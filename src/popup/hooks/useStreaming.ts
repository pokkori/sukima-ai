// useStreaming - Streaming API読み取りフック
import { useState, useCallback } from 'react';

export function useStreaming() {
  const [streamText, setStreamText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async (url: string, body: object) => {
    setStreamText('');
    setIsStreaming(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        setError('DAILY_LIMIT_EXCEEDED');
        setIsStreaming(false);
        return;
      }

      if (!response.ok) {
        setError(`エラーが発生しました（${response.status}）`);
        setIsStreaming(false);
        return;
      }

      if (!response.body) {
        setError('レスポンスが空です');
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setStreamText(prev => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ネットワークエラーが発生しました');
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamText('');
    setIsStreaming(false);
    setError(null);
  }, []);

  return { streamText, isStreaming, error, startStream, reset };
}
