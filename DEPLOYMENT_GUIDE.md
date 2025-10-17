# Promptly Deployment Guide

This guide will walk you through setting up all the necessary services and deploying Promptly to production.

## 🚀 Quick Start Checklist

- [ ] Set up Supabase database
- [ ] Configure Stripe billing
- [ ] Set up OpenAI & DeepSeek API keys
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test all functionality
- [ ] Build and test browser extension

## 📋 Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Stripe account
- OpenAI account
- DeepSeek account

---

## 1. 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `promptly-production`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait for setup to complete (2-3 minutes)

### Step 2: Connect Supabase to Vercel
1. In your Vercel project dashboard
2. Go to **Settings** → **Integrations**
3. Find **Supabase** and click **Add Integration**
4. Select your Supabase project
5. Vercel will automatically add all environment variables

### Step 3: Run Database Migrations
```bash
# Install dependencies
npm install

# Set up your local .env.local file with the DATABASE_URL from Vercel
# Copy the POSTGRES_PRISMA_URL from Vercel and add it to .env.local as DATABASE_URL
echo 'DATABASE_URL="your-postgres-prisma-url-from-vercel"' > apps/web/.env.local

# Generate Prisma client
cd packages/database
npx prisma generate

# Run migrations
npx prisma db push

# Verify tables were created
npx prisma studio
```

---

## 2. 💳 Stripe Setup

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete business verification
4. Switch to **Test mode** for development

### Step 2: Get API Keys
1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Create Products and Prices
1. Go to **Products** → **Add product**
2. Create **Pro Plan**:
   - **Name**: `Promptly Pro`
   - **Description**: `1,000 prompts per month with advanced features`
   - **Pricing**: `$8.00` recurring monthly
   - **Copy the Price ID** (starts with `price_`)

### Step 4: Set Up Webhooks
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

---

## 3. 🤖 AI API Setup

### OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API keys**
4. Click **Create new secret key**
5. Name it `Promptly Production`
6. Copy the key (starts with `sk-`)

### DeepSeek Setup
1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up for an account
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `sk-`)

---

## 4. 🚀 Vercel Deployment

### Step 1: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **New Project**
4. Import your `promptly` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd apps/web && npm run build`
   - **Output Directory**: `.next`

### Step 2: Configure Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

**✅ Already Added by Supabase Integration:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` 
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `POSTGRES_URL_NON_POOLING`
- `SUPABASE_JWT_SECRET`
- `POSTGRES_USER`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_HOST`
- `SUPABASE_ANON_KEY`

**➕ Add These Remaining Variables:**

```bash
# Database (use the Prisma URL from Supabase integration)
DATABASE_URL=your-postgres-prisma-url-from-supabase

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRODUCT_ID=prod_...
STRIPE_PRO_PRICE_ID=price_...

# Public Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

# AI APIs
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

### Step 3: Deploy
1. Click **Deploy**
2. Wait for deployment to complete
3. Note your domain: `https://your-project.vercel.app`

---

## 5. 🔐 OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure consent screen first if prompted
6. Application type: **Web application**
7. **Authorized redirect URIs**:
   - `https://your-domain.vercel.app/api/auth/callback/google`
8. Copy **Client ID** and **Client Secret**

### GitHub OAuth Setup
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Promptly`
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. Click **Register application**
5. Copy **Client ID** and **Client Secret**

---

## 6. 🔄 Update Stripe Webhook URL

1. Go back to Stripe dashboard
2. **Developers** → **Webhooks**
3. Edit your webhook endpoint
4. Update **Endpoint URL** to: `https://your-domain.vercel.app/api/webhooks/stripe`
5. Save changes

---

## 7. 🌐 Browser Extension Setup

### Step 1: Build Extension
```bash
# Build for all browsers
npm run build:all

# Or build individually
npm run build:chrome
npm run build:firefox
npm run build:edge
```

### Step 2: Test Extension Locally
1. Open Chrome → Extensions → Developer mode
2. Click "Load unpacked" → Select `apps/extension/dist`
3. Test on ChatGPT, Claude, Gemini, etc.

### Step 3: Prepare for Store Submission
1. **Chrome Web Store**:
   - Create developer account ($5 one-time fee)
   - Prepare store listing with screenshots
   - Upload extension package

2. **Firefox Add-ons**:
   - Create developer account (free)
   - Upload extension package
   - Complete store listing

3. **Edge Add-ons**:
   - Create developer account (free)
   - Upload extension package
   - Complete store listing

---

## 8. 🧪 Testing Your Deployment

### Test Web Application
1. Visit `https://your-domain.vercel.app`
2. Click **Get Started**
3. Try signing up with Google/GitHub
4. Verify you can access the dashboard
5. Test optimization API

### Test Browser Extension
1. Install extension from store or load unpacked
2. Visit ChatGPT, Claude, or Gemini
3. Write a prompt and click the optimization hint
4. Verify prompt gets optimized
5. Test authentication flow

### Test Billing (Test Mode)
1. Go to `/pricing`
2. Try upgrading to Pro plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify subscription updates in dashboard

### Test Database
1. Check Supabase dashboard
2. Verify users are being created
3. Check quota logs are being recorded
4. Verify optimization history is stored

---

## 9. 🎯 Production Checklist

### Security
- [ ] All environment variables are set
- [ ] Database is properly secured
- [ ] API keys are production keys (not test)
- [ ] Webhook secrets are configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured

### Functionality
- [ ] Authentication works (Google, GitHub)
- [ ] AI optimization works (OpenAI, DeepSeek)
- [ ] Quota tracking works (monthly reset)
- [ ] Billing system works (Stripe)
- [ ] Dashboard displays correctly
- [ ] Extension loads without errors
- [ ] Extension works on all supported platforms

### Performance
- [ ] Database queries are optimized
- [ ] Images are optimized
- [ ] Caching is configured
- [ ] CDN is enabled
- [ ] Extension bundle size < 500KB

### Monitoring
- [ ] Health check endpoint working
- [ ] Error tracking configured (Sentry)
- [ ] Analytics tracking enabled
- [ ] Rate limiting working
- [ ] Database monitoring active

---

## 10. 🔧 Troubleshooting

### Common Issues

**Extension Won't Load**
- Check manifest.json paths match Vite output
- Verify all required files are in dist/
- Check browser console for errors
- Ensure extension has proper permissions

**Database Connection Failed**
- Check DATABASE_URL format
- Verify Supabase project is active
- Check firewall settings
- Run `npx prisma db push` to sync schema

**Authentication Not Working**
- Verify OAuth redirect URLs
- Check NEXTAUTH_SECRET is set
- Ensure OAuth apps are configured correctly
- Check JWT token generation

**Stripe Webhooks Failing**
- Check webhook URL is correct
- Verify webhook secret matches
- Check Stripe dashboard for error logs
- Ensure webhook events are properly configured

**AI API Errors**
- Verify API keys are correct
- Check API quotas and limits
- Ensure models are available
- Check rate limiting isn't blocking requests

### Debug Mode
Add to your environment variables for debugging:
```bash
DEBUG=true
NODE_ENV=development
```

---

## 11. 📊 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and monitoring
- **Stripe Dashboard**: Payment and subscription analytics
- **Supabase Dashboard**: Database performance and logs

### Key Metrics to Monitor
- User signups and retention
- API usage and costs
- Payment success rates
- Database performance
- Error rates and response times
- Extension installation and usage

---

## 🎉 You're Live!

Your Promptly application should now be fully deployed and functional. Users can:

1. ✅ Sign up with Google/GitHub
2. ✅ Optimize prompts with real AI models
3. ✅ Track their usage and quotas
4. ✅ Upgrade to paid plans
5. ✅ Manage their billing
6. ✅ Install browser extension
7. ✅ Use extension on all major AI platforms

### Next Steps
1. Set up monitoring and alerts
2. Create user documentation
3. Plan marketing and user acquisition
4. Monitor performance and costs
5. Iterate based on user feedback
6. Submit extension to app stores

---

## 📞 Support

If you encounter any issues during deployment:

1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check Supabase logs
4. Verify all environment variables are set correctly
5. Test each component individually
6. Check browser extension console for errors

Good luck with your deployment! 🚀
