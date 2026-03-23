// useDailyLimit - 無料/Pro制限ロジック

const STORAGE_KEY = 'selectext_daily_limit';
const FREE_LIMIT = 10;

interface DailyLimitData {
  count: number;
  date: string;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

async function loadData(): Promise<DailyLimitData> {
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const data = result[STORAGE_KEY] as DailyLimitData | undefined;
  const today = getTodayString();

  if (!data || data.date !== today) {
    return { count: 0, date: today };
  }
  return data;
}

async function saveData(data: DailyLimitData): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

export async function getDailyCount(): Promise<number> {
  const data = await loadData();
  return data.count;
}

export async function incrementCount(): Promise<void> {
  const data = await loadData();
  data.count += 1;
  await saveData(data);
}

export async function canUse(): Promise<boolean> {
  // Proチェック
  const proResult = await chrome.storage.local.get(['isPro']);
  if (proResult['isPro'] === true) return true;

  const count = await getDailyCount();
  return count < FREE_LIMIT;
}

export function useDailyLimit() {
  return { getDailyCount, incrementCount, canUse };
}
