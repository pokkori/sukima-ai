import React from 'react';

interface ResultPanelProps {
  text: string;
  isStreaming: boolean;
  actionType?: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  explain: { label: '解説', color: '#3b82f6' },
  translate: { label: '翻訳', color: '#10b981' },
  summarize: { label: '要約', color: '#8b5cf6' },
  tax: { label: '税務', color: '#f59e0b' },
  business: { label: 'ビジネス', color: '#6366f1' },
  medical: { label: '医療', color: '#ec4899' },
  simple: { label: '子ども向け', color: '#06b6d4' },
};

export function ResultPanel({ text, isStreaming, actionType }: ResultPanelProps) {
  const action = actionType ? ACTION_LABELS[actionType] : null;

  return (
    <div style={{ padding: '12px 16px' }}>
      {action && (
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600,
          background: action.color,
          color: '#ffffff',
          marginBottom: '8px',
        }}>
          {action.label}
        </div>
      )}

      <div
        role="region"
        aria-label="AI解析結果"
        aria-live="polite"
        className={isStreaming ? 'cursor-blink' : ''}
        style={{
          lineHeight: 1.6,
          color: '#e2e8f0',
          minHeight: '80px',
          maxHeight: '240px',
          overflowY: 'auto',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text || (
          <span style={{ color: '#64748b', fontStyle: 'italic' }}>
            結果がここに表示されます
          </span>
        )}
        {isStreaming && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              background: '#e2e8f0',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 1s infinite',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
