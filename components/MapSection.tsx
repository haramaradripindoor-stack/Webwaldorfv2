'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export default function MapSection() {
  return (
    <section id="ubicacion" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <span className="text-[var(--color-waldorf-mustard)] text-xs font-bold tracking-widest uppercase block mb-4">
          Nuestra Casa
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          Dónde Encontrarnos
        </h2>
        <p className="text-[var(--color-waldorf-text-light)] text-lg max-w-xl mx-auto mt-4 font-medium">
          Estamos inmersos en la naturaleza del Parque Ivian, un entorno que nutre y cobija el desarrollo de nuestros niños.
        </p>
      </div>

      <motion.div 
        className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[400px] md:h-[550px] border border-[var(--color-waldorf-sage)]/20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Google Maps Embed sin filtros oscuros para mantener la legibilidad y estética limpia */}
        <iframe 
          title="Mapa de ubicación del Colegio Waldorf Trekan en Puerto Varas, Parque Ivian"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11961.341148810057!2d-72.973406!3d-41.328328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96183aef542dfdd1%3A0x6a2c206a4b1262d!2sColegio%20Waldorf%20Trekan!5e0!3m2!1ses-419!2scl!4v1718000000000!5m2!1ses-419!2scl" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 z-0"
        />

        {/* Tarjeta de Información Flotante (Glassmorphism) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 md:left-12 md:right-auto z-10 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[var(--color-waldorf-sage)]/10 md:max-w-sm pointer-events-auto transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-waldorf-cream)] flex items-center justify-center text-[var(--color-waldorf-moss)] border border-[var(--color-waldorf-sage)]/20">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-waldorf-moss)] font-serif text-2xl drop-shadow-sm">Colegio Waldorf Trekan</h3>
              <p className="text-[var(--color-waldorf-terracotta)] text-xs font-bold tracking-widest uppercase mt-1">Parque Ivian, Puerto Varas</p>
            </div>
          </div>
          <p className="text-[var(--color-waldorf-text-light)] text-sm font-medium mb-6 leading-relaxed">
            Un entorno natural protegido donde el bosque es nuestra principal aula de clases.
          </p>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Colegio+Waldorf+Trekan+Puerto+Varas" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group/btn flex items-center justify-between w-full bg-[#1a2e25] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2a4538] transition-colors shadow-lg"
          >
            Abrir en Google Maps
            <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
