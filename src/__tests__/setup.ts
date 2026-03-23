// Chrome API mock for tests
const chromeMock = {
  storage: {
    local: {
      _data: {} as Record<string, unknown>,
      get: jest.fn(function(keys: string | string[] | Record<string, unknown> | null, callback?: (result: Record<string, unknown>) => void) {
        const result: Record<string, unknown> = {};
        if (keys === null) {
          Object.assign(result, chromeMock.storage.local._data);
        } else if (typeof keys === 'string') {
          result[keys] = chromeMock.storage.local._data[keys];
        } else if (Array.isArray(keys)) {
          keys.forEach(k => { result[k] = chromeMock.storage.local._data[k]; });
        } else {
          Object.keys(keys).forEach(k => {
            result[k] = chromeMock.storage.local._data[k] !== undefined
              ? chromeMock.storage.local._data[k]
              : (keys as Record<string, unknown>)[k];
          });
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn(function(items: Record<string, unknown>, callback?: () => void) {
        Object.assign(chromeMock.storage.local._data, items);
        if (callback) callback();
        return Promise.resolve();
      }),
      clear: jest.fn(function(callback?: () => void) {
        chromeMock.storage.local._data = {};
        if (callback) callback();
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    id: 'test-extension-id-12345678901234567890',
    onMessage: {
      addListener: jest.fn(),
    },
    onInstalled: {
      addListener: jest.fn(),
    },
    getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
    sendMessage: jest.fn(),
  },
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
  },
  alarms: {
    create: jest.fn(),
    onAlarm: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    sendMessage: jest.fn(),
    create: jest.fn(),
  },
};

// Reset storage data before each test
beforeEach(() => {
  chromeMock.storage.local._data = {};
  // Reset mock call history
  jest.clearAllMocks();
  // Re-setup mock implementations after clearAllMocks
  chromeMock.storage.local.get.mockImplementation(function(keys: string | string[] | Record<string, unknown> | null, callback?: (result: Record<string, unknown>) => void) {
    const result: Record<string, unknown> = {};
    if (keys === null) {
      Object.assign(result, chromeMock.storage.local._data);
    } else if (typeof keys === 'string') {
      result[keys] = chromeMock.storage.local._data[keys];
    } else if (Array.isArray(keys)) {
      (keys as string[]).forEach((k: string) => { result[k] = chromeMock.storage.local._data[k]; });
    } else {
      Object.keys(keys as Record<string, unknown>).forEach((k: string) => {
        result[k] = chromeMock.storage.local._data[k] !== undefined
          ? chromeMock.storage.local._data[k]
          : (keys as Record<string, unknown>)[k];
      });
    }
    if (callback) callback(result);
    return Promise.resolve(result);
  });
  chromeMock.storage.local.set.mockImplementation(function(items: Record<string, unknown>, callback?: () => void) {
    Object.assign(chromeMock.storage.local._data, items);
    if (callback) callback();
    return Promise.resolve();
  });
  chromeMock.storage.local.clear.mockImplementation(function(callback?: () => void) {
    chromeMock.storage.local._data = {};
    if (callback) callback();
    return Promise.resolve();
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).chrome = chromeMock;
