'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const septenios = [
  {
    titulo: 'Jardín de Infantes',
    edad: 'Primer Septenio · 3-6 años',
    descripcion: 'El mundo es bueno. A través del juego libre, la imitación y el ritmo, el niño construye su cuerpo físico y desarrolla la voluntad en un entorno hogareño y cálido.',
    image: '/imagenes-web/photo_2026-06-29_12-10-23.jpg',
    num: '01'
  },
  {
    titulo: 'Enseñanza Básica',
    edad: 'Segundo Septenio · 7-12 años',
    descripcion: 'El mundo es bello. Guiados por el maestro de clase y a través del arte, la imaginación y las narraciones, los niños cultivan su mundo emocional y su conexión con el entorno.',
    image: '/imagenes-web/actividapedagogicahumedales2.jpg',
    num: '02'
  },
  {
    titulo: 'El Paso del Rubicón',
    edad: 'Crisis de los 9 años',
    descripcion: 'Un hito emocional profundo. El niño comienza a experimentar su propia individualidad, separándose del mundo que lo rodea. Lo acompañamos con firmeza y amor.',
    image: '/imagenes-web/paseocerro20261.jpg',
    num: '03'
  },
  {
    titulo: 'Hacia la Adolescencia',
    edad: 'Transición · 13-14 años',
    descripcion: 'El mundo es verdadero. Despierta el pensamiento lógico y crítico. Los jóvenes buscan comprender el mundo a través de su propio juicio y experimentación.',
    image: '/imagenes-web/actividapedagogicahumedales1.jpg',
    num: '04'
  }
]

// Componente para cada tarjeta manejado puramente por el scroll
function SeptenioCard({
  etapa,
  index,
  total,
  scrollYProgress,
}: {
  etapa: (typeof septenios)[0]
  index: number
  total: number
  scrollYProgress: any
}) {
  const start = index / total
  const end = (index + 1) / total
  const fade = 0.12

  let input, outputOpacity, outputY, outputBlur, outputScale

  if (index === 0) {
    input = [0, end - fade, end]
    outputOpacity = [1, 1, 0]
    outputY = [0, 0, -40]
    outputBlur = [0, 0, 12]
    outputScale = [1, 1, 0.95]
  } else if (index === total - 1) {
    input = [start - fade, start, 1]
    outputOpacity = [0, 1, 1]
    outputY = [40, 0, 0]
    outputBlur = [12, 0, 0]
    outputScale = [0.95, 1, 1]
  } else {
    input = [start - fade, start, end - fade, end]
    outputOpacity = [0, 1, 1, 0]
    outputY = [40, 0, 0, -40]
    outputBlur = [12, 0, 0, 12]
    outputScale = [0.95, 1, 1, 0.95]
  }

  const opacity = useTransform(scrollYProgress, input, outputOpacity)
  const y = useTransform(scrollYProgress, input, outputY)
  const blurVal = useTransform(scrollYProgress, input, outputBlur)
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`)
  const scale = useTransform(scrollYProgress, input, outputScale)
  
  // Desactivar clicks cuando está invisible
  const pointerEvents = useTransform(opacity, (val) => val > 0.5 ? 'auto' : 'none')

  return (
    <motion.div
      style={{ opacity, y, filter, scale, pointerEvents }}
      className="absolute inset-0 w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 px-6 md:px-20 pt-24 md:pt-0 pb-16 md:pb-0"
    >
      {/* Imagen */}
      <div className="relative w-full md:w-[50%] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0">
        <Image
          src={etapa.image}
          alt={etapa.titulo}
          fill
          className="object-cover"
        />
      </div>

      {/* Texto */}
      <div className="w-full md:w-[50%] flex flex-col justify-center">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--color-waldorf-terracotta)] font-bold block mb-3">
          {etapa.num} — {etapa.edad}
        </span>
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1a2e25] mb-5 leading-tight">
          {etapa.titulo}
        </h3>
        <p className="text-base md:text-lg text-[#1a2e25]/70 leading-relaxed font-light max-w-md">
          {etapa.descripcion}
        </p>
      </div>
    </motion.div>
  )
}

function ProgressDot({ index, total, scrollYProgress }: {
  index: number
  total: number
  scrollYProgress: any
}) {
  const start = index / total
  const end = (index + 1) / total
  const fade = 0.05

  let input, outputHeight, outputColor

  if (index === 0) {
    input = [0, end - fade, end]
    outputHeight = [24, 24, 6]
    outputColor = ['var(--color-waldorf-moss)', 'var(--color-waldorf-moss)', 'rgba(26,46,37,0.3)']
  } else if (index === total - 1) {
    input = [start - fade, start, 1]
    outputHeight = [6, 24, 24]
    outputColor = ['rgba(26,46,37,0.3)', 'var(--color-waldorf-moss)', 'var(--color-waldorf-moss)']
  } else {
    input = [start - fade, start, end - fade, end]
    outputHeight = [6, 24, 24, 6]
    outputColor = ['rgba(26,46,37,0.3)', 'var(--color-waldorf-moss)', 'var(--color-waldorf-moss)', 'rgba(26,46,37,0.3)']
  }

  const height = useTransform(scrollYProgress, input, outputHeight)
  const backgroundColor = useTransform(scrollYProgress, input, outputColor)

  return (
    <motion.div
      style={{ height, backgroundColor }}
      className="w-1.5 rounded-full transition-colors duration-100"
    />
  )
}

export default function PedagogiaHorizontal() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // 80vh por tarjeta para que no sea tan largo
  const totalVh = septenios.length * 80

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="viaje"
      className="relative bg-[#FAF8F5]"
      style={{ height: `${totalVh}vh` }}
    >
      {/* STICKY */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-[#FAF8F5] flex flex-col">

        {/* Header compacto fijo */}
        <div className="shrink-0 pt-8 pb-2 px-6 md:px-20 z-20 bg-gradient-to-b from-[#FAF8F5] to-transparent">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-waldorf-terracotta)] font-bold block mb-1">
            Metodología Waldorf
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1a2e25] leading-tight">
            Pedagogía Waldorf: El Viaje del Caminante
          </h2>
        </div>

        {/* Contenedor relativo para las tarjetas apiladas (position: absolute) */}
        <div className="flex-1 relative w-full h-full">
          {septenios.map((etapa, i) => (
            <SeptenioCard
              key={i}
              etapa={etapa}
              index={i}
              total={septenios.length}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Dots laterales */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
            {septenios.map((_, i) => (
              <ProgressDot
                key={i}
                index={i}
                total={septenios.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Barra de progreso horizontal */}
        <div className="shrink-0 h-[2px] bg-[#1a2e25]/10 relative z-30">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[var(--color-waldorf-moss)]"
            style={{ width: progressWidth }}
          />
        </div>

        {/* Hint "Sigue bajando" */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#1a2e25]/40 pointer-events-none z-30"
        >
          <span className="text-[9px] font-mono tracking-widest uppercase">Sigue bajando</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-[#1a2e25]/40 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
