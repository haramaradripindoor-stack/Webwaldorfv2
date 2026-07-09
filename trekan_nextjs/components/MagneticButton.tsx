'use client'

import React, { useRef, useState } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface MagneticButtonProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  magneticStrength?: number
}

export default function MagneticButton({
  children,
  className = '',
  magneticStrength = 0.5,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * magneticStrength
    const y = (clientY - (top + height / 2)) * magneticStrength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center ${className} group`}
      {...props}
    >
      {/* Capa Gooey oculta detrás del contenido real */}
      <div 
        className="absolute inset-[-20px] pointer-events-none z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ filter: 'url(#gooey)' }}
      >
        <motion.div 
          className="absolute w-12 h-12 bg-[var(--color-waldorf-terracotta)] rounded-full mix-blend-multiply"
          animate={{
            x: position.x * 1.5,
            y: position.y * 1.5,
            scale: isHovered ? 4 : 1
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        />
        <motion.div 
          className="absolute w-16 h-16 bg-[var(--color-waldorf-mustard)] rounded-full mix-blend-multiply"
          animate={{
            x: position.x * 0.8,
            y: position.y * 0.8,
            scale: isHovered ? 3 : 1
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        />
      </div>

      <span className="relative z-10 flex items-center justify-center w-full">{children}</span>
    </motion.div>
  )
}
