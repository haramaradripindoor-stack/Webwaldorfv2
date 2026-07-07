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
      image: '/assets/fb/fb_post_1.jpg',
      lightText: true,
    },
    {
      title: 'Maestro Guía',
      desc: 'Acompaña al niño durante varios años, creando un vínculo profundo y seguro.',
      icon: <Users className="text-[var(--color-waldorf-moss)]" size={24} />,
      size: 'md:col-span-1 md:row-span-2',
      bg: 'bg-[var(--color-waldorf-sage)]/10',
      image: '/assets/fb/fb_post_3.jpg',
      lightText: true,
    },
    {
      title: 'Conexión Naturaleza',
      desc: 'Huerta, carpintería, salidas al bosque y celebración de las estaciones.',
      icon: <Trees className="text-[var(--color-waldorf-moss)]" size={24} />,
      size: 'md:col-span-1 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-sage)]/20',
      image: '/assets/fb/fb_post_5.jpg',
      lightText: true,
    },
    {
      title: 'Bloques Temáticos',
      desc: 'Contenidos integrados: arte, música, manualidades y movimiento.',
      icon: <Paintbrush className="text-[var(--color-waldorf-mustard)]" size={24} />,
      size: 'md:col-span-2 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-mustard)]/10',
      image: '/assets/fb/fb_post_6.jpg',
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className={`relative overflow-hidden rounded-[32px] p-8 ${card.bg} border border-[var(--color-waldorf-sage)]/10 flex flex-col justify-between group hover:border-[var(--color-waldorf-sage)]/30 transition-all duration-500 earth-shadow earth-shadow-hover ${card.size}`}
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
                <div className={`relative h-full w-full p-8 flex flex-col justify-between z-10 ${card.lightText ? 'text-white' : 'text-[#1a2e25]'}`}>
              {/* Icon */}
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  {card.icon}
                </div>
                <span className="font-mono text-xs opacity-50 tracking-widest">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              {/* Text Content */}
              <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-serif font-bold mb-3 drop-shadow-md">{card.title}</h3>
                <p className="text-sm md:text-base font-sans opacity-0 group-hover:opacity-90 transition-opacity duration-500 delay-100 max-w-sm drop-shadow-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
              </>
            )}

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
      </div>
    </section>
  )
}
