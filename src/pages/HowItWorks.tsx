import { Link } from 'react-router-dom';
import { UserPlus, Megaphone, Sparkles, Rocket } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Sign up',
    time: '30 seconds',
    description: 'Create your account with just an email.',
    whatYouSee: 'A simple form. No credit card. No hoops.',
  },
  {
    number: 2,
    icon: Megaphone,
    title: 'Create your first campaign',
    time: '2 minutes',
    description: "Tell us what you're promoting.",
    whatYouSee: "A few questions about your product or service. That's it.",
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Generate posts with AI',
    time: 'Instant',
    description: 'We create content for you. Or write your own.',
    whatYouSee: 'Ready-to-use posts you can edit, approve, or just let run.',
  },
  {
    number: 4,
    icon: Rocket,
    title: 'Connect and let it run',
    time: 'Set once',
    description: 'Link your platforms. We handle the rest.',
    whatYouSee: 'Your social presence continues while you focus elsewhere.',
  },
];

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">MFS Autopilot</Link>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-white font-medium">How It Works</Link>
            <Link to="/pricing" className="text-[#e0e0e0] hover:text-white transition-colors">Pricing</Link>
            <Link to="/login" className="text-[#e0e0e0] hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            How It Works
          </h1>
          <p className="text-[#e0e0e0] text-lg">
            Four steps. No complexity. Start now, be done in 5 minutes.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map(({ number, icon: Icon, title, time, description, whatYouSee }) => (
            <div
              key={number}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 flex gap-6"
            >
              {/* Step Number & Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <Icon size={28} className="text-[#0e0e0e]" />
                </div>
                <div className="text-center mt-2">
                  <span className="text-white font-bold text-sm">Step {number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <span className="text-xs bg-white/10 text-[#e0e0e0] px-2 py-1 rounded-full">
                    {time}
                  </span>
                </div>
                <p className="text-[#e0e0e0] mb-3">{description}</p>
                <p className="text-sm text-[#888]">
                  <span className="text-[#aaa]">What you'll see:</span> {whatYouSee}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creating Your First Campaign */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Creating Your First Campaign
          </h2>
          <p className="text-[#e0e0e0] text-center mb-12">
            A closer look at Step 2. Here's exactly what happens.
          </p>
          
          <div className="space-y-4">
            {[
              { num: 1, title: 'Click "New Campaign"', desc: 'Found on your dashboard.' },
              { num: 2, title: 'Name your campaign', desc: 'Something simple like "Product Launch" or "Weekly Content".' },
              { num: 3, title: "Describe what you're promoting", desc: 'Your product, service, or message in a few sentences.' },
              { num: 4, title: 'Set your target audience', desc: 'Who should see this. Optional.' },
              { num: 5, title: 'Choose platforms', desc: 'X, LinkedIn, Instagram, Bluesky.' },
              { num: 6, title: 'Done', desc: 'The system takes it from here.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-4 bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-5">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{num}</span>
                </div>
                <div>
                  <span className="text-white font-medium">{title}</span>
                  <span className="text-[#888] ml-2">— {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to take this off your plate?</h2>
          <p className="text-[#e0e0e0] mb-8">Start free. No credit card. Cancel anytime.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#e0e0e0] text-sm">
          <span>&copy; 2026 MFS Autopilot</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
