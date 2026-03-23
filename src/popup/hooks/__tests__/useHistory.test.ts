import { addHistory, getHistory, clearHistory, HistoryEntry } from '../useHistory';

function makeEntry(id: string): HistoryEntry {
  return {
    id,
    timestamp: Date.now(),
    actionType: 'translate',
    inputText: `Input text ${id}`,
    resultText: `Result text ${id}`,
  };
}

describe('useHistory', () => {
  test('1. 履歴の追加と取得', async () => {
    const entry = makeEntry('test-001');
    await addHistory(entry);

    const history = await getHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('test-001');
  });

  test('2. 51件追加後に getHistory() が50件を返す', async () => {
    for (let i = 0; i < 51; i++) {
      await addHistory(makeEntry(`entry-${String(i).padStart(3, '0')}`));
    }

    const history = await getHistory();
    expect(history.length).toBe(50);
    // 最新のエントリが先頭に来る
    expect(history[0].id).toBe('entry-050');
  });

  test('3. clearHistory() で全削除', async () => {
    await addHistory(makeEntry('to-delete-001'));
    await addHistory(makeEntry('to-delete-002'));

    await clearHistory();

    const history = await getHistory();
    expect(history.length).toBe(0);
  });
});
