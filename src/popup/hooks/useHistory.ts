// useHistory - chrome.storage.local 履歴管理フック

export interface HistoryEntry {
  id: string;
  timestamp: number;
  actionType: string;
  inputText: string;
  resultText: string;
}

const STORAGE_KEY = 'selectext_history';
const MAX_HISTORY = 50;

export async function addHistory(entry: HistoryEntry): Promise<void> {
  const current = await getHistory();
  const updated = [entry, ...current].slice(0, MAX_HISTORY);
  await chrome.storage.local.set({ [STORAGE_KEY]: updated });
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const data = result[STORAGE_KEY];
  if (!Array.isArray(data)) return [];
  return data as HistoryEntry[];
}

export async function clearHistory(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: [] });
}

export function useHistory() {
  return { addHistory, getHistory, clearHistory };
}
