'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Leaf, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import MagneticButton from './MagneticButton'
import ADMISION_CONFIG from '@/config/admision'

export default function Hero({ data }: { data?: any }) {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const [showSoundPrompt, setShowSoundPrompt] = useState(false)

  // Datos dinámicos con fallback
  const title = (data?.title && data.title !== 'La Vida en Trekan') ? data.title : "Donde el niño camina con voluntad"
  const subtitle = (data?.subtitle && data.subtitle !== 'Educación con sentido') ? data.subtitle : "Colegio Waldorf Trekan • Puerto Varas. Un espacio de naturaleza, arte y ciencia donde la infancia camina con reverencia y propósito."
  const mediaUrl = (data?.media_url && data.media_url !== '/assets/testimonial.mp4') ? data.media_url : "/assets/hero-casona-drone.mp4"
  const mediaType = data?.media_type || "video"

  useEffect(() => {
    setIsMounted(true)
    // Aparece 1s después de que termina el splash (~8.2s)
    const t = setTimeout(() => setShowScroll(true), 9000)
    
    // Sugerencia de sonido aparece a los 4s y desaparece a los 10s
    const soundTimeout1 = setTimeout(() => setShowSoundPrompt(true), 4000)
    const soundTimeout2 = setTimeout(() => setShowSoundPrompt(false), 10000)
    
    return () => {
      clearTimeout(t)
      clearTimeout(soundTimeout1)
      clearTimeout(soundTimeout2)
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

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Animaciones para las palabras (efecto líquido/fluido)
  const titleWords: string[] = (title || "").toString().split(" ")

  return (
    <section ref={containerRef} id="inicio" className="relative min-h-[100svh] min-h-screen flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-24 px-6 md:px-12 overflow-hidden bg-[#0B1710]">
      
      {/* Cinematic 4K Video Background with Parallax */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 overflow-hidden">
        {(mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be')) ? (
          <iframe 
            src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1]?.split('&')[0] || mediaUrl.split('youtu.be/')[1]}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${mediaUrl.split('v=')[1]?.split('&')[0] || mediaUrl.split('youtu.be/')[1]}&controls=0`} 
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none"
            allow="autoplay; fullscreen"
          />
        ) : mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i) || mediaType === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            aria-hidden="true"
            className="object-cover object-center w-full h-full opacity-90 transition-opacity duration-1000"
          >
            <source src="/assets/hero-casona-drone.webm" type="video/webm" />
            <source src={mediaUrl} type="video/mp4" />
          </video>
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
      
      {/* Audio Control (Organic Audio) */}
      {isMounted && mediaType === 'video' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 right-12 z-50 flex items-center gap-4"
        >
          <AnimatePresence>
            {showSoundPrompt && isMuted && (
               <motion.span 
                 initial={{ opacity: 0, filter: 'blur(4px)', x: 10 }}
                 animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                 exit={{ opacity: 0, filter: 'blur(4px)', x: 10 }}
                 className="text-[10px] uppercase tracking-widest font-mono text-white/50 pointer-events-none hidden sm:block"
               >
                 Experiencia con sonido
               </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={toggleAudio}
            aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'}
            className="relative flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
          >
            {isMuted && (
              <span className="absolute inset-0 rounded-full border border-white/30 animate-[ping_3s_ease-in-out_infinite] opacity-50"></span>
            )}
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center mt-12">
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          className="flex flex-col items-center"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[var(--color-waldorf-cream)] text-xs font-semibold tracking-widest uppercase mb-12 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Leaf size={14} className="text-[var(--color-waldorf-mustard)]" />
            Puerto Varas, Chile
          </motion.div>

          <h1 
            aria-label={title}
            className="font-bold tracking-tighter mb-8 leading-[1.1] font-serif text-white drop-shadow-2xl flex flex-wrap justify-center gap-x-4 md:gap-x-8 max-w-5xl" 
            style={{ fontSize: 'var(--text-fluid-hero)' }}
          >
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                className={`relative inline-block ${word.toLowerCase() === 'voluntad' ? 'text-[var(--color-waldorf-mustard)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60'}`}
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
                    className="absolute w-full h-4 -bottom-4 left-0 text-[var(--color-waldorf-terracotta)]/80 drop-shadow-lg" viewBox="0 0 100 20" preserveAspectRatio="none"
                  >
                     <path d="M0 10 Q 25 20, 50 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                   </motion.svg>
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            className="text-lg md:text-2xl text-[var(--color-waldorf-cream)]/70 font-medium max-w-2xl mx-auto mb-16 font-sans drop-shadow-md"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton magneticStrength={0.4}>
              <a href="#admision" className="w-full sm:w-auto px-10 py-5 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-bold text-sm tracking-wide shadow-[0_0_50px_rgba(224,169,109,0.3)] hover:shadow-[0_0_80px_rgba(224,169,109,0.5)] transition-all duration-500 flex items-center justify-center gap-3 group">
                Admisión {ADMISION_CONFIG.activeYear} • Conocer Cupos
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator — aparece solo después del splash */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={showScroll ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-mono text-white/50">Descubrir</span>
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
