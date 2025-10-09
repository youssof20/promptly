export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
          <p className="text-slate-300 mb-4">
            We collect minimal information necessary to provide our service:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>Email address for account creation</li>
            <li>Prompts you choose to optimize (processed locally when possible)</li>
            <li>Usage statistics to improve our service</li>
            <li>Browser extension interaction data</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
          <p className="text-slate-300 mb-4">
            Your information is used solely to:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>Provide prompt optimization services</li>
            <li>Track usage quotas and billing</li>
            <li>Improve our AI models and service quality</li>
            <li>Send important service updates</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
          <p className="text-slate-300 mb-6">
            We implement industry-standard security measures to protect your data. 
            All data transmission is encrypted, and we never share your personal 
            information with third parties without your explicit consent.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-slate-300 mb-6">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-electric-blue">
            privacy@promptly.ai
          </p>
        </div>
      </div>
    </div>
  );
}
