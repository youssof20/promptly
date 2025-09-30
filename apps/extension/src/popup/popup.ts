// Popup script for Promptly browser extension
// Handles the extension popup UI and interactions

interface QuotaStatus {
  quotaUsed: number;
  quotaLimit: number;
  tier: 'free' | 'pro';
  canOptimize: boolean;
}

class PromptlyPopup {
  private quotaStatus: QuotaStatus | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await this.loadQuotaStatus();
      this.setupEventListeners();
      this.updateUI();
    } catch (error) {
      this.showError('Failed to load extension data');
      console.error('Popup initialization failed:', error);
    }
  }

  private async loadQuotaStatus() {
    return new Promise<void>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'GET_QUOTA_STATUS' }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response && response.quotaUsed !== undefined) {
          this.quotaStatus = response;
          resolve();
        } else {
          reject(new Error('Invalid response from background script'));
        }
      });
    });
  }

  private setupEventListeners() {
    // Optimize button
    const optimizeBtn = document.getElementById('optimize-btn');
    optimizeBtn?.addEventListener('click', () => this.optimizeCurrentPrompt());

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn?.addEventListener('click', () => this.openSettings());

    // History button
    const historyBtn = document.getElementById('history-btn');
    historyBtn?.addEventListener('click', () => this.openHistory());

    // Upgrade button
    const upgradeBtn = document.getElementById('upgrade-btn');
    upgradeBtn?.addEventListener('click', () => this.openUpgrade());
  }

  private updateUI() {
    // Hide loading, show content
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';

    if (!this.quotaStatus) return;

    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
      statusBadge.textContent = this.quotaStatus.tier === 'pro' ? 'Pro' : 'Free';
      statusBadge.className = `status-badge ${this.quotaStatus.tier}`;
    }

    // Update quota bar
    const quotaFill = document.getElementById('quota-fill');
    const quotaText = document.getElementById('quota-text');
    
    if (quotaFill && quotaText) {
      const percentage = (this.quotaStatus.quotaUsed / this.quotaStatus.quotaLimit) * 100;
      quotaFill.style.width = `${Math.min(percentage, 100)}%`;
      quotaText.textContent = `${this.quotaStatus.quotaUsed} / ${this.quotaStatus.quotaLimit} prompts used`;
    }

    // Update optimize button
    const optimizeBtn = document.getElementById('optimize-btn') as HTMLButtonElement;
    if (optimizeBtn) {
      if (this.quotaStatus.canOptimize) {
        optimizeBtn.disabled = false;
        optimizeBtn.textContent = 'Optimize Current Prompt';
      } else {
        optimizeBtn.disabled = true;
        optimizeBtn.textContent = 'Quota Exceeded';
      }
    }

    // Show/hide upgrade banner
    const upgradeBanner = document.getElementById('upgrade-banner');
    if (upgradeBanner) {
      if (this.quotaStatus.tier === 'free' && this.quotaStatus.quotaUsed > this.quotaStatus.quotaLimit * 0.8) {
        upgradeBanner.style.display = 'block';
      } else {
        upgradeBanner.style.display = 'none';
      }
    }
  }

  private async optimizeCurrentPrompt() {
    if (!this.quotaStatus?.canOptimize) {
      this.showError('Quota exceeded. Please upgrade to Pro for more optimizations.');
      return;
    }

    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      // Send message to content script to optimize
      chrome.tabs.sendMessage(tab.id, { type: 'OPTIMIZE_PROMPT' }, (response) => {
        if (chrome.runtime.lastError) {
          this.showError('Please navigate to a supported AI platform to use this feature.');
          return;
        }

        if (response && response.success) {
          this.showSuccess('Prompt optimized successfully!');
          // Refresh quota status
          this.loadQuotaStatus().then(() => this.updateUI());
        } else {
          this.showError(response?.error || 'Optimization failed');
        }
      });
    } catch (error) {
      this.showError('Failed to optimize prompt. Please try again.');
      console.error('Optimization error:', error);
    }
  }

  private openSettings() {
    // Open settings page in new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  }

  private openHistory() {
    // Open history page in new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
  }

  private openUpgrade() {
    // Open upgrade page in new tab
    chrome.tabs.create({ url: 'https://promptly.app/upgrade' });
  }

  private showError(message: string) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      // Hide after 5 seconds
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }
  }

  private showSuccess(message: string) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'error';
    successDiv.style.background = '#1F1F1F';
    successDiv.style.borderColor = '#22C55E';
    successDiv.style.color = '#22C55E';
    successDiv.textContent = message;
    
    const container = document.querySelector('.container');
    if (container) {
      container.appendChild(successDiv);
      
      // Remove after 3 seconds
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PromptlyPopup();
});
