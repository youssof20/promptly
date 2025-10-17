export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-400 mb-2">🔒 Privacy-First Design</h3>
            <p className="text-slate-300">
              Promptly is designed with privacy as the top priority. We don't collect, store, or process your personal data.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">What We Don't Collect</h2>
          <p className="text-slate-300 mb-4">
            Promptly is completely privacy-focused. We do NOT collect:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>Your personal information or email addresses</li>
            <li>Your prompts or AI conversations</li>
            <li>Usage statistics or analytics</li>
            <li>Any data that could identify you</li>
            <li>Cookies or tracking data</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
          <p className="text-slate-300 mb-4">
            Promptly operates entirely on your device and uses your own API keys:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>All prompt optimization happens locally in your browser</li>
            <li>Your API keys are stored securely on your device only</li>
            <li>No data is sent to our servers</li>
            <li>You control all AI provider interactions</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Open Source Transparency</h2>
          <p className="text-slate-300 mb-6">
            Since Promptly is open source, you can verify our privacy claims by examining the code. 
            The entire codebase is available on GitHub for public review.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
          <p className="text-slate-300 mb-4">
            Promptly may interact with third-party AI services when you provide your own API keys:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>OpenAI (when you use your OpenAI API key)</li>
            <li>Anthropic (when you use your Claude API key)</li>
            <li>Google (when you use your Gemini API key)</li>
            <li>Local AI models (Ollama, LM Studio) - completely private</li>
          </ul>
          <p className="text-slate-300 mb-6">
            These interactions are governed by the respective third-party privacy policies. 
            We do not have access to or control over these interactions.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-slate-300 mb-6">
            If you have any questions about this Privacy Policy, please open an issue on our GitHub repository:
          </p>
          <p className="text-electric-blue">
            <a href="https://github.com/your-username/promptly/issues" target="_blank" rel="noopener noreferrer" className="hover:underline">
              https://github.com/your-username/promptly/issues
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
