'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only on desktop
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let animFrame: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
      animFrame = requestAnimationFrame(animate)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')

      if (isInteractive) {
        ring.style.transform += ' scale(2.2)'
        ring.style.borderColor = 'var(--color-waldorf-terracotta)'
        dot.style.opacity = '0'
      } else {
        ring.style.borderColor = 'var(--color-waldorf-moss)'
        dot.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)
    animFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <>
      {/* Dot — instantáneo */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-200"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--color-waldorf-moss)',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Ring — lerp suave */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-0 transition-[opacity,border-color] duration-200"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid var(--color-waldorf-moss)',
          mixBlendMode: 'multiply',
        }}
      />
    </>
  )
}
