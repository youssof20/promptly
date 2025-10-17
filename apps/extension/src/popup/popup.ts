// Promptly Extension Popup - Open Source Version
// Handles API key configuration and settings

document.addEventListener('DOMContentLoaded', async () => {
  const aiProviderSelect = document.getElementById('ai-provider') as HTMLSelectElement;
  const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
  const localEndpointInput = document.getElementById('local-endpoint') as HTMLInputElement;
  const apiKeyGroup = document.getElementById('api-key-group') as HTMLElement;
  const localEndpointGroup = document.getElementById('local-endpoint-group') as HTMLElement;
  const testButton = document.getElementById('test-connection') as HTMLButtonElement;
  const saveButton = document.getElementById('save-settings') as HTMLButtonElement;
  const statusDot = document.getElementById('status-dot') as HTMLElement;
  const statusText = document.getElementById('status-text') as HTMLElement;
  const testResult = document.getElementById('test-result') as HTMLElement;
  const apiKeyHelp = document.getElementById('api-key-help') as HTMLElement;

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = (button as HTMLElement).dataset.tab;
      if (!tabName) return;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => content.classList.remove('active'));
      const targetContent = document.getElementById(tabName);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Load saved settings
  await loadSettings();

  // Provider change handler
  aiProviderSelect.addEventListener('change', () => {
    updateUIForProvider();
  });

  // Test connection handler
  testButton.addEventListener('click', async () => {
    await testConnection();
  });

  // Save settings handler
  saveButton.addEventListener('click', async () => {
    await saveSettings();
  });

  // Update UI based on selected provider
  function updateUIForProvider() {
    const provider = aiProviderSelect.value;
    
    if (provider === 'ollama' || provider === 'lmstudio') {
      // Local AI providers
      apiKeyGroup.style.display = 'none';
      localEndpointGroup.style.display = 'block';
      
      if (provider === 'ollama') {
        localEndpointInput.placeholder = 'http://localhost:11434';
        localEndpointInput.value = localEndpointInput.value || 'http://localhost:11434';
      } else {
        localEndpointInput.placeholder = 'http://localhost:1234';
        localEndpointInput.value = localEndpointInput.value || 'http://localhost:1234';
      }
    } else {
      // Cloud AI providers
      apiKeyGroup.style.display = 'block';
      localEndpointGroup.style.display = 'none';
      
      // Update API key help text based on provider
      const helpTexts: Record<string, string> = {
        openai: 'Get your API key from https://platform.openai.com/api-keys',
        anthropic: 'Get your API key from https://console.anthropic.com/',
        google: 'Get your API key from https://makersuite.google.com/app/apikey',
        deepseek: 'Get your API key from https://platform.deepseek.com/api_keys'
      };
      
      apiKeyHelp.textContent = helpTexts[provider] || 'Your API key is stored locally and never sent to our servers';
    }
  }

  // Load settings from storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.local.get(['promptlySettings']);
      const settings = result.promptlySettings || {};
      
      aiProviderSelect.value = settings.provider || 'openai';
      apiKeyInput.value = settings.apiKey || '';
      localEndpointInput.value = settings.localEndpoint || '';
      
      updateUIForProvider();
      updateStatus();
    } catch (error) {
      console.error('Failed to load settings:', error);
      showError('Failed to load settings');
    }
  }

  // Save settings to storage
  async function saveSettings() {
    try {
      const provider = aiProviderSelect.value;
      const apiKey = apiKeyInput.value.trim();
      const localEndpoint = localEndpointInput.value.trim();
      
      // Validate settings
      if (provider !== 'ollama' && provider !== 'lmstudio' && !apiKey) {
        showError('API key is required for this provider');
        return;
      }
      
      if ((provider === 'ollama' || provider === 'lmstudio') && !localEndpoint) {
        showError('Local endpoint is required for this provider');
        return;
      }
      
      const settings = {
        provider,
        apiKey: provider === 'ollama' || provider === 'lmstudio' ? '' : apiKey,
        localEndpoint: provider === 'ollama' || provider === 'lmstudio' ? localEndpoint : '',
        lastUpdated: Date.now()
      };
      
      await chrome.storage.local.set({ promptlySettings: settings });
      
      // Update status
      updateStatus();
      
      // Show success message
      showSuccess('Settings saved successfully!');
      
      // Notify background script of settings change
      chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings });
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      showError('Failed to save settings');
    }
  }

  // Test connection to AI provider
  async function testConnection() {
    const provider = aiProviderSelect.value;
    const apiKey = apiKeyInput.value.trim();
    const localEndpoint = localEndpointInput.value.trim();
    
    testButton.disabled = true;
    testButton.innerHTML = '<div class="loading"></div> Testing...';
    clearMessages();
    
    try {
      let testPrompt = 'Hello, this is a test. Please respond with "Test successful".';
      
      const response = await chrome.runtime.sendMessage({
        type: 'TEST_CONNECTION',
        provider,
        apiKey: provider === 'ollama' || provider === 'lmstudio' ? '' : apiKey,
        localEndpoint: provider === 'ollama' || provider === 'lmstudio' ? localEndpoint : '',
        prompt: testPrompt
      });
      
      if (response.success) {
        showSuccess('Connection successful! Your AI provider is working correctly.');
        updateStatus('connected');
      } else {
        showError(`Connection failed: ${response.error || 'Unknown error'}`);
        updateStatus('error');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Connection test failed: ${errorMessage}`);
      updateStatus('error');
    } finally {
      testButton.disabled = false;
      testButton.textContent = 'Test Connection';
    }
  }

  // Update status indicator
  function updateStatus(status: string = 'ready') {
    const statusDots: Record<string, { class: string; text: string }> = {
      ready: { class: '', text: 'Ready to optimize prompts' },
      connected: { class: '', text: 'Connected to AI provider' },
      error: { class: 'error', text: 'Connection error - check settings' },
      warning: { class: 'warning', text: 'Settings not configured' }
    };
    
    const statusInfo = statusDots[status] || statusDots.ready;
    
    statusDot.className = `status-dot ${statusInfo.class}`;
    statusText.textContent = statusInfo.text;
  }

  // Show error message
  function showError(message: string) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    testResult.appendChild(errorDiv);
  }

  // Show success message
  function showSuccess(message: string) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    testResult.appendChild(successDiv);
  }

  // Clear all messages
  function clearMessages() {
    testResult.innerHTML = '';
  }

  // Initialize UI
  updateUIForProvider();
  updateStatus();
});