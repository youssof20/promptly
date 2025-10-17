# 🚀 Promptly Complete User Flow

**Current Status:** Ready for Testing & Store Submission  
**Last Updated:** January 4, 2025  
**Vision:** "Write once. Think better." - The Perfect Promptly Experience

## 🧭 Dream User Flow: The Perfect Promptly Experience

### **Phase 0: Discovery — The Spark**
- User sees a quick video demo — one tap, a messy prompt turns into gold
- Tagline hits instantly: **"Write once. Think better."**
- User clicks **"Install Free Extension"**
- 10 seconds later, it's live in their browser — no setup, no friction

### **Phase 1: Activation — The First Wow**
- User opens ChatGPT, starts typing: *"write me something about startups"*
- A subtle glow appears under the text box: **⚡ Promptly: See how we'd improve this.**
- User clicks → instantly, the text morphs into: *"Write a 200-word essay explaining why most startups fail, focusing on team dynamics and product-market fit."*
- A friendly note fades in: **✅ "Clearer, more specific. You'll get a sharper response."**
- The user sends the prompt. The AI gives a noticeably better answer.
- **They smile — hooked.**

### **Phase 2: Habit Formation — Everyday Magic**
- Promptly is now always on
- Works seamlessly across: ChatGPT, Claude, Bard, Perplexity, Notion, Google Docs, even emails
- No popups, no clutter — just quiet power
- Prompts are optimized in real time, with subtle hints:
  - "Add detail?"
  - "Specify tone?"
  - "Boost clarity?"
- User can accept with a tap, or ignore completely
- **It never feels intrusive — only helpful**

### **Phase 3: Deep Value — Professional Use Cases**
- **Marketer** → adds brand tone
- **Developer** → optimizes for technical clarity
- **Researcher** → structures prompts for depth
- User starts trusting Promptly as their thinking companion — not just a tool

### **Phase 4: Monetization — Effortless Upgrade**
- After 30 days, Promptly gently prompts: *"You've optimized 47 prompts this month — ready for unlimited power?"*
- Pro plan offer appears inline — no hard sell, just obvious value
- Pro tier unlocks:
  - Smarter model (GPT-4o-mini / Claude Sonnet / Mistral Large)
  - Instant mode (no delay)
  - Upgrade in one click. Stripe checkout. Done.
- A **"Pro Boost"** badge appears in their extension — subtle pride moment

### **Phase 5: Mastery — The Invisible Standard**
- Promptly becomes infrastructure — integrated into every tool
- APIs for Notion, Slack, VS Code, Chrome, Safari, mobile keyboards
- Teams use it collectively — shared prompt libraries, consistency analytics
- Users start to trust their own clarity — Promptly becomes synonymous with good AI communication
- **Tagline evolves: "Promptly: Because how you ask matters."**

### **Phase 6: The Vision — Promptly Everywhere**
- You open any text box on the internet
- You start typing a thought
- Promptly gently shapes it — making your ideas land sharper, clearer, smarter
- **It's no longer an extension. It's part of how people think.**

---

## 📋 Current Implementation Flow

### **Phase 1: Discovery & Landing**

#### **1.1 User Visits Website**
- **URL:** `https://promptly-two-ashy.vercel.app` (or custom domain)
- **Landing Page:** Modern SaaS homepage with:
  - **Hero Section:** "AI Prompt Optimization Made Simple"
  - **Value Proposition:** "Automatically improve your prompts before sending to ChatGPT, Claude, and other AI systems"
  - **CTA Buttons:** 
    - "Install Extension" (primary)
    - "View Pricing" (secondary)
  - **Social Proof:** "Trusted by professionals at OpenAI, Anthropic, Google, Microsoft, Meta, Stripe, Vercel"
  - **Feature Cards:** Automatic, Fast, Clear, Private, Scalable, Differentiated

#### **1.2 User Clicks "Install Extension"**
- **Action:** Redirects to Chrome Web Store or Edge Add-ons
- **Status:** ⚠️ **NOT YET LIVE** - Extension needs to be submitted to stores

#### **1.3 User Clicks "View Pricing"**
- **Action:** Navigates to `/pricing` page
- **Content:** 
  - **Free Plan:** $0/month, 50 prompts, Basic optimization, DeepSeek AI
  - **Pro Plan:** $8/month, 1,000 prompts, Advanced optimization, GPT-4o-mini, Priority support
  - **30-day money-back guarantee** badge

---

### **Phase 2: Account Creation & Authentication**

#### **2.1 User Clicks "Get Started" or "Upgrade to Pro"**
- **Action:** Redirects to `/auth/signin` page
- **Options:**
  - **Google OAuth:** "Continue with Google"
  - **GitHub OAuth:** "Continue with GitHub"

#### **2.2 OAuth Authentication Flow**
- **Google Flow:**
  1. User clicks "Continue with Google"
  2. Redirects to Google OAuth consent screen
  3. User grants permissions
  4. Redirects back to `/dashboard?upgraded=true` (if from pricing)
  5. User account created in Supabase database

- **GitHub Flow:**
  1. User clicks "Continue with GitHub"
  2. Redirects to GitHub OAuth consent screen
  3. User grants permissions
  4. Redirects back to `/dashboard?upgraded=true` (if from pricing)
  5. User account created in Supabase database

#### **2.3 Account Creation in Database**
- **Supabase:** User record created with:
  - `id`: Unique identifier
  - `email`: From OAuth provider
  - `name`: From OAuth provider
  - `image`: Profile picture URL
  - `emailVerified`: OAuth timestamp
  - `subscriptionTier`: Defaults to 'FREE'
  - `stripeCustomerId`: NULL (created on first payment)

---

### **Phase 3: Dashboard & Onboarding**

#### **3.1 User Lands on Dashboard**
- **URL:** `/dashboard`
- **Header:** Consistent navigation with logo, Home, Pricing, Dashboard links
- **User Menu:** Avatar with dropdown (Dashboard, Sign Out)
- **Content:**
  - **Welcome:** "Welcome back! Here's your prompt optimization overview"
  - **Stats Card:** "Prompts Optimized" with count
  - **Plan Status Card:** Shows current plan with upgrade button if Free

#### **3.2 Free User Experience**
- **Quota Display:** "0 / 50 prompts used this month"
- **Upgrade Button:** "Upgrade to Pro" → Stripe checkout
- **Features:** Basic optimization with DeepSeek AI model

#### **3.3 Pro User Experience**
- **Quota Display:** "0 / 1,000 prompts used this month"
- **Features:** Advanced optimization with GPT-4o-mini model
- **Access:** Priority support, usage analytics, API access

---

### **Phase 4: Extension Installation**

#### **4.1 User Installs Extension**
- **Chrome Web Store:**
  1. User clicks "Install Extension" from website
  2. Redirects to Chrome Web Store listing
  3. User clicks "Add to Chrome"
  4. Extension installs with permissions:
     - `activeTab`: Access current tab
     - `storage`: Store user preferences
     - `scripting`: Inject content scripts
  5. Welcome notification appears: "Welcome to Promptly! Your AI prompt optimizer is now active."

- **Edge Add-ons:**
  1. Similar flow for Microsoft Edge
  2. Extension installs with same permissions
  3. Welcome notification appears

#### **4.2 Extension Permissions**
- **Host Permissions:** Access to AI platforms:
  - `https://chat.openai.com/*`
  - `https://chatgpt.com/*`
  - `https://claude.ai/*`
  - `https://poe.com/*`
  - `https://bard.google.com/*`
  - `https://deepseek.com/*`

---

### **Phase 5: Extension Usage**

#### **5.1 User Visits AI Platform**
- **Supported Platforms:**
  - ChatGPT (chat.openai.com, chatgpt.com)
  - Claude (claude.ai)
  - Poe (poe.com)
  - Bard (bard.google.com)
  - DeepSeek (deepseek.com)

#### **5.2 Automatic Detection**
- **Content Script:** Automatically loads on supported pages
- **Platform Detection:** Identifies which AI platform user is on
- **Chatbox Detection:** Finds text input areas using platform-specific selectors

#### **5.3 User Types Prompt**
- **Trigger:** User types 10+ characters in chatbox
- **Hint Appears:** Clean, minimal optimization hint:
  ```
  ⚡ Optimize with Promptly
     Click to improve your prompt
  ```
- **Positioning:** Appears below chatbox
- **Auto-hide:** Disappears after 5 seconds if not clicked

#### **5.4 User Clicks Optimization Hint**
- **Action:** Sends prompt to background script
- **Background Script:** 
  1. Checks user quota
  2. Calls optimization API
  3. Returns optimized prompt
- **Content Script:** Replaces original text with optimized version
- **Feedback:** Success toast appears: "✓ Prompt optimized!"

#### **5.5 Optimization Process**
- **Free Users:**
  - **Model:** DeepSeek AI
  - **Quota:** 50 prompts/month
  - **Features:** Basic optimization

- **Pro Users:**
  - **Model:** GPT-4o-mini
  - **Quota:** 1,000 prompts/month
  - **Features:** Advanced optimization, priority support

---

### **Phase 6: Payment & Subscription**

#### **6.1 User Clicks "Upgrade to Pro"**
- **From Dashboard:** Plan status card
- **From Pricing Page:** Pro plan card
- **Action:** Creates Stripe checkout session

#### **6.2 Stripe Checkout Flow**
- **API Call:** `POST /api/subscription/create-checkout`
- **Stripe Session:** Creates subscription checkout
- **Payment:** User completes payment
- **Webhook:** Stripe sends success event
- **Database Update:** User subscription tier → 'PRO'

#### **6.3 Post-Payment**
- **Redirect:** Back to `/dashboard?upgraded=true`
- **Success Message:** "Welcome to Pro! You now have 1,000 prompts per month."
- **Quota Reset:** Monthly quota refreshed
- **Features Unlocked:** Advanced optimization, priority support

---

### **Phase 7: Extension Management**

#### **7.1 Extension Popup**
- **Access:** Click extension icon in browser toolbar
- **Content:**
  - **Status:** Free/Pro badge
  - **Quota:** Progress bar showing usage
  - **Actions:** Optimize Current Prompt, Settings, View History
  - **Upgrade Banner:** Shows if Free user approaching quota limit

#### **7.2 Settings & Preferences**
- **Access:** Extension popup → Settings
- **Options:**
  - Enable/disable extension
  - Change optimization model
  - View usage statistics
  - Manage account

#### **7.3 History & Analytics**
- **Access:** Extension popup → View History
- **Content:**
  - Recent optimizations
  - Usage statistics
  - Performance metrics

---

### **Phase 8: Ongoing Usage**

#### **8.1 Daily Usage Pattern**
1. **User opens AI platform** (ChatGPT, Claude, etc.)
2. **Extension automatically detects** platform and chatbox
3. **User types prompt** → hint appears
4. **User clicks hint** → prompt optimized
5. **User sends optimized prompt** to AI
6. **Quota decremented** in database

#### **8.2 Quota Management**
- **Free Users:** 50 prompts/month
- **Pro Users:** 1,000 prompts/month
- **Reset:** Monthly on subscription date
- **Tracking:** Real-time in database
- **Notifications:** Upgrade prompts when approaching limit

#### **8.3 Error Handling**
- **Quota Exceeded:** "Quota exceeded. Please upgrade to Pro."
- **API Errors:** "Optimization failed. Please try again."
- **Network Issues:** Graceful fallback with error message

---

## 🧩 Emotional UX Principles

### **Invisible Power**
- Promptly feels like intuition — not automation
- Users think "I'm getting better at this" not "The tool is doing it for me"

### **Trust by Design**
- Private, local, transparent
- No raw prompt logging
- Clear privacy controls

### **Instant Gratification**
- Every action gives visible improvement
- Immediate feedback on optimization quality
- "Aha!" moments happen within seconds

### **Growth Loop**
- Users feel themselves getting better at prompting
- Each use builds confidence
- Natural progression from basic to advanced usage

### **Pride of Use**
- The product becomes part of their professional identity
- "Pro Boost" badge creates subtle status
- Users recommend it because it makes them look smart

---

## 🏁 Ultimate Success Criteria

| Category | Definition of "We Win" |
|----------|------------------------|
| **Adoption** | Installed by 1M+ users, active on 100k+ devices monthly |
| **Delight** | 90% of users say "It makes me better at using AI" |
| **Retention** | >40% month-3 retention, 15% conversion to Pro |
| **Brand Trust** | Known as the default prompt layer — safe, smart, essential |
| **Cultural Impact** | "Prompting" becomes synonymous with "Promptly-ing" |

---

## 💰 Future Monetization Vision

### **Pro Plan** → $8/month individual, scalable to millions
- Unlimited optimizations
- Advanced models (GPT-4o-mini, Claude Sonnet)
- Priority support
- Usage analytics

### **Pro + Plan** → $15/month
- Everything in Pro
- Team collaboration features
- Custom prompt templates
- API access

### **Token Overages & API Access** → metered usage for power users
- Pay-per-use for heavy API consumers
- Enterprise pricing for large teams
- White-label solutions

---

## 🔄 Current Status & Next Steps

### **✅ Completed Components**
- **Website:** Modern SaaS UI, Stripe integration, authentication
- **Database:** Supabase connected, user management, quota tracking
- **Extension:** Code complete, comprehensive platform support, minimal UI
- **Payment:** Stripe checkout working, webhook handling
- **Authentication:** Google & GitHub OAuth working

### **🔄 In Progress**
- **Extension Testing:** Ready for testing on real AI platforms
- **Store Submission:** Chrome Web Store and Edge Add-ons assets needed

### **❌ Missing Components**
- **Extension Store Listings:** Screenshots, descriptions, metadata
- **Custom Domain:** Still using Vercel subdomain
- **Production API:** Currently using placeholder optimization
- **Error Monitoring:** No Sentry or error tracking
- **Analytics:** No user behavior tracking

---

## 🎯 Success Metrics

### **Week 1 Goals**
- [ ] Extension live on Chrome Web Store
- [ ] Extension live on Edge Add-ons
- [ ] Custom domain live
- [ ] 10+ downloads

### **Month 1 Goals**
- [ ] 100+ downloads
- [ ] 4+ star rating
- [ ] 10+ active users
- [ ] First paying customers

### **Month 3 Goals**
- [ ] 1,000+ downloads
- [ ] 4.5+ star rating
- [ ] 100+ active users
- [ ] 10+ paying customers
- [ ] $100+ MRR

---

## 🚨 Critical Path Items

### **Immediate (This Week)**
1. **Test Extension** on ChatGPT, Claude, DeepSeek
2. **Create Store Assets** (screenshots, descriptions)
3. **Submit to Stores** (Chrome Web Store, Edge Add-ons)
4. **Purchase Domain** (promptly.ai or similar)

### **Short Term (Next 2 Weeks)**
1. **Domain Setup** with Vercel
2. **Production API** integration
3. **Error Monitoring** setup
4. **User Analytics** implementation

### **Medium Term (Next Month)**
1. **Marketing Campaign** launch
2. **User Feedback** collection
3. **Feature Iterations** based on usage
4. **Performance Optimization**

---

**Next Action:** Start Phase 5 - Extension Testing  
**Timeline:** 14 days to full launch  
**Status:** Ready for testing! 🚀
