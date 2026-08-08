'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'
import Image from 'next/image'
import { MarkdownPost } from '@/lib/markdown'

interface ActividadRowProps {
  post: MarkdownPost;
  isCelebracion: boolean;
  tagColor: string;
  hoverImg: string;
}

export default function ActividadRow({ post, isCelebracion, tagColor, hoverImg }: ActividadRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (isCelebracion && videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isHovered, isCelebracion])

  return (
    <a 
      href={`/actividades`}
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-8 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Organic Reveal (Permanent on mobile, Hover on desktop) */}
      <div 
        className="absolute z-0 overflow-hidden transition-all duration-700 pointer-events-none
                   inset-0 w-full h-full opacity-30
                   md:inset-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:w-72 md:h-48 md:opacity-0 md:group-hover:opacity-100 md:scale-95 md:group-hover:scale-100 md:shadow-lg" 
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
      >
        {isCelebracion ? (
          <div className="relative w-full h-full bg-[#0A0A10]">
            {!videoReady && (
              <Image
                src="/imagenes-web/fiesta%20de%20la%20luz20261.jpg"
                alt="Celebración"
                fill
                className="absolute inset-0 object-cover transition-opacity duration-1000"
              />
            )}
            <video
              ref={videoRef}
              src="/imagenes-web/Candlelight_glow_in_forest_202607082057.mp4"
              muted
              playsInline
              loop
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              onCanPlay={() => setVideoReady(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:block" />
            {/* Gradient to protect text legibility on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-waldorf-cream)] via-[var(--color-waldorf-cream)]/70 to-transparent z-10 md:hidden" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={hoverImg}
              alt={post.title || "Actividad"}
              fill
              className="object-cover"
            />
            {/* Gradient to protect text legibility on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-waldorf-cream)] via-[var(--color-waldorf-cream)]/70 to-transparent z-10 md:hidden" />
          </div>
        )}
      </div>

      {/* Date & Type (Warm, serif, organic) */}
      <div className="w-full md:w-1/4 flex flex-col mb-4 md:mb-0 relative z-10 pointer-events-none pl-4 md:pl-8 border-l-[3px] border-[var(--color-waldorf-mustard)]/30 group-hover:border-[var(--color-waldorf-terracotta)]/60 transition-colors duration-700">
        <span className={`text-sm italic font-serif mb-1 ${tagColor}`}>
          ~ {post.tipo || 'Actividad'} ~
        </span>
        <div className="flex items-baseline gap-2 text-[#1a2e25]">
          <span className="text-4xl md:text-5xl font-serif font-bold leading-none">{post.dia || '00'}</span>
          <span className="text-lg font-serif italic text-[var(--color-waldorf-sage)] capitalize">{post.mes?.toLowerCase() || 'mes'}</span>
        </div>
      </div>
      
      {/* Title & Desc */}
      <div className="w-full md:w-1/2 relative z-10 transition-transform duration-700 md:group-hover:translate-x-6 pointer-events-none">
        <h4 className="text-2xl md:text-4xl font-serif font-bold text-[#1a2e25] mb-3 leading-tight group-hover:text-[var(--color-waldorf-moss)] transition-colors duration-700">
          {post.title}
        </h4>
        <p className="text-[#1a2e25]/60 text-base line-clamp-2 max-w-lg font-medium">
          {post.excerpt}
        </p>
      </div>
      
      {/* Meta (Softer icons) */}
      <div className="w-full md:w-1/4 flex flex-col md:items-end gap-3 mt-4 md:mt-0 relative z-10 pointer-events-none">
        {post.lugar && (
          <div className="flex items-center gap-3 text-sm text-[#1a2e25]/60 font-medium bg-[var(--color-waldorf-paper)]/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-6 h-6 rounded-full bg-[var(--color-waldorf-sage)]/10 flex items-center justify-center text-[var(--color-waldorf-moss)]">
              <MapPin size={14} strokeWidth={1.5} />
            </div>
            {post.lugar}
          </div>
        )}
        {post.hora && (
          <div className="flex items-center gap-3 text-sm text-[#1a2e25]/60 font-medium bg-[var(--color-waldorf-paper)]/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-6 h-6 rounded-full bg-[var(--color-waldorf-sage)]/10 flex items-center justify-center text-[var(--color-waldorf-moss)]">
              <Clock size={14} strokeWidth={1.5} />
            </div>
            {post.hora}
          </div>
        )}
      </div>
    </a>
  )
}
