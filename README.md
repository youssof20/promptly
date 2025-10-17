# Promptly - Open Source AI Prompt Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/your-username/promptly)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Transform your simple prompts into powerful, detailed instructions that get you better results from AI systems.**

Promptly is a completely free, open-source browser extension that automatically optimizes your prompts before sending them to ChatGPT, Claude, Gemini, and other AI platforms. No account required, no data collection, works with your own API keys.

## ✨ Features

### 🚀 **Completely Free & Open Source**
- No hidden costs, no subscriptions, no vendor lock-in
- Full source code available on GitHub
- MIT licensed - use, modify, distribute freely

### 🔒 **Privacy-First Design**
- Uses your own API keys - we never see your data
- Supports local AI models (Ollama, LM Studio)
- No data collection or tracking
- All processing happens on your device

### 🤖 **Multi-Provider Support**
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 Haiku, Sonnet, Opus
- **Google**: Gemini Pro, Flash
- **DeepSeek**: Cost-effective alternative
- **Local AI**: Ollama, LM Studio (completely private)

### 🌐 **Works Everywhere**
- ChatGPT, Claude, Gemini, DeepSeek
- Poe, Perplexity, You.com
- Cursor, GitHub Copilot, and more
- 20+ AI platforms supported

### ⚡ **Automatic & Seamless**
- Detects when you're typing prompts
- One-click optimization
- Works in the background
- No disruption to your workflow

## 🚀 Quick Start

### 1. Install the Extension

**Chrome Web Store** (Coming Soon)
- [Install for Chrome](https://chrome.google.com/webstore/detail/promptly/your-extension-id)

**Edge Add-ons** (Coming Soon)
- [Install for Edge](https://microsoftedge.microsoft.com/addons/detail/promptly/your-extension-id)

**Manual Installation** (Development)
```bash
git clone https://github.com/your-username/promptly.git
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

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/promptly.git
cd promptly

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Project Structure
```
promptly/
├── apps/
│   ├── web/                 # Next.js website (static)
│   │   ├── src/app/         # Pages and components
│   │   └── public/          # Static assets
│   └── extension/           # Browser extension
│       ├── src/
│       │   ├── popup/       # Extension popup UI
│       │   ├── background/  # Background script
│       │   ├── content/     # Content script
│       │   └── lib/         # AI providers
│       └── dist/            # Built extension
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

### Building
```bash
# Build everything
npm run build

# Build website only
cd apps/web && npm run build

# Build extension only
cd apps/extension && npm run build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute
- 🐛 **Bug fixes**: Fix issues in the codebase
- ✨ **New features**: Add new functionality
- 📚 **Documentation**: Improve docs and guides
- 🎨 **UI/UX**: Enhance the user interface
- 🧪 **Testing**: Add or improve tests
- 🌐 **Platforms**: Add support for new AI platforms

### Quick Contribution
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Supported Platforms

### AI Chat Platforms
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Gemini (Google)
- DeepSeek
- Poe
- Perplexity
- You.com
- And many more...

### Local AI Models
- Ollama (any model)
- LM Studio (any model)
- Any OpenAI-compatible API

## 🔧 Configuration

### API Keys
- **OpenAI**: Get from [platform.openai.com](https://platform.openai.com/api-keys)
- **Anthropic**: Get from [console.anthropic.com](https://console.anthropic.com/)
- **Google**: Get from [makersuite.google.com](https://makersuite.google.com/app/apikey)
- **DeepSeek**: Get from [platform.deepseek.com](https://platform.deepseek.com/api_keys)

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

## 🐛 Troubleshooting

### Common Issues

**Extension not working?**
- Check if you've configured an AI provider
- Verify your API key is correct
- Test the connection in settings

**Optimization not appearing?**
- Make sure you're on a supported platform
- Try refreshing the page
- Check browser console for errors

**API errors?**
- Verify your API key has sufficient credits
- Check if the API service is down
- Try switching to a different provider

### Getting Help
- 📖 Check the [documentation](https://github.com/your-username/promptly/wiki)
- 🐛 [Report bugs](https://github.com/your-username/promptly/issues)
- 💬 [Ask questions](https://github.com/your-username/promptly/discussions)
- 💡 [Request features](https://github.com/your-username/promptly/issues/new?template=feature_request.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **Anthropic** for Claude models
- **Google** for Gemini models
- **DeepSeek** for cost-effective AI
- **Ollama** for local AI capabilities
- **The open-source community** for inspiration and support

## 📊 Project Status

- ✅ **Extension**: Fully functional
- ✅ **Website**: Static site ready
- ✅ **AI Providers**: 6 providers supported
- ✅ **Platforms**: 20+ platforms supported
- 🔄 **Chrome Store**: Submission in progress
- 🔄 **Edge Add-ons**: Submission in progress

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/promptly&type=Date)](https://star-history.com/#your-username/promptly&Date)

---

**Made with ❤️ by the open-source community**

[⭐ Star this repo](https://github.com/your-username/promptly) | [🐛 Report a bug](https://github.com/your-username/promptly/issues) | [💡 Request a feature](https://github.com/your-username/promptly/issues/new?template=feature_request.md) | [📖 Read the docs](https://github.com/your-username/promptly/wiki)