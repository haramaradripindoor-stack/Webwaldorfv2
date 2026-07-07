'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const images = [
  { src: '/images/galeria1.webp', alt: 'Niños aprendiendo', span: 'col-span-1 md:col-span-2 row-span-2 md:row-span-2' },
  { src: '/images/galeria2.webp', alt: 'Aprendizaje vivencial', span: 'col-span-1 row-span-1' },
  { src: '/images/galeria3.webp', alt: 'Valores Waldorf', span: 'col-span-1 row-span-2' },
  { src: '/images/galeria7.webp', alt: 'Visión educativa', span: 'col-span-1 row-span-1' },
  { src: '/images/galeria8.webp', alt: 'Maestro guía', span: 'col-span-2 row-span-1' },
  { src: '/images/galeria5.webp', alt: 'Conexión Naturaleza', span: 'col-span-1 row-span-1' },
  { src: '/images/galeria6.webp', alt: 'Trabajo con las manos', span: 'col-span-1 row-span-1' },
]

export default function MasonryGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Distintos niveles de parallax
  const yFast = useTransform(scrollYProgress, [0, 1], [100, -100])
  const ySlow = useTransform(scrollYProgress, [0, 1], [50, -50])

  // Close lightbox with Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox((lightbox + 1) % images.length)
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox((lightbox - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox])

  return (
    <section ref={containerRef} id="galeria" className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden relative">
      <div className="mb-16 text-center md:text-left relative z-10">
        <span className="text-[var(--color-waldorf-terracotta)] text-xs font-bold tracking-widest uppercase block mb-4">
          Nuestro Mundo
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          La Vida en Trekan
        </h2>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4 relative z-0">
        {images.map((img, i) => {
          // Asignar parallax intercalado
          const yTransform = i % 2 === 0 ? yFast : ySlow
          
          return (
            <motion.div
              key={i}
              style={{ y: yTransform }}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer earth-shadow ${img.span}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-[var(--color-waldorf-moss)]/40 transition-all duration-500 flex items-end p-5">
                <span className="text-[var(--color-waldorf-cream)] text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[var(--color-waldorf-text)]/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-[var(--color-waldorf-cream)]/60 hover:text-[var(--color-waldorf-cream)] text-2xl z-10"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-waldorf-cream)]/40 hover:text-[var(--color-waldorf-cream)] text-3xl z-10"
            aria-label="Anterior"
          >
            ‹
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-waldorf-cream)]/40 hover:text-[var(--color-waldorf-cream)] text-3xl z-10"
            aria-label="Siguiente"
          >
            ›
          </button>
          <span className="absolute bottom-6 text-[var(--color-waldorf-cream)]/60 text-sm font-mono">
            {lightbox + 1} / {images.length}
          </span>
        </motion.div>
      )}
    </section>
  )
}
