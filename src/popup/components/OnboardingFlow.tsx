import React, { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'SelecText AIへようこそ',
    description: 'Webページの英語テキストを右クリックするだけでAI解析できます。日本語での解説・翻訳・要約を瞬時に提供します。',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#1a1a2e" />
        <text x="24" y="34" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial Black">S</text>
      </svg>
    ),
  },
  {
    title: '使い方はとても簡単',
    description: '',
    icon: null,
    steps: [
      '英語テキストをドラッグして選択',
      '選択範囲を右クリック',
      'SelecText AI のメニューを選択',
    ],
  },
  {
    title: '準備完了！',
    description: '今すぐ試してみましょう。英語のニュースや資料を開いてテキストを選択してください。',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" />
        <path d="M16 24L21 29L32 18" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    privacy: true,
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  const handleComplete = async () => {
    await chrome.storage.local.set({ onboardingCompleted: true });
    onComplete();
  };

  const handleSkip = async () => {
    await chrome.storage.local.set({ onboardingCompleted: true });
    onComplete();
  };

  const current = STEPS[step];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0f0f1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 9999,
    }}>
      {/* スキップボタン */}
      <button
        onClick={handleSkip}
        aria-label="チュートリアルをスキップ"
        type="button"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          fontSize: '13px',
          cursor: 'pointer',
          minHeight: '44px',
          minWidth: '44px',
          padding: '8px',
        }}
      >
        スキップ
      </button>

      {/* ステップインジケーター */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i === step ? '#6366f1' : 'rgba(255,255,255,0.2)',
            transition: 'background 300ms',
          }} />
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ textAlign: 'center', maxWidth: '320px' }}>
        {current.icon && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            {current.icon}
          </div>
        )}

        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 12px' }}>
          {current.title}
        </h2>

        {current.description && (
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.7 }}>
            {current.description}
          </p>
        )}

        {/* ステップ2: アニメーション図解 */}
        {'steps' in current && current.steps && (
          <ol style={{ listStyle: 'none', margin: '0 0 20px', padding: 0 }}>
            {current.steps.map((s, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: i < current.steps!.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                textAlign: 'left',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{s}</span>
              </li>
            ))}
          </ol>
        )}

        {/* プライバシー表示（UXリサーチ追加） */}
        {current.privacy && (
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '20px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
              プライバシーについて
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
              送信するのは選択テキストのみです。ブラウジング履歴・個人情報は一切収集しません。
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              aria-label="前のステップへ戻る"
              type="button"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#94a3b8',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              戻る
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              aria-label="次のステップへ進む"
              type="button"
              style={{
                minHeight: '44px',
                padding: '8px 24px',
                background: '#6366f1',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              次へ
            </button>
          ) : (
            <button
              onClick={handleComplete}
              aria-label="使い始める"
              type="button"
              style={{
                minHeight: '44px',
                padding: '8px 24px',
                background: '#6366f1',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              始める
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
