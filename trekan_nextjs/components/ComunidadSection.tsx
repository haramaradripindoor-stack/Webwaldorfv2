'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Home } from 'lucide-react'

export default function ComunidadSection() {
  const items = [
    'Consejo Escolar',
    'Asambleas mensuales',
    'Celebraciones estacionales',
    'Comisiones de trabajo',
    'Talleres para padres',
    'Mantención del espacio'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="comunidad" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="bg-[var(--color-waldorf-mustard)]/10 rounded-[40px] p-8 md:p-16 border border-[var(--color-waldorf-mustard)]/20 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white border border-[var(--color-waldorf-mustard)]/30 flex items-center justify-center text-[var(--color-waldorf-terracotta)] shadow-sm">
            <Home size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">
          Vida Comunitaria
        </h2>
        
        <p className="text-[var(--color-waldorf-text-light)] text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium">
          En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo.
        </p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white/40 shadow-sm text-left"
            >
              <CheckCircle2 size={20} className="text-[var(--color-waldorf-sage)] shrink-0" />
              <span className="font-semibold text-[var(--color-waldorf-text)]">{item}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white/80 p-6 md:p-8 rounded-3xl backdrop-blur-md max-w-4xl mx-auto border border-white/50 shadow-sm">
          <p className="text-[var(--color-waldorf-moss)] text-lg leading-relaxed font-medium">
            Fomentamos una gestión participativa, horizontal y transparente, basada en la <strong className="text-[var(--color-waldorf-terracotta)] font-bold">trimembración social</strong>: pedagógica, administrativa y comunitaria.
          </p>
        </div>
      </div>
    </section>
  )
}
