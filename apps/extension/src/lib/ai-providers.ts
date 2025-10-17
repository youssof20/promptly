// AI Providers for Promptly Extension
// Handles different AI services and local models

export interface AIProvider {
  name: string;
  optimize(prompt: string, apiKey?: string, endpoint?: string): Promise<string>;
  testConnection(apiKey?: string, endpoint?: string): Promise<boolean>;
}

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  async optimize(prompt: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt optimization expert. Transform the user\'s prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || prompt;
  }

  async testConnection(apiKey?: string): Promise<boolean> {
    if (!apiKey) return false;
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';

  async optimize(prompt: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a prompt optimization expert. Transform this prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.\n\nOriginal prompt: ${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || prompt;
  }

  async testConnection(apiKey?: string): Promise<boolean> {
    if (!apiKey) return false;
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }]
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class GoogleProvider implements AIProvider {
  name = 'Google';

  async optimize(prompt: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Google API key is required');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a prompt optimization expert. Transform this prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.\n\nOriginal prompt: ${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Google API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || prompt;
  }

  async testConnection(apiKey?: string): Promise<boolean> {
    if (!apiKey) return false;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';

  async optimize(prompt: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt optimization expert. Transform the user\'s prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || prompt;
  }

  async testConnection(apiKey?: string): Promise<boolean> {
    if (!apiKey) return false;
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class OllamaProvider implements AIProvider {
  name = 'Ollama';

  async optimize(prompt: string, apiKey?: string, endpoint?: string): Promise<string> {
    const baseUrl = endpoint || 'http://localhost:11434';
    
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:latest', // Default model, can be configured
        prompt: `You are a prompt optimization expert. Transform this prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.\n\nOriginal prompt: ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || prompt;
  }

  async testConnection(apiKey?: string, endpoint?: string): Promise<boolean> {
    const baseUrl = endpoint || 'http://localhost:11434';
    
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class LMStudioProvider implements AIProvider {
  name = 'LM Studio';

  async optimize(prompt: string, apiKey?: string, endpoint?: string): Promise<string> {
    const baseUrl = endpoint || 'http://localhost:1234';
    
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'local-model', // LM Studio uses this as default
        messages: [
          {
            role: 'system',
            content: 'You are a prompt optimization expert. Transform the user\'s prompt into a more effective, detailed, and specific version that will get better results from AI systems. Keep the original intent but make it clearer, more structured, and more actionable. Respond with only the optimized prompt, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || prompt;
  }

  async testConnection(apiKey?: string, endpoint?: string): Promise<boolean> {
    const baseUrl = endpoint || 'http://localhost:1234';
    
    try {
      const response = await fetch(`${baseUrl}/v1/models`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Provider factory
export function getProvider(providerName: string): AIProvider {
  switch (providerName) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'google':
      return new GoogleProvider();
    case 'deepseek':
      return new DeepSeekProvider();
    case 'ollama':
      return new OllamaProvider();
    case 'lmstudio':
      return new LMStudioProvider();
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}
