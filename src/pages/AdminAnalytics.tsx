import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
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
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  RefreshCw,
} from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  x: '#000000',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  instagram: '#E4405F',
  tiktok: '#000000',
  bluesky: '#0085FF',
};

const PROVIDER_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Cost estimates per operation
const COST_ESTIMATES = {
  openai_text: 0.01,
  anthropic_text: 0.015,
  deepseek_text: 0.002,
  google_text: 0.005,
  groq_text: 0.001,
  dalle_image: 0.04,
};

export function AdminAnalytics() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    async function loadData() {
      const [postsRes, campaignsRes, subsRes, reportsRes] = await Promise.all([
        supabase.from('mfs_posts').select('*').order('created_at', { ascending: true }),
        supabase.from('mfs_campaigns').select('*'),
        supabase.from('mfs_subscriptions').select('*, mfs_plans!price_id(plan_type, price)').eq('status', 'active'),
        supabase.from('mfs_reports').select('*').order('created_at', { ascending: false }).limit(10),
      ]);
      setPosts(postsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setSubscriptions(subsRes.data || []);
      setReports(reportsRes.data || []);
      setLoading(false);
    }
    if (isAdmin) loadData();
  }, [isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const generateReport = async (type: string) => {
    setGeneratingReport(true);
    try {
      const res = await fetch('https://rzhpydydecvakrtwwxfl.supabase.co/functions/v1/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_type: type }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setReports(prev => [data, ...prev.slice(0, 9)]);
      }
    } catch (e) {
      console.error('Failed to generate report', e);
    }
    setGeneratingReport(false);
  };

  // Calculate spending metrics
  const totalTextCosts = posts.length * COST_ESTIMATES.openai_text;
  const imagePosts = posts.filter(p => p.image_url);
  const totalImageCosts = imagePosts.length * COST_ESTIMATES.dalle_image;
  const totalSpending = totalTextCosts + totalImageCosts;
  const costPerPost = posts.length > 0 ? totalSpending / posts.length : 0;

  // Monthly spending trend
  const monthlySpending = posts.reduce((acc, post) => {
    const month = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const cost = COST_ESTIMATES.openai_text + (post.image_url ? COST_ESTIMATES.dalle_image : 0);
    acc[month] = (acc[month] || 0) + cost;
    return acc;
  }, {} as Record<string, number>);

  const monthlySpendingData = Object.entries(monthlySpending).map(([month, cost]) => ({
    month,
    cost: Number(cost.toFixed(2)),
  }));

  // Revenue calculation
  const monthlyRevenue = subscriptions.reduce((sum, sub) => {
    return sum + (sub.mfs_plans?.price || 0) / 100;
  }, 0);

  // Platform breakdown
  const platformData = posts.reduce((acc, post) => {
    const platform = (post.platform || 'unknown').toLowerCase();
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformChartData = Object.entries(platformData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: PLATFORM_COLORS[name] || '#6366f1',
  }));

  // Posts per campaign
  const campaignPosts = campaigns.map(c => ({
    name: c.name || c.objective?.slice(0, 20) || `Campaign ${c.id}`,
    posts: posts.filter(p => p.campaign_id === c.id).length,
  })).sort((a, b) => b.posts - a.posts).slice(0, 5);

  // Status breakdown
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.length - publishedCount;
  const successRate = posts.length > 0 ? (publishedCount / posts.length) * 100 : 0;

  // Posts over time
  const postsOverTime = posts.reduce((acc, post) => {
    const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const postsOverTimeData = Object.entries(postsOverTime).map(([date, count]) => ({
    date,
    posts: count,
  }));

  // Most active hours
  const hourlyActivity = posts.reduce((acc, post) => {
    const hour = new Date(post.created_at).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHour = Object.entries(hourlyActivity).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
            <p className="text-gray-400 text-sm">Internal dashboard - Admin access only</p>
          </div>
        </div>

        {/* Spending Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-red-400" />
              <span className="text-red-300 text-sm">Total API Spend</span>
            </div>
            <p className="text-2xl font-bold text-white">${totalSpending.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-1">Text: ${totalTextCosts.toFixed(2)} | Images: ${totalImageCosts.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-green-400" />
              <span className="text-green-300 text-sm">Monthly Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">${monthlyRevenue.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-1">{subscriptions.length} active subscriptions</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={20} className="text-blue-400" />
              <span className="text-blue-300 text-sm">Cost Per Post</span>
            </div>
            <p className="text-2xl font-bold text-white">${costPerPost.toFixed(3)}</p>
            <p className="text-gray-500 text-xs mt-1">{posts.length} total posts</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-purple-400" />
              <span className="text-purple-300 text-sm">Profit/Loss</span>
            </div>
            <p className={`text-2xl font-bold ${monthlyRevenue - totalSpending >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {monthlyRevenue - totalSpending >= 0 ? '+' : ''}${(monthlyRevenue - totalSpending).toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">Revenue - API costs</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Monthly Spending Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Platform Usage</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Campaigns</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={campaignPosts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Bar dataKey="posts" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Posts Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={postsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="posts" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-white font-medium">Success Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{successRate.toFixed(1)}%</p>
            <p className="text-gray-500 text-sm">{publishedCount} published / {draftCount} drafts</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users size={20} className="text-cyan-400" />
              <span className="text-white font-medium">Active Campaigns</span>
            </div>
            <p className="text-3xl font-bold text-white">{campaigns.length}</p>
            <p className="text-gray-500 text-sm">{(posts.length / Math.max(campaigns.length, 1)).toFixed(1)} avg posts/campaign</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock size={20} className="text-orange-400" />
              <span className="text-white font-medium">Peak Activity</span>
            </div>
            <p className="text-3xl font-bold text-white">{peakHour ? `${peakHour[0]}:00` : 'N/A'}</p>
            <p className="text-gray-500 text-sm">{peakHour ? `${peakHour[1]} posts at this hour` : 'No data yet'}</p>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Scheduled Reports</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => generateReport('daily')}
                disabled={generatingReport}
                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-1"
              >
                <RefreshCw size={12} className={generatingReport ? 'animate-spin' : ''} />
                Daily
              </button>
              <button
                onClick={() => generateReport('weekly')}
                disabled={generatingReport}
                className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-1"
              >
                <RefreshCw size={12} className={generatingReport ? 'animate-spin' : ''} />
                Weekly
              </button>
              <button
                onClick={() => generateReport('monthly')}
                disabled={generatingReport}
                className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-1"
              >
                <RefreshCw size={12} className={generatingReport ? 'animate-spin' : ''} />
                Monthly
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-4">Daily: 8AM UTC | Weekly: Mondays 8AM UTC | Monthly: 1st of month 8AM UTC</p>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">No reports yet. Click a button above to generate one.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {reports.map((report) => (
                <div key={report.id} className="p-4 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-white font-medium capitalize">{report.report_type} Report</span>
                      <span className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Users</p>
                      <p className="text-white font-medium">{report.data?.summary?.new_users || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Posts</p>
                      <p className="text-white font-medium">{report.data?.summary?.new_posts || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Campaigns</p>
                      <p className="text-white font-medium">{report.data?.summary?.new_campaigns || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Leads</p>
                      <p className="text-white font-medium">{report.data?.summary?.new_leads || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Subscriptions</p>
                      <p className="text-white font-medium">{report.data?.summary?.new_subscriptions || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">API Cost</p>
                      <p className="text-white font-medium">${report.data?.summary?.total_api_cost || '0.00'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Insights & Recommendations</h2>
          <div className="space-y-3">
            {imagePosts.length / posts.length < 0.3 && posts.length > 5 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="p-1 bg-yellow-500/20 rounded">
                  <TrendingUp size={16} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Increase image usage</p>
                  <p className="text-gray-400 text-xs">Only {((imagePosts.length / posts.length) * 100).toFixed(0)}% of posts have images. Visual content typically performs better.</p>
                </div>
              </div>
            )}
            {successRate < 50 && posts.length > 5 && (
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="p-1 bg-orange-500/20 rounded">
                  <Target size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Low publish rate</p>
                  <p className="text-gray-400 text-xs">Most posts are still drafts. Consider enabling auto-publish or remind users to publish.</p>
                </div>
              </div>
            )}
            {monthlyRevenue > totalSpending && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="p-1 bg-green-500/20 rounded">
                  <DollarSign size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Profitable operations</p>
                  <p className="text-gray-400 text-xs">Revenue exceeds API costs by ${(monthlyRevenue - totalSpending).toFixed(2)}. Consider investing in growth.</p>
                </div>
              </div>
            )}
            {posts.length === 0 && (
              <p className="text-gray-500 text-sm">Generate some posts to see insights and recommendations.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
