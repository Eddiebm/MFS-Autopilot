import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { BarChart3, Calendar, TrendingUp, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface Campaign {
  id: number;
  name: string;
}

interface Post {
  id: number;
  campaign_id: number;
  platform: string;
  status: string;
  created_at: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  instagram: '#E4405F',
  threads: '#000000',
  bluesky: '#0085FF',
  default: '#6366f1',
};

const PROVIDER_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function Reports() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      const { data } = await supabase
        .from('mfs_campaigns')
        .select('id, name')
        .order('created_at', { ascending: false });
      setCampaigns(data || []);
    }
    loadCampaigns();
  }, []);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      let query = supabase
        .from('mfs_posts')
        .select('id, campaign_id, platform, status, created_at')
        .order('created_at', { ascending: true });

      if (selectedCampaign !== 'all') {
        query = query.eq('campaign_id', parseInt(selectedCampaign));
      }

      const { data } = await query;
      setPosts(data || []);
      setLoading(false);
    }
    loadPosts();
  }, [selectedCampaign]);

  // Platform distribution
  const platformData = posts.reduce((acc, post) => {
    const platform = post.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformChartData = Object.entries(platformData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: PLATFORM_COLORS[name.toLowerCase()] || PLATFORM_COLORS.default,
  }));

  // Status distribution (replacing provider since it doesn't exist)
  const statusData = posts.reduce((acc, post) => {
    const status = post.status || 'draft';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([name, value], idx) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: PROVIDER_COLORS[idx % PROVIDER_COLORS.length],
  }));

  // Posts over time (grouped by day)
  const timeData = posts.reduce((acc, post) => {
    const date = new Date(post.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timeChartData = Object.entries(timeData).map(([date, count]) => ({
    date,
    posts: count,
  }));

  // Summary stats
  const totalPosts = posts.length;
  const mostUsedPlatform = platformChartData.length
    ? platformChartData.reduce((a, b) => (a.value > b.value ? a : b)).name
    : 'N/A';
  const dateRange =
    posts.length > 0
      ? `${new Date(posts[0].created_at).toLocaleDateString()} - ${new Date(
          posts[posts.length - 1].created_at
        ).toLocaleDateString()}`
      : 'N/A';

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="text-violet-400" />
            Campaign Reports
          </h1>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || `Campaign #${c.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-violet-600/20 to-violet-900/20 border border-violet-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-500/20 rounded-lg">
                <Layers size={24} className="text-violet-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-white">{loading ? '-' : totalPosts}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <TrendingUp size={24} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-cyan-300 text-sm">Top Platform</p>
                <p className="text-2xl font-bold text-white">{loading ? '-' : mostUsedPlatform}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Calendar size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-300 text-sm">Date Range</p>
                <p className="text-lg font-bold text-white">{loading ? '-' : dateRange}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-[#e0e0e0]">Loading report data...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
            <BarChart3 size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-[#e0e0e0] text-lg">No posts found for the selected campaign.</p>
            <p className="text-gray-500 mt-2">Generate some posts to see your reports here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Posts by Platform */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Posts by Platform</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#666" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {platformChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Provider Usage */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Post Status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Posts Over Time */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Posts Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#a78bfa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
