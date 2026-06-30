'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Leaf } from 'lucide-react'
import { useRef } from 'react'
import Image from 'next/image'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Efectos Parallax
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200])
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section ref={containerRef} id="inicio" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-[#1a2e25]">
      
      {/* Background Image with Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
        <Image 
          src="/assets/colegio-fondo.webp" 
          alt="Colegio Waldorf Trekan" 
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e25]/80 via-[#1a2e25]/40 to-[#1a2e25]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/30 mix-blend-overlay" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center mt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yText, opacity: opacityText }}
          className="flex flex-col items-center"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[var(--color-waldorf-cream)] text-xs font-semibold tracking-widest uppercase mb-8 shadow-2xl"
            variants={itemVariants}
          >
            <Leaf size={14} className="text-[var(--color-waldorf-mustard)]" />
            Educación en Armonía con la Naturaleza
          </motion.div>

          <motion.h1 
            className="font-bold tracking-tight mb-6 leading-[1.05] font-serif text-white drop-shadow-2xl"
            style={{ fontSize: 'var(--text-fluid-hero)' }}
            variants={itemVariants}
          >
            Pedagogía con el <br className="hidden md:block"/>
            <span className="text-[var(--color-waldorf-mustard)] relative whitespace-nowrap inline-block">
              Corazón
              <svg className="absolute w-full h-4 -bottom-3 left-0 text-[var(--color-waldorf-terracotta)]/80" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 25 20, 50 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-2xl text-[var(--color-waldorf-cream)] font-medium max-w-2xl mx-auto mb-10 font-sans drop-shadow-md opacity-90"
            variants={itemVariants}
          >
            Colegio Waldorf Trekan en Puerto Varas. Un espacio diseñado para que los niños de 3 a 14 años crezcan libres, conscientes y conectados con su entorno.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={itemVariants}
          >
            <a href="#admision" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-bold text-sm shadow-[0_0_40px_rgba(224,169,109,0.4)] hover:shadow-[0_0_60px_rgba(224,169,109,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-none">
              Admisión 2026 Abierta
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#pedagogia" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20 cursor-none">
              Descubrir Pedagogía
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  )
}
