// Background script for Promptly browser extension
// Handles extension lifecycle, storage, and communication

// Browser API detection and wrapper
const browser = (() => {
  if (typeof chrome !== 'undefined') {
    return chrome;
  }
  
  if (typeof window !== 'undefined' && (window as any).browser) {
    return (window as any).browser;
  }
  
  throw new Error('Browser extension API not available');
})();

// Unified storage API
const storage = {
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
  }
};

// Unified messaging API
const messaging = {
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
const tabs = {
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

// Unified scripting API (for content script injection)
const scripting = {
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

// Unified runtime API
const runtime = {
  onInstalled: {
    addListener(callback: (details: chrome.runtime.InstalledDetails) => void) {
      browser.runtime.onInstalled.addListener(callback);
    }
  },

  getManifest() {
    return browser.runtime.getManifest();
  }
};

interface PromptlyConfig {
  apiUrl: string;
  isEnabled: boolean;
  userToken: string | null;
  tier: 'free' | 'pro';
  quotaUsed: number;
  quotaLimit: number;
  user?: {
    name: string;
    email: string;
  };
}

class PromptlyBackground {
  private config: PromptlyConfig = {
    apiUrl: 'https://promptly-two-ashy.vercel.app',
    isEnabled: true,
    userToken: null,
    tier: 'free',
    quotaUsed: 0,
    quotaLimit: 50
  };

  constructor() {
    this.init();
  }

  private async init() {
    // Load configuration from storage
    await this.loadConfig();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize quota tracking
    await this.initializeQuotaTracking();
    
    // Check authentication status
    await this.checkAuthStatus();
  }

  private async loadConfig() {
    try {
      const result = await storage.get(['promptlyConfig']);
      if (result.promptlyConfig && typeof result.promptlyConfig === 'object') {
        this.config = { ...this.config, ...result.promptlyConfig };
      }
    } catch (error) {
      console.warn('Failed to load Promptly config:', error);
      // Reset to defaults
      this.config = {
        apiUrl: 'https://promptly-two-ashy.vercel.app',
        isEnabled: true,
        userToken: null,
        tier: 'free',
        quotaUsed: 0,
        quotaLimit: 50
      };
    }
  }

  private async saveConfig() {
    try {
      await storage.set({ promptlyConfig: this.config });
    } catch (error) {
      console.error('Failed to save Promptly config:', error);
    }
  }

  private setupEventListeners() {
    // Extension installation/update events
    runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Message handling from content scripts and popup
    messaging.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Tab updates for content script injection
    tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });
  }

  private handleInstallation(details: chrome.runtime.InstalledDetails) {
    if (details.reason === 'install') {
      this.showWelcomeNotification();
      this.saveConfig();
    } else if (details.reason === 'update') {
      this.showUpdateNotification(details.previousVersion);
    }
  }

  private showWelcomeNotification() {
    console.log('🎉 Welcome to Promptly! Your AI prompt optimizer is now active.');
  }

  private showUpdateNotification(previousVersion?: string) {
    console.log(`🔄 Promptly Updated from ${previousVersion} to ${runtime.getManifest().version}`);
  }

  private async handleMessage(message: any, _sender: any, sendResponse: (response?: any) => void) {
    try {
      switch (message.type) {
        case 'GET_CONFIG':
          sendResponse({ config: this.config });
          break;

        case 'UPDATE_CONFIG':
          this.config = { ...this.config, ...message.config };
          await this.saveConfig();
          sendResponse({ success: true });
          break;

        case 'OPTIMIZE_PROMPT':
          try {
            const result = await this.optimizePrompt(message.prompt, message.tier);
            sendResponse({ success: true, optimizedPrompt: result.optimizedPrompt });
          } catch (error) {
            sendResponse({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
          break;

        case 'CHECK_QUOTA':
          sendResponse({
            quotaUsed: this.config.quotaUsed,
            quotaLimit: this.config.quotaLimit,
            canOptimize: this.config.quotaUsed < this.config.quotaLimit
          });
          break;

        case 'INCREMENT_QUOTA':
          this.config.quotaUsed++;
          await this.saveConfig();
          sendResponse({ success: true });
          break;

        case 'GET_QUOTA_STATUS':
          sendResponse({
            quotaUsed: this.config.quotaUsed,
            quotaLimit: this.config.quotaLimit,
            tier: this.config.tier,
            canOptimize: this.config.quotaUsed < this.config.quotaLimit
          });
          break;

        case 'SET_USER_TOKEN':
          this.config.userToken = message.token;
          if (message.user) {
            this.config.tier = message.user.tier.toLowerCase();
            this.config.quotaUsed = message.user.quotaUsed || 0;
            this.config.quotaLimit = message.user.quotaLimit || 50;
            this.config.user = {
              name: message.user.name || message.user.email?.split('@')[0] || 'User',
              email: message.user.email || 'user@example.com'
            };
          }
          await this.saveConfig();
          sendResponse({ success: true });
          break;

        case 'REFRESH_AUTH':
          await this.checkAuthStatus();
          sendResponse({ 
            success: true, 
            authenticated: !!this.config.userToken,
            tier: this.config.tier
          });
          break;

        default:
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: 'Internal error' });
    }
  }

  private async handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
    // Only inject scripts when page is fully loaded
    if (changeInfo.status === 'complete' && tab.url) {
      if (this.isSupportedPlatform(tab.url)) {
        try {
          // Inject content script
          await scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });

          // Inject CSS
          await scripting.insertCSS({
            target: { tabId: tabId },
            files: ['content.css']
          });
        } catch (error) {
          console.warn('Failed to inject Promptly scripts:', error);
        }
      }
    }
  }

  private isSupportedPlatform(url: string): boolean {
    const supportedPlatforms = [
      'openai.com', 'chatgpt.com', 'claude.ai', 'poe.com',
      'bard.google.com', 'gemini.google.com', 'deepseek.com',
      'copilot.microsoft.com', 'bing.com', 'copilot.azure.com',
      'perplexity.ai', 'you.com', 'huggingface.co', 'together.ai',
      'lmsys.org', 'meta.ai', 'mistral.ai', 'anthropic.com',
      'x.com', 'twitter.com', 'grok.x.ai', 'grok.com',
      'notion.so', 'docs.google.com', 'word.office.com',
      'grammarly.com', 'jasper.ai', 'writesonic.com', 'copy.ai',
      'rytr.me', 'cursor.sh', 'replit.com', 'github.com',
      'stackblitz.com', 'codeium.com', 'chatpaper.ai',
      'consensus.app', 'scite.ai', 'typeset.io'
    ];

    try {
      const urlObj = new URL(url);
      return supportedPlatforms.some(platform => urlObj.hostname.includes(platform));
    } catch {
      return false;
    }
  }

  private async optimizePrompt(prompt: string, tier: string = 'free'): Promise<{ optimizedPrompt: string }> {
    if (!this.config.userToken) {
      throw new Error('Please sign in to use Promptly. Click the extension icon to authenticate.');
    }

    if (this.config.quotaUsed >= this.config.quotaLimit) {
      throw new Error('Quota exceeded. Please upgrade to Pro for more optimizations.');
    }

    try {
      console.log('Calling Promptly API:', `${this.config.apiUrl}/api/optimize/extension`);
      
      const response = await fetch(`${this.config.apiUrl}/api/optimize/extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.userToken}`
        },
        body: JSON.stringify({
          prompt: prompt,
          tier: tier || this.config.tier
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', errorData);
        
        if (response.status === 401) {
          // Token expired, clear it
          this.config.userToken = null;
          await this.saveConfig();
          throw new Error('Authentication expired. Please sign in again.');
        }
        
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Optimization failed');
      }

      // Update quota info if provided
      if (result.quotaInfo) {
        this.config.quotaUsed = result.quotaInfo.limit - result.quotaInfo.remaining;
        this.config.quotaLimit = result.quotaInfo.limit;
        this.config.tier = result.quotaInfo.tier.toLowerCase();
        await this.saveConfig();
      }

      return { optimizedPrompt: result.optimized };
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      
      // If it's not an authentication error, fall back to simple optimization
      if (!(error instanceof Error && error.message.includes('Authentication'))) {
        console.log('Falling back to simple optimization');
        const simpleOptimized = this.simpleOptimize(prompt);
        this.config.quotaUsed++;
        await this.saveConfig();
        return { optimizedPrompt: simpleOptimized };
      }
      
      throw error;
    }
  }

  private simpleOptimize(prompt: string): string {
    let optimized = prompt.trim();
    
    // Add specificity if missing
    if (optimized.length > 100 && 
        (optimized.includes('Please') || optimized.includes('Can you') || optimized.includes('I need')) &&
        (optimized.includes('specific') || optimized.includes('detailed') || optimized.includes('context'))) {
      // Already has good structure
    } else {
      // Add politeness if missing
      if (!optimized.includes('Please') && !optimized.includes('Can you') && !optimized.includes('I need')) {
        optimized = `Please ${optimized.toLowerCase()}`;
      }
      
      // Add specificity for short prompts
      if (optimized.length < 30 && !optimized.includes('specific') && !optimized.includes('detailed')) {
        optimized += '. Please provide specific and detailed information.';
      }
      
      // Add context request for very short prompts
      if (optimized.length < 60 && !optimized.includes('context') && !optimized.includes('background') && !optimized.includes('situation')) {
        optimized += ' Please provide context and background information.';
      }
    }
    
    return optimized;
  }

  private async initializeQuotaTracking() {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${now.getMonth()}`;
    
    const { lastQuotaReset } = await storage.get(['lastQuotaReset']);
    
    if (lastQuotaReset !== currentPeriod) {
      this.config.quotaUsed = 0;
      await this.saveConfig();
      await storage.set({ lastQuotaReset: currentPeriod });
    }
  }

  private async checkAuthStatus() {
    try {
      const { promptlyConfig } = await storage.get(['promptlyConfig']);
      const token = promptlyConfig?.userToken;
      
      if (token) {
        const response = await fetch(`${this.config.apiUrl}/api/auth/extension`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.config.userToken = token;
            this.config.tier = data.user.tier.toLowerCase();
            this.config.quotaUsed = data.user.quotaUsed;
            this.config.quotaLimit = data.user.quotaLimit;
            await this.saveConfig();
            console.log('Auth status check completed - user authenticated');
            return;
          }
        }
      }
      
      // Clear auth if token is invalid or missing
      this.config.userToken = null;
      this.config.tier = 'free';
      this.config.quotaUsed = 0;
      this.config.quotaLimit = 50;
      await this.saveConfig();
      console.log('Auth status check completed - user not authenticated');
    } catch (error) {
      console.error('Auth status check failed:', error);
      this.config.userToken = null;
      this.config.tier = 'free';
      this.config.quotaUsed = 0;
      this.config.quotaLimit = 50;
      await this.saveConfig();
    }
  }
}

// Initialize the background script
new PromptlyBackground();