'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico primero');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('¡Revisa tu bandeja de entrada! Te hemos enviado un link para restablecer la contraseña.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-waldorf-dark)] text-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[var(--color-waldorf-moss)] rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-[var(--color-waldorf-terracota)]" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-center">Panel Administrativo</h1>
          <p className="text-white/70 mt-2 text-center">Colegio Waldorf Trekan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/90">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-waldorf-terracota)] text-white"
              placeholder="admin@colegiowaldorftrekan.cl"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white/90">Contraseña</label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-[var(--color-waldorf-terracota)] hover:text-white transition-colors underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-waldorf-terracota)] text-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`p-3 border rounded-lg text-sm text-center ${error.includes('Revisa tu bandeja') ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200'}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-waldorf-terracota)] hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
