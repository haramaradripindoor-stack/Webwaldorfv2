require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const { data, error } = await supabase.from('email_campaigns').select('*').eq('status', 'sending');
  console.log("Stuck campaigns:", data);
  
  if (data) {
    for (const camp of data) {
      const { error: updErr } = await supabase.from('email_campaigns').update({
        status: 'sent',
        sent_count: 61 // Hardcoded based on the UI banner they saw
      }).eq('id', camp.id);
      console.log("Updated", camp.id, "Error:", updErr);
    }
  }
}
fix();
