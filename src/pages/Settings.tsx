import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link2, Check, Crown, ArrowUpRight } from 'lucide-react';

const platforms = [
  { id: 'twitter', name: 'X (Twitter)', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'bluesky', name: 'Bluesky', color: '#0085FF' },
];

const planNames: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
};

export function Settings() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [subscription, setSubscription] = useState<any>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mfs_connections');
    if (saved) setConnections(JSON.parse(saved));
    
    async function loadSubscription() {
      if (!user) return;
      const { data } = await supabase
        .from('mfs_subscriptions')
        .select('*, mfs_plans!price_id(plan_type, price, monthly_limit)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      setSubscription(data);
    }
    loadSubscription();
  }, [user]);

  function handleConnect(platformId: string) {
    setToast('Coming Soon - OAuth integration will be available in a future update');
    setTimeout(() => setToast(''), 3000);
  }

  function handleDisconnect(platformId: string) {
    const updated = { ...connections, [platformId]: false };
    setConnections(updated);
    localStorage.setItem('mfs_connections', JSON.stringify(updated));
  }

  const currentPlan = subscription?.mfs_plans?.plan_type || 'free';

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Current Plan */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Current Plan</h2>
                <p className="text-[#e0e0e0]">
                  {planNames[currentPlan] || 'Free'} Plan
                  {subscription?.mfs_plans?.monthly_limit && ` • ${subscription.mfs_plans.monthly_limit} posts/month`}
                </p>
              </div>
            </div>
            {currentPlan === 'free' && (
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Upgrade
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white mb-4">Platform Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {platforms.map((platform) => (
            <div key={platform.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: platform.color }}>
                    <Link2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{platform.name}</h3>
                    <p className="text-[#e0e0e0] text-sm">
                      {connections[platform.id] ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections[platform.id] ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="px-4 py-2 border border-[#2a2a2a] text-[#e0e0e0] rounded-lg hover:bg-white/5 transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Lead Capture Form</h2>
          <p className="text-[#e0e0e0] mb-4">Embed this form on your website to capture leads:</p>
          <div className="bg-[#0e0e0e] rounded-lg p-4 font-mono text-sm text-[#e0e0e0] overflow-x-auto">
            {`<iframe src="${window.location.origin}/capture" width="100%" height="300" frameborder="0"></iframe>`}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`<iframe src="${window.location.origin}/capture" width="100%" height="300" frameborder="0"></iframe>`);
              setToast('Embed code copied!');
              setTimeout(() => setToast(''), 2000);
            }}
            className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Copy Embed Code
          </button>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a1a] border border-[#2a2a2a] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
