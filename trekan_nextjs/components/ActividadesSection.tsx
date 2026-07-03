import { getMarkdownPosts, MarkdownPost } from '@/lib/markdown'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

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

  // Agrupar actividades por mes
  const actividadesPorMes = allActividades.reduce((acc, curr) => {
    const mes = curr.mes?.toUpperCase() || 'OTROS'
    if (!acc[mes]) {
      acc[mes] = []
    }
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

          <div className="flex flex-col gap-16">
            {Object.entries(actividadesPorMes).slice(0, 1).map(([mes, actividades]) => (
              <div key={mes}>
                <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-8 border-b border-[var(--color-waldorf-sage)]/20 pb-4 inline-block w-full">
                  Próximas en {mes}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(actividades as any[]).map((post: any) => {
                    const isCelebracion = post.tipo?.toLowerCase() === 'celebracion' || post.tipo?.toLowerCase() === 'celebración';
                    const tagColor = isCelebracion ? 'bg-[var(--color-waldorf-sage)]/20 text-[var(--color-waldorf-moss)]' : 'bg-purple-100 text-purple-700';
                    const dateBlockBg = isCelebracion ? 'bg-[var(--color-waldorf-moss)]' : 'bg-[#c6a382]';

                    return (
                      <article 
                        key={post.id} 
                        className="flex bg-white rounded-2xl overflow-hidden border border-[var(--color-waldorf-sage)]/10 earth-shadow hover:-translate-y-1 transition-transform duration-300"
                      >
                        <div className={`${dateBlockBg} flex flex-col items-center justify-center p-6 text-white min-w-[100px]`}>
                          <span className="text-3xl font-bold font-serif leading-none mb-1">{post.dia || '00'}</span>
                          <span className="text-xs font-bold tracking-widest uppercase">{post.mes || 'MES'}</span>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 w-fit ${tagColor}`}>
                            {post.tipo || 'ACTIVIDAD'}
                          </span>
                          
                          <h4 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-3 leading-tight">
                            {post.title}
                          </h4>
                          
                          <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
                            {post.lugar && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <MapPin size={14} />
                                {post.lugar}
                              </div>
                            )}
                            {post.hora && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <Clock size={14} />
                                {post.hora}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
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
