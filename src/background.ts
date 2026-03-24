// SelecText AI - Service Worker (MV3)
// MV3ルール: グローバル変数禁止・chrome.alarms使用・return true必須
import ExtPay from 'extpay';
const extpay = ExtPay('selectext-ai');
extpay.startBackground();

extpay.onPaid.addListener(() => {
  chrome.storage.local.set({ isPro: true });
});

export const TEMPLATE_PROMPTS: Record<string, string> = {
  explain: `以下の英語テキストを、日本人ビジネスパーソンに向けて日本語で解説してください。専門用語は括弧内に英語を残してください。300字以内。\n\nテキスト:\n{{text}}`,
  translate: `以下の英語テキストを自然な日本語に翻訳してください。直訳でなく、日本語として読みやすい表現にしてください。\n\nテキスト:\n{{text}}`,
  summarize: `以下のテキストの要点を日本語で3箇条にまとめてください。各箇条は50字以内。箇条書き形式（・で開始）。\n\nテキスト:\n{{text}}`,
  tax: `以下の英語テキストを、日本の確定申告・税務の文脈で日本語解説してください。日本の税制（所得税・消費税・法人税）との関連性を含めてください。\n\nテキスト:\n{{text}}`,
  business: `以下の英語テキストを、日本のビジネス・契約の文脈で日本語解説してください。法的リスクや日本のビジネス慣行との違いがあれば指摘してください。\n\nテキスト:\n{{text}}`,
  medical: `以下の英語テキストを、医療・健康の文脈で日本語解説してください。専門用語は日本語の医学用語に置き換えてください。\n\nテキスト:\n{{text}}`,
  simple: `以下の英語テキストを、小学生でも理解できる日本語で説明してください。難しい言葉は使わず、具体的な例を挙げてください。\n\nテキスト:\n{{text}}`,
};

// コンテキストメニュー登録
function registerContextMenus(): void {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'SelecText AI: 解説する（日本語）',
    contexts: ['selection'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });
  chrome.contextMenus.create({
    id: 'translate',
    title: 'SelecText AI: 日本語に翻訳',
    contexts: ['selection'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });
  chrome.contextMenus.create({
    id: 'summarize',
    title: 'SelecText AI: 要約する（3箇条）',
    contexts: ['selection'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });

  // 業種別テンプレート（サブメニュー）
  chrome.contextMenus.create({
    id: 'templates',
    title: 'SelecText AI: テンプレートで使う',
    contexts: ['selection'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });

  const templateItems = [
    { id: 'tax', title: '確定申告・税務で使う', parentId: 'templates' },
    { id: 'business', title: 'ビジネス・契約で使う', parentId: 'templates' },
    { id: 'medical', title: '健康・医療を解説', parentId: 'templates' },
    { id: 'simple', title: 'やさしい言葉で解説（子ども向け）', parentId: 'templates' },
  ];

  templateItems.forEach(item =>
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      parentId: item.parentId,
      contexts: ['selection'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    })
  );
}

// インストール時処理
chrome.runtime.onInstalled.addListener(({ reason }) => {
  registerContextMenus();

  if (reason === 'install') {
    // 初回インストール: ウェルカムページを開く（UXリサーチ追加）
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html?onboarding=true') });
  }
});

// コンテキストメニュークリック処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  if (!info.selectionText) return;

  const actionType = info.menuItemId as string;

  chrome.tabs.sendMessage(tab.id, {
    action: 'SHOW_POPUP',
    text: info.selectionText,
    actionType: actionType,
  });
});

// 定期的な使用量キャッシュ同期（chrome.alarms使用 - setInterval禁止）
chrome.alarms.create('syncUsageCache', { periodInMinutes: 60 });

// 週次レポート通知（7日 = 10080分）
chrome.alarms.create('weeklyReport', { periodInMinutes: 10080 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'syncUsageCache') {
    try {
      const extensionId = chrome.runtime.id;
      const res = await fetch(
        `https://selectext-ai-api.vercel.app/api/usage?extensionId=${extensionId}`
      );
      if (res.ok) {
        const data = await res.json();
        await chrome.storage.local.set({ usageCache: data, usageCachedAt: Date.now() });
      }
    } catch {
      // ネットワークエラーは無視
    }
  }

  if (alarm.name === 'weeklyReport') {
    chrome.storage.local.get(['weeklyUsageCount'], (result) => {
      const count = (result['weeklyUsageCount'] as number) || 0;
      chrome.notifications.create('weeklyReport', {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'すき間AIの週次レポート',
        message: `今週は${count}回使用しました！引き続きご活用ください。`,
      });
      chrome.storage.local.set({ weeklyUsageCount: 0 });
    });
  }
});

// メッセージリスナー（非同期時は return true 必須）
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_USAGE') {
    chrome.storage.local.get(['usageCache'], (result) => {
      sendResponse({ data: result['usageCache'] });
    });
    return true; // 非同期レスポンスには return true 必須
  }

  if (message.type === 'GET_IS_PRO') {
    chrome.storage.local.get(['isPro'], (result) => {
      sendResponse({ isPro: result['isPro'] === true });
    });
    return true;
  }
});
