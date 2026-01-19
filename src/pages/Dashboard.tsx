import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { Megaphone, Users, FileText, TrendingUp, Plus, ArrowRight } from 'lucide-react';

interface Stats {
  campaigns: number;
  leads: number;
  posts: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ campaigns: 0, leads: 0, posts: 0 });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { count: campaignCount } = await supabase
        .from('mfs_campaigns')
        .select('*', { count: 'exact', head: true });

      const { count: leadCount } = await supabase
        .from('mfs_leads')
        .select('*', { count: 'exact', head: true });

      const { count: postCount } = await supabase
        .from('mfs_posts')
        .select('*', { count: 'exact', head: true });

      const { data: campaignData } = await supabase
        .from('mfs_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        campaigns: campaignCount || 0,
        leads: leadCount || 0,
        posts: postCount || 0,
      });
      setCampaigns(campaignData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const statCards = [
    { label: 'Active Campaigns', value: stats.campaigns, icon: Megaphone },
    { label: 'Total Leads', value: stats.leads, icon: Users },
    { label: 'Posts Scheduled', value: stats.posts, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-[#e0e0e0] text-sm">{label}</p>
                  <p className="text-2xl font-bold text-white">{loading ? '-' : value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-white" />
              <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
            </div>
          </div>
          {loading ? (
            <p className="text-[#e0e0e0]">Loading...</p>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone size={40} className="text-gray-600 mx-auto mb-4" />
              <p className="text-[#e0e0e0] mb-4">No campaigns yet. Get started by creating your first one!</p>
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus size={18} />
                Create Your First Campaign
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between py-3 border-b border-[#2a2a2a] last:border-0">
                  <div>
                    <p className="text-white font-medium capitalize">{campaign.name || campaign.objective}</p>
                    <p className="text-[#e0e0e0] text-sm">
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
