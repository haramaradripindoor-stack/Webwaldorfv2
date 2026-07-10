import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Único cliente de base de datos para el navegador (sincroniza sesión con cookies para el middleware)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
