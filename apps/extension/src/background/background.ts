// Background script for Promptly browser extension - Open Source Version
// Handles extension lifecycle, storage, and AI optimization

import { getProvider } from '../lib/ai-providers';

interface PromptlySettings {
  provider: string;
  apiKey: string;
  localEndpoint: string;
  lastUpdated: number;
}

interface PromptlyConfig {
  isEnabled: boolean;
  settings: PromptlySettings | null;
}

class PromptlyBackground {
  private config: PromptlyConfig = {
    isEnabled: true,
    settings: null
  };

  constructor() {
    this.init();
  }

  private async init() {
    // Load configuration from storage
    await this.loadConfig();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  private async loadConfig() {
    try {
      const result = await chrome.storage.local.get(['promptlyConfig', 'promptlySettings']);
      if (result.promptlyConfig && typeof result.promptlyConfig === 'object') {
        this.config = { ...this.config, ...result.promptlyConfig };
      }
      if (result.promptlySettings) {
        this.config.settings = result.promptlySettings;
      }
    } catch (error) {
      console.warn('Failed to load Promptly config:', error);
      // Reset to default config if corrupted
      this.config = {
        isEnabled: true,
        settings: null
      };
    }
  }

  private async saveConfig() {
    try {
      await chrome.storage.local.set({ promptlyConfig: this.config });
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
    console.log('🎉 Welcome to Promptly! Your open-source AI prompt optimizer is now active.');
  }

  private showUpdateNotification(previousVersion?: string) {
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

      case 'SETTINGS_UPDATED':
        this.config.settings = message.settings;
        await this.saveConfig();
        sendResponse({ success: true });
        break;

      case 'OPTIMIZE_PROMPT':
        try {
          const result = await this.optimizePrompt(message.prompt);
          sendResponse({ success: true, optimized: result });
        } catch (error) {
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
        break;

      case 'TEST_CONNECTION':
        try {
          const success = await this.testConnection(
            message.provider,
            message.apiKey,
            message.localEndpoint
          );
          sendResponse({ success, error: success ? null : 'Connection failed' });
        } catch (error) {
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Connection test failed' 
          });
        }
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

  private async optimizePrompt(prompt: string): Promise<string> {
    // Check if settings are configured
    if (!this.config.settings) {
      throw new Error('Please configure your AI provider settings in the extension popup.');
    }

    const { provider, apiKey, localEndpoint } = this.config.settings;

    try {
      // Use static import instead of dynamic import
      const aiProvider = getProvider(provider);
      return await aiProvider.optimize(prompt, apiKey, localEndpoint);
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      
      // Fallback to simple optimization if AI provider fails
      console.log('Falling back to simple optimization');
      return this.simpleOptimize(prompt);
    }
  }

  private async testConnection(provider: string, apiKey?: string, localEndpoint?: string): Promise<boolean> {
    try {
      // Use static import instead of dynamic import
      const aiProvider = getProvider(provider);
      return await aiProvider.testConnection(apiKey, localEndpoint);
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  private simpleOptimize(prompt: string): string {
    // Smart optimization logic for fallback
    let optimized = prompt.trim();
    
    // Don't optimize if already well-structured
    if (optimized.length > 100 && 
        (optimized.includes('Please') || optimized.includes('Can you') || optimized.includes('I need')) &&
        (optimized.includes('specific') || optimized.includes('detailed') || optimized.includes('context'))) {
      return optimized;
    }
    
    // Add politeness if missing
    if (!optimized.includes('Please') && !optimized.includes('Can you') && !optimized.includes('I need')) {
      optimized = `Please ${optimized.toLowerCase()}`;
    }
    
    // Add specificity for short prompts
    if (optimized.length < 30 && !optimized.includes('specific') && !optimized.includes('detailed')) {
      optimized += '. Please provide specific and detailed information.';
    }
    
    // Add context for medium-length prompts
    if (optimized.length < 60 && !optimized.includes('context') && !optimized.includes('background') && !optimized.includes('situation')) {
      optimized += ' Please provide context and background information.';
    }
    
    return optimized;
  }
}

// Initialize the background script
new PromptlyBackground();