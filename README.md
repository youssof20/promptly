# Promptly - Open Source AI Prompt Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/youssof20/promptly)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Promptly is a completely free, open-source browser extension that automatically optimizes your prompts before sending them to ChatGPT, Claude, Gemini, and other AI platforms. No account required, no data collection, works with your own API keys.

## Start

### 1. Install the Extension

**Manual Installation** (Development)
```bash
git clone https://github.com/youssof20/promptly.git
cd promptly
npm install
npm run build
# Load the extension from apps/extension/dist in Chrome/Edge
```

### 2. Configure Your AI Provider

1. Click the Promptly extension icon
2. Go to the Settings tab
3. Choose your preferred AI provider:
   - **OpenAI**: Enter your API key from [platform.openai.com](https://platform.openai.com/api-keys)
   - **Anthropic**: Enter your API key from [console.anthropic.com](https://console.anthropic.com/)
   - **Google**: Enter your API key from [makersuite.google.com](https://makersuite.google.com/app/apikey)
   - **DeepSeek**: Enter your API key from [platform.deepseek.com](https://platform.deepseek.com/api_keys)
   - **Local AI**: Enter your Ollama (`http://localhost:11434`) or LM Studio (`http://localhost:1234`) endpoint
4. Test the connection
5. Save settings

### 3. Start Optimizing

1. Visit any supported AI platform (ChatGPT, Claude, etc.)
2. Start typing your prompt
3. Click the optimization hint when it appears
4. Watch your prompt transform automatically!

## 📖 How It Works

### Before Optimization
```
"help me write a blog post about ai"
```

### After Optimization
```
"Write a comprehensive 1,500-word blog post about artificial intelligence, 
focusing on its current applications in healthcare, business automation, 
and creative industries. Include real-world examples, potential challenges, 
and future outlook. Target audience: general business professionals. 
Tone: informative yet accessible."
```

### Setup
   ```bash
# Clone the repository
git clone https://github.com/youssof20/promptly.git
   cd promptly

# Install dependencies
   npm install

# Start development servers
   npm run dev
   ```

### Local AI Models
- Ollama (any model)
- LM Studio (any model)
- Any OpenAI-compatible API

## 🔧 Configuration

### Local AI Setup

**Ollama**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# Start Ollama (runs on http://localhost:11434)
ollama serve
```

**LM Studio**
1. Download from [lmstudio.ai](https://lmstudio.ai)
2. Install and start the server
3. Load any model
4. Server runs on `http://localhost:1234`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=youssof20/promptly&type=Date)](https://star-history.com/#youssof20/promptly&Date)
