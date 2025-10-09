# Promptly - AI Prompt Optimization Platform

> **Transform your simple prompts into powerful, detailed instructions that get you better results from AI.**

Promptly is a browser extension and web platform that automatically optimizes your prompts before sending them to ChatGPT, Claude, Bard, and other AI systems. Get better results without learning prompt engineering.

## 🚀 Features

### Core Functionality
- **Automatic Prompt Optimization**: Transform simple prompts into detailed, effective instructions
- **Multi-Platform Support**: Works on ChatGPT, Claude, Bard, and 20+ other AI platforms
- **Browser Extension**: Seamless integration with your existing workflow
- **Smart Detection**: Automatically detects when you're typing prompts
- **Privacy-First**: Minimal data storage, secure processing

### User Experience
- **Invisible Integration**: Works in the background without disrupting your flow
- **Contextual Hints**: Smart suggestions that appear when you need them
- **One-Click Optimization**: Click to optimize, see results instantly
- **Real-Time Feedback**: Visual confirmation of successful optimizations

### Plans & Pricing
- **Free Tier**: 50 optimizations/month, DeepSeek AI model
- **Pro Tier**: 1,000 optimizations/month, GPT-4o-mini model, advanced features
- **Transparent Pricing**: $8/month for Pro, no hidden fees
- **30-Day Money-Back Guarantee**: Try risk-free

## 🏗️ Architecture

### Frontend (Web App)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js with OAuth providers
- **Deployment**: Vercel

### Browser Extension
- **Platform**: Chrome/Edge MV3 extension
- **Content Scripts**: AI platform detection and UI injection
- **Background Scripts**: Lifecycle management and communication
- **Popup Interface**: Quota tracking and settings

### Backend
- **API**: Next.js API routes (serverless)
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **AI Integration**: OpenAI (GPT-4o-mini) and DeepSeek
- **Caching**: In-memory caching for performance
- **Authentication**: Secure token-based system

### Design System
- **Theme**: Dark-first with electric blue/vibrant purple gradients
- **Typography**: Helvetica Bold for headings, system fonts for body
- **Colors**: Rich black, charcoal gray, electric blue, vibrant purple
- **Components**: Consistent, accessible UI components

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Supabase recommended)
- OpenAI API key
- DeepSeek API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/promptly.git
   cd promptly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   SUPABASE_URL="https://..."
   SUPABASE_ANON_KEY="..."
   SUPABASE_SERVICE_ROLE_KEY="..."
   
   # AI APIs
   OPENAI_API_KEY="sk-..."
   DEEPSEEK_API_KEY="sk-..."
   
   # Authentication
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   
   # Stripe
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_PUBLISHABLE_KEY="pk_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Load the extension** (for development)
   - Open Chrome/Edge
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select `apps/extension`

## 📁 Project Structure

```
promptly/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Utilities and services
│   │   │   └── styles/      # Global styles
│   │   └── public/          # Static assets
│   └── extension/           # Browser extension
│       ├── src/
│       │   ├── background/  # Background scripts
│       │   ├── content/     # Content scripts
│       │   ├── popup/       # Extension popup
│       │   └── injected/    # Page context scripts
│       └── public/          # Extension assets
├── packages/
│   └── database/            # Shared database package
├── docs/                    # Documentation
└── scripts/                 # Build and deployment scripts
```

## 🔧 API Endpoints

### Web App APIs
- `POST /api/optimize` - Optimize prompt (authenticated)
- `GET /api/user/stats` - Get user statistics
- `GET /api/quota` - Get quota information
- `POST /api/subscription/create-checkout` - Create Stripe checkout
- `POST /api/subscription/billing-portal` - Open billing portal

### Extension APIs
- `POST /api/auth/extension` - Get extension auth token
- `GET /api/auth/extension` - Validate extension token
- `POST /api/optimize/extension` - Optimize prompt (extension)

## 🎨 Design System

### Colors
- **Primary**: Electric Blue (`#00D4FF`)
- **Secondary**: Vibrant Purple (`#8B5CF6`)
- **Accent**: Cyan Teal (`#14B8A6`)
- **Success**: Lime Green (`#84CC16`)
- **Error**: Crimson (`#DC2626`)
- **Background**: Rich Black (`#0D0D0D`)
- **Surface**: Charcoal Gray (`#1F1F1F`)

### Typography
- **Headings**: Helvetica Bold
- **Body**: System font stack
- **Code**: JetBrains Mono

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glassmorphism with backdrop blur
- **Forms**: Clean inputs with focus states
- **Navigation**: Minimal, accessible design

## 🚀 Deployment

### Web App (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Extension (Chrome Web Store)
1. Build the extension: `npm run build:extension`
2. Create a developer account on Chrome Web Store
3. Upload the built extension package
4. Submit for review

### Database (Supabase)
1. Create a new Supabase project
2. Run migrations: `npx prisma db push`
3. Set up Row Level Security policies
4. Configure API keys

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Coverage
- Unit tests for core functionality
- Integration tests for API endpoints
- E2E tests for user workflows
- Extension functionality tests

## 📊 Performance

### Optimizations
- **Caching**: In-memory cache for prompt optimizations
- **CDN**: Static assets served from Vercel CDN
- **Database**: Optimized queries with Prisma
- **Bundle**: Code splitting and tree shaking
- **Images**: Optimized with Next.js Image component

### Metrics
- **Page Load**: < 2 seconds
- **Optimization**: < 3 seconds average
- **Extension**: < 100ms response time
- **Uptime**: 99.9% target

## 🔒 Security

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure OAuth flows
- **Authorization**: Role-based access control
- **Privacy**: Minimal data collection and storage

### API Security
- **Rate Limiting**: Prevent abuse and overuse
- **Input Validation**: Sanitize all user inputs
- **CORS**: Proper cross-origin resource sharing
- **Headers**: Security headers on all responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.promptly.ai](https://docs.promptly.ai)
- **Issues**: [GitHub Issues](https://github.com/your-username/promptly/issues)
- **Discord**: [Join our community](https://discord.gg/promptly)
- **Email**: support@promptly.ai

## 🙏 Acknowledgments

- OpenAI for GPT models
- DeepSeek for cost-effective AI
- Supabase for database infrastructure
- Vercel for hosting and deployment
- The open-source community for inspiration

---

**Made with ❤️ by the Promptly team**