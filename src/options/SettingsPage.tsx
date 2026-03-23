import React, { useEffect, useState } from 'react';

export function SettingsPage() {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding') === 'true') {
      setIsOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = async () => {
    await chrome.storage.local.set({ onboardingCompleted: true });
    setIsOnboarding(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (isOnboarding) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          {onboardingStep === 0 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: '16px' }} aria-hidden="true">
                  <rect width="64" height="64" rx="16" fill="#1a1a2e" />
                  <text x="32" y="45" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold" fontFamily="Arial Black">S</text>
                </svg>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                  SelecText AI へようこそ
                </h1>
                <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7 }}>
                  英語テキストをAIで解説・翻訳・要約。<br />
                  日本語業種別テンプレートで専門的な解析も可能です。
                </p>
              </div>

              {/* 3ステップガイド */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#94a3b8' }}>
                  3ステップで使い始める
                </h2>
                {[
                  { num: '1', title: '拡張機能をピン留め', desc: 'ツールバーの拡張機能アイコン → SelecText AI の横のピンアイコンをクリック' },
                  { num: '2', title: 'テキストを選択', desc: 'Webページの英語テキストをドラッグして選択してください' },
                  { num: '3', title: '右クリックで使う', desc: '選択範囲を右クリック → SelecText AI のメニューを選択' },
                ].map((step) => (
                  <div key={step.num} style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    marginBottom: '8px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {step.num}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{step.title}</div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* デモテキスト（UXリサーチ追加: 30秒以内の初回体験） */}
              <div style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', marginBottom: '12px' }}>
                  今すぐ試してみましょう - このテキストを選択して右クリックしてください
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#e2e8f0',
                  lineHeight: 1.7,
                  userSelect: 'text',
                }}>
                  The quick brown fox jumps over the lazy dog. This is a sample English text to demonstrate the AI translation and explanation feature of SelecText AI.
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  上のテキストを選択 → 右クリック → 「SelecText AI: 日本語に翻訳」を選択
                </div>
              </div>

              {/* プライバシー（UXリサーチ追加） */}
              <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: 1.6,
              }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>プライバシー: </span>
                送信するのは選択テキストのみです。ブラウジング履歴・個人情報は一切収集しません。
              </div>

              <button
                onClick={handleCompleteOnboarding}
                aria-label="使い始める"
                type="button"
                style={{
                  width: '100%',
                  minHeight: '48px',
                  background: '#6366f1',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                始める
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f1a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          SelecText AI 設定
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '14px' }}>
          拡張機能の設定を管理します
        </p>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#94a3b8' }}>
            アカウント
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '16px',
          }}>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>
              Proプランにアップグレードすると無制限でご利用いただけます。
            </p>
            <button
              aria-label="Proプランにアップグレードする"
              type="button"
              onClick={() => window.open('https://selectext-ai-api.vercel.app/#pricing', '_blank')}
              style={{
                minHeight: '44px',
                padding: '8px 20px',
                background: '#6366f1',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Proプランを見る
            </button>
          </div>
        </section>

        {saved && (
          <div style={{
            padding: '12px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '8px',
            color: '#10b981',
            fontSize: '14px',
          }}>
            設定を保存しました
          </div>
        )}
      </div>
    </div>
  );
}
