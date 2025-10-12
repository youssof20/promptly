// Browser-agnostic API wrapper for Chrome/Firefox/Edge support

// Detect browser and provide unified API
export const browser = (() => {
  // Check for Chrome/Edge (Chromium-based)
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return chrome;
  }
  
  // Check for Firefox
  if (typeof (window as any).browser !== 'undefined') {
    return (window as any).browser;
  }
  
  // Fallback to chrome for development
  if (typeof chrome !== 'undefined') {
    return chrome;
  }
  
  throw new Error('Browser extension API not available');
})();

// Unified storage API
export const storage = {
  async get(keys: string | string[] | Record<string, any>): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      browser.storage.sync.get(keys, (result: Record<string, any>) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(result);
        }
      });
    });
  },

  async set(items: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.storage.sync.set(items, () => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },

  async remove(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.storage.sync.remove(keys, () => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }
};

// Unified messaging API
export const messaging = {
  async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      browser.runtime.sendMessage(message, (response: any) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  },

  onMessage: {
    addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void) {
      browser.runtime.onMessage.addListener(callback);
    },

    removeListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void) {
      browser.runtime.onMessage.removeListener(callback);
    }
  }
};

// Unified tabs API
export const tabs = {
  async create(createProperties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      browser.tabs.create(createProperties, (tab: chrome.tabs.Tab) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(tab);
        }
      });
    });
  },

  async update(tabId: number, updateProperties: chrome.tabs.UpdateProperties): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      browser.tabs.update(tabId, updateProperties, (tab: chrome.tabs.Tab) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(tab);
        }
      });
    });
  },

  async query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      browser.tabs.query(queryInfo, (tabs: chrome.tabs.Tab[]) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(tabs);
        }
      });
    });
  },

  async get(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      browser.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(tab);
        }
      });
    });
  },

  onUpdated: {
    addListener(callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void) {
      browser.tabs.onUpdated.addListener(callback);
    },

    removeListener(callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void) {
      browser.tabs.onUpdated.removeListener(callback);
    }
  }
};

// Unified windows API
export const windows = {
  async update(windowId: number, updateInfo: chrome.windows.UpdateInfo): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      browser.windows.update(windowId, updateInfo, (window: chrome.windows.Window) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(window);
        }
      });
    });
  }
};

// Unified scripting API (for content script injection)
export const scripting = {
  async executeScript(injection: chrome.scripting.ScriptInjection<any, any>): Promise<chrome.scripting.InjectionResult<any>[]> {
    return new Promise((resolve, reject) => {
      browser.scripting.executeScript(injection, (results: chrome.scripting.InjectionResult<any>[]) => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve(results || []);
        }
      });
    });
  },

  async insertCSS(injection: chrome.scripting.CSSInjection): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.scripting.insertCSS(injection, () => {
        if (browser.runtime.lastError) {
          reject(new Error(browser.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }
};

// Runtime utilities
export const runtime = {
  getManifest: () => browser.runtime.getManifest(),
  getURL: (path: string) => browser.runtime.getURL(path),
  lastError: () => browser.runtime.lastError,
  
  onInstalled: {
    addListener(callback: (details: chrome.runtime.InstalledDetails) => void) {
      browser.runtime.onInstalled.addListener(callback);
    }
  }
};

// Detect browser type
export const browserInfo = {
  isChrome: () => typeof chrome !== 'undefined' && chrome.runtime && !chrome.runtime.getManifest().applications,
  isFirefox: () => typeof (window as any).browser !== 'undefined',
  isEdge: () => typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest().applications,
  getType: () => {
    if (browserInfo.isFirefox()) return 'firefox';
    if (browserInfo.isEdge()) return 'edge';
    if (browserInfo.isChrome()) return 'chrome';
    return 'unknown';
  }
};
