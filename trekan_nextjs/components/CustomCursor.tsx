'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Hide default cursor on desktop
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return

    // Native cursor stays visible - custom cursor is decorative only

    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' })

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.no-cursor-scale')) return
      
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('interactive')
      ) {
        gsap.to(cursor, { scale: 3.5, backgroundColor: '#ffffff', duration: 0.3 })
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.no-cursor-scale')) return

      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('interactive')
      ) {
        gsap.to(cursor, { scale: 1, backgroundColor: '#ffffff', duration: 0.3 })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)

    return () => {
      // Cleanup
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[9999] bg-[var(--color-waldorf-terracotta)] hidden md:block transition-all duration-300 opacity-70"
    />
  )
}
