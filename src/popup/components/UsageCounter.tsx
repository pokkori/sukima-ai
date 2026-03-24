import React, { useState } from 'react';
import { useUsageCount } from '../hooks/useUsageCount';

interface UsageCounterProps {
  isPro: boolean;
  onUpgradeClick: () => void;
}

export function UsageCounter({ isPro, onUpgradeClick }: UsageCounterProps) {
  const { count, remaining, isLimitReached, FREE_LIMIT } = useUsageCount();
  const [showModal, setShowModal] = useState(isLimitReached);

  if (isPro) return null;

  const filledCount = Math.min(count, FREE_LIMIT);
  const isNearLimit = count >= 8 && !isLimitReached;

  return (
    <>
      {/* 残り回数バー（常時表示） */}
      <div
        aria-label={`使用状況: ${count}回使用済み、残り${remaining}回`}
        style={{
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            無料利用回数
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: isLimitReached ? '#ef4444' : isNearLimit ? '#f59e0b' : '#94a3b8',
          }}>
            残り{remaining}回
          </span>
        </div>

        {/* プログレスバー（10マス） */}
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={FREE_LIMIT}
          aria-label={`${FREE_LIMIT}回中${count}回使用済み`}
          style={{
            display: 'flex',
            gap: '2px',
          }}
        >
          {Array.from({ length: FREE_LIMIT }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '5px',
                borderRadius: '2px',
                background: i < filledCount
                  ? (isLimitReached ? '#ef4444' : isNearLimit ? '#f59e0b' : '#6366f1')
                  : 'rgba(255,255,255,0.1)',
                transition: 'background 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* 残り2回バナー（8回使用時） */}
      {isNearLimit && (
        <div
          role="alert"
          aria-label="残り2回でアップグレードが必要です"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'rgba(245,158,11,0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#f59e0b' }}>
            残り{remaining}回でアップグレードが必要です
          </span>
          <button
            onClick={onUpgradeClick}
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
            Proへ
          </button>
        </div>
      )}

      {/* 上限到達モーダル */}
      {(isLimitReached || showModal) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="プレミアム機能への移行を促すモーダル"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{
            width: '320px',
            padding: '24px',
            background: 'rgba(15,15,26,0.95)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}>
            {/* ロックアイコン */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
              style={{ margin: '0 auto 16px' }}
            >
              <rect width="40" height="40" rx="20" fill="rgba(99,102,241,0.15)" />
              <path
                d="M14 20V16a6 6 0 0 1 12 0v4"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="12"
                y="20"
                width="16"
                height="12"
                rx="3"
                fill="#6366f1"
                opacity="0.9"
              />
              <circle cx="20" cy="26" r="2" fill="white" />
            </svg>

            <h2 style={{
              margin: '0 0 8px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#e2e8f0',
            }}>
              無料回数を使い切りました
            </h2>
            <p style={{
              margin: '0 0 20px',
              fontSize: '13px',
              color: '#94a3b8',
              lineHeight: 1.6,
            }}>
              プレミアム機能に移行しますか？<br />
              無制限で全機能をご利用いただけます。
            </p>

            <button
              onClick={onUpgradeClick}
              aria-label="プレミアムプランへアップグレードする"
              type="button"
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              プレミアムにアップグレード
            </button>

            <button
              onClick={() => setShowModal(false)}
              aria-label="モーダルを閉じる"
              type="button"
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              後で
            </button>
          </div>
        </div>
      )}
    </>
  );
}
