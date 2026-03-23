// SelecText AI - Content Script
// Webページに注入されてポップアップを表示する

const API_BASE = 'https://selectext-ai-api.vercel.app';
const POPUP_WIDTH = 360;
const POPUP_HEIGHT = 400;

// ポップアップ位置計算（画面端クリッピング処理）
export function calculatePopupPosition(
  x: number,
  y: number,
  winWidth: number = window.innerWidth,
  winHeight: number = window.innerHeight,
  popupWidth: number = POPUP_WIDTH,
  popupHeight: number = POPUP_HEIGHT
): { x: number; y: number } {
  let left = x;
  let top = y + 20;

  if (left + popupWidth > winWidth) {
    left = winWidth - popupWidth - 8;
  }
  if (left < 8) left = 8;

  if (top + popupHeight > winHeight) {
    top = y - popupHeight - 8;
  }
  if (top < 8) top = 8;

  return { x: left, y: top };
}

// ポップアップDOM生成
function createPopupElement(actionType: string): HTMLElement {
  const popup = document.createElement('div');
  popup.id = 'selectext-popup';
  popup.setAttribute('data-testid', 'selectext-popup');
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'SelecText AI 解析結果');

  const badgeLabels: Record<string, string> = {
    explain: '解説',
    translate: '翻訳',
    summarize: '要約',
    tax: '税務',
    business: 'ビジネス',
    medical: '医療',
    simple: '子ども向け',
  };

  const badgeClass = ['explain', 'translate', 'summarize'].includes(actionType)
    ? actionType
    : 'explain';

  popup.innerHTML = `
    <div class="action-badge ${badgeClass}">${badgeLabels[actionType] ?? '解析'}</div>
    <div class="result-text" role="region" aria-label="AI解析結果" aria-live="polite" data-testid="result-text"></div>
    <div class="btn-row">
      <button class="btn-copy" data-testid="copy-button" aria-label="結果テキストをコピーする" type="button">コピー</button>
      <button class="btn-share" data-testid="share-button" aria-label="Xでシェアする" type="button">X でシェア</button>
      <button class="btn-close" data-testid="close-button" aria-label="ポップアップを閉じる" type="button">閉じる</button>
    </div>
  `;

  return popup;
}

// Streaming API呼び出し
export async function fetchAIResult(
  text: string,
  actionType: string,
  extensionId: string,
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        extensionId,
        actionType,
        selectedText: text,
        pageUrl: window.location.href,
      }),
    });

    if (response.status === 429) {
      onChunk('__LIMIT_EXCEEDED__');
      onDone();
      return;
    }

    if (!response.ok) {
      onChunk(`エラーが発生しました（${response.status}）`);
      onDone();
      return;
    }

    if (!response.body) {
      onChunk('レスポンスが空です');
      onDone();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }

    onDone();
  } catch {
    onChunk('ネットワークエラーが発生しました');
    onDone();
  }
}

// 使用量チェック
export async function checkDailyLimit(extensionId: string): Promise<{ canUse: boolean; remaining: number | null }> {
  try {
    const response = await fetch(`${API_BASE}/api/usage?extensionId=${extensionId}`);
    if (!response.ok) return { canUse: true, remaining: null };
    const data = await response.json();
    if (data.remaining === 0) {
      return { canUse: false, remaining: 0 };
    }
    return { canUse: true, remaining: data.remaining };
  } catch {
    return { canUse: true, remaining: null };
  }
}

// ポップアップ表示メイン関数
function showPopup(text: string, actionType: string, position: { x: number; y: number }): void {
  // 既存ポップアップを削除
  const existing = document.getElementById('selectext-popup');
  if (existing) existing.remove();

  const popup = createPopupElement(actionType);
  const pos = calculatePopupPosition(position.x, position.y);
  popup.style.left = `${pos.x}px`;
  popup.style.top = `${pos.y}px`;

  document.body.appendChild(popup);

  // フェードインアニメーション
  requestAnimationFrame(() => {
    popup.classList.add('visible');
  });

  const resultText = popup.querySelector<HTMLElement>('.result-text');
  if (!resultText) return;

  let fullText = '';

  // ボタンイベント設定
  const copyBtn = popup.querySelector<HTMLButtonElement>('[data-testid="copy-button"]');
  const shareBtn = popup.querySelector<HTMLButtonElement>('[data-testid="share-button"]');
  const closeBtn = popup.querySelector<HTMLButtonElement>('[data-testid="close-button"]');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(fullText);
      copyBtn.textContent = 'コピー済み';
      setTimeout(() => { copyBtn.textContent = 'コピー'; }, 300);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const tweetText = encodeURIComponent(
        `${fullText.slice(0, 100)}...\n\n#SelecTextAI\nhttps://selectext-ai-api.vercel.app`
      );
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.style.opacity = '0';
      setTimeout(() => popup.remove(), 200);
    });
  }

  // 使用量チェック後にStreaming開始
  const extensionId = chrome.runtime.id;

  checkDailyLimit(extensionId).then(({ canUse }) => {
    if (!canUse) {
      resultText.textContent = '1日の無料枠（10回）を使い切りました。Proプランにアップグレードしてください。';
      return;
    }

    resultText.classList.add('cursor-blink');

    fetchAIResult(
      text,
      actionType,
      extensionId,
      (chunk) => {
        if (chunk === '__LIMIT_EXCEEDED__') {
          resultText.textContent = '1日の無料枠（10回）を使い切りました。Proプランにアップグレードしてください。';
          resultText.classList.remove('cursor-blink');
          return;
        }
        fullText += chunk;
        resultText.textContent = fullText;
      },
      () => {
        resultText.classList.remove('cursor-blink');
      }
    );
  });
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'SHOW_POPUP') {
    // マウス位置を取得して表示
    const lastMousePos = (window as unknown as { _selectextLastMousePos?: { x: number; y: number } })._selectextLastMousePos ?? { x: 200, y: 200 };
    showPopup(message.text, message.actionType, lastMousePos);
  }
});

// マウス位置を追跡
document.addEventListener('mouseup', (e) => {
  (window as unknown as { _selectextLastMousePos: { x: number; y: number } })._selectextLastMousePos = { x: e.clientX, y: e.clientY };
});
