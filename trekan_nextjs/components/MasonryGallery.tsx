'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const images = [
  { src: '/images/paseocerro20264.jpg', alt: 'Exploración en la naturaleza', span: 'col-span-2 row-span-2' },
  { src: '/images/actividapedagogicahumedales5.jpg', alt: 'Conexión vivencial', span: 'col-span-1 row-span-1' },
  { src: '/images/fiesta%20de%20la%20luz202610.jpg', alt: 'Ritmos y tradiciones', span: 'col-span-1 row-span-2' },
  { src: '/images/paseocerro20268.jpg', alt: 'Comunidad en movimiento', span: 'col-span-1 row-span-1' },
  { src: '/images/actividapedagogicahumedales6.jpg', alt: 'Aprendizaje en el entorno', span: 'col-span-2 row-span-1' },
  { src: '/images/paseocerro20269.jpg', alt: 'Libertad y asombro', span: 'col-span-1 row-span-1' },
  { src: '/images/fiesta%20de%20la%20luz20268.jpg', alt: 'Luz y calidez', span: 'col-span-1 row-span-1' },
]

export default function MasonryGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Contenedor principal Parallax (Valores reducidos drásticamente para no romper el grid en móvil)
  const yFast = useTransform(scrollYProgress, [0, 1], [40, -40])
  const ySlow = useTransform(scrollYProgress, [0, 1], [15, -15])

  // Lando Norris Internal Image Displacement (La imagen se mueve dentro del contenedor)
  const imageParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

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
    <section ref={containerRef} id="galeria" className="py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-visible relative">
      <div className="mb-24 text-center md:text-left relative z-10 max-w-3xl">
        <span className="text-[var(--color-waldorf-terracotta)] text-sm font-bold tracking-widest uppercase block mb-6">
          Nuestro Mundo
        </span>
        <h2 className="text-5xl md:text-7xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-[1.1] tracking-tighter">
          La Vida en Trekan
        </h2>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-6 md:gap-8 relative z-0">
        {images.map((img, i) => {
          const yTransform = i % 2 === 0 ? yFast : ySlow
          
          return (
            <motion.div
              key={i}
              style={{ y: yTransform }}
              className={`relative overflow-hidden group cursor-pointer ${img.span}`}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightbox(i)}
            >
              {/* Contenedor interno que escala para dar espacio al parallax */}
              <motion.div className="w-full h-full relative" style={{ y: imageParallax, scale: 1.3 }}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-[var(--color-waldorf-moss)]/40 transition-colors duration-700 flex items-end p-6 md:p-8">
                <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
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
          className="fixed inset-0 z-[9999] bg-[#0A0A10]/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl z-10 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-6xl z-10 transition-colors"
            aria-label="Anterior"
          >
            ‹
          </button>
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-6xl z-10 transition-colors"
            aria-label="Siguiente"
          >
            ›
          </button>
          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono tracking-widest">
            {lightbox + 1} / {images.length}
          </span>
        </motion.div>
      )}
    </section>
  )
}
