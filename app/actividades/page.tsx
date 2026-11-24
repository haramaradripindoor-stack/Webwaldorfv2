import { createPublicClient } from '@/utils/supabase/server'
import { Calendar } from 'lucide-react'
import ActividadesClient from '@/components/ActividadesClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.colegiowaldorftrekan.cl'),
  title: 'Calendario de Actividades | Colegio Waldorf Trekan',
  description: 'Revisa el calendario completo de nuestras próximas asambleas, festividades, y encuentros para padres.',
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/actividades',
  },
}

import { getMarkdownPosts } from '@/lib/markdown'

export const revalidate = 60;

export default async function ActividadesPage() {
  const supabase = createPublicClient();
  let actividades: any[] | null = null;
  try {
    const res = await Promise.race([
      supabase.from('actividades').select('*').order('published_at', { ascending: true }),
      new Promise<{ data: any }>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 600))
    ]);
    actividades = res.data;
  } catch (e) {
    // fallback
  }

  const allActividades = (actividades && actividades.length > 0)
    ? actividades 
    : getMarkdownPosts('_actividades').sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());

  return (
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] pt-32 pb-24 relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="mb-16 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 mb-6 earth-shadow">
              <Calendar className="text-[var(--color-waldorf-moss)]" size={28} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">
              Calendario Escolar
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] text-lg md:text-xl">
              Próximos eventos, celebraciones de estación y reuniones importantes organizadas por mes.
            </p>
          </header>

          {allActividades.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--color-waldorf-text-light)] text-lg">No hay actividades registradas en este momento.</p>
            </div>
          ) : (
            <ActividadesClient actividades={allActividades} />
          )}
        </div>
        <Footer />
      </main>
  )
}
