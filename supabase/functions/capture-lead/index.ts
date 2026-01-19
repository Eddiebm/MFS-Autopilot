Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, source, tenantId } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Get default tenant if not provided
    let tid = tenantId;
    if (!tid) {
      const tenantsRes = await fetch(`${supabaseUrl}/rest/v1/mfs_tenants?limit=1`, {
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
        },
      });
      const tenants = await tenantsRes.json();
      tid = tenants?.[0]?.id || null;
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/mfs_leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        email: email,
        source: source || 'capture_form',
        tenant_id: tid,
      }),
    });

    if (!insertResponse.ok) {
      const err = await insertResponse.text();
      throw new Error(`Failed to save lead: ${err}`);
    }

    const leadData = await insertResponse.json();

    return new Response(JSON.stringify({ data: leadData[0], success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
