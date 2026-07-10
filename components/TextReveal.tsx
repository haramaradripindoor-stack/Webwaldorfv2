'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  text: string
}

export default function TextReveal({ text }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const words = text.split(' ')

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-16 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]"
    >
      <p className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[var(--color-waldorf-moss)] leading-[1.15] tracking-tight text-center flex flex-wrap justify-center gap-x-4 gap-y-1">
        {words.map((word, i) => {
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0.1, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
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
