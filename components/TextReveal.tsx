'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  text: string
}

export default function TextReveal({ text }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 20%']
  })

  const words = text.split(' ')

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-16 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]"
    >
      <p className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[var(--color-waldorf-moss)] leading-[1.15] tracking-tight text-center flex flex-wrap justify-center gap-x-4 gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length
          const end = Math.min(start + 1.5 / words.length, 1)
          // Solo opacidad — sin y, sin blur, sin rotación — 100% sereno
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [start, end], [0.08, 1])

          return (
            <motion.span
              key={i}
              style={{ opacity }}
              className="inline-block"
            >
              {word}
            </motion.span>
          )
        })}
      </p>
    </section>
  )
}
