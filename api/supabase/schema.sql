-- SelecText AI Supabase Schema
-- Supabase SQL Editor で実行してください

-- users テーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extension_id TEXT UNIQUE NOT NULL,
  email TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_started_at TIMESTAMPTZ,
  pro_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_extension_id ON users(extension_id);

-- usage_logs テーブル
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  extension_id TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('explain', 'translate', 'summarize')),
  input_chars INT NOT NULL,
  output_chars INT,
  model TEXT DEFAULT 'claude-haiku-4-5',
  latency_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_extension_id_date ON usage_logs(extension_id, created_at DESC);

-- subscriptions テーブル
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  extensionpay_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS（Row Level Security）設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Service Role はすべてアクセス可能（APIサーバーから使用）
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL USING (true);

CREATE POLICY "Service role has full access to usage_logs"
  ON usage_logs FOR ALL USING (true);

CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions FOR ALL USING (true);
