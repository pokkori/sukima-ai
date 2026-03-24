import { useState, useEffect } from 'react';

export function useStreak(): number {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['streakCount', 'lastUsedDate'], (result) => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastUsed: string | undefined = result['lastUsedDate'];
      const currentStreak: number = result['streakCount'] || 0;

      if (lastUsed === today) {
        // 今日すでに使用済み
        setStreak(currentStreak);
      } else if (lastUsed === yesterday) {
        // 昨日使用 → 連続継続
        const newStreak = currentStreak + 1;
        chrome.storage.local.set({ streakCount: newStreak, lastUsedDate: today });
        setStreak(newStreak);
      } else {
        // 途切れ → リセット
        chrome.storage.local.set({ streakCount: 1, lastUsedDate: today });
        setStreak(1);
      }
    });
  }, []);

  return streak;
}
