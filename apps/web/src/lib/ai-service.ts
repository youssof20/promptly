interface AIOptimizationRequest {
  prompt: string;
  tier: 'free' | 'pro';
}

interface AIOptimizationResponse {
  optimizedPrompt: string;
  tokensUsed: number;
  model: string;
  tier: string;
}

interface AIProvider {
  optimizePrompt(request: AIOptimizationRequest): Promise<AIOptimizationResponse>;
}

class OpenAIProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async optimizePrompt(request: AIOptimizationRequest): Promise<AIOptimizationResponse> {
    const { prompt, tier } = request;
    
    // Select model based on tier
    const model = tier === 'pro' ? 'gpt-4o-mini' : 'gpt-3.5-turbo';
    
    // Create optimization prompt
    const systemPrompt = tier === 'pro' 
      ? `You are an expert prompt engineer. Transform the user's prompt into a highly optimized, detailed, and effective prompt that will yield better results from AI systems. 

Guidelines for PRO optimization:
- Add specific context and constraints
- Include clear output format requirements
- Specify the desired tone and style
- Add examples or templates when relevant
- Include step-by-step instructions for complex tasks
- Add quality criteria and success metrics
- Optimize for clarity, specificity, and actionability

Return only the optimized prompt, no explanations.`
      : `You are a helpful assistant that improves prompts. Make the user's prompt clearer and more specific to get better AI responses.

Guidelines for FREE optimization:
- Make the prompt clearer and more specific
- Add basic context when helpful
- Suggest a clear structure
- Keep it concise but effective

Return only the improved prompt, no explanations.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: tier === 'pro' ? 1000 : 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const optimizedPrompt = data.choices[0]?.message?.content?.trim() || prompt;
      
      // Calculate token usage
      const tokensUsed = data.usage?.total_tokens || 0;

      return {
        optimizedPrompt,
        tokensUsed,
        model,
        tier
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to optimize prompt with OpenAI');
    }
  }
}

class DeepSeekProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async optimizePrompt(request: AIOptimizationRequest): Promise<AIOptimizationResponse> {
    const { prompt, tier } = request;
    
    // DeepSeek models
    const model = tier === 'pro' ? 'deepseek-chat' : 'deepseek-chat';
    
    const systemPrompt = tier === 'pro' 
      ? `You are an expert prompt engineer. Transform the user's prompt into a highly optimized, detailed, and effective prompt that will yield better results from AI systems. 

Guidelines for PRO optimization:
- Add specific context and constraints
- Include clear output format requirements
- Specify the desired tone and style
- Add examples or templates when relevant
- Include step-by-step instructions for complex tasks
- Add quality criteria and success metrics
- Optimize for clarity, specificity, and actionability

Return only the optimized prompt, no explanations.`
      : `You are a helpful assistant that improves prompts. Make the user's prompt clearer and more specific to get better AI responses.

Guidelines for FREE optimization:
- Make the prompt clearer and more specific
- Add basic context when helpful
- Suggest a clear structure
- Keep it concise but effective

Return only the improved prompt, no explanations.`;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: tier === 'pro' ? 1000 : 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const optimizedPrompt = data.choices[0]?.message?.content?.trim() || prompt;
      
      // Calculate token usage
      const tokensUsed = data.usage?.total_tokens || 0;

      return {
        optimizedPrompt,
        tokensUsed,
        model,
        tier
      };
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to optimize prompt with DeepSeek');
    }
  }
}

class MockProvider implements AIProvider {
  async optimizePrompt(request: AIOptimizationRequest): Promise<AIOptimizationResponse> {
    const { prompt, tier } = request;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isPro = tier === 'pro';
    
    let optimizedPrompt = prompt;
    let tokensUsed = 0;
    let model = '';

    if (isPro) {
      model = 'gpt-4o-mini';
      tokensUsed = Math.floor(prompt.length * 0.8) + Math.floor(prompt.length * 1.2);
      
      optimizedPrompt = `Please provide a comprehensive and detailed response to the following request. 

Context: I'm looking for a thorough, well-structured answer that covers all relevant aspects of this topic.

Request: ${prompt}

Please ensure your response:
- Is clear, detailed, and actionable
- Includes specific examples where relevant
- Addresses potential follow-up questions
- Is organized in a logical structure
- Provides practical insights and recommendations

Please proceed with your response.`;
    } else {
      model = 'deepseek-chat';
      tokensUsed = Math.floor(prompt.length * 0.5) + Math.floor(prompt.length * 0.8);
      
      optimizedPrompt = `Please provide a helpful and detailed response to: ${prompt}

Please make sure to:
- Be clear and specific
- Provide useful information
- Give practical examples if relevant
- Structure your response well

Thank you!`;
    }

    return {
      optimizedPrompt,
      tokensUsed,
      model,
      tier
    };
  }
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    // Initialize providers based on available API keys
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider(process.env.OPENAI_API_KEY));
    }
    
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', new DeepSeekProvider(process.env.DEEPSEEK_API_KEY));
    }
    
    // Always add mock provider as fallback
    this.providers.set('mock', new MockProvider());
  }

  async optimizePrompt(request: AIOptimizationRequest): Promise<AIOptimizationResponse> {
    const { tier } = request;
    
    // Select provider based on tier and availability
    let provider: AIProvider;
    
    if (tier === 'pro') {
      // Prefer OpenAI for Pro tier
      provider = this.providers.get('openai') || this.providers.get('deepseek') || this.providers.get('mock')!;
    } else {
      // Prefer DeepSeek for Free tier (more cost-effective)
      provider = this.providers.get('deepseek') || this.providers.get('openai') || this.providers.get('mock')!;
    }

    try {
      return await provider.optimizePrompt(request);
    } catch (error) {
      console.error('AI optimization failed:', error);
      
      // Fallback to mock provider if real API fails
      if (provider !== this.providers.get('mock')) {
        console.log('Falling back to mock provider');
        return await this.providers.get('mock')!.optimizePrompt(request);
      }
      
      throw error;
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  isProviderAvailable(provider: string): boolean {
    return this.providers.has(provider);
  }
}

// Export singleton instance
export const aiService = new AIService();
