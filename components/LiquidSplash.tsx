'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LiquidSplash() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Solo mostrar la cortina editorial en la primera visita de la sesión
    const seen = sessionStorage.getItem('trekan_splash_seen_v2')
    if (!seen) {
      setIsVisible(true)
      sessionStorage.setItem('trekan_splash_seen_v2', '1')

      // Autocierre suave después de 1.1s (rápido, cinematográfico, sin bloqueo)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1100)

      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => setIsVisible(false)

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="editorial-curtain"
          onClick={dismiss}
          className="fixed inset-0 z-[100000] cursor-pointer flex flex-col items-center justify-center bg-[#0E1B13] text-[#FAF8F5] select-none"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Grano sutil de papel orgánico */}
          <div 
            aria-hidden="true" 
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]"
          />

          {/* Sello y Tipografía Editorial */}
          <motion.div 
            className="relative z-10 flex flex-col items-center text-center px-6"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Sello Vectorial Original Trekan */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
              <Image
                src="/brand/trekan_sello_completo_crema.svg"
                alt="Colegio Waldorf Trekan"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Micro Tagline */}
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.28em] text-[#EBBA7A] font-medium mb-2">
              Colegio Waldorf Trekan
            </span>

            {/* Lema Humanista Waldorf */}
            <p className="font-serif italic text-base md:text-lg text-[#FAF8F5]/85 tracking-wide max-w-sm">
              Donde el niño camina con voluntad hacia la libertad
            </p>

            {/* Línea dorada de progresión viva */}
            <div className="w-24 h-[1.5px] bg-white/10 rounded-full mt-6 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#EBBA7A] to-[#D4A362]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.95, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* Indicador táctil inferior */}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute bottom-8 text-[9px] font-mono uppercase tracking-[0.25em] text-[#FAF8F5]/40"
          >
            Puerto Varas · Chile
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
