'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

function BentoCard({ card, index }: { card: any, index: number }) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPosition({ x, y })

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    setTilt({ rotateX, rotateY })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => {
    setOpacity(0)
    setTilt({ rotateX: 0, rotateY: 0 })
  }

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
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden p-8 sm:p-10 min-h-[380px] md:min-h-0 bg-[#0D1F17] flex flex-col justify-end group ${card.size} will-change-transform shadow-xl`}
      style={{
        borderRadius: organicRadius,
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: opacity ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-30 mix-blend-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.25), transparent 40%)`,
        }}
      />

      {card.image && (
        <>
          <Image 
            src={card.image}
            alt={card.title}
            fill
            className={`object-cover ${card.objectPosition || 'object-center'} transition-transform duration-1000 group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradiente de alto contraste permanente para garantizar lectura perfecta */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1710]/95 via-[#0B1710]/55 to-black/20 z-10" />
        </>
      )}
      
      <div className="relative z-20 text-white transform transition-transform duration-500 md:translate-y-2 group-hover:translate-y-0">
        <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 block text-[#EBBA7A] drop-shadow-sm font-mono">
          {card.subtitle}
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight text-white drop-shadow-md">
          {card.title}
        </h3>
        <p className="text-sm sm:text-base text-[#FAF8F5]/90 font-light leading-relaxed max-w-md drop-shadow-sm">
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
      image: '/imagenes-web/puedes-bailar-teatro-del-lago-expresion-movimiento.webp',
      objectPosition: 'object-top',
    },
    {
      title: 'La Luz del Cobijo',
      subtitle: 'Salas & Madera Noble',
      desc: 'Espacios de madera nativa y ventanales hacia el bosque, donde el tiempo se detiene para cuidar la infancia.',
      size: 'md:col-span-1 md:row-span-1',
      image: '/assets/pilares/aula_madera_ventanales.webp',
      objectPosition: 'object-center',
    },
    {
      title: 'Conexión Natural',
      subtitle: 'Nuestra Aula Viva',
      desc: 'Parque Ivian, bosque templado lluvioso y praderas abiertas donde la voluntad camina libre.',
      size: 'md:col-span-1 md:row-span-2',
      image: '/imagenes-web/fiestas-2026/_MG_5515.webp',
      objectPosition: 'object-center',
    },
    {
      title: 'Bloques Temáticos',
      subtitle: 'Inmersión y Épocas',
      desc: 'Semanas continuas dedicadas a una sola materia en pizarras de época para profundizar y amar el saber.',
      size: 'md:col-span-2 md:row-span-1',
      image: '/assets/bento/bento_pizarra_inmersion.webp',
      objectPosition: 'object-center',
    },
  ]

  return (
    <section id="pedagogia" className="py-28 px-6 md:px-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 md:w-2/3">
          <span className="text-[#A84126] text-xs font-bold tracking-[0.25em] uppercase block mb-4 border-l-2 border-[#A84126] pl-3.5">
            Filosofía Trekan
          </span>
          <h2 className="text-4xl md:text-6xl font-light font-serif text-[#1A3526] leading-tight">
            Un ecosistema diseñado para <span className="font-bold italic text-[#946820]">florecer</span>.
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
