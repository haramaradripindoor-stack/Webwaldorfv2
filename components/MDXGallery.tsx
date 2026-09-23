"use client"
import { useState, useEffect } from 'react'

export default function MDXGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox((lightbox + 1) % images.length)
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox((lightbox - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, images.length])

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 my-16 md:my-24 space-y-6">
        {images.map((src, i) => (
          <div 
            key={i} 
            className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setLightbox(i)}
          >
            <img 
              src={src} 
              alt={`Galería imagen ${i+1}`} 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-[#0A0A10]/95 flex items-center justify-center p-4 backdrop-blur-md transition-opacity"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl z-10 transition-colors mix-blend-difference"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-5xl md:text-6xl z-10 transition-colors mix-blend-difference"
          >
            ‹
          </button>
          
          <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightbox]}
              alt={`Galería imagen ${lightbox + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in"
            />
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-5xl md:text-6xl z-10 transition-colors mix-blend-difference"
          >
            ›
          </button>
          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono tracking-widest mix-blend-difference">
            {lightbox + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  )
}
