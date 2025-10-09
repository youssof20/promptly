export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-charcoal-gray to-rich-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
          <p className="text-slate-300 mb-6">
            By accessing and using Promptly, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
          <p className="text-slate-300 mb-6">
            Promptly provides AI prompt optimization services through our web platform 
            and browser extension. We help users improve their prompts for better AI 
            interaction results.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
          <p className="text-slate-300 mb-4">
            Users are responsible for:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li>Providing accurate account information</li>
            <li>Using the service in compliance with applicable laws</li>
            <li>Not attempting to reverse engineer or exploit our systems</li>
            <li>Respecting usage quotas and subscription terms</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Payment and Billing</h2>
          <p className="text-slate-300 mb-6">
            Pro subscriptions are billed monthly. Users can cancel anytime. 
            We offer a 30-day money-back guarantee for all paid plans.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
          <p className="text-slate-300 mb-6">
            Promptly shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use of the service.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
          <p className="text-slate-300 mb-6">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-electric-blue">
            legal@promptly.ai
          </p>
        </div>
      </div>
    </div>
  );
}
