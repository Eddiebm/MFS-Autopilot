import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText, Shield, Calendar, ArrowRight, Loader2 } from 'lucide-react';
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

interface AuditResult {
  overall_score: number;
  platforms: {
    twitter?: {
      platform: string;
      username: string;
      score: number;
      issues: string[];
      recommendations: string[];
    };
    linkedin?: {
      platform: string;
      score: number;
      issues: string[];
      recommendations: string[];
    };
  };
  recommendations: string[];
  seven_day_plan: { day: number; action: string }[];
}

export function MaintenanceAudit() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!linkedin && !twitter)) {
      setError('Please provide at least one social profile');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Save lead
      await supabase.from('mfs_leads').insert({
        email,
        source: 'maintenance-audit',
        metadata: { linkedin, twitter, name },
      });

      // Call audit function
      const response = await fetch('https://rzhpydydecvakrtwwxfl.supabase.co/functions/v1/maintenance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          linkedin_url: linkedin,
          twitter_username: twitter,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAuditResult(data.audit);
      } else {
        setError('Failed to generate audit. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Attention';
    return 'Critical';
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

      {auditResult ? (
        /* Audit Results */
        <div className="px-6 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Score Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-4">Your Maintenance Audit</h1>
              <div className="inline-flex items-center gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-8 py-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(auditResult.overall_score)}`}>
                    {auditResult.overall_score}
                  </div>
                  <div className="text-[#888] text-sm mt-1">Overall Score</div>
                </div>
                <div className="w-px h-12 bg-[#2a2a2a]" />
                <div className={`text-lg font-medium ${getScoreColor(auditResult.overall_score)}`}>
                  {getScoreLabel(auditResult.overall_score)}
                </div>
              </div>
            </div>

            {/* Platform Analysis */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {auditResult.platforms.twitter && (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold">X</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Twitter/X</h3>
                      <p className="text-[#888] text-sm">@{auditResult.platforms.twitter.username}</p>
                    </div>
                    <div className={`ml-auto text-2xl font-bold ${getScoreColor(auditResult.platforms.twitter.score)}`}>
                      {auditResult.platforms.twitter.score}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {auditResult.platforms.twitter.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[#888]">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {auditResult.platforms.linkedin && (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold">in</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">LinkedIn</h3>
                      <p className="text-[#888] text-sm">Profile</p>
                    </div>
                    <div className={`ml-auto text-2xl font-bold ${getScoreColor(auditResult.platforms.linkedin.score)}`}>
                      {auditResult.platforms.linkedin.score}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {auditResult.platforms.linkedin.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[#888]">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-12">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={20} />
                Recommendations
              </h3>
              <div className="space-y-3">
                {auditResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ArrowRight size={16} className="text-white mt-0.5 flex-shrink-0" />
                    <span className="text-[#e0e0e0]">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Plan */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-6 mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar size={20} />
                Your 7-Day Maintenance Plan
              </h3>
              <div className="space-y-4">
                {auditResult.seven_day_plan.map(({ day, action }) => (
                  <div key={day} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{day}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[#e0e0e0]">{action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Let Us Handle Your Maintenance</h3>
              <p className="text-[#888] mb-6">
                Don't have time to execute this plan? KeepAlive does it all for you, running quietly in the background.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
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

          {/* Form */}
          <section className="px-6 py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Get Your Instant Audit
              </h2>
              <p className="text-[#666] text-center text-sm mb-8">
                Results delivered immediately. No waiting.
              </p>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#888] text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm mb-2">Twitter/X Handle</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white/50"
                    placeholder="@yourhandle"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating Audit...
                    </>
                  ) : (
                    'Get My Instant Audit'
                  )}
                </button>
              </form>
              <p className="text-[#666] text-center text-xs mt-4">
                No posting. No pressure. No credit card.
              </p>
            </div>
          </section>
        </>
      )}

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
