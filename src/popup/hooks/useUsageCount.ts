import { useState, useEffect } from 'react';

const FREE_LIMIT = 10;

export function useUsageCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['usageCount'], (result) => {
      setCount(result['usageCount'] || 0);
    });
  }, []);

  const increment = () => {
    chrome.storage.local.get(['usageCount'], (result) => {
      const newCount = (result['usageCount'] || 0) + 1;
      chrome.storage.local.set({ usageCount: newCount });
      setCount(newCount);
    });
  };

  return {
    count,
    increment,
    remaining: Math.max(FREE_LIMIT - count, 0),
    isLimitReached: count >= FREE_LIMIT,
    FREE_LIMIT,
  };
}
