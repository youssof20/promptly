// Promptly Extension Popup - Open Source Version
// Handles API key configuration and settings

document.addEventListener('DOMContentLoaded', async () => {
  const aiProviderSelect = document.getElementById('ai-provider');
  const apiKeyInput = document.getElementById('api-key');
  const localEndpointInput = document.getElementById('local-endpoint');
  const apiKeyGroup = document.getElementById('api-key-group');
  const localEndpointGroup = document.getElementById('local-endpoint-group');
  const testButton = document.getElementById('test-connection');
  const saveButton = document.getElementById('save-settings');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const testResult = document.getElementById('test-result');
  const apiKeyHelp = document.getElementById('api-key-help');

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
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
      const helpTexts = {
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
      showError(`Connection test failed: ${error.message}`);
      updateStatus('error');
    } finally {
      testButton.disabled = false;
      testButton.textContent = 'Test Connection';
    }
  }

  // Update status indicator
  function updateStatus(status = 'ready') {
    const statusDots = {
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
  function showError(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    testResult.appendChild(errorDiv);
  }

  // Show success message
  function showSuccess(message) {
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
