import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Zap, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const plans = [
  {
    id: 'trial',
    name: 'Trial Maintenance',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Short trial to experience automation-first social media maintenance.',
    features: [
      '1 platform',
      'Automation-only posting',
      'Mandatory approval before publish',
    ],
    exclusions: [
      'No human review',
      'Trial-limited access',
    ],
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
      '1 platform (LinkedIn or X)',
      'Low posting cadence (1–2 posts/week)',
      'Automation-first generation & scheduling',
      'Mandatory approval queue',
    ],
    exclusions: [
      'No multi-platform coverage',
      'No evergreen queue',
      'No priority scheduling',
      'No human review',
    ],
    cta: 'Choose Light Maintenance',
    popular: false,
  },
  {
    id: 'core',
    name: 'Core Maintenance',
    monthlyPrice: 79,
    annualPrice: 790,
    description: 'Ongoing social media maintenance for founders who want consistent presence with minimal involvement.',
    features: [
      '2 platforms (LinkedIn + X)',
      'Consistent weekly posting cadence',
      'Evergreen maintenance queue',
      'Priority scheduling',
      'Mandatory approval queue',
    ],
    exclusions: [],
    addon: 'Human review available on request (paid add-on)',
    cta: 'Choose Core Maintenance',
    popular: true,
  },
  {
    id: 'full',
    name: 'Full Maintenance',
    monthlyPrice: 149,
    annualPrice: 1490,
    description: 'Maximum coverage and safety for founders who want zero day-to-day involvement.',
    features: [
      'Multi-platform maintenance',
      'Higher posting cadence',
      'Evergreen queue',
      'Priority scheduling',
      'Human review available on request (soft-capped)',
    ],
    exclusions: [],
    cta: 'Choose Full Maintenance',
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
              className={`relative bg-[#1a1a1a] border rounded-xl p-6 flex flex-col ${plan.popular ? 'border-white ring-1 ring-white' : 'border-[#2a2a2a]'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full flex items-center gap-1">
                  <Zap size={12} /> Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#888] text-sm">/{annual ? 'year' : 'mo'}</span>
              </div>
              <p className="text-[#888] text-sm mb-4 leading-relaxed">{plan.description}</p>
              
              <ul className="space-y-2 mb-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[#e0e0e0] text-sm">
                    <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.addon && (
                  <li className="flex items-start gap-2 text-[#888] text-sm mt-3 pt-3 border-t border-[#2a2a2a]">
                    <HelpCircle size={14} className="text-[#666] flex-shrink-0 mt-0.5" />
                    <span>{plan.addon}</span>
                  </li>
                )}
              </ul>

              {plan.exclusions.length > 0 && (
                <ul className="space-y-1.5 mb-4 pt-3 border-t border-[#2a2a2a]">
                  {plan.exclusions.map((exclusion) => (
                    <li key={exclusion} className="flex items-start gap-2 text-[#666] text-xs">
                      <X size={12} className="text-[#555] flex-shrink-0 mt-0.5" />
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Human Review Add-on */}
        <div className="mt-12 max-w-xl mx-auto">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Human Review (On Request)</h3>
            <p className="text-[#888] text-sm mb-4">
              Optional quality and brand-safety review for sensitive posts. Not required for routine maintenance.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-[#e0e0e0]">
                <span className="font-semibold text-white">$15</span> per request
              </div>
              <div className="text-[#888]">or</div>
              <div className="text-[#e0e0e0]">
                <span className="font-semibold text-white">Monthly bundle</span> (clearly capped)
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-[#666] text-sm max-w-2xl mx-auto">
            KeepAlive provides automation-first social media maintenance. We do not promise growth, leads, or performance outcomes.
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
