'use client'

import { motion } from 'framer-motion'
import { Trees, Paintbrush, Heart, Users, GraduationCap } from 'lucide-react'

import Image from 'next/image'

export default function BentoGrid() {
  const cards = [
    {
      title: 'Aprendizaje Vivencial',
      desc: 'Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente.',
      icon: <Heart className="text-[var(--color-waldorf-terracotta)]" size={24} />,
      size: 'md:col-span-2 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-paper)]',
      image: '/images/galeria3.webp',
      lightText: true,
    },
    {
      title: 'Maestro Guía',
      desc: 'Acompaña al niño durante varios años, creando un vínculo profundo y seguro.',
      icon: <Users className="text-[var(--color-waldorf-moss)]" size={24} />,
      size: 'md:col-span-1 md:row-span-2',
      bg: 'bg-[var(--color-waldorf-sage)]/10',
      image: '/images/galeria2.webp',
      lightText: true,
    },
    {
      title: 'Conexión Naturaleza',
      desc: 'Huerta, carpintería, salidas al bosque y celebración de las estaciones.',
      icon: <Trees className="text-[var(--color-waldorf-moss)]" size={24} />,
      size: 'md:col-span-1 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-sage)]/20',
    },
    {
      title: 'Bloques Temáticos',
      desc: 'Contenidos integrados: arte, música, manualidades y movimiento.',
      icon: <Paintbrush className="text-[var(--color-waldorf-mustard)]" size={24} />,
      size: 'md:col-span-2 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-mustard)]/10',
      image: '/images/galeria4.webp',
      lightText: true,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section id="pedagogia" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <span className="text-[var(--color-waldorf-sage)] text-xs font-bold tracking-widest uppercase block mb-4">Nuestro Espacio</span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">Un Ecosistema para Crecer</h2>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`relative overflow-hidden rounded-[32px] p-8 ${card.bg} border border-[var(--color-waldorf-sage)]/10 flex flex-col justify-between group hover:border-[var(--color-waldorf-sage)]/30 transition-all duration-500 cursor-none earth-shadow earth-shadow-hover ${card.size}`}
          >
            {card.image && (
              <>
                <Image 
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </>
            )}

            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <span className={`${card.lightText ? 'text-white/60' : 'text-[var(--color-waldorf-text-light)]/30'} text-sm font-bold font-serif`}>
                0{index + 1}
              </span>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className={`text-2xl font-bold mb-3 font-serif ${card.lightText ? 'text-white' : 'text-[var(--color-waldorf-moss)]'}`}>
                {card.title}
              </h3>
              <p className={`${card.lightText ? 'text-white/90' : 'text-[var(--color-waldorf-text-light)]'} text-sm md:text-base leading-relaxed font-medium`}>
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
