# Promptly - AI Prompt Optimizer

Promptly is an always-on AI prompt optimizer delivered via a browser extension companion. It automatically improves user-written prompts before they are sent to AI systems like ChatGPT, Claude, and other LLM chats, ensuring clearer, more structured, and more effective inputs.

## 🚀 Features

- **Automatic Optimization**: Seamless, background assistance across all AI platforms
- **Fast & Cost-Efficient**: Low-latency, controlled AI API usage with smart caching
- **Clear & Emotional**: Confidence-boosting improvements that feel good
- **Private**: PII redaction, minimal storage, optional local-only mode
- **Scalable**: Supports millions of users without runaway costs
- **Differentiated**: Lightweight, inline-first, market-ready

## 🏗️ Architecture

### Frontend
- **Next.js 14** + TypeScript, deployed on Vercel
- Server components for performance
- Dark-first design with electric blue/purple gradient theme

### Browser Extension
- **Chrome/Edge MV3** extension (TypeScript + Vite)
- Lightweight injected UI to avoid latency/memory issues
- Content script injection for seamless integration

### Backend
- **Next.js API routes** (serverless, Node.js)
- Pay-per-use scaling → no idle costs

### Database
- **PostgreSQL** (Supabase) + Prisma ORM
- Fits relational models (users, prompts, quotas)

### Caching & Cost Control
- **Upstash Redis** → deduplicate prompts, reduce redundant API calls
- Quota enforcement prevents free-tier overuse

### Models & APIs
- **Free**: DeepSeek (cost-effective)
- **Pro**: GPT-4 mini (stronger but still cost-efficient)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Chrome/Edge browser for extension testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   ```bash
   cd packages/database
   npm run db:generate
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Next.js app
   cd apps/web
   npm run dev

   # Terminal 2: Browser extension
   cd apps/extension
   npm run dev
   ```

### Browser Extension Setup

1. Build the extension:
   ```bash
   cd apps/extension
   npm run build
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `apps/extension/dist` folder

## 📁 Project Structure

```
promptly/
├── apps/
│   ├── web/                 # Next.js application
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   └── components/  # React components
│   │   └── package.json
│   └── extension/           # Browser extension
│       ├── src/
│       │   ├── content/     # Content scripts
│       │   ├── background/  # Background scripts
│       │   └── popup/       # Extension popup
│       └── manifest.json
├── packages/
│   └── database/            # Prisma schema and client
│       ├── schema.prisma
│       └── src/
└── turbo.json              # Turborepo configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#3B82F6) + Vibrant Purple (#8B5CF6)
- **Background**: Rich Black (#0D0D0D) + Charcoal Gray (#1F1F1F)
- **Text**: White (#FFFFFF) + Light Gray (#D1D5DB)
- **Accents**: Cyan/Teal (#06B6D4), Lime Green (#22C55E)

### Typography
- **Primary**: System UI fonts
- **Monospace**: Fira Code, JetBrains Mono

## 🔧 API Endpoints

### POST /api/optimize
Optimize a prompt using AI.

**Request:**
```json
{
  "prompt": "help me write a blog post about ai",
  "tier": "free"
}
```

**Response:**
```json
{
  "optimizedPrompt": "Write a comprehensive 1,500-word blog post...",
  "tokensUsed": 150,
  "model": "deepseek-chat",
  "tier": "free"
}
```

## 📊 Data Models

### User
- `id`: Unique identifier
- `email`: User email
- `subscriptionTier`: FREE/PRO/ENTERPRISE
- `stripeCustomerId`: Stripe customer ID

### Prompt
- `id`: Unique identifier
- `userId`: User reference
- `originalPrompt`: User's input
- `optimizedPrompt`: AI-optimized output
- `tokensIn/Out`: Token usage tracking
- `modelUsed`: AI model used

### QuotaLog
- `userId`: User reference
- `date`: Daily quota tracking
- `promptsUsed`: Number of prompts used

## 🚀 Deployment

### Web App (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Browser Extension
1. Build the extension: `npm run build`
2. Create a ZIP file of the `dist` folder
3. Submit to Chrome Web Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.promptly.app](https://docs.promptly.app)
- **Issues**: [GitHub Issues](https://github.com/promptly/issues)
- **Email**: support@promptly.app

---

**Promptly** - Making AI prompts better, one optimization at a time. ✨
