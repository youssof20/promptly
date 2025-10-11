// Content script for Promptly browser extension
// Detects AI chat platforms and provides minimal hint-based optimization

(function() {
  // Prevent multiple injections
  if ((window as any).promptlyLoaded) {
    console.log('Promptly already loaded, skipping');
    return;
  }
  (window as any).promptlyLoaded = true;

  console.log('Promptly content script loaded');

// Enhanced platform detection with better error handling
const detectPlatform = (): string | null => {
  const hostname = window.location.hostname;
  
  // Major chat AI platforms with comprehensive detection
  if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) {
    return 'chatgpt';
  } else if (hostname.includes('claude.ai')) {
    return 'claude';
  } else if (hostname.includes('poe.com')) {
    return 'poe';
  } else if (hostname.includes('bard.google.com') || hostname.includes('gemini.google.com')) {
    return 'gemini';
  } else if (hostname.includes('deepseek.com')) {
    return 'deepseek';
  } else if (hostname.includes('perplexity.ai')) {
    return 'perplexity';
  } else if (hostname.includes('you.com')) {
    return 'you';
  } else if (hostname.includes('huggingface.co')) {
    return 'huggingface';
  } else if (hostname.includes('together.ai')) {
    return 'together';
  } else if (hostname.includes('lmsys.org')) {
    return 'lmsys';
  } else if (hostname.includes('meta.ai')) {
    return 'meta';
  } else if (hostname.includes('mistral.ai')) {
    return 'mistral';
  } else if (hostname.includes('anthropic.com')) {
    return 'anthropic';
  } else if (hostname.includes('copilot.microsoft.com') || hostname.includes('bing.com')) {
    return 'copilot';
  } else if (hostname.includes('x.com') || hostname.includes('twitter.com') || hostname.includes('grok.x.ai') || hostname.includes('grok.com')) {
    return 'grok';
  } else if (hostname.includes('notion.so')) {
    return 'notion';
  } else if (hostname.includes('docs.google.com')) {
    return 'google-docs';
  } else if (hostname.includes('word.office.com')) {
    return 'word';
  } else if (hostname.includes('grammarly.com')) {
    return 'grammarly';
  } else if (hostname.includes('jasper.ai')) {
    return 'jasper';
  } else if (hostname.includes('writesonic.com')) {
    return 'writesonic';
  } else if (hostname.includes('copy.ai')) {
    return 'copy-ai';
  } else if (hostname.includes('rytr.me')) {
    return 'rytr';
  } else if (hostname.includes('cursor.sh')) {
    return 'cursor';
  } else if (hostname.includes('replit.com')) {
    return 'replit';
  } else if (hostname.includes('github.com')) {
    return 'github-copilot';
  } else if (hostname.includes('stackblitz.com')) {
    return 'stackblitz';
  } else if (hostname.includes('codeium.com')) {
    return 'codeium';
  } else if (hostname.includes('chatpaper.ai')) {
    return 'chatpaper';
  } else if (hostname.includes('consensus.app')) {
    return 'consensus';
  } else if (hostname.includes('scite.ai')) {
    return 'scite';
  } else if (hostname.includes('typeset.io')) {
    return 'typeset';
  }
  
  return 'generic';
};

// Chatbox detection patterns for different platforms
const getChatboxSelectors = (platform: string): string[] => {
  const selectors: Record<string, string[]> = {
    chatgpt: [
      'textarea[placeholder*="Message"]',
      'textarea[data-id="root"]',
      '#prompt-textarea',
      'textarea[placeholder*="Send a message"]'
    ],
    claude: [
      'div[contenteditable="true"]',
      'textarea',
      'div[role="textbox"]',
      '[contenteditable="true"]'
    ],
    gemini: [
      'div[contenteditable="true"]',
      '.ql-editor[contenteditable="true"]',
      'textarea',
      'div[role="textbox"]',
      '[contenteditable="true"]'
    ],
    poe: [
      'textarea[placeholder*="Message"]',
      'textarea[data-testid="composer-text-input"]'
    ],
    deepseek: [
      'textarea',
      'div[contenteditable="true"]',
      'div[role="textbox"]',
      '[contenteditable="true"]'
    ],
    perplexity: [
      'textarea[placeholder*="Ask anything"]',
      'textarea[data-testid="composer-text-input"]'
    ],
    you: [
      'textarea[placeholder*="Ask anything"]',
      'textarea[data-testid="composer-text-input"]'
    ],
    grok: [
      'textarea',
      'div[contenteditable="true"]',
      'div[role="textbox"]',
      '[contenteditable="true"]'
    ],
    generic: [
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="Type"]',
      'textarea[placeholder*="Enter"]',
      'textarea[placeholder*="Write"]',
      'textarea[placeholder*="Send"]',
      'textarea[data-testid*="composer"]',
      'textarea[data-testid*="input"]',
      'textarea[role="textbox"]',
      'div[contenteditable="true"]',
      'div[role="textbox"]'
    ]
  };
  
  return selectors[platform] || selectors.generic;
};

// Find chatbox element
const findChatbox = (platform: string): HTMLTextAreaElement | HTMLDivElement | null => {
  const selectors = getChatboxSelectors(platform);
  
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLTextAreaElement | HTMLDivElement;
    if (element && isVisible(element)) {
      return element;
    }
  }
  
  return null;
};

// Check if element is visible
const isVisible = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0;
};

// Create minimal optimization hint UI
const createOptimizationHint = (): HTMLElement => {
  const hint = document.createElement('div');
  hint.className = 'promptly-hint';
  
  const hintContent = document.createElement('div');
  hintContent.className = 'promptly-hint-content';
  hintContent.setAttribute('data-platform', detectPlatform() || 'generic');
  
  const icon = document.createElement('span');
  icon.className = 'promptly-hint-icon';
  icon.textContent = '⚡';
  
  const text = document.createElement('div');
  text.className = 'promptly-hint-text';
  
          const title = document.createElement('div');
          title.className = 'promptly-hint-title';
          title.textContent = 'Optimize with AI';
          
          text.appendChild(title);
  hintContent.appendChild(icon);
  hintContent.appendChild(text);
  hint.appendChild(hintContent);
  
  return hint;
};

// Position hint relative to chatbox with better positioning
const positionHint = (hint: HTMLElement, chatbox: Element): void => {
  const rect = chatbox.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  // Check if there's space below the chatbox
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  hint.style.position = 'absolute';
  hint.style.zIndex = '10000';
  
  // Center horizontally relative to chatbox
  const centerX = rect.left + (rect.width / 2);
  
  if (spaceBelow > 50 || spaceBelow > spaceAbove) {
    // Position below chatbox, centered
    hint.style.top = `${rect.bottom + scrollTop + 6}px`;
    hint.style.left = `${centerX + scrollLeft - 40}px`; // Center the hint
  } else {
    // Position above chatbox, centered
    hint.style.top = `${rect.top + scrollTop - 45}px`;
    hint.style.left = `${centerX + scrollLeft - 40}px`; // Center the hint
  }
  
  // Ensure hint doesn't go off-screen horizontally
  const hintRect = hint.getBoundingClientRect();
  if (hintRect.right > window.innerWidth) {
    hint.style.left = `${window.innerWidth - hintRect.width - 20}px`;
  }
  if (hintRect.left < 0) {
    hint.style.left = '20px';
  }
};

// Show optimization hint
const showHint = (chatbox: Element): void => {
  // Remove existing hint
  const existingHint = document.querySelector('.promptly-hint');
  if (existingHint) {
    existingHint.remove();
  }
  
  const hint = createOptimizationHint();
  positionHint(hint, chatbox);
  
  // Add click handler
  hint.addEventListener('click', () => {
    optimizePrompt(chatbox);
  });
  
  document.body.appendChild(hint);
  
  // Auto-hide after 8 seconds (increased from 5)
  setTimeout(() => {
    if (hint.parentNode) {
      hint.style.animation = 'promptly-fade-out 0.3s ease-in';
      setTimeout(() => {
        if (hint.parentNode) {
          hint.remove();
        }
      }, 300);
    }
  }, 8000);
};

// Optimize prompt
const optimizePrompt = async (chatbox: Element): Promise<void> => {
  const text = chatbox.textContent || (chatbox as HTMLTextAreaElement).value || '';
  
  if (!text.trim()) {
    return;
  }
  
  console.log('Optimizing prompt:', text);
  
  try {
    // Send message to background script for optimization
    const response = await chrome.runtime.sendMessage({
      type: 'OPTIMIZE_PROMPT',
      prompt: text
    });
    
    console.log('Background response:', response);
    
    if (response && response.success && response.optimized) {
      console.log('Optimized prompt:', response.optimized);
      
      // Replace text in chatbox
      if (chatbox instanceof HTMLTextAreaElement) {
        chatbox.value = response.optimized;
        chatbox.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        chatbox.textContent = response.optimized;
        chatbox.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Show success feedback
      showSuccessFeedback();
    } else {
      console.error('Optimization failed:', response);
      showErrorFeedback();
    }
  } catch (error) {
    console.error('Optimization failed:', error);
    showErrorFeedback();
  }
};

// Show success feedback with dopamine boost
const showSuccessFeedback = (): void => {
  const feedback = document.createElement('div');
  feedback.className = 'promptly-feedback promptly-success';
  feedback.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 18px;">✨</span>
      <div>
        <div style="font-weight: 600; margin-bottom: 2px;">Prompt optimized!</div>
        <div style="font-size: 12px; opacity: 0.9;">Clearer, more specific. You'll get a sharper response.</div>
      </div>
    </div>
  `;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10001;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
    animation: promptly-bounce-in 0.4s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.animation = 'promptly-fade-out 0.3s ease-in';
    setTimeout(() => {
      feedback.remove();
    }, 300);
  }, 4000);
};

// Show error feedback
const showErrorFeedback = (): void => {
  const feedback = document.createElement('div');
  feedback.className = 'promptly-feedback promptly-error';
  feedback.textContent = '✗ Optimization failed';
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #DC2626;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    animation: promptly-slide-in 0.3s ease-out;
  `;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 3000);
};

// Monitor chatbox for changes with improved logic
const monitorChatbox = (chatbox: Element): void => {
  let lastValue = '';
  let hintTimeout: number | null = null;
  let hintShown = false;
  let lastActivityTime = 0;
  
  const checkForChanges = () => {
    const currentValue = chatbox.textContent || (chatbox as HTMLTextAreaElement).value || '';
    const now = Date.now();
    
    // Only check if enough time has passed since last activity (debounce)
    if (now - lastActivityTime < 300) {
      return;
    }
    
    if (currentValue !== lastValue && currentValue.length > 15) {
      lastValue = currentValue;
      lastActivityTime = now;
      
      // Only show hint once per prompt and only for substantial content
      if (!hintShown && currentValue.length > 15 && !isAlreadyOptimized(currentValue)) {
        // Clear existing timeout
        if (hintTimeout) {
          clearTimeout(hintTimeout);
        }
        
        // Show hint after user stops typing (longer delay)
        hintTimeout = window.setTimeout(() => {
          showHint(chatbox);
          hintShown = true;
        }, 2000);
      }
    }
    
    // Reset hint flag when prompt is cleared
    if (currentValue.length === 0) {
      hintShown = false;
      lastValue = '';
    }
  };
  
  // Check if prompt is already well-optimized
  const isAlreadyOptimized = (text: string): boolean => {
    const optimizedIndicators = [
      'please provide',
      'please ensure',
      'please include',
      'please make sure',
      'specific examples',
      'detailed information',
      'comprehensive',
      'structured',
      'step-by-step',
      'context',
      'background'
    ];
    
    return optimizedIndicators.some(indicator => 
      text.toLowerCase().includes(indicator)
    );
  };
  
  // Listen for input events with debouncing
  let inputTimeout: number | null = null;
  chatbox.addEventListener('input', () => {
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    inputTimeout = window.setTimeout(checkForChanges, 500);
  });
  
  chatbox.addEventListener('paste', () => {
    setTimeout(checkForChanges, 1000);
  });
  
  // Listen for focus events to catch programmatic changes
  chatbox.addEventListener('focus', () => {
    setTimeout(checkForChanges, 1000);
  });
};

// Initialize extension
const init = () => {
  try {
    const platform = detectPlatform();
    
    if (platform) {
      console.log(`Promptly detected platform: ${platform}`);
      
      let chatboxFound = false;
      let retryCount = 0;
      const maxRetries = 10;
      
      // Wait for page to fully load
      const checkForChatbox = () => {
        try {
          if (chatboxFound) return;
          
          const chatbox = findChatbox(platform);
          
          if (chatbox) {
            console.log('Chatbox found, setting up monitoring');
            chatbox.setAttribute('data-promptly-monitored', 'true');
            monitorChatbox(chatbox);
            chatboxFound = true;
          } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Promptly: Chatbox not found, retrying... (${retryCount}/${maxRetries})`);
            // Retry with exponential backoff
            setTimeout(checkForChatbox, Math.min(1000 * retryCount, 5000));
          } else {
            console.log('Promptly: Chatbox not found after maximum retries');
          }
        } catch (error) {
          console.error('Promptly: Error in checkForChatbox:', error);
        }
      };
      
      // Start checking for chatbox immediately
      checkForChatbox();
      
      // Also check when DOM changes (for SPA navigation)
      const observer = new MutationObserver(() => {
        try {
          if (!chatboxFound) {
            const chatbox = findChatbox(platform);
            if (chatbox && !chatbox.hasAttribute('data-promptly-monitored')) {
              console.log('Chatbox found via DOM mutation, setting up monitoring');
              chatbox.setAttribute('data-promptly-monitored', 'true');
              monitorChatbox(chatbox);
              chatboxFound = true;
            }
          }
        } catch (error) {
          console.error('Promptly: Error in mutation observer:', error);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      console.log('Promptly: Platform not supported');
    }
  } catch (error) {
    console.error('Promptly initialization error:', error);
  }
};

// Add CSS animations
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes promptly-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes promptly-bounce-in {
      0% {
        transform: translateX(100%) scale(0.8);
        opacity: 0;
      }
      50% {
        transform: translateX(-10px) scale(1.05);
        opacity: 1;
      }
      100% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes promptly-fade-out {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateX(100%) scale(0.8);
        opacity: 0;
      }
    }
   `;
  document.head.appendChild(style);
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    init();
  });
} else {
  addStyles();
  init();
}

})(); // End of IIFE