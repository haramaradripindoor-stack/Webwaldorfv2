import { createClient } from '@/utils/supabase/server'
import { Calendar } from 'lucide-react'
import ActividadesClient from '@/components/ActividadesClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata = {
  title: 'Calendario de Actividades | Colegio Waldorf Trekan',
  description: 'Revisa el calendario completo de nuestras próximas asambleas, festividades, y encuentros para padres.',
}

export const revalidate = 0; // Disable cache so it updates when admin saves

export default async function ActividadesPage() {
  const supabase = createClient();
  const { data: actividades } = await supabase
    .from('actividades')
    .select('*')
    .order('published_at', { ascending: false });

  const allActividades = actividades || [];

  return (
    <SmoothScroll>
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
    </SmoothScroll>
  )
}
