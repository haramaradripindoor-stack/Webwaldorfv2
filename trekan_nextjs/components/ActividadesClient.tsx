'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { MarkdownPost } from '@/lib/markdown'
import { motion, AnimatePresence } from 'framer-motion'

export default function ActividadesClient({ actividades }: { actividades: MarkdownPost[] }) {
  const [activeTab, setActiveTab] = useState('Todos')

  const monthMap: Record<string, string> = {
    'ene': 'Enero', 'feb': 'Febrero', 'mar': 'Marzo', 'abr': 'Abril',
    'may': 'Mayo', 'jun': 'Junio', 'jul': 'Julio', 'ago': 'Agosto',
    'sep': 'Septiembre', 'oct': 'Octubre', 'nov': 'Noviembre', 'dic': 'Diciembre'
  }

  // Agrupar actividades por Mes
  const groupedActividades = actividades.reduce((acc, post) => {
    let rawMonth = (post.mes || 'Próximamente').toLowerCase().trim()
    let monthKey = monthMap[rawMonth] || (rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1))

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(post);
    return acc;
  }, {} as Record<string, MarkdownPost[]>)

  // Orden cronológico de meses escolares
  const monthOrder = [
    'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'
  ]

  const availableMonths = monthOrder.filter(m => groupedActividades[m])
  // Añadir cualquier mes raro o "Próximamente" al final
  Object.keys(groupedActividades).forEach(k => {
    if (!availableMonths.includes(k)) availableMonths.push(k);
  })

  const tabs = ['Todos', ...availableMonths]

  return (
    <div className="w-full">
      {/* Pestañas de Navegación */}
      <div className="flex flex-wrap gap-2 mb-12 border-b border-[var(--color-waldorf-sage)]/20 pb-6 justify-center md:justify-start">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[var(--color-waldorf-moss)] text-white shadow-md' 
                : 'bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-text-light)] hover:border-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-moss)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido (Actividades) */}
      <div className="space-y-16">
        <AnimatePresence mode="popLayout">
          {availableMonths.map(month => {
            if (activeTab !== 'Todos' && activeTab !== month) return null;
            
            const posts = groupedActividades[month] || [];
            if (posts.length === 0) return null;

            return (
              <motion.section 
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="border-b-2 border-[var(--color-waldorf-sage)]/20 pb-2 mb-8">
                  <h2 className="text-3xl font-bold font-serif text-[var(--color-waldorf-moss)]">{month}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: MarkdownPost) => {
                    const isCelebracion = post.tipo?.toLowerCase() === 'celebracion' || post.tipo?.toLowerCase() === 'celebración';
                    // Extraer día y mes abreviado de la fecha
                    let postDay = post.dia || '00';
                    let postMonthAbbr = post.mes || month.substring(0, 3).toUpperCase();

                    return (
                      <article 
                        key={post.id} 
                        className="bg-white rounded-2xl border border-[var(--color-waldorf-sage)]/20 p-6 flex gap-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 earth-shadow group"
                      >
                        {/* Bloque de Fecha estilo Tarjeta */}
                        <div className="bg-[#c6a382] group-hover:bg-[var(--color-waldorf-terracotta)] transition-colors rounded-xl flex flex-col items-center justify-center p-3 w-16 h-20 text-white shrink-0 shadow-sm">
                          <span className="text-2xl font-bold font-serif leading-none">{postDay}</span>
                          <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-90">{postMonthAbbr}</span>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                          <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase w-fit mb-2">
                            {post.tipo || 'ACTIVIDAD'}
                          </span>
                          
                          <h3 className="text-lg font-bold font-serif text-[var(--color-waldorf-moss)] mb-2 leading-tight group-hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-gray-100">
                            {post.lugar && (
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                                <MapPin size={12} />
                                {post.lugar}
                              </div>
                            )}
                            {post.hora && (
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                                <Clock size={12} />
                                {post.hora}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </motion.section>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
