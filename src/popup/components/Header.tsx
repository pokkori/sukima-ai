import React from 'react';
import { useStreak } from '../hooks/useStreak';

interface HeaderProps {
  dailyCount: number;
  isPro: boolean;
}

export function Header({ dailyCount, isPro }: HeaderProps) {
  const isNearLimit = !isPro && dailyCount >= 9;
  const streak = useStreak();

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
        {/* ストリーク表示（2日以上連続の場合） */}
        {streak >= 2 && (
          <div
            aria-label={`${streak}日連続使用中`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#f59e0b',
            }}
          >
            {/* 炎SVGアイコン */}
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path d="M5 0C5 0 8 3 8 6C8 7.5 7 9 5 9C3 9 2 7.5 2 6C2 5 2.5 4 3 3.5C3 3.5 3 5 4 5.5C4 4 3.5 2 5 0Z" fill="#f59e0b"/>
              <path d="M5 7C5.55 7 6 7.45 6 8C6 8.55 5.55 9 5 9C4.45 9 4 8.55 4 8C4 7.45 4.45 7 5 7Z" fill="#fcd34d"/>
            </svg>
            {streak}日streak
          </div>
        )}

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
