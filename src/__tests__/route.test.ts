// API route バリデーションのユニットテスト
// Next.js の依存なしにバリデーションロジックのみをテスト

// バリデーション関数を直接テスト（route.ts のロジックを抽出）
function validateRequest(body: {
  extensionId?: unknown;
  actionType?: unknown;
  selectedText?: unknown;
}): { status: number; error?: string } {
  const { selectedText, actionType } = body;

  if (!selectedText || (typeof selectedText === 'string' && selectedText.trim() === '')) {
    return { status: 400, error: 'selectedText is required' };
  }

  if (typeof selectedText === 'string' && selectedText.length > 2000) {
    return { status: 400, error: 'selectedText must be 2000 characters or less' };
  }

  const validActionTypes = ['explain', 'translate', 'summarize', 'tax', 'business', 'medical', 'simple'];
  if (!actionType || !validActionTypes.includes(actionType as string)) {
    return { status: 400, error: 'Invalid actionType' };
  }

  return { status: 200 };
}

function checkDailyLimit(todayCount: number, isPro: boolean): { status: number } {
  if (!isPro && todayCount >= 10) {
    return { status: 429 };
  }
  return { status: 200 };
}

describe('API route バリデーション', () => {
  test('1. selectedText が空 → 400', () => {
    const result = validateRequest({
      extensionId: 'test',
      actionType: 'translate',
      selectedText: '',
    });
    expect(result.status).toBe(400);
  });

  test('2. selectedText が2001文字 → 400', () => {
    const result = validateRequest({
      extensionId: 'test',
      actionType: 'translate',
      selectedText: 'a'.repeat(2001),
    });
    expect(result.status).toBe(400);
  });

  test('3. 使用量10回超（非Pro）→ 429', () => {
    const result = checkDailyLimit(10, false);
    expect(result.status).toBe(429);
  });

  test('4. 正常リクエスト（2000文字以内・有効なactionType）→ 200', () => {
    const result = validateRequest({
      extensionId: 'test-extension',
      actionType: 'translate',
      selectedText: 'Hello world',
    });
    expect(result.status).toBe(200);
  });
});
