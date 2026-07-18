'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [hoverText, setHoverText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const trailingConfig = { damping: 20, stiffness: 200, mass: 1.5 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const trailingX = useSpring(0, trailingConfig)
  const trailingY = useSpring(0, trailingConfig)

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true)
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16) // Center offset (w-8 h-8 = 32px / 2 = 16px)
      cursorY.set(e.clientY - 16)
      trailingX.set(e.clientX - 4) // Center offset for small trailing dot (w-2 h-2 = 8px / 2 = 4px)
      trailingY.set(e.clientY - 4)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if we are hovering a button, link, or image
      const isClickable = target.closest('a') || target.closest('button')
      const isImage = target.closest('img') || target.tagName.toLowerCase() === 'img'

      if (isClickable) {
        setIsHovering(true)
        setHoverText('')
      } else if (isImage) {
        setIsHovering(true)
        setHoverText('Ver')
      } else {
        setIsHovering(false)
        setHoverText('')
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <>
      {/* Hide native cursor globally */}
      <style dangerouslySetInnerHTML={{ __html: `
        body, a, button {
          cursor: none !important;
        }
        input, textarea {
          cursor: text !important;
        }
      `}} />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[10000] flex items-center justify-center text-[8px] font-bold tracking-widest uppercase text-white"
        style={{
          x: cursorX,
          y: cursorY,
          mixBlendMode: 'difference', // <-- Awwwards secret for contrast
          backgroundColor: isHovering && hoverText ? 'white' : 'transparent',
          border: '1px solid white',
          backdropFilter: isHovering && !hoverText ? 'invert(100%)' : 'none'
        }}
        animate={{
          scale: isHovering ? (hoverText ? 2.5 : 0.5) : 1,
          backgroundColor: isHovering && hoverText 
            ? 'white' 
            : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="opacity-0 transition-opacity duration-300" style={{ opacity: hoverText ? 1 : 0 }}>
          {hoverText}
        </span>
      </motion.div>

      {/* Trailing Physics Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999]"
        style={{
          x: trailingX,
          y: trailingY,
          mixBlendMode: 'difference',
          opacity: isHovering ? 0 : 1
        }}
      />
    </>
  )
}
