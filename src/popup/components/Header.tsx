import React from 'react';

interface HeaderProps {
  dailyCount: number;
  isPro: boolean;
}

export function Header({ dailyCount, isPro }: HeaderProps) {
  const isNearLimit = !isPro && dailyCount >= 9;

  return (
    <header aria-label="SelecText AIヘッダー" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* SVGロゴ */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#1a1a2e" />
          <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial Black">S</text>
        </svg>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#e2e8f0' }}>
          SelecText AI
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isPro ? (
          <span
            aria-label="Proプラン利用中"
            style={{
              background: '#6366f1',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            PRO
          </span>
        ) : (
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '12px',
              color: isNearLimit ? '#f59e0b' : '#94a3b8',
            }}>
              今日 {dailyCount}/10回使用
            </div>
            {/* プログレスバー */}
            <div style={{
              width: '80px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              marginTop: '2px',
            }}>
              <div style={{
                width: `${Math.min(dailyCount / 10 * 100, 100)}%`,
                height: '100%',
                background: isNearLimit ? '#f59e0b' : '#6366f1',
                borderRadius: '2px',
                transition: 'width 300ms ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
