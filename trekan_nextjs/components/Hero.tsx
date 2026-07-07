'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Leaf, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import MagneticButton from './MagneticButton'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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
  const titleWords = "Donde el niño camina con voluntad".split(" ")

  return (
    <section ref={containerRef} id="inicio" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-[#0A0A10]">
      
      {/* Cinematic 4K Video Background with Parallax */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
        <video
          ref={videoRef}
          src="/assets/testimonial.mp4" // Placeholder until the 4K drone shot is uploaded
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="object-cover object-center w-full h-full opacity-80"
        />
        {/* Gradients for extreme contrast and mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A10]/90 via-[#0A0A10]/20 to-[#0A0A10] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/20 mix-blend-overlay" />
        {/* Film grain layer */}

      </motion.div>
      
      {/* Audio Control (Organic Audio) */}
      {isMounted && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 1 }}
          onClick={toggleAudio}
          className="absolute bottom-12 right-12 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
        >
          <span className="text-xs uppercase tracking-widest font-mono opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
            {isMuted ? 'Atmósfera' : 'Silenciar'}
          </span>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
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

          <h1 className="font-bold tracking-tighter mb-8 leading-[1.1] font-serif text-white drop-shadow-2xl flex flex-wrap justify-center gap-x-4 md:gap-x-8 max-w-5xl" style={{ fontSize: 'var(--text-fluid-hero)' }}>
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                className={`relative inline-block ${word.toLowerCase() === 'voluntad' ? 'text-[var(--color-waldorf-mustard)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60'}`}
                initial={{ opacity: 0, y: 50, rotateX: 45, filter: 'blur(10px)' }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          >
            Colegio Waldorf Trekan. Un espacio diseñado para que los niños crezcan libres, conscientes y profundamente conectados con su entorno.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton magneticStrength={0.4}>
              <a href="#admision" className="w-full sm:w-auto px-10 py-5 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-bold text-sm tracking-wide shadow-[0_0_50px_rgba(224,169,109,0.3)] hover:shadow-[0_0_80px_rgba(224,169,109,0.5)] transition-all duration-500 flex items-center justify-center gap-3 group">
                Comenzar el Viaje
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Kinetic Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 text-white/40 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-medium">Descubrir</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent" 
        />
      </motion.div>
    </section>
  )
}
