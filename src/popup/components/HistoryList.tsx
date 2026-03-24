import React, { useEffect, useState } from 'react';
import { getHistory, HistoryEntry } from '../hooks/useHistory';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  explain: { label: '解説', color: '#3b82f6' },
  translate: { label: '翻訳', color: '#10b981' },
  translate_ja_en: { label: '日→英翻訳', color: '#059669' },
  summarize: { label: '要約', color: '#8b5cf6' },
  tax: { label: '税務', color: '#f59e0b' },
  business: { label: 'ビジネス', color: '#6366f1' },
  medical: { label: '医療', color: '#ec4899' },
  simple: { label: '子ども向け', color: '#06b6d4' },
  legal: { label: '法律相談', color: '#ef4444' },
  business_email: { label: 'メール返信', color: '#8b5cf6' },
  contract_check: { label: '契約書チェック', color: '#f97316' },
  sns: { label: 'SNS投稿変換', color: '#0ea5e9' },
};

export function HistoryList() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  const handleCopy = async (entry: HistoryEntry) => {
    await navigator.clipboard.writeText(entry.resultText);
    setCopied(entry.id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (history.length === 0) {
    return (
      <div style={{ padding: '24px 16px', color: '#64748b', textAlign: 'center', fontSize: '14px' }}>
        まだ履歴がありません。<br />
        Webページのテキストを選択して右クリックしてみてください。
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ padding: '4px 16px 8px', fontSize: '12px', color: '#64748b' }}>
        使用履歴（最大50件）
      </div>
      <ul aria-label="使用履歴" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {history.map((entry) => {
          const action = ACTION_LABELS[entry.actionType];
          const date = new Date(entry.timestamp);
          const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

          return (
            <li
              key={entry.id}
              onClick={() => handleCopy(entry)}
              role="button"
              tabIndex={0}
              aria-label={`${timeStr}の${action?.label ?? ''}結果をコピーする`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy(entry); }}
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {action && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    background: action.color,
                    color: '#fff',
                  }}>
                    {action.label}
                  </span>
                )}
                <span style={{ fontSize: '11px', color: '#64748b' }}>{timeStr}</span>
                {copied === entry.id && (
                  <span style={{ fontSize: '11px', color: '#10b981', marginLeft: 'auto' }}>コピー済み</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>
                {entry.inputText.slice(0, 30)}{entry.inputText.length > 30 ? '...' : ''}
              </div>
              <div style={{ fontSize: '13px', color: '#e2e8f0' }}>
                {entry.resultText.slice(0, 60)}{entry.resultText.length > 60 ? '...' : ''}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
