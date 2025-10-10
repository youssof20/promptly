// Background script for Promptly browser extension
// Handles extension lifecycle, storage, and communication

interface PromptlyConfig {
  apiUrl: string;
  isEnabled: boolean;
  userToken: string | null;
  tier: 'free' | 'pro';
  quotaUsed: number;
  quotaLimit: number;
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
      const result = await chrome.storage.sync.get(['promptlyConfig']);
      if (result.promptlyConfig && typeof result.promptlyConfig === 'object') {
        this.config = { ...this.config, ...result.promptlyConfig };
      }
    } catch (error) {
      console.warn('Failed to load Promptly config:', error);
      // Reset to default config if corrupted
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
      await chrome.storage.sync.set({ promptlyConfig: this.config });
    } catch (error) {
      console.error('Failed to save Promptly config:', error);
    }
  }

  private setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle tab updates to inject content scripts
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });
  }

  private handleInstallation(details: chrome.runtime.InstalledDetails) {
    if (details.reason === 'install') {
      // First time installation
      this.showWelcomeNotification();
      this.saveConfig();
    } else if (details.reason === 'update') {
      // Extension update
      this.showUpdateNotification(details.previousVersion);
    }
  }

  private showWelcomeNotification() {
    // Use console log instead of notifications to avoid permission issues
    console.log('🎉 Welcome to Promptly! Your AI prompt optimizer is now active.');
  }

  private showUpdateNotification(previousVersion?: string) {
    // Use console log instead of notifications to avoid permission issues
    console.log(`🔄 Promptly Updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
  }

  private async handleMessage(
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
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
          sendResponse({ success: true, optimized: result.optimizedPrompt });
        } catch (error) {
          sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
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
  }

  private async handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
    // Only inject on complete page loads
    if (changeInfo.status !== 'complete' || !tab.url) return;

    // Check if this is a supported AI platform
    if (this.isSupportedPlatform(tab.url)) {
      try {
        // Inject content script
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['dist/content.js']
        });

        // Inject CSS
        await chrome.scripting.insertCSS({
          target: { tabId },
          files: ['dist/content.css']
        });
      } catch (error) {
        console.warn('Failed to inject Promptly scripts:', error);
      }
    }
  }

  private isSupportedPlatform(url: string): boolean {
    const supportedDomains = [
      // Major chat AI platforms
      'openai.com', 'chatgpt.com', 'claude.ai', 'poe.com', 'bard.google.com', 'gemini.google.com', 'deepseek.com',
      // Microsoft and Bing
      'copilot.microsoft.com', 'bing.com', 'copilot.azure.com',
      // Perplexity & You.com
      'perplexity.ai', 'you.com',
      // Hugging Face & open LLM demos
      'huggingface.co', 'together.ai', 'lmsys.org',
      // Meta & others
      'meta.ai', 'mistral.ai', 'anthropic.com',
      // X/Twitter & Grok
      'x.com', 'twitter.com', 'grok.x.ai', 'grok.com',
      // Writing & productivity AI
      'notion.so', 'docs.google.com', 'word.office.com', 'grammarly.com', 'jasper.ai', 'writesonic.com', 'copy.ai', 'rytr.me',
      // Developer-oriented AIs
      'cursor.sh', 'replit.com', 'github.com', 'stackblitz.com', 'codeium.com',
      // Research & productivity AI
      'chatpaper.ai', 'consensus.app', 'scite.ai', 'typeset.io'
    ];

    try {
      const urlObj = new URL(url);
      return supportedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  private async optimizePrompt(prompt: string, tier: string = 'free'): Promise<any> {
    // Check if user is authenticated
    if (!this.config.userToken) {
      throw new Error('Please sign in to use Promptly. Click the extension icon to authenticate.');
    }

    // Check quota
    if (this.config.quotaUsed >= this.config.quotaLimit) {
      throw new Error('Quota exceeded. Please upgrade to Pro for more optimizations.');
    }

    try {
      console.log('Calling Promptly API:', `${this.config.apiUrl}/api/optimize/extension`);
      
      // Call the authenticated API
      const response = await fetch(`${this.config.apiUrl}/api/optimize/extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.userToken}`
        },
        body: JSON.stringify({
          prompt,
          tier: tier || this.config.tier
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', errorData);
        
        if (response.status === 401) {
          // Token expired or invalid, clear auth
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
      
      // Update quota info from response
      if (result.quotaInfo) {
        this.config.quotaUsed = result.quotaInfo.limit - result.quotaInfo.remaining;
        this.config.quotaLimit = result.quotaInfo.limit;
        this.config.tier = result.quotaInfo.tier.toLowerCase();
        await this.saveConfig();
      }

      return { optimizedPrompt: result.optimized };
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      
      // Only fallback to simple optimization if it's not an auth error
      if (!(error instanceof Error && error.message.includes('Authentication'))) {
        console.log('Falling back to simple optimization');
        const optimizedPrompt = this.simpleOptimize(prompt);
        this.config.quotaUsed++;
        await this.saveConfig();
        return { optimizedPrompt };
      }
      
      throw error;
    }
  }

  private simpleOptimize(prompt: string): string {
    // Smart optimization logic for testing
    let optimized = prompt.trim();
    
    // Don't optimize if already well-structured
    if (optimized.length > 100 && 
        (optimized.includes('Please') || optimized.includes('Can you') || optimized.includes('I need')) &&
        (optimized.includes('specific') || optimized.includes('detailed') || optimized.includes('context'))) {
      return optimized; // Already well-structured
    }
    
    // Add structure if missing
    if (!optimized.includes('Please') && !optimized.includes('Can you') && !optimized.includes('I need')) {
      optimized = `Please ${optimized.toLowerCase()}`;
    }
    
    // Add specificity only if really vague
    if (optimized.length < 30 && !optimized.includes('specific') && !optimized.includes('detailed')) {
      optimized += '. Please provide specific and detailed information.';
    }
    
    // Add context only if missing and prompt is short
    if (optimized.length < 60 && !optimized.includes('context') && !optimized.includes('background') && !optimized.includes('situation')) {
      optimized += ' Please provide context and background information.';
    }
    
    return optimized;
  }

  private async initializeQuotaTracking() {
    // Reset quota on new day
    const today = new Date().toDateString();
    const lastReset = await chrome.storage.local.get(['lastQuotaReset']);
    
    if (lastReset.lastQuotaReset !== today) {
      this.config.quotaUsed = 0;
      await this.saveConfig();
      await chrome.storage.local.set({ lastQuotaReset: today });
    }
  }

  private async checkAuthStatus() {
    try {
      // Check if we have a stored token
      const storedConfig = await chrome.storage.sync.get(['promptlyConfig']);
      const token = storedConfig.promptlyConfig?.userToken;
      
      if (token) {
        // Validate token with backend
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
      
      // If we get here, user is not authenticated
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
