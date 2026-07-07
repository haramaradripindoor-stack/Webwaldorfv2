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
  }

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center w-full">{children}</span>
    </motion.div>
  )
}
