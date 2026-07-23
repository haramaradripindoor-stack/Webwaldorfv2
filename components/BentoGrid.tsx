'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

// Sub-componente para el efecto Spotlight en cada tarjeta
function BentoCard({ card, index }: { card: any, index: number }) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  // Variaciones sutiles y orgánicas de los bordes para romper la geometría perfecta
  const borderRadiuses = [
    '2rem 3.5rem 1.5rem 2.5rem',
    '3.5rem 2rem 2.5rem 1.5rem',
    '1.5rem 2.5rem 2rem 3.5rem',
    '2.5rem 1.5rem 3.5rem 2rem',
  ]
  const organicRadius = borderRadiuses[index % 4]

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden p-10 min-h-[420px] md:min-h-0 ${card.bg} flex flex-col justify-end group cursor-none ${card.size}`}
      style={{
        borderRadius: organicRadius,
        // Borde luminoso sutil basado en el mouse (MotionSites effect)
        boxShadow: opacity ? '0 0 40px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      {/* Efecto Spotlight que sigue el mouse */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-30 mix-blend-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.25), transparent 40%)`,
        }}
      />

      {card.image && (
        <>
          <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/50 transition-colors duration-700" />
          <Image 
            src={card.image}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </>
      )}
      
      <div className={`relative z-20 ${card.lightText ? 'text-white' : 'text-[#1a2e25]'} transform transition-transform duration-700 md:translate-y-4 group-hover:translate-y-0`}>
        <span className="text-sm italic font-serif mb-2 block opacity-80">
          {card.subtitle}
        </span>
        <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight drop-shadow-sm">
          {card.title}
        </h3>
        {/* Siempre visible en mobile, aparece en hover solo en desktop */}
        <p className="text-base md:text-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100 font-medium max-w-sm drop-shadow-sm">
          {card.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function BentoGrid() {
  const cards = [
    {
      title: 'Aprendizaje Vivencial',
      subtitle: 'El Arte de Hacer',
      desc: 'Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente. No memorizamos, experimentamos.',
      size: 'md:col-span-2 md:row-span-2',
      bg: 'bg-[#1a2e25]',
      image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales3.jpg',
      lightText: true,
    },
    {
      title: 'Maestro Guía',
      subtitle: 'Vínculo Profundo',
      desc: 'Acompaña al niño durante años, creando un refugio seguro.',
      size: 'md:col-span-1 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-mustard)]',
      image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/equipoescolar.jpg',
      lightText: true,
    },
    {
      title: 'Conexión Natural',
      subtitle: 'Nuestra Aula',
      desc: 'Huerta, carpintería y bosque.',
      size: 'md:col-span-1 md:row-span-2',
      bg: 'bg-transparent',
      image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20267.jpg',
      lightText: true,
    },
    {
      title: 'Bloques Temáticos',
      subtitle: 'Inmersión Total',
      desc: 'Semanas dedicadas a un solo tema para profundizar verdaderamente.',
      size: 'md:col-span-2 md:row-span-1',
      bg: 'bg-[var(--color-waldorf-terracotta)]',
      image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales4.jpg',
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
            <BentoCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
