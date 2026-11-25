'use client'

import { useState, useEffect, useRef } from 'react'
import { Instagram, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { FALLBACK_POSTS, InstagramPost } from '@/config/instagram'

export default function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Drag state
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const [isGrabbing, setIsGrabbing] = useState(false)
  const hasMovedRef = useRef(false)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    async function loadLivePosts() {
      try {
        const res = await fetch('/api/instagram')
        if (!res.ok) return
        const data = await res.json()
        if (isMounted && data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts)
        }
      } catch {
        // Keeps fallback posts on network error
      }
    }
    loadLivePosts()
    return () => { isMounted = false }
  }, [])

  // Auto-scroll ticker continuo que se pausa automáticamente al interactuar
  useEffect(() => {
    let animId: number
    const el = containerRef.current
    if (!el) return

    const tick = () => {
      if (!isDraggingRef.current && !isHoveredRef.current && el) {
        el.scrollLeft += 0.75
        // Loop infinito suave: si pasa la mitad del contenido duplicado, vuelve al inicio
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Controladores de arrastre con mouse (Click & Drag horizontal)
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    isDraggingRef.current = true
    hasMovedRef.current = false
    setIsGrabbing(true)
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const el = containerRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * 1.5 // Multiplicador de fluidez táctil
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true
    }
    el.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
    setIsGrabbing(false)
  }

  const scrollByAmount = (amount: number) => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  // Prevenir click accidental si el usuario estaba arrastrando
  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <section className="py-24 px-6 md:px-12 bg-[#FAF8F5] relative overflow-hidden border-t border-[var(--color-waldorf-sage)]/15">
      
      {/* Organic background glow */}
      <div 
        aria-hidden="true"
        className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[var(--color-waldorf-cream)] rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" 
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-[#E8EFEA]/60 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] flex items-center justify-center md:justify-start gap-3 tracking-tight">
              <Instagram size={36} className="text-[var(--color-waldorf-terracotta)]" />
              Comunidad Activa
            </h2>
            <p className="text-[var(--color-waldorf-text-light)] text-base mt-2 font-medium max-w-xl">
              Sigue el día a día de nuestros caminantes en Parque Ivian, Puerto Varas a través de{' '}
              <a 
                href="https://www.instagram.com/waldorftrekanpv/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-waldorf-moss)] font-bold underline decoration-[var(--color-waldorf-terracotta)]/40 hover:decoration-[var(--color-waldorf-terracotta)] transition-colors"
              >
                @waldorftrekanpv
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Controles de navegación manual para desktop */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                onClick={() => scrollByAmount(-350)}
                aria-label="Desplazar a la izquierda"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[var(--color-waldorf-moss)] border border-[var(--color-waldorf-sage)]/30 flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollByAmount(350)}
                aria-label="Desplazar a la derecha"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[var(--color-waldorf-moss)] border border-[var(--color-waldorf-sage)]/30 flex items-center justify-center shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <a 
              href="https://www.instagram.com/waldorftrekanpv/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group px-7 py-3.5 rounded-full bg-[var(--color-waldorf-moss)] text-[#F7F4EE] font-serif font-semibold text-sm hover:bg-[#122118] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Instagram size={18} className="text-[#EBBA7A]" />
              <span>Seguir en Instagram</span>
              <ArrowUpRight size={16} className="text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Vitrina Horizontal interactiva con Drag del Mouse & Touch Swipe */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            isHoveredRef.current = false
            handleMouseUpOrLeave()
          }}
          onMouseEnter={() => { isHoveredRef.current = true }}
          className={`relative w-full overflow-x-auto scrollbar-none flex pt-2 pb-8 -mx-6 md:-mx-12 px-6 md:px-12 select-none ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollBehavior: isDraggingRef.current ? 'auto' : 'smooth' }}
        >
          <div className="flex gap-5 md:gap-7 w-max">
            {/* Duplicamos los 8 posts para scroll infinito y navegación fluida */}
            {[...posts, ...posts].map((post, i) => (
              <a
                key={`${post.id}-${i}`}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                draggable={false}
                className="group relative w-72 md:w-84 aspect-square rounded-[28px] overflow-hidden bg-white/40 border border-[var(--color-waldorf-sage)]/20 shadow-md hover:shadow-2xl transition-all duration-500 flex-shrink-0"
              >
                <Image
                  src={post.img}
                  alt={post.caption || 'Publicación Colegio Waldorf Trekan'}
                  fill
                  draggable={false}
                  className="object-cover transition-transform duration-700 group-hover:scale-108 pointer-events-none"
                  sizes="(max-width: 768px) 288px, 336px"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                {/* Tag pill top */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#FAF8F5]/90 text-[var(--color-waldorf-moss)] backdrop-blur-md shadow-xs border border-white/40">
                    {post.tag || 'Trekan'}
                  </span>
                </div>

                {/* Bottom caption and Instagram badge */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10 flex flex-col justify-end pointer-events-none">
                  <p className="text-xs font-sans text-[#F7F4EE] line-clamp-2 leading-relaxed opacity-95 group-hover:opacity-100 transition-opacity">
                    {post.caption}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/20 text-[11px] font-mono text-[#EBBA7A]">
                    <span className="flex items-center gap-1.5">
                      <Instagram size={13} />
                      @waldorftrekanpv
                    </span>
                    <span className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                      Ver post <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>

                {/* Hover overlay glow */}
                <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
