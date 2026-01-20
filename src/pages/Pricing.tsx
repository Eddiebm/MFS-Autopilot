import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Zap, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Tooltip component
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#2a2a2a] text-[#e0e0e0] text-xs rounded-lg shadow-lg z-10 text-center">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2a2a]"></span>
      </span>
    </span>
  );
}

const plans = [
  {
    id: 'trial',
    name: 'Trial Maintenance',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Short trial to experience automation-first social media maintenance.',
    features: [
      { text: '1 platform', tooltip: null },
      { text: 'Automation-only posting', tooltip: 'Posts are generated and scheduled automatically. You approve everything before it publishes.' },
      { text: 'Mandatory approval', tooltip: 'Nothing goes live unless you approve it first.' },
    ],
    exclusions: ['No human review', 'Trial-limited access'],
    footnote: 'This is a short trial to experience maintenance, not a free long-term plan.',
    cta: 'Start Trial',
    popular: false,
  },
  {
    id: 'light',
    name: 'Light Maintenance',
    monthlyPrice: 39.99,
    annualPrice: 399,
    description: 'Minimal social media maintenance to stay visible.',
    features: [
      { text: '1 platform (LinkedIn or X)', tooltip: 'Choose either LinkedIn or X. Multi-platform coverage requires Core Maintenance.' },
      { text: '1–2 posts/week', tooltip: 'Low, steady cadence designed to maintain visibility without overposting.' },
      { text: 'Automation-first scheduling', tooltip: null },
      { text: 'Mandatory approval queue', tooltip: null },
    ],
    exclusions: ['No evergreen queue', 'No priority scheduling', 'No human review'],
    footnote: 'Best for founders who want basic uptime without full coverage.',
    cta: 'Choose Light',
    popular: false,
  },
  {
    id: 'core',
    name: 'Core Maintenance',
    monthlyPrice: 79,
    annualPrice: 790,
    description: 'Consistent presence with minimal involvement.',
    features: [
      { text: '2 platforms (LinkedIn + X)', tooltip: 'Maintain presence on LinkedIn and X simultaneously.' },
      { text: 'Weekly posting cadence', tooltip: null },
      { text: 'Evergreen queue', tooltip: 'Background content rotation that prevents gaps when you\'re busy.' },
      { text: 'Priority scheduling', tooltip: null },
      { text: 'Human review (add-on)', tooltip: 'Optional, paid quality check for sensitive posts. Not required for routine maintenance.' },
    ],
    exclusions: [],
    footnote: 'This is the plan most founders choose for consistent, low-effort presence.',
    cta: 'Choose Core',
    popular: true,
  },
  {
    id: 'full',
    name: 'Full Maintenance',
    monthlyPrice: 149,
    annualPrice: 1490,
    description: 'Maximum coverage for zero day-to-day involvement.',
    features: [
      { text: 'Multi-platform', tooltip: 'Coverage across all supported platforms without manual coordination.' },
      { text: 'Higher posting cadence', tooltip: null },
      { text: 'Evergreen queue', tooltip: null },
      { text: 'Priority scheduling', tooltip: null },
      { text: 'Human review (soft-capped)', tooltip: 'Human review is available within reasonable use limits. This is not unlimited editorial service.' },
    ],
    exclusions: [],
    footnote: 'For founders who want maximum peace of mind and minimal involvement.',
    cta: 'Choose Full',
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubscribe(planId: string) {
    if (planId === 'trial') {
      navigate('/signup');
      return;
    }

    if (!user) {
      navigate('/signup');
      return;
    }

    setLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { planType: planId, customerEmail: user.email },
      });

      if (error) throw error;
      if (data?.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      alert(err.message || 'Failed to create subscription');
    } finally {
      setLoading(null);
    }
  }

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
            <Link to="/pricing" className="text-white font-medium">Pricing</Link>
            <Link to="/login" className="text-[#e0e0e0] hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Start Trial
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Maintenance Plans</h1>
          <p className="text-[#888] text-lg mb-8">Choose the maintenance level that fits your needs</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-[#888]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-white' : 'bg-[#2a2a2a]'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full transition-transform ${annual ? 'translate-x-8 bg-black' : 'translate-x-1 bg-white'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-[#888]'}`}>Annual <span className="text-green-400">(Save 17%)</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1a1a1a] border rounded-xl p-5 flex flex-col ${plan.popular ? 'border-white ring-1 ring-white' : 'border-[#2a2a2a]'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full flex items-center gap-1">
                  <Zap size={12} /> Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#888] text-sm">/{annual ? 'year' : 'mo'}</span>
              </div>
              <p className="text-[#888] text-xs mb-4 leading-relaxed">{plan.description}</p>
              
              <ul className="space-y-2 mb-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2 text-[#e0e0e0] text-sm">
                    <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="flex items-center gap-1">
                      {feature.text}
                      {feature.tooltip && (
                        <Tooltip text={feature.tooltip}>
                          <Info size={12} className="text-[#666] cursor-help" />
                        </Tooltip>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.exclusions.length > 0 && (
                <ul className="space-y-1 mb-3 pt-2 border-t border-[#2a2a2a]">
                  {plan.exclusions.map((exclusion) => (
                    <li key={exclusion} className="flex items-start gap-2 text-[#555] text-xs">
                      <X size={10} className="flex-shrink-0 mt-0.5" />
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </button>

              {/* Footnote */}
              <p className="text-[#555] text-[10px] mt-3 text-center leading-tight">{plan.footnote}</p>
            </div>
          ))}
        </div>

        {/* Human Review Add-on */}
        <div className="mt-12 max-w-xl mx-auto">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-white">Human Review (On Request)</h3>
              <Tooltip text="Human review is only performed when you explicitly ask for it.">
                <Info size={14} className="text-[#666] cursor-help" />
              </Tooltip>
            </div>
            <p className="text-[#888] text-sm mb-3">
              Optional quality and brand-safety review for sensitive posts.
              <Tooltip text="Clarity, tone, and brand safety — not strategy or performance.">
                <Info size={12} className="text-[#666] cursor-help ml-1 inline" />
              </Tooltip>
            </p>
            <div className="flex items-center gap-6 text-sm mb-3">
              <div className="text-[#e0e0e0]">
                <span className="font-semibold text-white">$15</span> per request
              </div>
              <div className="text-[#666]">or</div>
              <div className="text-[#e0e0e0]">
                <span className="font-semibold text-white">Monthly bundle</span> (capped)
              </div>
            </div>
            <p className="text-[#555] text-[10px]">Most routine posts do not require human review.</p>
          </div>
        </div>

        {/* Checkout notes */}
        <div className="mt-10 flex justify-center gap-8 text-[#666] text-xs">
          <span>✓ Cancel anytime</span>
          <span>✓ You control what publishes</span>
          <span>✓ Human review is optional</span>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-[#555] text-xs max-w-2xl mx-auto leading-relaxed">
            KeepAlive provides automation-first social media maintenance. We do not promise growth, reach, engagement, or leads. Human review is optional and only provided when explicitly requested.
          </p>
        </div>
      </main>

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
