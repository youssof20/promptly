// Promptly Extension Popup - Grammarly-style flow

document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  const notLoggedIn = document.getElementById('not-logged-in');
  const loggedIn = document.getElementById('logged-in');
  const error = document.getElementById('error');

  // Load user state
  try {
    const result = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
    const config = result.config;

    loading!.style.display = 'none';

    if (config.userToken) {
      // User is logged in
      showLoggedInState(config);
    } else {
      // User is not logged in
      showNotLoggedInState();
    }
  } catch (error) {
    console.error('Failed to load config:', error);
    loading!.style.display = 'none';
    showNotLoggedInState();
  }

  function showNotLoggedInState() {
    notLoggedIn!.style.display = 'block';
    loggedIn!.style.display = 'none';

    // Sign in button
    document.getElementById('signin-btn')!.addEventListener('click', async () => {
      try {
        // Open sign in page
        const tab = await chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/auth/signin' });
        
        // Listen for the tab to complete authentication
        const listener = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            const tabInfo = await chrome.tabs.get(tabId);
            if (tabInfo.url?.includes('/dashboard')) {
              // User successfully signed in, get auth token
              await authenticateUser();
              chrome.tabs.onUpdated.removeListener(listener);
            }
          }
        };
        
        chrome.tabs.onUpdated.addListener(listener);
        
        // Close popup
        window.close();
      } catch (error) {
        showError('Failed to open sign in page');
      }
    });

    // Sign up link
    document.getElementById('signup-link')!.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/auth/signup' });
    });

    // Already logged in button
    document.getElementById('already-logged-btn')!.addEventListener('click', async () => {
      await authenticateUser();
    });
  }

  function showLoggedInState(config: any) {
    notLoggedIn!.style.display = 'none';
    loggedIn!.style.display = 'block';

    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    const quotaFill = document.getElementById('quota-fill') as HTMLElement;
    const quotaText = document.getElementById('quota-text');

    if (config.tier === 'pro') {
      statusBadge!.textContent = 'Pro';
      statusBadge!.className = 'status-badge pro';
      config.quotaLimit = 1000;
    } else {
      statusBadge!.textContent = 'Free';
      statusBadge!.className = 'status-badge free';
    }

    // Update quota display
    const quotaPercentage = (config.quotaUsed / config.quotaLimit) * 100;
    quotaFill!.style.width = `${quotaPercentage}%`;
    quotaText!.textContent = `${config.quotaUsed} / ${config.quotaLimit} prompts used`;

    // Show upgrade banner if free user
    const upgradeBanner = document.getElementById('upgrade-banner');
    if (config.tier === 'free' && config.quotaUsed > config.quotaLimit * 0.8) {
      upgradeBanner!.style.display = 'block';
    }

    // Optimize current prompt button
    document.getElementById('optimize-btn')!.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          await chrome.tabs.sendMessage(tab.id, { type: 'OPTIMIZE_CURRENT_PROMPT' });
          window.close();
        }
      } catch (error) {
        showError('No prompt found on this page');
      }
    });

    // Settings button
    document.getElementById('settings-btn')!.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/dashboard' });
    });

    // Upgrade button
    document.getElementById('upgrade-btn')!.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/pricing' });
    });
  }

  async function authenticateUser() {
    try {
      // Get auth token from web app
      const response = await fetch('https://promptly-two-ashy.vercel.app/api/auth/extension', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          // Store the token in extension
          await chrome.runtime.sendMessage({
            type: 'SET_USER_TOKEN',
            token: data.token,
            user: data.user
          });
          
          // Reload the popup state
          const result = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
          const config = result.config;
          
          if (config.userToken) {
            showLoggedInState(config);
          }
        } else {
          showError('Authentication failed. Please try signing in again.');
        }
      } else {
        showError('Please sign in to your account first, then try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      showError('Authentication failed. Please try again.');
    }
  }

  function showError(message: string) {
    error!.textContent = message;
    error!.style.display = 'block';
    setTimeout(() => {
      error!.style.display = 'none';
    }, 3000);
  }
});