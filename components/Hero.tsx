'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Leaf, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import MagneticButton from './MagneticButton'
import ADMISION_CONFIG from '@/config/admision'

export default function Hero({ data }: { data?: any }) {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScroll, setShowScroll] = useState(false)

  // Datos dinámicos con fallback
  const title = (data?.title && data.title !== 'La Vida en Trekan') ? data.title : "Donde el niño camina con voluntad"
  const subtitle = (data?.subtitle && data.subtitle !== 'Educación con sentido') ? data.subtitle : "Colegio Waldorf Trekan • Puerto Varas. Un espacio de naturaleza, arte y ciencia donde la infancia camina con reverencia y propósito."
  const mediaUrl = (data?.media_url && data.media_url !== '/assets/testimonial.mp4' && data.media_url !== '/assets/hero-casona-drone.mp4') ? data.media_url : "/assets/hero_casona_cinematic.mp4"
  const mediaType = data?.media_type || "video"

  useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize, { passive: true })
    const t = setTimeout(() => setShowScroll(true), 2500)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Efectos Parallax
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200])
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Animaciones para las palabras (efecto líquido/fluido)
  const titleWords: string[] = (title || "").toString().split(" ")

  return (
    <section ref={containerRef} id="inicio" className="relative min-h-[100svh] min-h-screen flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-24 px-6 md:px-12 overflow-hidden bg-[#0B1710]">
      
      {/* Cinematic 4K Video Background with Parallax */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 overflow-hidden">
        {(mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be')) ? (
          <iframe 
            src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]?.split('&')[0] || mediaUrl.split('youtu.be/')[1]}?autoplay=1&mute=1&loop=1&playlist=${mediaUrl.split('v=')[1]?.split('&')[0] || mediaUrl.split('youtu.be/')[1]}&controls=0`} 
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none"
            allow="autoplay; fullscreen"
          />
        ) : mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) || mediaType === 'video' ? (
          <>
            {isMobile && (
              <Image
                src="/assets/hero_casona_poster.webp"
                alt="Colegio Waldorf Trekan en Parque Ivian, Puerto Varas"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center w-full h-full opacity-90"
              />
            )}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/hero_casona_poster.webp"
              preload={isMobile ? "none" : "auto"}
              aria-hidden="true"
              className={`object-cover object-center w-full h-full transition-opacity duration-1000 ${
                isMobile ? 'opacity-0 md:opacity-90' : 'opacity-90'
              }`}
            >
              <source src="/assets/hero_casona_cinematic.webm" type="video/webm" />
              <source src={mediaUrl} type="video/mp4" />
            </video>
          </>
        ) : (
          <img 
            src={mediaUrl} 
            alt="Hero Background"
            className="object-cover object-center w-full h-full opacity-90"
          />
        )}

        {/* Organic Patagonian Forest Atmosphere (Marina Budarina & Master Web Engine Standard) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1710]/65 via-[#0B1710]/20 to-[#0B1710]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/15 mix-blend-overlay" />
        {/* Film grain layer */}

      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center mt-6 sm:mt-12">
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          className="flex flex-col items-center w-full"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[var(--color-waldorf-cream)] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-6 sm:mb-12 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Leaf size={14} className="text-[var(--color-waldorf-mustard)]" />
            Puerto Varas, Chile
          </motion.div>

          <h1 
            aria-label={title}
            className="font-bold tracking-tighter mb-4 sm:mb-8 leading-[1.1] font-serif text-white drop-shadow-2xl flex flex-wrap justify-center gap-x-2.5 sm:gap-x-4 md:gap-x-8 max-w-5xl" 
            style={{ fontSize: 'var(--text-fluid-hero)' }}
          >
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                className={`relative inline-block ${word.toLowerCase() === 'voluntad' ? 'text-[var(--color-waldorf-mustard)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70'}`}
                initial={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: idx * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(255,255,255,0.4)" }}
              >
                {word}
                {word.toLowerCase() === 'voluntad' && (
                   <motion.svg 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                    className="absolute w-full h-3 sm:h-4 -bottom-3 sm:-bottom-4 left-0 text-[var(--color-waldorf-terracotta)]/90 drop-shadow-lg" viewBox="0 0 100 20" preserveAspectRatio="none"
                  >
                     <path d="M0 10 Q 25 20, 50 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                   </motion.svg>
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            className="text-base sm:text-lg md:text-2xl text-[var(--color-waldorf-cream)]/85 font-medium max-w-2xl mx-auto mb-8 sm:mb-14 font-sans drop-shadow-md px-4 leading-relaxed"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton magneticStrength={0.4}>
              <a href="#admision" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 min-h-[50px] rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-bold text-sm tracking-wide shadow-[0_0_50px_rgba(224,169,109,0.3)] hover:shadow-[0_0_80px_rgba(224,169,109,0.5)] transition-all duration-500 flex items-center justify-center gap-3 group">
                Admisión {ADMISION_CONFIG.activeYear} • Conocer Cupos
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator — aparece solo después del splash */}
      <motion.div
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10 cursor-pointer pointer-events-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={showScroll ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-mono text-white/85">Descubrir</span>
        {/* Línea que respira — como latido orgánico */}
        <motion.div
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="w-[1px] h-14 bg-gradient-to-b from-white/60 to-transparent origin-top"
        />
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-waldorf-mustard)]"
        />
      </motion.div>
    </section>
  )
}
