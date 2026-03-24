import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SelecText AI - 選択テキストをAIで解説・翻訳・要約 | Chrome拡張機能',
  description: '英語テキストを選択して右クリック。Claude AIが瞬時に日本語で解説・翻訳・要約します。無料10回/日。確定申告・ビジネス・医療・子ども向けテンプレートも搭載。',
};

const featureCards = [
  { title: '解説する', desc: '英語テキストを日本人ビジネスパーソン向けに300字以内で解説', color: '#3b82f6' },
  { title: '日本語に翻訳', desc: '直訳でなく、日本語として自然に読めるように翻訳', color: '#10b981' },
  { title: '英訳（日→英）', desc: '日本語をビジネスシーンで使える丁寧な英語に翻訳', color: '#14b8a6' },
  { title: '要約する（3箇条）', desc: '要点を50字以内の3箇条にまとめてシンプルに把握', color: '#8b5cf6' },
  { title: '確定申告・税務', desc: '日本の税制（所得税・消費税・法人税）との関連で解説', color: '#f59e0b' },
  { title: 'ビジネス・契約', desc: '法的リスクや日本のビジネス慣行との違いを指摘', color: '#6366f1' },
  { title: '法律チェック', desc: '法的観点から注意すべきリスクや問題点を分析', color: '#ef4444' },
  { title: '契約書チェック', desc: '契約書・規約の不利な条件やリスク条項を箇条書きで指摘', color: '#f97316' },
  { title: 'ビジネスメール化', desc: '入力内容をビジネスメール形式（件名・敬語・締め）に変換', color: '#84cc16' },
  { title: 'SNS投稿化', desc: 'X（Twitter）用140文字・ハッシュタグ付きに最適化', color: '#000000' },
  { title: '医療・健康', desc: '日本語の医学用語に置き換えて分かりやすく解説', color: '#ec4899' },
];

export default function HomePage() {
  return (
    <main style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      lineHeight: 1.6,
      color: '#e2e8f0',
    }}>
      {/* ホバースタイル定義 */}
      <style>{`
        .cta-btn-primary {
          transition: transform 300ms ease, box-shadow 300ms ease;
        }
        .cta-btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(99,102,241,0.5);
        }
        .feature-card {
          transition: transform 300ms ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
        }
        .cta-btn-secondary {
          transition: transform 300ms ease;
        }
        .cta-btn-secondary:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* ヒーローセクション */}
      <section
        aria-label="SelecText AIのメインビジュアルとCTA"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div style={{ marginBottom: '24px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: '16px' }} aria-hidden="true">
              <rect width="80" height="80" rx="20" fill="#1a1a2e" />
              <text x="40" y="56" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold" fontFamily="Arial Black">S</text>
            </svg>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            SelecText AI
          </h1>
          <p style={{ fontSize: '22px', color: '#6366f1', fontWeight: 600, marginBottom: '16px' }}>
            選択テキストをAIで即解説・翻訳・要約
          </p>
          <p style={{ fontSize: '17px', color: '#94a3b8', marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
            英語テキストを選択して右クリックするだけ。Claude AIが瞬時に日本語で解説します。
            確定申告・ビジネス・医療・子ども向けテンプレートで専門的な解析も可能。
          </p>

          {/* カウントアップ統計バッジ */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}>
            {[
              { label: '無料利用', value: '10回/日' },
              { label: 'テンプレート', value: '11種類' },
              { label: '応答方式', value: 'Streaming対応' },
            ].map((stat) => (
              <div
                key={stat.label}
                aria-label={`${stat.label}: ${stat.value}`}
                style={{
                  padding: '10px 20px',
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://chrome.google.com/webstore"
              className="cta-btn-primary"
              aria-label="Chrome Web Store でSelecText AIをインストールする（無料）"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '52px',
                padding: '12px 28px',
                background: '#6366f1',
                color: '#ffffff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              Chrome に追加（無料）
            </a>
            <a
              href="#features"
              className="cta-btn-secondary"
              aria-label="機能詳細セクションを見る"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '52px',
                padding: '12px 28px',
                backdropFilter: 'blur(16px)',
                background: 'rgba(255,255,255,0.06)',
                color: '#e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              機能を見る
            </a>
          </div>

          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
            無料 10回/日 - クレジットカード不要
          </p>
        </div>
      </section>

      {/* 機能セクション */}
      <section
        id="features"
        aria-label="SelecText AIの機能一覧"
        style={{ padding: '80px 20px', background: '#0f0f1a' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
            Chrome拡張AI - 日本語業務特化11テンプレート
          </h2>
          <p style={{ fontSize: '16px', color: '#94a3b8', textAlign: 'center', marginBottom: '48px' }}>
            右クリック即発動・AI翻訳・法律チェック・契約書チェック・SNS投稿化・ビジネスメール化に対応
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {featureCards.map((feat) => (
              <div
                key={feat.title}
                className="feature-card"
                aria-label={`機能: ${feat.title} - ${feat.desc}`}
                style={{
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(15,15,26,0.7)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '5px',
                  background: feat.color,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '10px',
                }}>
                  {feat.title}
                </div>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section
        id="pricing"
        aria-label="料金プランの説明"
        style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)' }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '48px' }}>
            シンプルな料金プラン
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div
              aria-label="無料プランの詳細"
              style={{
                backdropFilter: 'blur(16px)',
                background: 'rgba(15,15,26,0.7)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>無料</h3>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>¥0</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>永久無料・変更なし</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '14px', color: '#94a3b8', padding: 0 }}>
                <li style={{ padding: '6px 0' }}>10回/日</li>
                <li style={{ padding: '6px 0' }}>全11種テンプレート</li>
                <li style={{ padding: '6px 0' }}>履歴50件</li>
              </ul>
            </div>

            <div
              aria-label="Proプランの詳細"
              style={{
                backdropFilter: 'blur(16px)',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid #6366f1',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#6366f1',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '4px',
              }}>
                おすすめ
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Pro</h3>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#6366f1', marginBottom: '4px' }}>¥980</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>/月 または</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>¥9,800/年</div>
              <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '20px' }}>1日あたり約27円</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '14px', color: '#94a3b8', padding: 0 }}>
                <li style={{ padding: '6px 0' }}>無制限</li>
                <li style={{ padding: '6px 0' }}>全11種テンプレート</li>
                <li style={{ padding: '6px 0' }}>優先サポート</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Xシェアセクション */}
      <section
        aria-label="SelecText AIをXでシェアする"
        style={{ padding: '40px 20px', background: '#0f0f1a', textAlign: 'center' }}
      >
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>SelecText AIを友達に教える</p>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('SelecTextAIで英語テキストを瞬時に日本語解説・翻訳できる！Chrome拡張機能 #SelecTextAI #Chrome拡張機能 #AI翻訳 https://selectext-ai-api.vercel.app')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SelecText AIをXでシェアする（新しいタブで開きます）"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#000',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでシェア
        </a>
      </section>

      {/* フッター */}
      <footer
        aria-label="フッターナビゲーション"
        style={{
          padding: '40px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        <p>SelecText AI - 日本語特化 AI Chrome拡張機能</p>
        <p style={{ marginTop: '8px' }}>
          <a href="/privacy" aria-label="プライバシーポリシーを見る" style={{ color: '#64748b', textDecoration: 'none' }}>プライバシーポリシー</a>
          {' | '}
          <a href="/terms" aria-label="利用規約を見る" style={{ color: '#64748b', textDecoration: 'none' }}>利用規約</a>
          {' | '}
          <a href="/tokusho" aria-label="特定商取引法に基づく表記を見る" style={{ color: '#64748b', textDecoration: 'none' }}>特定商取引法</a>
        </p>
      </footer>
    </main>
  );
}
