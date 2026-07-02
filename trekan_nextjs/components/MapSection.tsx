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
        className="relative rounded-[40px] overflow-hidden earth-shadow h-[400px] md:h-[500px] bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Overlay informativo sobre el mapa */}
        <div className="absolute top-6 left-6 z-10 bg-[var(--color-waldorf-paper)]/95 backdrop-blur-md p-6 rounded-3xl earth-shadow border border-[var(--color-waldorf-sage)]/10 max-w-xs hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--color-waldorf-cream)] flex items-center justify-center text-[var(--color-waldorf-sage)] border border-[var(--color-waldorf-sage)]/20">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-waldorf-moss)] font-serif text-lg">Colegio Trekan</h3>
          </div>
          <p className="text-[var(--color-waldorf-text-light)] text-sm font-medium">
            Las Azaleas 96, Parque Ivian 1<br/>Puerto Varas, Los Lagos
          </p>
          <a href="https://www.google.com/maps/search/?api=1&query=Colegio+Waldorf+Trekan+Puerto+Varas" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-[var(--color-waldorf-terracotta)] text-sm font-bold hover:underline">
            Abrir en Google Maps →
          </a>
        </div>

        {/* Google Maps Embed */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11961.341148810057!2d-72.973406!3d-41.328328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96183aef542dfdd1%3A0x6a2c206a4b1262d!2sColegio%20Waldorf%20Trekan!5e0!3m2!1ses-419!2scl!4v1718000000000!5m2!1ses-419!2scl" 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'contrast(0.9) opacity(0.9)' }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Filtro sutil cálido sobre el mapa para que no rompa la estética */}
        <div className="absolute inset-0 bg-[var(--color-waldorf-mustard)]/5 pointer-events-none mix-blend-overlay" />
      </motion.div>
    </section>
  )
}
