const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('leads').select('*');
  if (error) {
    console.error("Error:", error);
  } else {
    fs.writeFileSync('leads_dump.json', JSON.stringify(data, null, 2));
    console.log("Dumped " + data.length + " leads.");
  }
}
check();
