const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function reset() {
  const email = 'admision@colegiowaldorftrekan.cl';
  const newPassword = 'TrekanAdmin2026!';
  
  // 1. Try to find the user
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error('List error:', listError);
  
  let user = usersData.users.find(u => u.email === email);
  
  if (!user) {
    console.log(`User ${email} not found. Creating it...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true
    });
    if (createError) return console.error('Create error:', createError);
    console.log('Created user with password:', newPassword);
  } else {
    console.log(`User ${email} found. Updating password...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });
    if (updateError) return console.error('Update error:', updateError);
    console.log('Updated password to:', newPassword);
  }
}
reset();
