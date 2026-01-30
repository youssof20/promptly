# Promptly

Browser extension that rewrites your prompts to make them better before sending to ChatGPT/Claude/etc.

## What it does

You type a lazy prompt like "help me write a blog post about ai" and it expands it into something way more detailed and useful. Works on ChatGPT, Claude, Gemini, and any other AI chat interface.

## Setup

```bash
git clone https://github.com/youssof20/promptly.git
cd promptly
npm install
npm run build
```

Then load `apps/extension/dist` as an unpacked extension in Chrome.

## How to use

1. Click the extension icon and add your API key (OpenAI, Anthropic, Google, or DeepSeek)
2. Go to ChatGPT or Claude
3. Start typing a prompt
4. Click the hint that pops up to optimize it
5. Your prompt gets rewritten with more detail

## Example

**Before:** "help me write a blog post about ai"

**After:** "Write a comprehensive 1,500-word blog post about artificial intelligence, focusing on its current applications in healthcare, business automation, and creative industries. Include real-world examples, potential challenges, and future outlook. Target audience: general business professionals. Tone: informative yet accessible."

## Local AI support

Works with Ollama or LM Studio if you don't want to use API keys:

```bash
# Ollama
ollama pull llama3.2
ollama serve

# Then set endpoint to http://localhost:11434 in settings
```

## Tech

- TypeScript
- Chrome Extension Manifest V3
- Works with OpenAI, Anthropic, Google, DeepSeek APIs
- Also works with local models via Ollama/LM Studio

## Privacy

Everything runs locally in your browser. Your prompts only go to whatever AI provider you configure. No tracking, no accounts, no BS.
