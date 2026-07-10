'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface VideoHoverRevealProps {
  videoSrc: string
  fallbackImg: string
  /** Si true → muestra el logo de Trekan superpuesto */
  showLogo?: boolean
}

export default function VideoHoverReveal({ videoSrc, fallbackImg, showLogo = false }: VideoHoverRevealProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fallback: imagen estática visible mientras el video no está listo */}
      {!videoReady && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImg})` }}
        />
      )}

      {/* Video — se reproduce solo al hover */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        onCanPlay={() => setVideoReady(true)}
      />

      {/* Overlay oscuro sutil para que el logo y texto resalten */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Logo de Trekan superpuesto */}
      {showLogo && (
        <div className="absolute top-3 left-3 z-10">
          <Image
            src="/assets/logo.png"
            alt="Colegio Waldorf Trekan"
            width={64}
            height={64}
            className="object-contain drop-shadow-lg opacity-90"
          />
        </div>
      )}

      {/* Badge "Celebración" */}
      {showLogo && (
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 font-bold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            ✦ Celebración
          </span>
        </div>
      )}
    </div>
  )
}
