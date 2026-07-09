'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function OrganicBlobs() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden bg-transparent">
      {/* Blob Terracota */}
      <motion.div
        className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] mix-blend-multiply opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-waldorf-terracotta) 0%, rgba(212,115,83,0) 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob Mostaza */}
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] mix-blend-multiply opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, var(--color-waldorf-mustard) 0%, rgba(224,169,109,0) 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Blob Verde Bosque Muy Tenue */}
      <motion.div
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full blur-[90px] mix-blend-multiply opacity-10"
        style={{
          background: 'radial-gradient(circle, var(--color-waldorf-moss) 0%, rgba(26,46,37,0) 70%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 40, -20, 0],
          y: [0, -20, 40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
