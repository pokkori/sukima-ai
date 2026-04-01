import React, { useState } from 'react';

export function PrivacyBadge() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        role="status"
        aria-label="プライバシー保護: 選択テキストのみ送信、URLは一切送信しません"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'default',
          fontSize: '11px',
          color: '#10b981',
          fontWeight: 500,
          outline: 'none',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
      >
        {/* シールドSVGアイコン */}
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 0L0 2.5V6.5C0 10.1 2.6 13.2 6 14C9.4 13.2 12 10.1 12 6.5V2.5L6 0Z"
            fill="#10b981"
            opacity="0.85"
          />
          <path
            d="M4 7L5.5 8.5L8.5 5.5"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        選択テキストのみ送信・URLは一切送信しません
      </div>

      {showTooltip && (
        <div
          role="tooltip"
          aria-label="プライバシー詳細説明"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            padding: '10px 12px',
            background: 'rgba(15, 15, 26, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            fontSize: '11px',
            lineHeight: 1.7,
            color: '#94a3b8',
            zIndex: 9999,
          }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#e2e8f0', fontSize: '11px' }}>
            プライバシー保護の詳細
          </p>
          <ul style={{ margin: 0, paddingLeft: '14px' }}>
            <li>送信するのは選択したテキストのみ</li>
            <li>閲覧URL・ページタイトルは送信しない</li>
            <li>個人情報・ブラウジング履歴は収集しない</li>
            <li>AIの解析後、テキストは即時削除</li>
          </ul>
        </div>
      )}
    </div>
  );
}
