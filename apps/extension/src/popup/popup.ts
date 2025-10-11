// Promptly Extension Popup - Grammarly-style flow

let isSigningIn = false; // Flag to prevent multiple sign-in attempts

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
      // Check if user is signed in on the website
      try {
        const response = await fetch('https://promptly-two-ashy.vercel.app/api/auth/extension', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.token) {
            // User is signed in on website, store token
            await chrome.runtime.sendMessage({
              type: 'SET_USER_TOKEN',
              token: data.token,
              user: data.user
            });
            
            // Reload config and show logged in state
            const newResult = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
            showLoggedInState(newResult.config);
            return;
          }
        }
      } catch (error) {
        console.log('Not signed in on website');
      }
      
      // User is not authenticated anywhere
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
      if (isSigningIn) return; // Prevent multiple sign-in attempts
      
      try {
        isSigningIn = true;
        
        // Clear any existing token first
        await chrome.runtime.sendMessage({
          type: 'SET_USER_TOKEN',
          token: null,
          user: null
        });
        
        // Check if there's already a sign-in tab open
        const tabs = await chrome.tabs.query({ url: 'https://promptly-two-ashy.vercel.app/auth/signin*' });
        if (tabs.length > 0) {
          // Focus existing tab instead of creating new one
          await chrome.tabs.update(tabs[0].id!, { active: true });
          await chrome.windows.update(tabs[0].windowId!, { focused: true });
          return;
        }
        
        // Open sign in page with logout parameter to force account selection
        const tab = await chrome.tabs.create({ 
          url: 'https://promptly-two-ashy.vercel.app/auth/signin?extension=true&logout=true',
          active: true 
        });
        
        // Listen for the tab to complete authentication
        const listener = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            const tabInfo = await chrome.tabs.get(tabId);
            if (tabInfo.url?.includes('/dashboard')) {
              // User successfully signed in, wait a moment then get auth token
              setTimeout(async () => {
                try {
                  // Get auth token from web app
                  const response = await fetch('https://promptly-two-ashy.vercel.app/api/auth/extension', {
                    method: 'POST',
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
                      
                      // Show success message in the tab
                      chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: () => {
                          const message = document.createElement('div');
                          message.innerHTML = `
                            <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; 
                                         background: linear-gradient(135deg, #10b981, #059669); 
                                         color: white; padding: 16px 24px; border-radius: 12px; 
                                         box-shadow: 0 8px 24px rgba(0,0,0,0.15); 
                                         font-family: Inter, sans-serif; font-size: 14px; font-weight: 500;">
                              <div style="display: flex; align-items: center; gap: 8px;">
                                <span>✅</span>
                                <span>You can close this page now - you're signed in to the extension!</span>
                              </div>
                            </div>
                          `;
                          document.body.appendChild(message);
                          setTimeout(() => message.remove(), 5000);
                        }
                      });
                      
                      console.log('Extension authenticated successfully');
                    } else {
                      console.error('Authentication failed:', data);
                    }
                  } else {
                    console.error('Failed to get auth token:', response.status);
                  }
                } catch (error) {
                  console.error('Authentication error:', error);
                } finally {
                  isSigningIn = false; // Reset flag
                }
              }, 1000);
              
              chrome.tabs.onUpdated.removeListener(listener);
            }
          }
        };
        
        chrome.tabs.onUpdated.addListener(listener);
        
        // Close popup
        window.close();
      } catch (error) {
        isSigningIn = false; // Reset flag on error
        console.error('Sign-in error:', error);
        showError('Failed to open sign in page');
      }
    });

    // Sign up link
    document.getElementById('signup-link')!.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/auth/signup' });
    });

  }

  function showLoggedInState(config: any) {
    notLoggedIn!.style.display = 'none';
    loggedIn!.style.display = 'block';

    // Update user info
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    
    if (userAvatar && userName && userEmail) {
      // Extract name from email (before @) or use email
      const name = config.user?.name || config.user?.email?.split('@')[0] || 'User';
      const email = config.user?.email || 'user@example.com';
      
      userAvatar.textContent = name.charAt(0).toUpperCase();
      userName.textContent = name;
      userEmail.textContent = email;
    }

    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    const quotaFill = document.getElementById('quota-fill') as HTMLElement;
    const quotaText = document.getElementById('quota-text');

    if (statusBadge) {
      if (config.tier === 'pro') {
        statusBadge.textContent = 'Pro';
        statusBadge.className = 'status-badge pro';
        config.quotaLimit = 1000;
      } else {
        statusBadge.textContent = 'Free';
        statusBadge.className = 'status-badge free';
      }
    }

    // Update quota display
    if (quotaFill && quotaText) {
      const quotaPercentage = (config.quotaUsed / config.quotaLimit) * 100;
      quotaFill.style.width = `${quotaPercentage}%`;
      quotaText.textContent = `${config.quotaUsed} / ${config.quotaLimit} prompts used`;
    }

    // Show upgrade banner if free user
    const upgradeBanner = document.getElementById('upgrade-banner');
    if (upgradeBanner && config.tier === 'free' && config.quotaUsed > config.quotaLimit * 0.8) {
      upgradeBanner.style.display = 'block';
    }

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/dashboard' });
      });
    }

    // Upgrade button
    const upgradeBtn = document.getElementById('upgrade-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://promptly-two-ashy.vercel.app/pricing' });
      });
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