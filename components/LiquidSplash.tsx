'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LiquidSplash() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const seen = sessionStorage.getItem('splash_seen')
    if (!seen) {
      setIsVisible(true)
      sessionStorage.setItem('splash_seen', '1')
    }
  }, [])

  const dismiss = () => setIsVisible(false)

  useEffect(() => {
    // Fallback máximo: si el video demora en cargar, lo quitamos igual
    const max = setTimeout(dismiss, 15000)
    return () => clearTimeout(max)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100000] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Video generado por Veo 3.1 */}
          <video
            src="/images/Waldorf_school_logo_animation_202607082053.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain md:object-cover"
            // Cuando el video termina naturalmente → desmontar
            onEnded={dismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
