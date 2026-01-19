import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const plans = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: ['1 campaign', '5 posts/month', '1 platform'],
    cta: 'Start Free',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 29,
    annualPrice: 290,
    features: ['3 campaigns', '50 posts/month', '3 platforms', 'Basic analytics'],
    cta: 'Subscribe',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 79,
    annualPrice: 790,
    features: ['10 campaigns', '200 posts/month', 'All platforms', 'Advanced analytics', 'Priority support'],
    cta: 'Subscribe',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    monthlyPrice: 199,
    annualPrice: 1990,
    features: ['Unlimited campaigns', '1000 posts/month', 'All platforms', 'Team seats', 'White-label', 'Dedicated support'],
    cta: 'Subscribe',
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubscribe(planId: string) {
    if (planId === 'free') {
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
          <Link to="/" className="text-xl font-bold text-white">MFS Autopilot</Link>
          <div className="flex items-center gap-6">
            <Link to="/#features" className="text-[#e0e0e0] hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="text-white font-medium">Pricing</Link>
            <Link to="/login" className="text-[#e0e0e0] hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-[#e0e0e0] text-lg mb-8">Choose the plan that fits your marketing needs</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-[#e0e0e0]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-white' : 'bg-[#2a2a2a]'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full transition-transform ${annual ? 'translate-x-8 bg-black' : 'translate-x-1 bg-white'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-[#e0e0e0]'}`}>Annual <span className="text-green-400">(Save 17%)</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1a1a1a] border rounded-xl p-6 ${plan.popular ? 'border-white' : 'border-[#2a2a2a]'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full flex items-center gap-1">
                  <Zap size={12} /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#e0e0e0]">/{annual ? 'year' : 'mo'}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-[#e0e0e0] text-sm">
                    <Check size={16} className="text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
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
      </main>
    </div>
  );
}
