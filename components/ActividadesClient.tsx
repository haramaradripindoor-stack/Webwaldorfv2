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

  // Agrupar actividades por Año y Mes
  const groupedActividades = actividades.reduce((acc, post) => {
    let rawMonth = (post.mes || 'Próximamente').toLowerCase().trim()
    let monthKey = monthMap[rawMonth] || (rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1))
    let yearKey = post.anio || '2026'
    
    let groupKey = `${monthKey} ${yearKey}`

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(post);
    return acc;
  }, {} as Record<string, MarkdownPost[]>)

  const monthIndex: Record<string, number> = {
    'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3,
    'Mayo': 4, 'Junio': 5, 'Julio': 6, 'Agosto': 7,
    'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
  }

  // Extraer las claves ordenadas chronológicamente
  const availableGroups = Object.keys(groupedActividades).sort((a, b) => {
    const [monthA, yearA] = a.split(' ')
    const [monthB, yearB] = b.split(' ')
    
    const numYearA = parseInt(yearA) || 0
    const numYearB = parseInt(yearB) || 0
    
    if (numYearA !== numYearB) {
      return numYearA - numYearB // Ascendente por año
    }
    
    const numMonthA = monthIndex[monthA] ?? 99
    const numMonthB = monthIndex[monthB] ?? 99
    
    return numMonthA - numMonthB // Ascendente por mes
  })
  const tabs = ['Todos', ...availableGroups]

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
          {availableGroups.map(group => {
            if (activeTab !== 'Todos' && activeTab !== group) return null;
            
            const posts = groupedActividades[group] || [];
            if (posts.length === 0) return null;

            return (
              <motion.section 
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="border-b-2 border-[var(--color-waldorf-sage)]/20 pb-2 mb-8">
                  <h2 className="text-3xl font-bold font-serif text-[var(--color-waldorf-moss)]">{group}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post: MarkdownPost, i: number) => {
                    const isCelebracion = post.tipo?.toLowerCase() === 'celebracion' || post.tipo?.toLowerCase() === 'celebración';
                    // Extraer día y mes abreviado de la fecha
                    let postDay = post.dia || '00';
                    let postMonthAbbr = post.mes || (post.published_at ? new Date(post.published_at).toLocaleString('es-CL', { month: 'short' }).replace('.', '').toUpperCase() : 'ACT');
                    
                    const borderRadiuses = ['2rem 3.5rem 1.5rem 2.5rem', '3.5rem 2rem 2.5rem 1.5rem', '1.5rem 2.5rem 2rem 3.5rem', '2.5rem 1.5rem 3.5rem 2rem'];

                    return (
                      <article 
                        key={post.id} 
                        className="bg-white p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-700 earth-shadow group relative overflow-hidden"
                        style={{ borderRadius: borderRadiuses[i % 4] }}
                      >
                        {/* Fecha */}
                        <div className="flex items-baseline gap-2 text-[#1a2e25] mb-6 border-b-2 border-[var(--color-waldorf-mustard)]/30 pb-4">
                          <span className="text-5xl font-serif font-bold leading-none">{postDay}</span>
                          <span className="text-lg font-serif italic text-[var(--color-waldorf-sage)] capitalize">{postMonthAbbr.toLowerCase()}</span>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                          <span className={`text-sm italic font-serif mb-3 ${isCelebracion ? 'text-[var(--color-waldorf-moss)]' : 'text-[var(--color-waldorf-terracotta)]'}`}>
                            ~ {post.tipo?.toLowerCase() || 'actividad'} ~
                          </span>
                          
                          <h3 className="text-2xl font-bold font-serif text-[#1a2e25] mb-4 leading-tight group-hover:text-[var(--color-waldorf-moss)] transition-colors duration-700">
                            {post.title}
                          </h3>
                          
                          <p className="text-[#1a2e25]/70 text-base leading-relaxed mb-8 flex-grow font-medium">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-[var(--color-waldorf-sage)]/20">
                            {post.lugar && (
                              <div className="flex items-center gap-3 text-sm text-[#1a2e25]/60 font-medium">
                                <MapPin size={16} strokeWidth={1.5} className="text-[var(--color-waldorf-moss)]" />
                                {post.lugar}
                              </div>
                            )}
                            {post.hora && (
                              <div className="flex items-center gap-3 text-sm text-[#1a2e25]/60 font-medium">
                                <Clock size={16} strokeWidth={1.5} className="text-[var(--color-waldorf-moss)]" />
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
