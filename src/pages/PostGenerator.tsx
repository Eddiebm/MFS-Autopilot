import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowLeft, Copy, Check, Send, Image, Loader2, Lightbulb, DollarSign } from 'lucide-react';

const platforms = ['X', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Bluesky'];
const aiProviders = [
  { id: 'openai', name: 'OpenAI (GPT-4o)' },
  { id: 'anthropic', name: 'Anthropic (Claude)' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'google', name: 'Google (Gemini)' },
  { id: 'groq', name: 'Groq (Fast)' },
];

export function PostGenerator() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [brandName, setBrandName] = useState('');
  const [platform, setPlatform] = useState('X');
  const [aiProvider, setAiProvider] = useState('openai');
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [blueskyConnection, setBlueskyConnection] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [generateImage, setGenerateImage] = useState(false);

  useEffect(() => {
    async function load() {
      if (!campaignId) return;
      const { data: camp } = await supabase.from('mfs_campaigns').select('*').eq('id', campaignId).single();
      setCampaign(camp);
      if (camp?.details?.brandName) {
        setBrandName(camp.details.brandName);
      }

      const { data: postData } = await supabase.from('mfs_posts').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false });
      setPosts(postData || []);

      // Load Bluesky connection
      if (user) {
        const { data: conn } = await supabase
          .from('mfs_platform_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'bluesky')
          .maybeSingle();
        setBlueskyConnection(conn);
      }
    }
    load();
  }, [campaignId, user]);

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
          provider: aiProvider,
          generateImage,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error.message);

      if (data?.data) {
        setPosts([data.data, ...posts]);
      }
    } catch (err: any) {
      // Parse error for user-friendly messages
      const msg = err.message || '';
      if (msg.includes('429') || msg.toLowerCase().includes('rate limit')) {
        setError('API rate limit reached. Please wait a moment and try again.');
      } else if (msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('unauthorized')) {
        setError('API key issue. Check your API settings and try again.');
      } else if (msg.includes('500') || msg.toLowerCase().includes('server error')) {
        setError('Server error. Please try again in a few moments.');
      } else if (msg.includes('non-2xx')) {
        setError('Generation failed. Please check your settings and try again.');
      } else {
        setError(msg || 'Failed to generate post');
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy(content: string, postId: number) {
    navigator.clipboard.writeText(content);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handlePublishBluesky(post: any) {
    if (!blueskyConnection) {
      setToast('Connect Bluesky in Settings first');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    setPublishingId(post.id);
    try {
      const { data, error } = await supabase.functions.invoke('publish-bluesky', {
        body: {
          postId: post.id,
          content: post.content,
          handle: blueskyConnection.handle,
          appPassword: blueskyConnection.credentials?.appPassword,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      // Update local state
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: 'published' } : p));
      setToast('Posted to Bluesky successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err: any) {
      setToast(err.message || 'Failed to publish');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setPublishingId(null);
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
        <p className="text-gray-400 mb-8">Campaign: {campaign?.name || campaign?.objective || 'Loading...'}</p>

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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-gray-400 text-sm mb-2">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white"
                >
                  {aiProviders.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0e0e0e]"
              />
              <label htmlFor="generateImage" className="text-gray-400 text-sm flex items-center gap-2">
                <Image size={16} />
                Generate image with post (Pro/Agency)
              </label>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={generating}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating your post...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Post
                </>
              )}
            </button>
          </form>
        </div>

        <h2 className="text-lg font-semibold text-white mb-4">Generated Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Ready to create your first post?</h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              Enter your brand name above and click Generate. Our AI will craft a platform-optimized post tailored to your campaign goals.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full">Tip: Try different AI providers</span>
              <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full">Tip: Enable image generation for visual posts</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">{post.platform}</span>
                    <span className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleString()}</span>
                    {post.status === 'published' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Published</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(post.content, post.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20"
                    >
                      {copiedId === post.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === post.id ? 'Copied' : 'Copy'}
                    </button>
                    {post.platform === 'Bluesky' && post.status !== 'published' && (
                      <button
                        onClick={() => handlePublishBluesky(post)}
                        disabled={publishingId === post.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0085FF] text-white text-sm rounded-lg hover:bg-[#0070E0] disabled:opacity-50"
                      >
                        <Send size={14} />
                        {publishingId === post.id ? 'Publishing...' : 'Publish'}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-white whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <img src={post.image_url} alt="Generated" className="mt-4 rounded-lg max-w-full" />
                )}
              </div>
            ))}
          </div>
        )}
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
