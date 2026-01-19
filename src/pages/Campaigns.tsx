import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { Megaphone, Plus, X, Sparkles, ChevronRight, ChevronLeft, Pencil, Trash2, Copy, ArrowRight } from 'lucide-react';

const industries = ['Real Estate', 'E-commerce', 'SaaS', 'Coaching', 'Agency', 'Other'];
const objectives = [
  { value: 'traffic', label: 'Get traffic' },
  { value: 'leads', label: 'Capture leads' },
  { value: 'sales', label: 'Sell products' },
  { value: 'authority', label: 'Build authority' },
];
const tones = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational', 'Provocative'];
const platformOptions = ['X/Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Bluesky'];
const frequencies = ['Daily', '3x/week', 'Weekly'];
const durations = ['1 week', '2 weeks', '1 month', '3 months'];

const initialForm = {
  name: '',
  brandName: '',
  industry: '',
  objective: '',
  targetAudience: '',
  toneOfVoice: [] as string[],
  platforms: [] as string[],
  keyMessages: '',
  callToAction: '',
  contentThemes: '',
  postingFrequency: '',
  campaignDuration: '',
};

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function loadCampaigns() {
    const { data } = await supabase.from('mfs_campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  }

  useEffect(() => { loadCampaigns(); }, []);

  function updateForm(field: string, value: any) {
    setForm({ ...form, [field]: value });
  }

  function toggleArrayField(field: 'toneOfVoice' | 'platforms', value: string) {
    const arr = form[field];
    if (arr.includes(value)) {
      updateForm(field, arr.filter((v: string) => v !== value));
    } else {
      updateForm(field, [...arr, value]);
    }
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setStep(1);
    setForm(initialForm);
  }

  function openEdit(campaign: any) {
    const d = campaign.details || {};
    setForm({
      name: campaign.name || '',
      brandName: d.brandName || '',
      industry: d.industry || '',
      objective: campaign.objective || '',
      targetAudience: d.targetAudience || '',
      toneOfVoice: d.toneOfVoice || [],
      platforms: d.platforms || [],
      keyMessages: d.keyMessages || '',
      callToAction: d.callToAction || '',
      contentThemes: d.contentThemes || '',
      postingFrequency: d.postingFrequency || '',
      campaignDuration: d.campaignDuration || '',
    });
    setEditingId(campaign.id);
    setStep(1);
    setShowModal(true);
  }

  async function handleDuplicate(campaign: any) {
    const d = campaign.details || {};
    await supabase.from('mfs_campaigns').insert({
      tenant_id: campaign.tenant_id,
      name: `${campaign.name || campaign.objective} (Copy)`,
      objective: campaign.objective,
      details: d,
      status: 'paused',
    });
    loadCampaigns();
  }

  async function handleDelete(id: string) {
    await supabase.from('mfs_campaigns').delete().eq('id', id);
    setDeleteConfirm(null);
    loadCampaigns();
  }

  async function toggleStatus(campaign: any) {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await supabase.from('mfs_campaigns').update({ status: newStatus }).eq('id', campaign.id);
    loadCampaigns();
  }

  async function handleSave() {
    if (!form.name || !form.objective) return;
    setSaving(true);

    const details = {
      brandName: form.brandName,
      industry: form.industry,
      targetAudience: form.targetAudience,
      toneOfVoice: form.toneOfVoice,
      platforms: form.platforms,
      keyMessages: form.keyMessages,
      callToAction: form.callToAction,
      contentThemes: form.contentThemes,
      postingFrequency: form.postingFrequency,
      campaignDuration: form.campaignDuration,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('mfs_campaigns').update({
          name: form.name,
          objective: form.objective,
          details: details,
        }).eq('id', editingId);
        if (error) {
          console.error('Update error:', error);
          alert(`Failed to update: ${error.message}`);
          setSaving(false);
          return;
        }
      } else {
        const { data: tenants } = await supabase.from('mfs_tenants').select('id').limit(1);
        let tenantId = tenants?.[0]?.id;
        if (!tenantId) {
          const { data: newTenant, error: tenantError } = await supabase.from('mfs_tenants').insert({ brand_name: form.brandName || 'My Brand' }).select().single();
          if (tenantError) {
            console.error('Tenant error:', tenantError);
            alert(`Failed to create tenant: ${tenantError.message}`);
            setSaving(false);
            return;
          }
          tenantId = newTenant?.id;
        }
        const { error } = await supabase.from('mfs_campaigns').insert({
          tenant_id: tenantId,
          name: form.name,
          objective: form.objective,
          details: details,
          status: 'active',
        });
        if (error) {
          console.error('Insert error:', error);
          alert(`Failed to create campaign: ${error.message}`);
          setSaving(false);
          return;
        }
      }

      closeModal();
      loadCampaigns();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white";
  const labelClass = "block text-[#e0e0e0] text-sm mb-2";

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Plus size={18} />
            New Campaign
          </button>
        </div>

        {loading ? (
          <p className="text-[#e0e0e0]">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
            <Megaphone size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No campaigns yet</h2>
            <p className="text-[#e0e0e0] mb-6">Create your first campaign to start automating your marketing.</p>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200">
              <Plus size={18} />
              Create Your First Campaign
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Megaphone size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{campaign.name || campaign.objective}</h3>
                      <p className="text-[#e0e0e0] text-sm capitalize">{campaign.objective} • {new Date(campaign.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(campaign)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      }`}
                    >
                      {campaign.status === 'active' ? 'Active' : 'Paused'}
                    </button>
                    <Link to={`/generate/${campaign.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20">
                      <Sparkles size={14} />
                      Generate
                    </Link>
                    <button onClick={() => openEdit(campaign)} className="p-1.5 text-[#e0e0e0] hover:text-white hover:bg-white/10 rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDuplicate(campaign)} className="p-1.5 text-[#e0e0e0] hover:text-white hover:bg-white/10 rounded-lg">
                      <Copy size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(campaign.id)} className="p-1.5 text-[#e0e0e0] hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Campaign?</h3>
            <p className="text-[#e0e0e0] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-[#2a2a2a] text-white rounded-lg hover:bg-white/5">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{editingId ? 'Edit Campaign' : 'New Campaign'}</h2>
                <p className="text-[#e0e0e0] text-sm">Step {step} of 3</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                  <div>
                    <label className={labelClass}>Campaign Name *</label>
                    <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g., Q1 Product Launch" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Brand/Business Name *</label>
                    <input type="text" value={form.brandName} onChange={(e) => updateForm('brandName', e.target.value)} placeholder="Your brand name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Industry/Niche</label>
                    <select value={form.industry} onChange={(e) => updateForm('industry', e.target.value)} className={inputClass}>
                      <option value="">Select industry...</option>
                      {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Campaign Objective *</label>
                    <select value={form.objective} onChange={(e) => updateForm('objective', e.target.value)} className={inputClass}>
                      <option value="">Select objective...</option>
                      {objectives.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Audience & Messaging</h3>
                  <div>
                    <label className={labelClass}>Target Audience</label>
                    <textarea value={form.targetAudience} onChange={(e) => updateForm('targetAudience', e.target.value)} placeholder="Who are you trying to reach?" rows={3} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Tone of Voice</label>
                    <div className="flex flex-wrap gap-2">
                      {tones.map((tone) => (
                        <button key={tone} type="button" onClick={() => toggleArrayField('toneOfVoice', tone)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${form.toneOfVoice.includes(tone) ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Key Messages</label>
                    <textarea value={form.keyMessages} onChange={(e) => updateForm('keyMessages', e.target.value)} placeholder="What key points should posts include?" rows={3} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Call to Action</label>
                    <input type="text" value={form.callToAction} onChange={(e) => updateForm('callToAction', e.target.value)} placeholder="What action do you want audience to take?" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Content Themes</label>
                    <textarea value={form.contentThemes} onChange={(e) => updateForm('contentThemes', e.target.value)} placeholder="Topics/themes to cover" rows={2} className={inputClass} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Platforms & Schedule</h3>
                  <div>
                    <label className={labelClass}>Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map((p) => (
                        <button key={p} type="button" onClick={() => toggleArrayField('platforms', p)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${form.platforms.includes(p) ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Posting Frequency</label>
                    <select value={form.postingFrequency} onChange={(e) => updateForm('postingFrequency', e.target.value)} className={inputClass}>
                      <option value="">Select frequency...</option>
                      {frequencies.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Campaign Duration</label>
                    <select value={form.campaignDuration} onChange={(e) => updateForm('campaignDuration', e.target.value)} className={inputClass}>
                      <option value="">Select duration...</option>
                      {durations.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="mt-6 p-4 bg-[#0e0e0e] rounded-lg border border-[#2a2a2a]">
                    <h4 className="text-white font-medium mb-3">Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-[#e0e0e0]">Name:</p><p className="text-white">{form.name || '-'}</p>
                      <p className="text-[#e0e0e0]">Brand:</p><p className="text-white">{form.brandName || '-'}</p>
                      <p className="text-[#e0e0e0]">Objective:</p><p className="text-white capitalize">{form.objective || '-'}</p>
                      <p className="text-[#e0e0e0]">Platforms:</p><p className="text-white">{form.platforms.join(', ') || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-[#2a2a2a] p-6 flex justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] text-white rounded-lg hover:bg-white/5">
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} disabled={step === 1 && (!form.name || !form.objective)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50">
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving || !form.name || !form.objective}
                  className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Campaign'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
