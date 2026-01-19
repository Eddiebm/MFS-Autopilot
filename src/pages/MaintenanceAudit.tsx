import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const auditIncludes = [
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'We identify what\'s broken, neglected, or quietly costing you attention.',
  },
  {
    icon: FileText,
    title: '7-Day Maintenance Plan',
    description: 'A simple, actionable plan to restore consistency to your social presence.',
  },
  {
    icon: Shield,
    title: 'Opportunity Cost Analysis',
    description: 'What your silence is actually costing you in visibility and trust.',
  },
];

const auditProcess = [
  {
    step: 1,
    title: 'Submit your profiles',
    description: 'Share your LinkedIn and/or Twitter handles.',
  },
  {
    step: 2,
    title: 'We review manually',
    description: 'A human reviews your posting history, messaging, and presence.',
  },
  {
    step: 3,
    title: 'Get your report',
    description: 'Receive a clear assessment with actionable next steps.',
  },
];

export function MaintenanceAudit() {
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await supabase.from('mfs_leads').insert({
        email,
        source: 'maintenance-audit',
        metadata: { linkedin, twitter },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">KeepAlive</Link>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-[#e0e0e0] hover:text-white transition-colors">How It Works</Link>
            <Link to="/maintenance-audit" className="text-white font-medium">Free Audit</Link>
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
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Free Social Media Maintenance Audit
          </h1>
          <p className="text-[#888] text-lg">
            We'll identify what's broken, neglected, or quietly costing you attention—then give you a simple 7-day maintenance plan.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            What the Audit Includes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {auditIncludes.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-[#888] text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            How the Audit Works
          </h2>
          <div className="space-y-6">
            {auditProcess.map(({ step, title, description }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{step}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                  <p className="text-[#888] text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <div className="max-w-md mx-auto">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
              <p className="text-[#888]">
                We'll review your profiles and send your maintenance audit within 48 hours.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Get My Free Maintenance Audit
              </h2>
              <p className="text-[#666] text-center text-sm mb-8">
                No posting. No pressure. No credit card.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#888] text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm mb-2">Twitter/X Handle</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="@yourhandle"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Get My Free Maintenance Audit'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Reassurance */}
      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#666] text-sm">
            We won't post anything. We won't pressure you. This is just a helpful assessment.
          </p>
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
