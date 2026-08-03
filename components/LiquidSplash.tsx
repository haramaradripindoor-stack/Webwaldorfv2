'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function LiquidSplash() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
    // Lógica UX: Solo mostrar el intro una vez por sesión del navegador
    const seen = sessionStorage.getItem('splash_seen')
    if (!seen) {
      setIsVisible(true)
      sessionStorage.setItem('splash_seen', '1')
    }
  }, [])

  const dismiss = () => setIsVisible(false)

  useEffect(() => {
    if (videoRef.current) {
      // Acelerar el video para que la intro sea más fluida y rápida (1.5x)
      videoRef.current.playbackRate = 1.5
    }
  }, [isVisible])

  useEffect(() => {
    // Fallback máximo: si el video demora en cargar, lo quitamos igual
    const max = setTimeout(dismiss, 10000) // Reducido a 10s máximo
    return () => clearTimeout(max)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100000] overflow-hidden bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Video generado por Veo 3.1 */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain md:object-cover"
            onEnded={dismiss}
          >
            <source src="/imagenes-web/Waldorf_school_logo_animation_202607082053.mp4" type="video/mp4" />
          </video>
          <button
            onClick={dismiss}
            className="absolute bottom-10 right-10 text-white/50 hover:text-white uppercase tracking-widest text-sm z-50 transition-colors"
          >
            Saltar Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
