import { Link } from 'react-router-dom';
import { Settings, Clock, Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const maintenanceItems = [
  {
    icon: Clock,
    problem: 'Inconsistent posting',
    description: 'Weeks go by. Your profile goes quiet. People forget you exist.',
  },
  {
    icon: AlertTriangle,
    problem: 'Content decay',
    description: 'Old messaging no longer reflects what you do or who you serve.',
  },
  {
    icon: Shield,
    problem: 'Visibility loss',
    description: 'Silent weeks cost you attention. Competitors stay visible.',
  },
  {
    icon: Settings,
    problem: 'Founder voice drift',
    description: 'Without maintenance, your social presence stops sounding like you.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Connect',
    description: 'Connect LinkedIn and/or Twitter. Tell us what you do.',
  },
  {
    step: 2,
    title: 'Maintain',
    description: 'Posts are drafted, reviewed, queued, and scheduled automatically. Human review ensures it still sounds like you.',
  },
  {
    step: 3,
    title: 'Approve & Forget',
    description: 'You approve or edit in seconds. Everything else runs in the background.',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">KeepAlive</Link>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-[#e0e0e0] hover:text-white transition-colors">How It Works</Link>
            <Link to="/maintenance-audit" className="text-[#e0e0e0] hover:text-white transition-colors">Free Audit</Link>
            <Link to="/faq" className="text-[#e0e0e0] hover:text-white transition-colors">FAQ</Link>
            <Link to="/pricing" className="text-[#e0e0e0] hover:text-white transition-colors">Pricing</Link>
            <Link to="/login" className="text-[#e0e0e0] hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#888] text-sm uppercase tracking-wider mb-4">Social Media Maintenance for Founders</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            KeepAlive
          </h1>
          <p className="mt-6 text-[#e0e0e0] text-xl max-w-2xl mx-auto leading-relaxed">
            Your social presence doesn't need strategy meetings.<br />
            It needs maintenance.
          </p>
          <p className="mt-4 text-[#888] text-lg max-w-xl mx-auto">
            We keep your LinkedIn and Twitter active, credible, and running quietly in the background—so you can focus on building.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Free (No Credit Card)
            </Link>
            <p className="text-[#666] text-sm">
              Trusted by 500+ founders · Runs quietly · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* What We Mean by Maintenance */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What We Mean by "Maintenance"
          </h2>
          <p className="text-[#888] text-center mb-12">
            Social media breaks down quietly. We fix it before you notice.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {maintenanceItems.map(({ icon: Icon, problem, description }) => (
              <div key={problem} className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-6 flex gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={24} className="text-[#888]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{problem}</h3>
                  <p className="text-[#888] text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How KeepAlive Works
          </h2>
          <div className="space-y-6">
            {howItWorks.map(({ step, title, description }) => (
              <div key={step} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-lg">{step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                  <p className="text-[#888]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-12 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#e0e0e0] text-lg">
            Used by 500+ founders who don't want to "do content."
          </p>
          <p className="text-[#666] text-sm mt-2">
            Like IT maintenance for your social presence.
          </p>
        </div>
      </section>

      {/* Who It's Not For */}
      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#666]">
            This is not for growth hackers or content creators.<br />
            It's for founders who want one less thing to manage.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Reliable. Consistent. Background.</h2>
          <p className="text-[#888] mb-8">Start free. No credit card. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Free
            </Link>
            <Link
              to="/maintenance-audit"
              className="px-8 py-4 border border-[#2a2a2a] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
            >
              Get Free Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#888] text-sm">
          <span>&copy; 2026 KeepAlive</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
