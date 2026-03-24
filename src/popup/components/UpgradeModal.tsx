import React, { useState } from 'react';
import ExtPay from 'extpay';

const extpay = ExtPay('selectext-ai');

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleUpgradeMonthly = async () => {
    await extpay.openPaymentPage();
  };

  const handleUpgradeYearly = async () => {
    await extpay.openPaymentPage();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Proプランへのアップグレード案内"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div style={{
        background: 'rgba(26,26,46,0.98)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '340px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(99,102,241,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#6366f1" />
            </svg>
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
            1日の無料枠（10回）を使い切りました
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            Proプランにアップグレードすると<br />
            無制限でご利用いただけます
          </p>
        </div>

        {/* 料金プラン選択（2ボタン: 月額 / 年額） */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setSelectedPlan('monthly')}
            aria-label="月額プランを選択 月額980円"
            style={{
              flex: 1,
              background: selectedPlan === 'monthly'
                ? 'rgba(99,102,241,0.15)'
                : 'rgba(255,255,255,0.05)',
              border: selectedPlan === 'monthly'
                ? '2px solid #6366f1'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>月払い</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>¥980</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>/月</div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlan('yearly')}
            aria-label="年額プランを選択 年額9800円 17パーセントオフ"
            style={{
              flex: 1,
              background: selectedPlan === 'yearly'
                ? 'rgba(99,102,241,0.15)'
                : 'rgba(255,255,255,0.05)',
              border: selectedPlan === 'yearly'
                ? '2px solid #6366f1'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'inherit',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#10b981',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
            }}>
              17%オフ
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>年払い</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>¥9,800</div>
            <div style={{ fontSize: '11px', color: '#6366f1' }}>1日あたり約27円</div>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={selectedPlan === 'yearly' ? handleUpgradeYearly : handleUpgradeMonthly}
            aria-label={selectedPlan === 'yearly'
              ? 'Pro年額プラン（9800円・17%オフ）にアップグレードする'
              : 'Pro月額プラン（980円/月）にアップグレードする'}
            type="button"
            style={{
              minHeight: '44px',
              width: '100%',
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {selectedPlan === 'yearly'
              ? 'Pro年額（¥9,800 / 17%オフ）で始める'
              : 'Pro月額（¥980/月）で始める'}
          </button>
          <button
            onClick={onClose}
            aria-label="後でアップグレードする"
            type="button"
            style={{
              minHeight: '44px',
              width: '100%',
              background: 'transparent',
              color: '#64748b',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            後で
          </button>
        </div>
      </div>
    </div>
  );
}
