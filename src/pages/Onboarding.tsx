import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const goals = [
  { value: 'traffic', label: 'Get traffic' },
  { value: 'leads', label: 'Capture leads' },
  { value: 'sales', label: 'Sell products' },
  { value: 'authority', label: 'Build authority' },
];

export function Onboarding() {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGoal || !user) return;
    
    setLoading(true);
    
    // Create a tenant first
    const { data: tenant, error: tenantError } = await supabase
      .from('mfs_tenants')
      .insert({ brand_name: user.email?.split('@')[0] || 'My Brand' })
      .select()
      .single();
    
    if (tenantError) {
      console.error('Error creating tenant:', tenantError);
      setLoading(false);
      return;
    }

    // Create campaign with the objective
    const { error: campaignError } = await supabase
      .from('mfs_campaigns')
      .insert({ 
        tenant_id: tenant.id, 
        objective: selectedGoal,
        status: 'active'
      });
    
    if (campaignError) {
      console.error('Error creating campaign:', campaignError);
    }
    
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          What's your main goal?
        </h1>
        <p className="text-gray-400 text-center mb-8">
          We'll customize your autopilot accordingly
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
            required
          >
            <option value="" disabled>Select your goal...</option>
            {goals.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || !selectedGoal}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Activate Autopilot'}
          </button>
        </form>
      </div>
    </div>
  );
}
