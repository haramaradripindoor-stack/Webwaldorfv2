const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ebpioebxcyjpjgiqpjaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc'
);

async function check() {
  const { data: tables, error } = await supabase.from('prospectos_growth').select('*').limit(5);
  if (error) {
     console.log("Error:", error);
     // Try a different table name
     const { data: leads, error2 } = await supabase.from('leads_admision').select('*').limit(2);
     console.log("Leads Admision:", leads);
  } else {
     console.log("Prospectos:", tables);
  }
}
check();
