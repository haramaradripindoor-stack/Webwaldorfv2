'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function RadicalTransparency() {
  return (
    <section className="py-32 bg-[#FAF8F5] text-[#1a2e25] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div className="order-2 md:order-1 relative h-[600px] w-full rounded-3xl overflow-hidden">
          {/* Placeholder for raw materials like wood, wool, watercolor */}
          <Image 
            src="/assets/colegio-fondo.webp" 
            alt="Materiales nobles en pedagogía Waldorf" 
            fill 
            className="object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a2e25]/40 to-transparent" />
          
          <div className="absolute bottom-8 left-8 text-white p-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
            <p className="font-serif font-bold text-2xl mb-2">Materia Prima</p>
            <p className="text-sm font-sans opacity-90 max-w-xs">En Trekan, no hay plástico. Solo madera viva, lana cruda y ceras naturales que conectan al niño con la verdad del mundo.</p>
          </div>
        </div>

        <div className="order-1 md:order-2 flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Sostenibilidad <br/>Radical.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-[#1a2e25]/70 max-w-lg mb-12 font-sans"
          >
            La ética no es una asignatura, es el entorno. Desde la arquitectura de nuestro colegio hasta las fibras de los juguetes, cada elemento está diseñado con un respeto absoluto por los ritmos de la naturaleza y el desarrollo humano.
          </motion.p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-[#1a2e25]/10 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="font-bold text-2xl font-serif mb-2 text-[var(--color-waldorf-moss)]">100%</h3>
              <p className="text-sm opacity-60">Materiales nobles en el aula parvularia</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="font-bold text-2xl font-serif mb-2 text-[var(--color-waldorf-terracotta)]">0%</h3>
              <p className="text-sm opacity-60">Pantallas en los primeros dos septenios</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
