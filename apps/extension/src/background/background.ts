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
      'x.com', 'twitter.com',
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
    // Check quota
    if (this.config.quotaUsed >= this.config.quotaLimit) {
      throw new Error('Quota exceeded. Please upgrade to Pro for more optimizations.');
    }

    try {
      console.log('Calling Promptly API:', `${this.config.apiUrl}/api/optimize/extension`);
      
      // Call your existing API
      const response = await fetch(`${this.config.apiUrl}/api/optimize/extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.userToken && { 'Authorization': `Bearer ${this.config.userToken}` })
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
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Optimization failed');
      }
      
      // Increment quota usage
      this.config.quotaUsed++;
      await this.saveConfig();

      return { optimizedPrompt: result.optimized };
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      console.log('Falling back to simple optimization');
      // Fallback to simple optimization if API fails
      const optimizedPrompt = this.simpleOptimize(prompt);
      this.config.quotaUsed++;
      await this.saveConfig();
      return { optimizedPrompt };
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
    // For now, we'll assume user is not authenticated
    // The popup will handle showing the sign-in state
    // Authentication will be handled when user clicks sign in
    this.config.userToken = null;
    this.config.tier = 'free';
    await this.saveConfig();
    console.log('Auth status check completed - user not authenticated');
  }

}

// Initialize the background script
new PromptlyBackground();
