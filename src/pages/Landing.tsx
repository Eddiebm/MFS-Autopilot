import { Link } from 'react-router-dom';
import { Pencil, Calendar, RefreshCw } from 'lucide-react';

const outcomes = [
  {
    icon: Pencil,
    title: 'Posts are written without you',
    description: 'Content happens in the background. You approve when convenient.',
  },
  {
    icon: Calendar,
    title: 'Your social presence continues while you work',
    description: 'Campaigns run on schedule. Platforms stay active.',
  },
  {
    icon: RefreshCw,
    title: 'The cycle keeps going',
    description: 'New content queues up. Old tasks stop recurring.',
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
            <Link to="/how-it-works" className="text-[#e0e0e0] hover:text-white transition-colors">How It Works</Link>
            <a href="#what-it-handles" className="text-[#e0e0e0] hover:text-white transition-colors">What It Handles</a>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Marketing that runs without you pretending to enjoy it
          </h1>
          <p className="mt-6 text-[#e0e0e0] text-lg max-w-xl mx-auto">
            Social media handled quietly in the background, so you can work on what actually matters.
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

      {/* Relief Anchor */}
      <section className="px-6 py-12">
        <p className="text-[#e0e0e0] text-lg text-center max-w-2xl mx-auto">
          Turn this on and stop worrying about staying visible.
        </p>
      </section>

      {/* What It Handles */}
      <section id="what-it-handles" className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What This Handles For You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map(({ icon: Icon, title, description }) => (
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

      {/* Mid-page statement */}
      <section className="px-6 py-12">
        <p className="text-[#888] text-center">
          Once it's running, promotion stops occupying space in your head.
        </p>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#e0e0e0] text-lg">
            500+ founders have taken this off their plate.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">One less thing to manage.</h2>
          <p className="text-[#e0e0e0] mb-8">Start free. No credit card required.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Boundary Statement */}
      <section className="px-6 py-12">
        <p className="text-[#888] text-center">
          If you enjoy marketing, this probably isn't for you.
        </p>
      </section>

      {/* Quiet link */}
      <section className="px-6 py-8">
        <p className="text-center">
          <a href="https://7xilv31vak25.space.minimax.io" className="text-[#666] text-sm hover:underline" aria-label="A very small book about not disappearing">
            How Things Get Noticed
          </a>
        </p>
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
