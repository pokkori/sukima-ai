import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ALLOWED_EXTENSION_ID = process.env.ALLOWED_EXTENSION_ID ?? '';

const PROMPTS: Record<string, (text: string) => string> = {
  explain: (text) => `以下の英語テキストを、日本人ビジネスパーソンに向けて日本語で解説してください。\n専門用語は括弧内に英語を残してください。300字以内。\n\nテキスト:\n${text}`,
  translate: (text) => `以下の英語テキストを自然な日本語に翻訳してください。\n直訳でなく、日本語として読みやすい表現にしてください。\n\nテキスト:\n${text}`,
  summarize: (text) => `以下のテキストの要点を日本語で3箇条にまとめてください。\n各箇条は50字以内。箇条書き形式（・で開始）。\n\nテキスト:\n${text}`,
  tax: (text) => `以下の英語テキストを、日本の確定申告・税務の文脈で日本語解説してください。日本の税制（所得税・消費税・法人税）との関連性を含めてください。\n\nテキスト:\n${text}`,
  business: (text) => `以下の英語テキストを、日本のビジネス・契約の文脈で日本語解説してください。法的リスクや日本のビジネス慣行との違いがあれば指摘してください。\n\nテキスト:\n${text}`,
  medical: (text) => `以下の英語テキストを、医療・健康の文脈で日本語解説してください。専門用語は日本語の医学用語に置き換えてください。\n\nテキスト:\n${text}`,
  simple: (text) => `以下の英語テキストを、小学生でも理解できる日本語で説明してください。難しい言葉は使わず、具体的な例を挙げてください。\n\nテキスト:\n${text}`,
};

function getCorsHeaders(extensionId?: string): HeadersInit {
  const origin = extensionId
    ? `chrome-extension://${extensionId}`
    : '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// OPTIONS preflight（MV3 CORS対応）
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const extensionId = ALLOWED_EXTENSION_ID || origin.replace('chrome-extension://', '');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(extensionId),
  });
}

export async function POST(req: NextRequest) {
  let body: { extensionId?: string; actionType?: string; selectedText?: string; pageUrl?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { extensionId, actionType, selectedText } = body;
  const corsHeaders = getCorsHeaders(ALLOWED_EXTENSION_ID || extensionId);

  // バリデーション
  if (!selectedText || selectedText.trim() === '') {
    return NextResponse.json(
      { error: 'selectedText is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (selectedText.length > 2000) {
    return NextResponse.json(
      { error: 'selectedText must be 2000 characters or less' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!actionType || !PROMPTS[actionType]) {
    return NextResponse.json(
      { error: 'Invalid actionType' },
      { status: 400, headers: corsHeaders }
    );
  }

  // 使用量チェック（Supabase接続がある場合）
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && extensionId) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // ユーザー取得またはupsert
      const { data: user } = await supabase
        .from('users')
        .select('id, is_pro')
        .eq('extension_id', extensionId)
        .single();

      if (user && !user.is_pro) {
        // 本日（JST）の使用回数確認
        const jstOffset = 9 * 60 * 60 * 1000;
        const now = new Date();
        const jstNow = new Date(now.getTime() + jstOffset);
        const todayJST = jstNow.toISOString().slice(0, 10);

        const { count } = await supabase
          .from('usage_logs')
          .select('*', { count: 'exact', head: true })
          .eq('extension_id', extensionId)
          .gte('created_at', `${todayJST}T00:00:00+09:00`)
          .lt('created_at', `${todayJST}T24:00:00+09:00`);

        if ((count ?? 0) >= 10) {
          return NextResponse.json(
            { error: 'DAILY_LIMIT_EXCEEDED', remaining: 0 },
            { status: 429, headers: corsHeaders }
          );
        }
      }
    } catch {
      // Supabaseエラーはスキップ（APIキー未設定時など）
    }
  }

  // Streaming レスポンス生成
  const prompt = PROMPTS[actionType](selectedText);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stream = await anthropic.messages.stream({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }

        // Supabaseにログ記録
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && extensionId) {
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
              process.env.SUPABASE_URL,
              process.env.SUPABASE_SERVICE_ROLE_KEY
            );

            // ユーザーupsert
            const { data: user } = await supabase
              .from('users')
              .upsert({ extension_id: extensionId }, { onConflict: 'extension_id' })
              .select('id')
              .single();

            if (user) {
              await supabase.from('usage_logs').insert({
                user_id: user.id,
                extension_id: extensionId,
                action_type: ['explain', 'translate', 'summarize'].includes(actionType)
                  ? actionType
                  : 'explain',
                input_chars: selectedText.length,
                model: 'claude-haiku-4-5',
              });
            }
          } catch {
            // ログ記録エラーは無視
          }
        }

        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        controller.enqueue(new TextEncoder().encode(`Error: ${message}`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
