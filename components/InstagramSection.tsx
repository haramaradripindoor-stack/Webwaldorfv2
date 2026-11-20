'use client'

import { useState, useEffect } from 'react'
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { FALLBACK_POSTS, InstagramPost } from '@/config/instagram'

export default function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS)

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
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-waldorf-terracotta)] font-bold flex items-center justify-center md:justify-start gap-1.5 mb-2">
              <Sparkles size={14} />
              Vida Comunitaria
            </span>
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

        {/* Marquee Carousel de Instagram */}
        <div className="relative w-full overflow-hidden flex pt-4 pb-10 -mx-6 md:-mx-12 px-6 md:px-12 mask-edges">
          <div className="flex gap-5 md:gap-7 w-max animate-marquee interactive">
            {/* Duplicamos los posts para el efecto marquee continuo */}
            {[...posts, ...posts].map((post, i) => (
              <a
                key={`${post.id}-${i}`}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-72 md:w-84 aspect-square rounded-[28px] overflow-hidden bg-white/40 border border-[var(--color-waldorf-sage)]/20 shadow-md hover:shadow-2xl transition-all duration-500 flex-shrink-0"
              >
                <Image
                  src={post.img}
                  alt={post.caption || 'Publicación Colegio Waldorf Trekan'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  sizes="(max-width: 768px) 288px, 336px"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Tag pill top */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#FAF8F5]/90 text-[var(--color-waldorf-moss)] backdrop-blur-md shadow-xs border border-white/40">
                    {post.tag || 'Trekan'}
                  </span>
                </div>

                {/* Bottom caption and Instagram badge */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10 flex flex-col justify-end">
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

        <style dangerouslySetInnerHTML={{__html: `
          .mask-edges {
            mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </div>
    </section>
  )
}
