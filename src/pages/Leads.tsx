import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { Users, Mail } from 'lucide-react';

export function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const { data } = await supabase
        .from('mfs_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      setLeads(data || []);
      setLoading(false);
    }
    loadLeads();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Leads</h1>

        {loading ? (
          <p className="text-gray-400">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
            <Users size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No leads yet</h2>
            <p className="text-gray-400">Leads captured from your campaigns will appear here.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Source</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#2a2a2a] last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <Mail size={16} className="text-white" />
                        </div>
                        <span className="text-white">{lead.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{lead.source || '-'}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
