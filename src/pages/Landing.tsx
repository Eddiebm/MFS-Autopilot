import { Link } from 'react-router-dom';
import { Zap, BarChart3, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Content',
    description: 'Generate engaging posts tailored to your brand voice in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Track performance and optimize your strategy with real-time insights.',
  },
  {
    icon: Clock,
    title: 'Set It & Forget It',
    description: 'Schedule weeks of content in advance across all your platforms.',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">MFS Autopilot</Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-[#e0e0e0] hover:text-white transition-colors">Features</a>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Marketing that runs without you pretending to enjoy it
          </h1>
          <p className="mt-6 text-[#e0e0e0] text-lg max-w-xl mx-auto">
            AI-powered social media automation that handles the boring stuff so you can focus on what matters.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 border border-[#2a2a2a] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Automate Your Marketing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-[#e0e0e0]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users size={24} className="text-white" />
            <span className="text-2xl font-bold text-white">500+</span>
          </div>
          <p className="text-[#e0e0e0] text-lg">
            Join 500+ marketers who've reclaimed their time with MFS Autopilot
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate?</h2>
          <p className="text-[#e0e0e0] mb-8">Start for free. No credit card required.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[#e0e0e0] text-sm">
          <span>&copy; 2026 MFS Autopilot. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
