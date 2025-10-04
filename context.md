context.md
Project Context: Promptly
1. Executive Summary

Project Name: Promptly

Core Concept:
Promptly is an always-on AI prompt optimizer delivered via a browser extension companion. It automatically improves user-written prompts before they are sent to an AI systems like ChatGPT,Claude, Deepseek and other llm chats, ensuring clearer, more structured, and more effective inputs. Promptly helps everyday AI users save time, get better results, and learn prompt engineering best practices without effort. Think “Grammarly for prompts”, but focused on AI input quality and embedded directly in the user’s workflow.

Key Principles:

Automatic — seamless, background assistance

Fast & Cost-Efficient — low-latency, controlled AI API usage

Clear & Emotional — confidence-boosting improvements that feel good

Private — PII redaction, minimal storage, optional local-only mode

Scalable — supports millions of users without runaway costs

Differentiated — lightweight, inline-first, market-ready

2. Problem Statement

Many AI users write vague or poorly structured prompts, wasting time and tokens.

Existing prompt tools are manual, clunky, or tied to single AI providers.

Free vs Pro models often fail to clearly demonstrate value, hurting conversions.

Users care about speed, privacy, and trust, not just better wording.

Promptly solves this by embedding optimization directly into writing, with clear Free vs Pro differentiation, performance-focused design, and privacy-first trust.

3. Target User Personas

Novice Nina (Everyday AI User): Wants better results without learning prompt engineering.
Marketer Max (Content Creator): Needs reliable, professional-quality outputs without trial and error.
Developer Dana (Power User): Needs efficient, low-latency prompts optimized for coding/research.

4. Core Features & User Flows

Feature 1: Inline Prompt Optimization

Detects text fields in AI apps, offers real-time optimized prompts.

Shows diffs + rationale to build trust.

One-click or hotkey replaces original text.

Emotional/Psycological Winning Design,UI,UX. Simple clear.

Feature 2: Free vs Pro Optimization (Cost-Controlled)

Free → lightweight, cheap model: fast, decent improvements.

Pro → more advanced but still cost-efficient model: deeper, higher-quality optimizations.

Side-by-side previews demonstrate Pro’s value, encouraging upgrades.

Feature 3: Quota Tracking & Upgrade Path

Free capped at ~50 prompts/month.

Pro unlocks ~1,000/month.

Transparent counters and banners guide upgrade flow.

Feature 4: History & Undo

Stores last 5 optimizations to restore/copy without re-calling APIs.

Reduces costs and boosts user confidence.

Psychological/UX Design:

Minimal clicks → instant gratification.

Highlighted improvements boost confidence.

Friendly tone makes optimization feel supportive, not judgmental.

5. Technical Architecture

Frontend:

Next.js 14 + TypeScript, deployed on Vercel.

Server components for performance.

Browser Extension:

MV3 Chrome/Edge extension (TypeScript + Vite).

Lightweight injected UI to avoid latency/memory issues.

Backend:

Next.js API routes (serverless, Node.js).

Pay-per-use scaling → no idle costs.

Database:

PostgreSQL (Supabase) + Prisma ORM.

Fits relational models (users, prompts, quotas).

Caching & Cost Control:

Database caching → deduplicate prompts, reduce redundant API calls.

Quota enforcement prevents free-tier overuse.

Models & APIs:

Free: cheaper LLM, not sure whats most cost-effective and cheap. Maybe deepseek?

Pro: stronger but cost-efficient model (e.g., GPT-4 mini or other still cheap but better).

Auth: NextAuth + Supabase

Billing: Stripe

Monitoring: Sentry

6. Data Models (Simplified)

User

id

email

stripe_customer_id

subscription_tier (free/pro/enterprise)

created_at

Prompt

id

user_id

original_prompt

optimized_prompt

tokens_in

tokens_out

model_used

created_at

QuotaLog

user_id

date

prompts_used

7. Design & UX Guidelines

Theme: Clean, modern, subtle gradients.

Principles: Inline-first, fast feedback, no cognitive overhead.

Emotional Design: Optimizations feel encouraging → user feels “smarter” and more in control.

🔹 Promptly Color Theme (Dark-First)
Primary Palette

Electric Blue (#3B82F6) → main CTA/action, highlights clarity & speed.

Vibrant Purple (#8B5CF6) → secondary accent, emphasizes intelligence/creativity.

Gradient Core → Blue → Purple diagonal gradient for buttons, icons, hero sections.

Background & Neutrals (Dark Mode First)

Rich Black (#0D0D0D) → primary background.

Charcoal Gray (#1F1F1F) → panels, extension UI cards.

Slate Gray (#374151) → secondary text/UI separators.

Cool Gray (#9CA3AF) → tertiary text, muted labels.

Support Colors

Cyan/Teal (#06B6D4) → spark/optimization indicators.

Lime Green (#22C55E) → success states.

Amber (#F59E0B) → warnings (quota nearing, risky prompt flag).

Crimson (#DC2626) → error states.

🔹 Usage Guidelines

Primary Buttons & CTAs (Optimize, Upgrade): Gradient (Blue → Purple) on Black.

Extension Panel: Black/Charcoal background with Blue highlights and Purple accents.

Diff Highlighting:

Added words → Blue underline/glow

Removed words → Purple strikethrough

Text:

Headings: White (#FFFFFF)

Body: Light Gray (#D1D5DB)

Secondary info: Cool Gray (#9CA3AF)

🔹 Brand Feel

Dark-first, neon-accented.

Feels high-tech, premium, professional, but not intimidating.

The Blue/Purple combo on Black gives that AI glow aesthetic without looking gimmicky.

Key Screens:

Extension panel (diffs, rationale, insert button)

History panel (last 5 prompts)

Upgrade flow (Free → Pro)

8. Project Phasing (Roadmap):

Make the extension the website the database the payment the log in system and stuff account plan full functionality whatever else, test, release

Goal: become the default prompt layer across all AI apps.