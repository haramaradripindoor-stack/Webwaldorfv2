'use client'

import { motion } from 'framer-motion'
import { Trees, Paintbrush, Heart, Users, GraduationCap } from 'lucide-react'

import Image from 'next/image'

export default function BentoGrid() {
  const cards = [
    {
      title: 'Aprendizaje Vivencial',
      subtitle: 'El Arte de Hacer',
      desc: 'Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente. No memorizamos, experimentamos.',
      size: 'md:col-span-2 md:row-span-2',
      bg: 'bg-[#1a2e25]',
      image: '/assets/fb/fb_post_1.jpg',
      lightText: true,
    },
    {
      title: 'Maestro Guía',
      subtitle: 'Vínculo Profundo',
      desc: 'Acompaña al niño durante años, creando un refugio seguro.',
      size: 'md:col-span-1 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-mustard)]',
      image: '',
      lightText: false,
    },
    {
      title: 'Conexión Natural',
      subtitle: 'Nuestra Aula',
      desc: 'Huerta, carpintería y bosque.',
      size: 'md:col-span-1 md:row-span-2',
      bg: 'bg-transparent',
      image: '/assets/fb/fb_post_5.jpg',
      lightText: true,
    },
    {
      title: 'Bloques Temáticos',
      subtitle: 'Inmersión Total',
      desc: 'Semanas dedicadas a un solo tema para profundizar verdaderamente.',
      size: 'md:col-span-2 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-terracotta)]',
      image: '/assets/fb/fb_post_6.jpg',
      lightText: true,
    },
  ]

  return (
    <section id="pedagogia" className="py-32 px-6 md:px-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 md:w-2/3">
          <span className="text-[var(--color-waldorf-terracotta)] text-sm font-bold tracking-[0.2em] uppercase block mb-6 border-l-2 border-[var(--color-waldorf-terracotta)] pl-4">
            Filosofía Trekan
          </span>
          <h2 className="text-4xl md:text-7xl font-light font-serif text-[#1a2e25] leading-tight">
            Un ecosistema diseñado para <span className="font-bold italic">florecer</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[2rem] p-10 ${card.bg} flex flex-col justify-end group ${card.size}`}
            >
              {card.image && (
                <>
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/40 transition-colors duration-700" />
                  <Image 
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </>
              )}
              
              <div className={`relative z-20 ${card.lightText ? 'text-white' : 'text-[#1a2e25]'} transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0`}>
                <span className="text-xs font-bold tracking-widest uppercase mb-3 block opacity-70">
                  {card.subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                  {card.title}
                </h3>
                <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light max-w-sm">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
