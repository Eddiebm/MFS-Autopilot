import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { Sparkles, ArrowLeft } from 'lucide-react';

const platforms = ['X', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Bluesky'];

export function PostGenerator() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [brandName, setBrandName] = useState('');
  const [platform, setPlatform] = useState('X');
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!campaignId) return;
      const { data: camp } = await supabase.from('mfs_campaigns').select('*').eq('id', campaignId).single();
      setCampaign(camp);

      const { data: postData } = await supabase.from('mfs_posts').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false });
      setPosts(postData || []);
    }
    load();
  }, [campaignId]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!brandName || !campaign) return;

    setGenerating(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-post', {
        body: {
          brandName,
          platform,
          objective: campaign.objective,
          campaignId: campaign.id,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error.message);

      if (data?.data) {
        setPosts([data.data, ...posts]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate post');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/campaigns')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={18} />
          Back to Campaigns
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">AI Post Generator</h1>
        <p className="text-gray-400 mb-8">Campaign: {campaign?.objective || 'Loading...'}</p>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={generating}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Sparkles size={18} />
              {generating ? 'Generating...' : 'Generate Post'}
            </button>
          </form>
        </div>

        <h2 className="text-lg font-semibold text-white mb-4">Generated Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet. Generate your first post above.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">{post.platform}</span>
                  <span className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <p className="text-white whitespace-pre-wrap">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
