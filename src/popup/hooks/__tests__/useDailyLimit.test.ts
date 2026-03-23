import { getDailyCount, incrementCount, canUse } from '../useDailyLimit';

const STORAGE_KEY = 'selectext_daily_limit';

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

describe('useDailyLimit', () => {
  test('1. 初回: canUse() → true, getDailyCount() → 0', async () => {
    const count = await getDailyCount();
    expect(count).toBe(0);

    const result = await canUse();
    expect(result).toBe(true);
  });

  test('2. 9回使用後: canUse() → true, getDailyCount() → 9', async () => {
    for (let i = 0; i < 9; i++) {
      await incrementCount();
    }
    const count = await getDailyCount();
    expect(count).toBe(9);

    const result = await canUse();
    expect(result).toBe(true);
  });

  test('3. 10回使用後: canUse() → false', async () => {
    for (let i = 0; i < 10; i++) {
      await incrementCount();
    }
    const result = await canUse();
    expect(result).toBe(false);
  });

  test('4. date が前日: getDailyCount() → 0 (リセット確認)', async () => {
    // 前日データをセット
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    await chrome.storage.local.set({
      [STORAGE_KEY]: { count: 10, date: yesterdayStr },
    });

    // 翌日扱いでカウント取得するとリセットされる
    const count = await getDailyCount();
    expect(count).toBe(0);
  });
});
