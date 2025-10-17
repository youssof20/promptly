export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">📄 Open Source License</h3>
            <p className="text-slate-300">
              Promptly is released under the MIT License. This means you're free to use, modify, and distribute the software.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
          <p className="text-slate-300 mb-6">
            By using Promptly, you agree to these terms. Since Promptly is open source and free, 
            these terms are minimal and focused on responsible use.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
          <p className="text-slate-300 mb-6">
            Promptly is an open-source browser extension that helps optimize AI prompts. 
            It works entirely on your device using your own API keys or local AI models. 
            No data is sent to our servers.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
          <p className="text-slate-300 mb-4">
            When using Promptly, you agree to:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>Use the software in compliance with applicable laws</li>
            <li>Respect the terms of service of AI providers you use</li>
            <li>Not use the software for illegal or harmful purposes</li>
            <li>Be responsible for your own API key security</li>
            <li>Not attempt to harm or exploit the software</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">No Warranty</h2>
          <p className="text-slate-300 mb-6">
            Promptly is provided "as is" without warranty of any kind. We make no guarantees 
            about the software's performance, reliability, or suitability for your needs. 
            Use at your own risk.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
          <p className="text-slate-300 mb-6">
            The developers of Promptly shall not be liable for any damages arising from the use 
            of this software. This includes direct, indirect, incidental, or consequential damages.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Open Source Rights</h2>
          <p className="text-slate-300 mb-4">
            As an open-source project, you have the right to:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>View and modify the source code</li>
            <li>Distribute copies of the software</li>
            <li>Create derivative works</li>
            <li>Use the software for any purpose</li>
            <li>Contribute improvements back to the project</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
          <p className="text-slate-300 mb-6">
            For questions about these Terms of Service, please open an issue on our GitHub repository:
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
