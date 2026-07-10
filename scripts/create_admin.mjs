import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'administracion@colegiowaldorftrekan.cl';
  const password = 'Fviva*2026';
  
  console.log('Creando usuario administrador...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (error) {
    console.error('Error al crear usuario:', error.message);
  } else {
    console.log('¡Usuario creado con éxito!');
    console.log('Email:', email);
    console.log('Contraseña:', password);
  }
}

run();
