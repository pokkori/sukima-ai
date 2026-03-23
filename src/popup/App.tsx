import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ResultPanel } from './components/ResultPanel';
import { HistoryList } from './components/HistoryList';
import { UpgradeModal } from './components/UpgradeModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { getDailyCount } from './hooks/useDailyLimit';

type Tab = 'result' | 'history';

export function App() {
  const [dailyCount, setDailyCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('result');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Pro状態確認
      const proResult = await chrome.storage.local.get(['isPro']);
      setIsPro(proResult['isPro'] === true);

      // 使用量取得
      const count = await getDailyCount();
      setDailyCount(count);

      // オンボーディング確認
      const onbResult = await chrome.storage.local.get(['onboardingCompleted']);
      if (!onbResult['onboardingCompleted']) {
        setShowOnboarding(true);
      }

      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: '380px',
        minHeight: '200px',
        background: '#0f0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '14px',
      }}>
        読み込み中...
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{
      width: '380px',
      minHeight: '500px',
      background: '#0f0f1a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      lineHeight: 1.6,
      position: 'relative',
    }}>
      <Header dailyCount={dailyCount} isPro={isPro} />

      {/* タブナビゲーション */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {(['result', 'history'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-label={tab === 'result' ? '解析結果タブを表示' : '履歴タブを表示'}
            aria-selected={activeTab === tab}
            role="tab"
            type="button"
            style={{
              flex: 1,
              minHeight: '44px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === tab ? '#e2e8f0' : '#64748b',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            {tab === 'result' ? '解析結果' : '履歴'}
          </button>
        ))}
      </div>

      {/* コンテンツエリア */}
      <div style={{ overflowY: 'auto', maxHeight: '380px' }}>
        {activeTab === 'result' ? (
          <ResultPanel text="" isStreaming={false} />
        ) : (
          <HistoryList />
        )}
      </div>

      {/* アップグレード誘導バナー（制限近い場合） */}
      {!isPro && dailyCount >= 8 && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(245,158,11,0.1)',
          borderTop: '1px solid rgba(245,158,11,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '12px', color: '#f59e0b' }}>
            残り {10 - dailyCount} 回で無料枠終了
          </span>
          <button
            onClick={() => setShowUpgrade(true)}
            aria-label="Proプランへアップグレードする"
            type="button"
            style={{
              minHeight: '32px',
              padding: '4px 12px',
              background: '#f59e0b',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Pro へ
          </button>
        </div>
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
