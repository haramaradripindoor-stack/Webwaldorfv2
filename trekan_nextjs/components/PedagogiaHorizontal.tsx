'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const septenios = [
  {
    titulo: 'Primer Septenio',
    edad: '3 a 6 años',
    descripcion: 'El mundo es bueno. A través del juego libre, la imitación y el ritmo, el niño construye su cuerpo físico y desarrolla la voluntad.',
    color: 'bg-[var(--color-waldorf-mustard)]',
    image: '/assets/ig/post_1.jpg' // Using the newly scraped images
  },
  {
    titulo: 'Segundo Septenio',
    edad: '7 a 14 años',
    descripcion: 'El mundo es bello. A través de la autoridad amorosa, las artes y la imaginación, se cultiva el sentir y la conexión con el entorno.',
    color: 'bg-[var(--color-waldorf-terracotta)]',
    image: '/assets/ig/post_2.jpg'
  }
]

export default function PedagogiaHorizontal() {
  const targetRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Transforma el scroll vertical (0 a 1) en movimiento horizontal (0% a -X%)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-[#FAF8F5]">
      {/* Sticky container that stays in place while we scroll horizontally */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        <div className="absolute top-16 md:top-32 left-6 md:left-24 z-10">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#1a2e25]">
            El Viaje del <br />Caminante
          </h2>
          <p className="mt-4 text-lg font-sans text-[#1a2e25]/70 max-w-md">
            Un recorrido por las etapas de desarrollo en la pedagogía Waldorf.
          </p>
        </div>

        <motion.div style={{ x }} className="flex gap-16 md:gap-32 px-6 md:px-24 pl-[100vw] items-center">
          {septenios.map((etapa, idx) => (
            <div key={idx} className="w-[85vw] md:w-[60vw] flex-shrink-0 h-[60vh] relative flex flex-col md:flex-row items-center gap-12 group">
              
              {/* Image Container with Parallax effect inside */}
              <div className="w-full md:w-1/2 h-full relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${etapa.image})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <div className={`absolute inset-0 ${etapa.color} mix-blend-multiply opacity-20`} />
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-sm font-mono tracking-widest uppercase mb-4 text-[var(--color-waldorf-moss)]">
                  {etapa.edad}
                </span>
                <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#1a2e25]">
                  {etapa.titulo}
                </h3>
                <p className="text-lg md:text-xl font-sans text-[#1a2e25]/80 leading-relaxed">
                  {etapa.descripcion}
                </p>
              </div>
            </div>
          ))}
          
          {/* Espacio final para que termine de scrollear limpio */}
          <div className="w-[10vw] flex-shrink-0" />
        </motion.div>
      </div>
    </section>
  )
}
