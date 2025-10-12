# Promptly - AI Prompt Optimizer

> **Grammarly for AI prompts** - Automatically improve your prompts before sending to ChatGPT, Claude, Gemini, and other AI systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)

## 🚀 Quick Start

### For Users
1. **Install Extension**: [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. **Sign Up**: Visit [promptly-two-ashy.vercel.app](https://promptly-two-ashy.vercel.app)
3. **Start Optimizing**: Write prompts on any AI platform and watch them improve automatically!

### For Developers
```bash
# Clone and install
git clone https://github.com/yourusername/promptly.git
cd promptly
npm install

# Start development
npm run dev

# Build extension
npm run build:all
```

## ✨ Features

### 🆓 Free Tier
- **50 prompts/month** - Perfect for casual users
- **Basic optimization** - Clearer, more specific prompts
- **5 prompt history** - See your recent optimizations
- **All major AI platforms** - Works on ChatGPT, Claude, Gemini, etc.

### ⚡ Pro Tier ($8/month)
- **1,000 prompts/month** - For power users
- **Priority speed** - Instant optimization (no delays)
- **Unlimited history** - Access all your past optimizations
- **Advanced analytics** - Track improvements and usage
- **Dark mode** - Premium UI experience
- **Custom templates** - Save and reuse prompt patterns
- **Keyboard shortcuts** - Optimize with hotkeys

## 🏗️ Architecture

```
promptly/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/app/        # App router pages & API routes
│   │   ├── src/components/ # React components
│   │   └── src/lib/        # Utilities & services
│   └── extension/          # Browser extension
│       ├── src/background/ # Service worker
│       ├── src/content/    # Content scripts
│       ├── src/popup/      # Extension popup
│       └── src/utils/      # Browser API wrapper
├── packages/
│   └── database/           # Prisma schema & migrations
└── docs/                  # Documentation
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js (Google, GitHub)
- **Payments**: Stripe
- **AI APIs**: OpenAI, DeepSeek
- **Extension**: Manifest V3, Vite, TypeScript

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm 10+
- PostgreSQL database (or Supabase account)

### Environment Variables
Create `.env.local` in `apps/web/`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/promptly"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI APIs
OPENAI_API_KEY="sk-..."
DEEPSEEK_API_KEY="sk-..."

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRODUCT_ID="prod_..."
STRIPE_PRO_PRICE_ID="price_..."

# Public Keys (for client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   cd packages/database
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build Extension** (for testing)
   ```bash
   cd apps/extension
   npm run build:chrome
   ```

5. **Load Extension in Browser**
   - Open Chrome → Extensions → Developer mode
   - Click "Load unpacked" → Select `apps/extension/dist`

## 📱 Extension Installation

### Local Development
1. Build the extension: `npm run build:chrome`
2. Open Chrome → Extensions → Developer mode
3. Click "Load unpacked" → Select `apps/extension/dist`

### Production (Coming Soon)
- **Chrome Web Store**: [Install Promptly](https://chrome.google.com/webstore)
- **Firefox Add-ons**: [Install Promptly](https://addons.mozilla.org)
- **Edge Add-ons**: [Install Promptly](https://microsoftedge.microsoft.com/addons)

## 🔧 API Reference

### Authentication
```typescript
POST /api/auth/extension
// Generate JWT token for extension authentication

GET /api/auth/extension
// Validate extension token
```

### Optimization
```typescript
POST /api/optimize/extension
{
  "prompt": "Write a story about a robot",
  "tier": "free" // or "pro"
}

Response:
{
  "success": true,
  "optimized": "Please write a creative short story about a robot...",
  "model": "deepseek-chat",
  "tokensUsed": 150,
  "quotaInfo": {
    "remaining": 49,
    "limit": 50,
    "tier": "free"
  }
}
```

### User Stats
```typescript
GET /api/user/stats
// Returns user statistics and optimization history
```

### Health Check
```typescript
GET /api/health
// System health and status
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#3B82F6) - Main CTAs
- **Secondary**: Vibrant Purple (#8B5CF6) - Accents
- **Background**: Rich Black (#0D0D0D) - Primary background
- **Surface**: Charcoal Gray (#1F1F1F) - Cards and panels
- **Success**: Lime Green (#22C55E) - Success states
- **Warning**: Amber (#F59E0B) - Warnings
- **Error**: Crimson (#DC2626) - Error states

### Typography
- **Headings**: White (#FFFFFF)
- **Body**: Light Gray (#D1D5DB)
- **Secondary**: Cool Gray (#9CA3AF)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment
```bash
# Build web app
cd apps/web
npm run build

# Build extension
cd ../extension
npm run build:all

# Deploy to your hosting platform
```

## 📊 Monitoring

### Health Checks
- **API Health**: `GET /api/health`
- **Database**: Connection status and response time
- **AI Providers**: Available models and status
- **Memory**: Usage and limits
- **Environment**: Required variables check

### Analytics
- User signups and retention
- Optimization requests (free vs pro)
- Popular AI platforms
- Error rates and performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/promptly/issues)
- **Email**: support@promptly.ai
- **Discord**: [Join our community](https://discord.gg/promptly)

## 🗺️ Roadmap

See [docs/FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md) for upcoming features and improvements.

### Current Status
- ✅ Core optimization engine
- ✅ Browser extension (Chrome, Firefox, Edge)
- ✅ Web dashboard
- ✅ User authentication
- ✅ Pro subscription system
- ✅ Multi-browser support
- 🔄 Store listings (in progress)
- 📋 Advanced analytics
- 📋 Team collaboration features
- 📋 API for third-party integrations

---

**Made with ❤️ by the Promptly team**