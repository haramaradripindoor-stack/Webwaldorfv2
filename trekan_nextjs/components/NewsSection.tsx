'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { MarkdownPost } from '@/lib/markdown'
import Link from 'next/link'

// Este componente ahora es 'use client' para permitir el scroll horizontal interactivo
export default function NewsSection({ displayNews }: { displayNews: MarkdownPost[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  if (!displayNews || displayNews.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 420 : 320
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="comunidad" className="py-24 bg-[#F9F8F6] relative overflow-hidden">
      {/* Fondo orgánico */}
      <div className="absolute top-0 right-0 w-[50vw] h-[60vh] rounded-[100%] bg-gradient-to-bl from-[var(--color-waldorf-mustard)]/10 via-transparent to-transparent blur-[80px] pointer-events-none transform translate-x-1/4 -translate-y-1/4" />
      
      <div className="max-w-[1400px] mx-auto relative z-10 pl-6 md:pl-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between pr-6 md:pr-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)]">
              Comunidad Trekan
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4 hidden md:flex">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/30 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-sage)]/10 transition-colors cursor-none">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/30 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-sage)]/10 transition-colors cursor-none">
                <ArrowRight size={18} />
              </button>
            </div>
            <Link href="/noticias" className="text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors flex items-center gap-2 group interactive cursor-none bg-white px-6 py-3 rounded-full earth-shadow border border-[var(--color-waldorf-sage)]/20">
              Ver todo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Contenedor de Scroll Horizontal (Carousel) */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 pr-6 md:pr-12"
        >
          {displayNews.map((post: MarkdownPost) => {
            const hasVideo = !!post.video_id;
            const hasGallery = post.galeria && Array.isArray(post.galeria) && post.galeria.length > 1;

            return (
              <article 
                key={post.id}
                className="group flex flex-col bg-white rounded-xl overflow-hidden earth-shadow hover:shadow-xl transition-all duration-500 cursor-none flex-shrink-0 snap-start
                           w-[85vw] sm:w-[380px] md:w-[420px]"
              >
                {/* Text Content (Top) */}
                <Link href={`/noticias/${post.slug}`} className="p-8 md:p-10 pb-6 flex flex-col flex-grow">
                  <time className="text-[13px] font-medium text-[#8F8D8B] mb-5 block">
                    {post.fecha_display || new Date(post.published_at).toLocaleDateString('es-CL', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </time>
                  <h3 className="text-3xl md:text-[36px] font-bold font-serif text-[var(--color-waldorf-moss)] mb-5 leading-[1.15] group-hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#5A5755] text-[15px] leading-[1.7] mb-2 line-clamp-4">
                    {post.excerpt}
                  </p>
                </Link>
                
                {/* Media Content (Bottom with Padding inside the card) */}
                <div className="relative w-full px-8 md:px-10 pb-8 md:pb-10 mt-auto">
                  {hasVideo ? (
                    <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-black earth-shadow">
                      <iframe 
                        src={`https://www.youtube.com/embed/${post.video_id}?rel=0`} 
                        title="YouTube video player"
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : hasGallery ? (
                    <Link href={`/noticias/${post.slug}`}>
                      <div className="grid grid-cols-2 gap-3 h-[200px] group-hover:scale-[1.01] transition-transform duration-500">
                        <div className="relative w-full h-full rounded-[12px] overflow-hidden earth-shadow">
                          <Image src={post.galeria[0]} alt="Gallery 1" fill className="object-cover" />
                        </div>
                        <div className="relative w-full h-full rounded-[12px] overflow-hidden earth-shadow">
                          <Image src={post.galeria[1]} alt="Gallery 2" fill className="object-cover" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/noticias/${post.slug}`}>
                      <div className="relative w-full h-[200px] rounded-[12px] overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 earth-shadow">
                        <Image src={post.image_url || '/images/galeria3.webp'} alt={post.title} fill className="object-cover" />
                      </div>
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
          
          {/* Tarjeta final "Ver más" para rellenar el final del scroll */}
          <div className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] flex items-center justify-center p-8 snap-start">
             <Link href="/noticias" className="flex flex-col items-center gap-4 text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors group cursor-none interactive">
                <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={24} />
                </div>
                <span className="font-serif text-xl font-bold">Ver todas las crónicas</span>
             </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
