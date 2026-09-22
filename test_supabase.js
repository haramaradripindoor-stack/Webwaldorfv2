require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('email_campaigns').select('*').limit(1);
  console.log("DATA:", data);
  console.log("ERROR:", error);

  // Let's test the update explicitly!
  if (data && data.length > 0) {
    const { error: updateError } = await supabase.from('email_campaigns').update({
      status: 'sent',
      sent_at: new Date().toISOString()
    }).eq('id', data[0].id);
    console.log("UPDATE ERROR:", updateError);
  }
}
check();
