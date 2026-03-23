import { NextRequest, NextResponse } from 'next/server';

function getCorsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const extensionId = searchParams.get('extensionId');

  if (!extensionId) {
    return NextResponse.json(
      { error: 'extensionId is required' },
      { status: 400, headers: getCorsHeaders() }
    );
  }

  // Supabase接続がない場合はデフォルト値を返す
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      extensionId,
      isPro: false,
      todayCount: 0,
      dailyLimit: 10,
      remaining: 10,
    }, { headers: getCorsHeaders() });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ユーザー取得（存在しない場合は作成）
    let { data: user } = await supabase
      .from('users')
      .select('id, is_pro')
      .eq('extension_id', extensionId)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({ extension_id: extensionId })
        .select('id, is_pro')
        .single();
      user = newUser;
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500, headers: getCorsHeaders() });
    }

    const isPro = user.is_pro ?? false;

    // 本日（JST）の使用回数
    const jstOffset = 9 * 60 * 60 * 1000;
    const now = new Date();
    const jstNow = new Date(now.getTime() + jstOffset);
    const todayJST = jstNow.toISOString().slice(0, 10);

    const { count: todayCount } = await supabase
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .eq('extension_id', extensionId)
      .gte('created_at', `${todayJST}T00:00:00+09:00`)
      .lt('created_at', `${todayJST}T24:00:00+09:00`);

    const count = todayCount ?? 0;
    const dailyLimit = isPro ? null : 10;
    const remaining = isPro ? null : Math.max(0, 10 - count);

    return NextResponse.json({
      extensionId,
      isPro,
      todayCount: count,
      dailyLimit,
      remaining,
    }, { headers: getCorsHeaders() });
  } catch (err) {
    console.error('Usage API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
