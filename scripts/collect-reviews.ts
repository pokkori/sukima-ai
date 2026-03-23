/**
 * Chrome Web Store レビュー収集・分類スクリプト
 *
 * 使用方法:
 *   npx ts-node scripts/collect-reviews.ts <extensionId>
 *
 * 例:
 *   npx ts-node scripts/collect-reviews.ts bjfhmglciegochdpefhhlphglcehbmek
 *
 * 出力:
 *   output/<extensionId>-review-analysis.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// ---- 型定義 ----

interface RawReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface CategoryCounts {
  UX: number;
  '機能不足': number;
  '有料化': number;
  '日本語未対応': number;
  'その他': number;
}

interface ClassifiedReview extends RawReview {
  categories: (keyof CategoryCounts)[];
  summary: string;
}

interface ReviewAnalysis {
  extensionId: string;
  collectedAt: string;
  totalReviews: number;
  averageRating: number;
  categoryCounts: CategoryCounts;
  reviews: ClassifiedReview[];
}

// ---- Puppeteer で Chrome Web Store レビューを収集 ----

async function collectReviewsWithPuppeteer(extensionId: string): Promise<RawReview[]> {
  // Puppeteer は動的インポートで読み込む（devDependencies 不要時のフォールバックあり）
  let puppeteer: typeof import('puppeteer') | null = null;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.warn('[collect-reviews] puppeteer が見つかりません。モックデータを使用します。');
    return getMockReviews(extensionId);
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const url = `https://chromewebstore.google.com/detail/${extensionId}`;
  console.log(`[collect-reviews] アクセス中: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // レビューセクションまでスクロール
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const reviews: RawReview[] = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[class*="review"]'));
    return items.slice(0, 50).map((el, idx) => {
      const ratingEl = el.querySelector('[aria-label*="out of"]');
      const textEl = el.querySelector('[class*="review-text"], [class*="body"]');
      const dateEl = el.querySelector('[class*="date"], time');
      const authorEl = el.querySelector('[class*="author"], [class*="user"]');

      const ratingStr = ratingEl?.getAttribute('aria-label') ?? '';
      const ratingMatch = ratingStr.match(/(\d)/);

      return {
        id: `review-${idx}`,
        author: authorEl?.textContent?.trim() ?? `ユーザー${idx + 1}`,
        rating: ratingMatch ? parseInt(ratingMatch[1], 10) : 3,
        date: dateEl?.textContent?.trim() ?? '',
        text: textEl?.textContent?.trim() ?? el.textContent?.trim() ?? '',
      };
    }).filter(r => r.text.length > 10);
  });

  await browser.close();

  if (reviews.length === 0) {
    console.warn('[collect-reviews] レビューが取得できませんでした。モックデータを使用します。');
    return getMockReviews(extensionId);
  }

  return reviews;
}

// ---- モックデータ（Puppeteer 未インストール時のフォールバック） ----

function getMockReviews(extensionId: string): RawReview[] {
  return [
    {
      id: 'mock-1',
      author: 'サンプルユーザー1',
      rating: 2,
      date: '2024-01-15',
      text: 'UIが古くて使いにくい。日本語に対応していないので分かりにくい。',
    },
    {
      id: 'mock-2',
      author: 'サンプルユーザー2',
      rating: 3,
      date: '2024-02-01',
      text: '無料で使えていたのに突然有料になった。機能が少ない割に高すぎる。',
    },
    {
      id: 'mock-3',
      author: 'サンプルユーザー3',
      rating: 2,
      date: '2024-02-20',
      text: 'ボタンが小さくて押しにくい。UXが悪い。翻訳機能が欲しい。',
    },
    {
      id: 'mock-4',
      author: 'サンプルユーザー4',
      rating: 4,
      date: '2024-03-05',
      text: '基本的な機能は揃っているが、もう少し細かいカスタマイズができると良い。',
    },
    {
      id: 'mock-5',
      author: 'サンプルユーザー5',
      rating: 1,
      date: '2024-03-10',
      text: '日本語のページでは全く動作しない。英語専用なのかもしれないが説明がない。',
    },
  ].map(r => ({ ...r, id: `${extensionId}-${r.id}` }));
}

// ---- Claude API でカテゴリ分類 ----

async function classifyReviewsWithClaude(
  reviews: RawReview[],
  apiKey: string
): Promise<ClassifiedReview[]> {
  const results: ClassifiedReview[] = [];

  // バッチ処理（5件ずつ）
  const batchSize = 5;
  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);
    const prompt = buildClassificationPrompt(batch);

    try {
      const response = await callClaudeAPI(prompt, apiKey);
      const parsed = parseClassificationResponse(response, batch);
      results.push(...parsed);
    } catch (err) {
      console.warn(`[collect-reviews] Claude API エラー (バッチ ${i}): ${err}`);
      // フォールバック: キーワードベース分類
      for (const review of batch) {
        results.push(classifyByKeyword(review));
      }
    }

    // レート制限対策
    if (i + batchSize < reviews.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

function buildClassificationPrompt(reviews: RawReview[]): string {
  const reviewsJson = JSON.stringify(
    reviews.map(r => ({ id: r.id, text: r.text, rating: r.rating })),
    null,
    2
  );

  return `以下の Chrome 拡張機能レビューを分析し、各レビューの不満カテゴリを分類してください。

カテゴリ定義:
- UX: UI が分かりにくい・ボタンが小さい・操作が複雑・デザインが古い
- 機能不足: 必要な機能がない・翻訳できない・カスタマイズできない
- 有料化: 無料から有料になった・価格が高い・無料枠が削減された
- 日本語未対応: 日本語 UI がない・日本語ページで動かない
- その他: 上記に該当しない不満や、肯定的なレビュー

レビューデータ:
${reviewsJson}

各レビューについて以下の JSON 形式で回答してください:
[
  {
    "id": "<レビューID>",
    "categories": ["<カテゴリ1>", "<カテゴリ2>"],
    "summary": "<30字以内の日本語要約>"
  }
]
複数カテゴリの場合は配列に複数指定してください。肯定的なレビューは categories に "その他" を設定してください。`;
}

function callClaudeAPI(prompt: string, apiKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content?.[0]?.text) {
            resolve(parsed.content[0].text);
          } else {
            reject(new Error(`API レスポンス異常: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function parseClassificationResponse(
  response: string,
  originalReviews: RawReview[]
): ClassifiedReview[] {
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSON 配列が見つかりません');

    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      id: string;
      categories: string[];
      summary: string;
    }>;

    return originalReviews.map(review => {
      const classification = parsed.find(p => p.id === review.id);
      const validCategories: (keyof CategoryCounts)[] = [
        'UX', '機能不足', '有料化', '日本語未対応', 'その他'
      ];

      const categories = (classification?.categories ?? ['その他']).filter(
        (c): c is keyof CategoryCounts => validCategories.includes(c as keyof CategoryCounts)
      );

      return {
        ...review,
        categories: categories.length > 0 ? categories : ['その他'],
        summary: classification?.summary ?? review.text.slice(0, 30),
      };
    });
  } catch {
    return originalReviews.map(r => classifyByKeyword(r));
  }
}

// ---- キーワードベース分類（フォールバック） ----

function classifyByKeyword(review: RawReview): ClassifiedReview {
  const text = review.text.toLowerCase();
  const categories: (keyof CategoryCounts)[] = [];

  const patterns: Record<keyof CategoryCounts, string[]> = {
    UX: ['ui', 'ux', '使いにくい', 'デザイン', 'ボタン', '画面', '操作', '分かりにくい', '古い'],
    '機能不足': ['機能', '翻訳', 'できない', '欲しい', '対応', '使えない', '動かない'],
    '有料化': ['有料', '課金', '料金', '高い', '無料', '突然', 'premium', 'pro'],
    '日本語未対応': ['日本語', '日本', 'japanese', '文字化け', '対応していない'],
    'その他': [],
  };

  for (const [category, keywords] of Object.entries(patterns)) {
    if (category === 'その他') continue;
    if (keywords.some(kw => text.includes(kw))) {
      categories.push(category as keyof CategoryCounts);
    }
  }

  if (categories.length === 0) {
    categories.push('その他');
  }

  return {
    ...review,
    categories,
    summary: review.text.slice(0, 30),
  };
}

// ---- 集計 ----

function calculateCategoryCounts(reviews: ClassifiedReview[]): CategoryCounts {
  const counts: CategoryCounts = {
    UX: 0,
    '機能不足': 0,
    '有料化': 0,
    '日本語未対応': 0,
    'その他': 0,
  };

  for (const review of reviews) {
    for (const cat of review.categories) {
      counts[cat]++;
    }
  }

  return counts;
}

// ---- メイン処理 ----

async function main(): Promise<void> {
  const extensionId = process.argv[2];

  if (!extensionId) {
    console.error('使用方法: npx ts-node scripts/collect-reviews.ts <extensionId>');
    console.error('例: npx ts-node scripts/collect-reviews.ts bjfhmglciegochdpefhhlphglcehbmek');
    process.exit(1);
  }

  const apiKey = process.env['ANTHROPIC_API_KEY'] ?? '';
  if (!apiKey) {
    console.warn('[collect-reviews] ANTHROPIC_API_KEY が未設定です。キーワードベース分類を使用します。');
  }

  console.log(`[collect-reviews] 拡張機能 ID: ${extensionId}`);
  console.log('[collect-reviews] レビュー収集中...');

  const rawReviews = await collectReviewsWithPuppeteer(extensionId);
  console.log(`[collect-reviews] 収集完了: ${rawReviews.length} 件`);

  console.log('[collect-reviews] カテゴリ分類中...');
  let classifiedReviews: ClassifiedReview[];
  if (apiKey) {
    classifiedReviews = await classifyReviewsWithClaude(rawReviews, apiKey);
  } else {
    classifiedReviews = rawReviews.map(r => classifyByKeyword(r));
  }

  const categoryCounts = calculateCategoryCounts(classifiedReviews);
  const averageRating =
    rawReviews.length > 0
      ? rawReviews.reduce((sum, r) => sum + r.rating, 0) / rawReviews.length
      : 0;

  const analysis: ReviewAnalysis = {
    extensionId,
    collectedAt: new Date().toISOString(),
    totalReviews: classifiedReviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
    categoryCounts,
    reviews: classifiedReviews,
  };

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${extensionId}-review-analysis.json`);
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8');

  console.log(`[collect-reviews] 出力完了: ${outputPath}`);
  console.log('[collect-reviews] カテゴリ集計:');
  for (const [category, count] of Object.entries(categoryCounts)) {
    console.log(`  ${category}: ${count} 件`);
  }
}

main().catch((err) => {
  console.error('[collect-reviews] エラー:', err);
  process.exit(1);
});
