import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link2, Check, Crown, ArrowUpRight, X } from 'lucide-react';

const platforms = [
  { id: 'twitter', name: 'X (Twitter)', color: '#000000', oauth: true },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', oauth: true },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', oauth: true },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', oauth: true },
  { id: 'tiktok', name: 'TikTok', color: '#000000', oauth: true },
  { id: 'bluesky', name: 'Bluesky', color: '#0085FF', oauth: false },
];

const planNames: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
};

export function Settings() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [subscription, setSubscription] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [showBlueskyModal, setShowBlueskyModal] = useState(false);
  const [blueskyHandle, setBlueskyHandle] = useState('');
  const [blueskyAppPassword, setBlueskyAppPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Load platform connections from database
      if (user) {
        const { data } = await supabase
          .from('mfs_platform_connections')
          .select('*')
          .eq('user_id', user.id);
        
        const conns: Record<string, any> = {};
        data?.forEach((c) => {
          conns[c.platform] = { handle: c.handle, connected: true };
        });
        setConnections(conns);

        // Load subscription
        const { data: subData } = await supabase
          .from('mfs_subscriptions')
          .select('*, mfs_plans!price_id(plan_type, price, monthly_limit)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        setSubscription(subData);
      }
    }
    loadData();
  }, [user]);

  function handleConnect(platformId: string) {
    if (platformId === 'bluesky') {
      setShowBlueskyModal(true);
    } else {
      setToast('Coming Soon - OAuth integration for this platform will be available soon');
      setTimeout(() => setToast(''), 3000);
    }
  }

  async function handleBlueskyConnect() {
    if (!blueskyHandle || !blueskyAppPassword || !user) return;
    setSaving(true);

    try {
      // Test the credentials first
      const testRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: blueskyHandle, password: blueskyAppPassword }),
      });

      if (!testRes.ok) {
        setToast('Invalid Bluesky credentials. Please check your handle and app password.');
        setSaving(false);
        return;
      }

      // Save to database (credentials stored encrypted via Supabase)
      const { error } = await supabase.from('mfs_platform_connections').upsert({
        user_id: user.id,
        platform: 'bluesky',
        handle: blueskyHandle,
        credentials: { appPassword: blueskyAppPassword },
      }, { onConflict: 'user_id,platform' });

      if (error) throw error;

      setConnections({ ...connections, bluesky: { handle: blueskyHandle, connected: true } });
      setShowBlueskyModal(false);
      setBlueskyHandle('');
      setBlueskyAppPassword('');
      setToast('Bluesky connected successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err: any) {
      setToast(err.message || 'Failed to connect Bluesky');
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect(platformId: string) {
    if (!user) return;
    await supabase.from('mfs_platform_connections').delete().eq('user_id', user.id).eq('platform', platformId);
    const updated = { ...connections };
    delete updated[platformId];
    setConnections(updated);
    setToast('Disconnected successfully');
    setTimeout(() => setToast(''), 2000);
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
                      {connections[platform.id]?.connected 
                        ? `Connected as @${connections[platform.id].handle}` 
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections[platform.id]?.connected ? (
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

      {/* Bluesky Connect Modal */}
      {showBlueskyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-lg font-semibold text-white">Connect Bluesky</h2>
              <button onClick={() => setShowBlueskyModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">Bluesky Handle</label>
                <input
                  type="text"
                  value={blueskyHandle}
                  onChange={(e) => setBlueskyHandle(e.target.value)}
                  placeholder="yourhandle.bsky.social"
                  className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">App Password</label>
                <input
                  type="password"
                  value={blueskyAppPassword}
                  onChange={(e) => setBlueskyAppPassword(e.target.value)}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white"
                />
                <p className="text-gray-500 text-xs mt-2">
                  App Passwords let you connect without sharing your main password.{' '}
                  <a 
                    href="https://bsky.app/settings/app-passwords" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0085FF] hover:underline"
                  >
                    Create one here
                  </a>
                  {' '}(Settings → Privacy → App Passwords)
                </p>
              </div>
              <button
                onClick={handleBlueskyConnect}
                disabled={saving || !blueskyHandle || !blueskyAppPassword}
                className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Connecting...' : 'Connect Bluesky'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a1a] border border-[#2a2a2a] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
