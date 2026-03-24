import React, { useEffect, useState } from 'react';
import { Header } from '../popup/components/Header';
import { ResultPanel } from '../popup/components/ResultPanel';
import { HistoryList } from '../popup/components/HistoryList';
import { UpgradeModal } from '../popup/components/UpgradeModal';
import { PrivacyBadge } from '../popup/components/PrivacyBadge';
import { UsageCounter } from '../popup/components/UsageCounter';
import { getDailyCount } from '../popup/hooks/useDailyLimit';
import { PRESETS } from '../popup/data/presets';

type Tab = 'result' | 'history';

export function SidePanel() {
  const [dailyCount, setDailyCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('result');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState('explain');

  useEffect(() => {
    const init = async () => {
      const proResult = await chrome.storage.local.get(['isPro']);
      setIsPro(proResult['isPro'] === true);

      const count = await getDailyCount();
      setDailyCount(count);

      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: '100%',
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

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#0f0f1a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      lineHeight: 1.6,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <Header dailyCount={dailyCount} isPro={isPro} />

      {/* プライバシーバッジ */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <PrivacyBadge />
      </div>

      {/* プリセット選択 */}
      <div
        aria-label="解析タイプを選択"
        style={{
          padding: '10px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPresetId(preset.id)}
            aria-label={`${preset.label}モードを選択`}
            aria-pressed={selectedPresetId === preset.id}
            type="button"
            title={preset.description}
            style={{
              minHeight: '44px',
              padding: '4px 12px',
              background: selectedPresetId === preset.id
                ? `rgba(${hexToRgb(preset.color)}, 0.2)`
                : 'rgba(255,255,255,0.05)',
              border: selectedPresetId === preset.id
                ? `1px solid ${preset.color}`
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: selectedPresetId === preset.id ? preset.color : '#94a3b8',
              fontSize: '12px',
              fontWeight: selectedPresetId === preset.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

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

      {/* コンテンツエリア（サイドパネルは縦長なので高さ制限なし） */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'result' ? (
          <ResultPanel text="" isStreaming={false} actionType={selectedPresetId} />
        ) : (
          <HistoryList />
        )}
      </div>

      {/* 使用カウンター */}
      <UsageCounter isPro={isPro} onUpgradeClick={() => setShowUpgrade(true)} />

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

/** HEX → "r, g, b" 変換ユーティリティ */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '99, 102, 241';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
