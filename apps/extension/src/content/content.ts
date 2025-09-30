// Content script for Promptly browser extension
// This script runs on AI chat pages and injects the optimization UI

interface PromptlyConfig {
  apiUrl: string;
  isEnabled: boolean;
  tier: 'free' | 'pro';
  quotaUsed: number;
  quotaLimit: number;
}

class PromptlyContentScript {
  private config: PromptlyConfig = {
    apiUrl: 'https://api.promptly.app',
    isEnabled: true,
    tier: 'free',
    quotaUsed: 0,
    quotaLimit: 50
  };

  // private injectedUI: HTMLElement | null = null;
  private isOptimizing = false;

  constructor() {
    this.init();
  }

  private async init() {
    // Load configuration from storage
    await this.loadConfig();
    
    // Only proceed if extension is enabled
    if (!this.config.isEnabled) return;

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private async loadConfig() {
    try {
      const result = await chrome.storage.sync.get(['promptlyConfig']);
      if (result.promptlyConfig) {
        this.config = { ...this.config, ...result.promptlyConfig };
      }
    } catch (error) {
      console.warn('Failed to load Promptly config:', error);
    }
  }

  private setup() {
    // Find text areas and input fields on the page
    this.observeTextInputs();
    
    // Listen for messages from the extension
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });
  }

  private observeTextInputs() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            this.checkForTextInputs(element);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Check existing inputs
    this.checkForTextInputs(document.body);
  }

  private checkForTextInputs(container: Element) {
    const selectors = [
      'textarea',
      'input[type="text"]',
      '[contenteditable="true"]',
      '[role="textbox"]'
    ];

    selectors.forEach(selector => {
      const inputs = container.querySelectorAll(selector);
      inputs.forEach(input => this.attachPromptlyUI(input as HTMLElement));
    });
  }

  private attachPromptlyUI(input: HTMLElement) {
    // Skip if already has Promptly UI
    if (input.closest('.promptly-container')) return;

    // Create container
    const container = document.createElement('div');
    container.className = 'promptly-container';
    container.style.cssText = `
      position: relative;
      margin-top: 8px;
    `;

    // Wrap the input
    input.parentNode?.insertBefore(container, input);
    container.appendChild(input);

    // Add optimize button
    this.addOptimizeButton(container, input);
  }

  private addOptimizeButton(container: HTMLElement, input: HTMLElement) {
    const button = document.createElement('button');
    button.className = 'promptly-optimize-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      Optimize
    `;
    
    button.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `;

    // Show button on focus
    input.addEventListener('focus', () => {
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    });

    // Hide button on blur (with delay)
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (document.activeElement !== input) {
          button.style.opacity = '0';
          button.style.transform = 'translateY(10px)';
        }
      }, 200);
    });

    // Handle click
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.optimizePrompt(input);
    });

    container.appendChild(button);
  }

  private async optimizePrompt(input: HTMLElement) {
    if (this.isOptimizing) return;

    const originalText = this.getInputValue(input);
    if (!originalText.trim()) return;

    this.isOptimizing = true;
    this.showOptimizingState(input);

    try {
      const optimizedText = await this.callOptimizationAPI(originalText);
      this.showOptimizationResult(input, originalText, optimizedText);
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      this.showError(input, 'Optimization failed. Please try again.');
    } finally {
      this.isOptimizing = false;
    }
  }

  private getInputValue(input: HTMLElement): string {
    if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
      return (input as HTMLInputElement | HTMLTextAreaElement).value;
    } else if (input.contentEditable === 'true') {
      return input.textContent || '';
    }
    return '';
  }

  private setInputValue(input: HTMLElement, value: string) {
    if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
      (input as HTMLInputElement | HTMLTextAreaElement).value = value;
    } else if (input.contentEditable === 'true') {
      input.textContent = value;
    }
  }

  private showOptimizingState(input: HTMLElement) {
    const button = input.parentElement?.querySelector('.promptly-optimize-btn') as HTMLButtonElement;
    if (button) {
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Optimizing...
      `;
      button.disabled = true;
    }
  }

  private showOptimizationResult(input: HTMLElement, original: string, optimized: string) {
    // Create result modal
    const modal = this.createResultModal(original, optimized, (useOptimized) => {
      if (useOptimized) {
        this.setInputValue(input, optimized);
      }
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  private createResultModal(original: string, optimized: string, onAction: (useOptimized: boolean) => void) {
    const modal = document.createElement('div');
    modal.className = 'promptly-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;

    modal.innerHTML = `
      <div style="
        background: #1F1F1F;
        border: 1px solid #374151;
        border-radius: 12px;
        max-width: 800px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      ">
        <div style="padding: 24px; border-bottom: 1px solid #374151;">
          <h3 style="color: white; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
            ✨ Prompt Optimized
          </h3>
          <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
            Here's how we improved your prompt for better AI results:
          </p>
        </div>
        
        <div style="padding: 24px;">
          <div style="margin-bottom: 24px;">
            <h4 style="color: #9CA3AF; font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">Original</h4>
            <div style="
              background: #0D0D0D;
              border: 1px solid #374151;
              border-radius: 8px;
              padding: 16px;
              color: #D1D5DB;
              font-size: 14px;
              line-height: 1.5;
            ">${original}</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: #22C55E; font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">Optimized</h4>
            <div style="
              background: #0D0D0D;
              border: 1px solid #22C55E;
              border-radius: 8px;
              padding: 16px;
              color: #D1D5DB;
              font-size: 14px;
              line-height: 1.5;
            ">${optimized}</div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="promptly-btn-secondary" style="
              background: transparent;
              color: #9CA3AF;
              border: 1px solid #374151;
              border-radius: 6px;
              padding: 10px 20px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
            ">Cancel</button>
            <button class="promptly-btn-primary" style="
              background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
              color: white;
              border: none;
              border-radius: 6px;
              padding: 10px 20px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
            ">Use Optimized</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('.promptly-btn-secondary')?.addEventListener('click', () => onAction(false));
    modal.querySelector('.promptly-btn-primary')?.addEventListener('click', () => onAction(true));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) onAction(false);
    });

    return modal;
  }

  private showError(input: HTMLElement, message: string) {
    // Reset button
    const button = input.parentElement?.querySelector('.promptly-optimize-btn') as HTMLButtonElement;
    if (button) {
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        Optimize
      `;
      button.disabled = false;
    }

    // Show error toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #DC2626;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  private async callOptimizationAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.apiUrl}/api/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        tier: this.config.tier
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.optimizedPrompt;
  }

  private handleMessage(message: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) {
    switch (message.type) {
      case 'OPTIMIZE_PROMPT':
        // Handle optimization request
        break;
      case 'UPDATE_CONFIG':
        this.config = { ...this.config, ...message.config };
        break;
    }
  }
}

// Initialize the content script
new PromptlyContentScript();
