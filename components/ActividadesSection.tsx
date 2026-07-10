import { getMarkdownPosts, MarkdownPost } from '@/lib/markdown'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import ActividadRow from './ActividadRow'

export const revalidate = 0; // Para que actualice siempre que haya cambios en BD

export default async function ActividadesSection() {
  const supabase = createClient();
  let allActividades: any[] = [];
  
  try {
    const { data, error } = await supabase
      .from('actividades')
      .select('*')
      .order('published_at', { ascending: true });
      
    if (data && !error && data.length > 0) {
      allActividades = data;
    } else {
      allActividades = getMarkdownPosts('_actividades').sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
    }
  } catch (e) {
    allActividades = getMarkdownPosts('_actividades').sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
  }

  // Filtrar actividades pasadas (mantener desde el inicio del mes actual en adelante)
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const upcomingActividades = allActividades.filter(post => {
    const postDate = new Date(post.published_at || post.date)
    return postDate >= currentMonthStart
  })

  // Agrupar actividades futuras por mes
  const actividadesPorMes = upcomingActividades.reduce((acc, curr) => {
    const mes = curr.mes?.toUpperCase() || 'OTROS'
    if (!acc[mes]) {
      acc[mes] = []
    }
    acc[mes].push(curr)
    return acc
  }, {} as Record<string, any[]>)
  
  // Si no hay actividades futuras, podemos mostrar el último mes disponible como fallback
  const mesesAgrupados = Object.keys(actividadesPorMes).length > 0 
    ? actividadesPorMes 
    : allActividades.slice(-4).reduce((acc, curr) => {
        const mes = curr.mes?.toUpperCase() || 'OTROS'
        if (!acc[mes]) acc[mes] = []
        acc[mes].push(curr)
        return acc
      }, {} as Record<string, any[]>)

  return (
    <section id="actividades" className="py-24 px-6 md:px-12 bg-[var(--color-waldorf-cream)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 mb-6">
                <Calendar className="text-[var(--color-waldorf-moss)]" size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">
                Calendario de Actividades
              </h2>
              <p className="text-[var(--color-waldorf-text-light)] font-medium text-lg">
                Momentos importantes para nuestra comunidad. ¡Te esperamos!
              </p>
            </div>
            
            <a 
              href="/actividades" 
              className="px-6 py-3 rounded-full bg-white text-[var(--color-waldorf-moss)] font-bold text-sm hover:bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20 earth-shadow transition-colors interactive flex items-center gap-2 group whitespace-nowrap"
            >
              Ver calendario completo
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col border-t border-[var(--color-waldorf-sage)]/20 mt-12">
            {Object.entries(mesesAgrupados).slice(0, 1).map(([mes, actividades]) => (
              <div key={mes} className="w-full">
                <h3 className="text-sm font-bold font-mono tracking-widest text-[var(--color-waldorf-terracotta)] uppercase py-8">
                  Próximas en {mes}
                </h3>
                
                <div className="flex flex-col w-full">
                  {(actividades as any[]).map((post: any, i: number) => {
                    const isCelebracion = post.tipo?.toLowerCase() === 'celebracion' || post.tipo?.toLowerCase() === 'celebración';
                    const tagColor = isCelebracion ? 'text-[var(--color-waldorf-moss)]' : 'text-[var(--color-waldorf-terracotta)]';
                    // We'll use a placeholder beautiful image based on index for the hover reveal
                    const fallbackImages = ['/images/fiesta de la luz20261.jpg', '/images/actividapedagogicahumedales1.jpg', '/images/paseocerro20261.jpg', '/images/comisionobraymantencion2.webp', '/images/photo_2025-06-11_11-43-23.jpg'];
                    const hoverImg = post.image_url || post.image || fallbackImages[i % fallbackImages.length];

                    return (
                      <ActividadRow 
                        key={post.id}
                        post={post}
                        isCelebracion={isCelebracion}
                        tagColor={tagColor}
                        hoverImg={hoverImg}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    )
}
