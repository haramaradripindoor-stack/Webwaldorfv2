'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'
import Image from 'next/image'

interface ActividadRowProps {
  post: any;
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
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-[var(--color-waldorf-sage)]/20 hover:border-[var(--color-waldorf-moss)] transition-colors duration-500 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Reveal */}
      <div className="hidden md:block absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-48 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-700 pointer-events-none z-0 rounded-2xl overflow-hidden shadow-2xl origin-center rotate-3 group-hover:rotate-0">
        {isCelebracion ? (
          <div className="relative w-full h-full bg-[#0A0A10]">
            {!videoReady && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url(/images/fiesta\\ de\\ la\\ luz20261.jpg)` }}
              />
            )}
            <video
              ref={videoRef}
              src="/images/Candlelight_glow_in_forest_202607082057.mp4"
              muted
              playsInline
              loop
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              onCanPlay={() => setVideoReady(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 z-10">
              <Image
                src="/assets/logo.png"
                alt="Colegio Waldorf Trekan"
                width={64}
                height={64}
                className="object-contain drop-shadow-lg opacity-90"
              />
            </div>
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 font-bold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                ✦ Celebración
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${hoverImg})` }}
          />
        )}
      </div>

      {/* Date & Type */}
      <div className="w-full md:w-1/4 flex flex-col mb-4 md:mb-0 relative z-10 pointer-events-none">
        <span className={`text-xs font-bold tracking-widest uppercase mb-2 ${tagColor}`}>
          {post.tipo || 'ACTIVIDAD'}
        </span>
        <div className="flex items-baseline gap-2 text-[#1a2e25]">
          <span className="text-4xl md:text-5xl font-serif font-bold leading-none">{post.dia || '00'}</span>
          <span className="text-sm font-bold uppercase tracking-wider">{post.mes || 'MES'}</span>
        </div>
      </div>
      
      {/* Title & Desc */}
      <div className="w-full md:w-1/2 relative z-10 transition-transform duration-500 group-hover:translate-x-4 pointer-events-none">
        <h4 className="text-2xl md:text-4xl font-serif font-bold text-[#1a2e25] mb-2 leading-tight group-hover:text-[var(--color-waldorf-moss)] transition-colors">
          {post.title}
        </h4>
        <p className="text-[#1a2e25]/60 text-sm md:text-base line-clamp-1 max-w-lg font-light">
          {post.excerpt}
        </p>
      </div>
      
      {/* Meta */}
      <div className="w-full md:w-1/4 flex flex-col md:items-end gap-2 mt-4 md:mt-0 relative z-10 pointer-events-none">
        {post.lugar && (
          <div className="flex items-center gap-2 text-sm text-[#1a2e25]/60 font-medium">
            <MapPin size={16} />
            {post.lugar}
          </div>
        )}
        {post.hora && (
          <div className="flex items-center gap-2 text-sm text-[#1a2e25]/60 font-medium">
            <Clock size={16} />
            {post.hora}
          </div>
        )}
      </div>
    </a>
  )
}
