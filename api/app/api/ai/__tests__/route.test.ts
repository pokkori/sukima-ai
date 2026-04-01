// API route.ts ユニットテスト
// Anthropic SDK と Supabase をモック

// Anthropic SDK モック
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        stream: jest.fn().mockImplementation(async function* () {
          yield {
            type: 'content_block_delta',
            delta: { type: 'text_delta', text: 'テスト応答' },
          };
        }),
      },
    })),
  };
});

// Next.js Request/Response モック
class MockRequest {
  private body: string;
  headers: Map<string, string>;

  constructor(url: string, options: { method?: string; body?: string; headers?: Record<string, string> } = {}) {
    this.body = options.body ?? '';
    this.headers = new Map(Object.entries(options.headers ?? {}));
  }

  async json() {
    return JSON.parse(this.body);
  }

  get url() {
    return 'https://api-six-olive-54.vercel.app/api/ai';
  }
}

// 環境変数をリセット
beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-key';
});

describe('POST /api/ai', () => {
  test('1. selectedText が空 → 400', async () => {
    const { POST } = await import('../route');
    const req = new MockRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({ extensionId: 'test', actionType: 'translate', selectedText: '' }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });

  test('2. selectedText が2001文字 → 400', async () => {
    const { POST } = await import('../route');
    const req = new MockRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({
        extensionId: 'test',
        actionType: 'translate',
        selectedText: 'a'.repeat(2001),
      }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(400);
  });

  test('3. 使用量10回超（非Pro）→ 429', async () => {
    // Supabase モックで10回超を返す
    jest.doMock('@supabase/supabase-js', () => ({
      createClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 'user-1', is_pro: false }, error: null }),
              gte: jest.fn().mockReturnValue({
                lt: jest.fn().mockResolvedValue({ count: 11, error: null }),
              }),
            }),
          }),
        }),
      }),
    }));

    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

    // モジュールキャッシュをリセット
    jest.resetModules();
    jest.mock('@anthropic-ai/sdk', () => ({
      __esModule: true,
      default: jest.fn().mockImplementation(() => ({
        messages: {
          stream: jest.fn(),
        },
      })),
    }));

    jest.mock('@supabase/supabase-js', () => ({
      createClient: jest.fn().mockReturnValue({
        from: jest.fn().mockImplementation((table: string) => {
          if (table === 'users') {
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: { id: 'user-1', is_pro: false },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === 'usage_logs') {
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  gte: jest.fn().mockReturnValue({
                    lt: jest.fn().mockResolvedValue({ count: 11, error: null }),
                  }),
                }),
              }),
            };
          }
          return {};
        }),
      }),
    }));

    const { POST } = await import('../route');
    const req = new MockRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({
        extensionId: 'test-extension',
        actionType: 'translate',
        selectedText: 'Hello world',
      }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(429);

    jest.resetModules();
  });

  test('4. 正常リクエスト → ストリームレスポンス開始（200）', async () => {
    // Supabase なし（環境変数未設定）の場合は直接Streamingを返す
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { POST } = await import('../route');
    const req = new MockRequest('https://example.com', {
      method: 'POST',
      body: JSON.stringify({
        extensionId: 'test-extension',
        actionType: 'translate',
        selectedText: 'Hello world',
      }),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as unknown as import('next/server').NextRequest);
    expect(res.status).toBe(200);
  });
});
