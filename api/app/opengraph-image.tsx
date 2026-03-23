import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SelecText AI - 選択テキストをAIで解説・翻訳・要約';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 30,
            background: '#1a1a2e',
            border: '3px solid #6366f1',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 900, color: '#ffffff' }}>S</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
          }}
        >
          SelecText AI
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#6366f1',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          選択テキストをAIで即解説・翻訳・要約
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          英語テキストを選択して右クリックするだけ。Claude AIが瞬時に日本語で解説。
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '12px 32px',
            background: '#6366f1',
            borderRadius: 12,
            fontSize: 22,
            color: '#ffffff',
            fontWeight: 700,
          }}
        >
          無料10回/日 - Chrome拡張機能
        </div>
      </div>
    ),
    { ...size }
  );
}
