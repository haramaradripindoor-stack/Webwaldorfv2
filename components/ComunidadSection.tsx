'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Users, CalendarHeart, Trees, Sparkles, BookOpen, User } from 'lucide-react'
import Image from 'next/image'

// Componente individual con Blur Reveal propio — sin violar Rules of Hooks
function PillarCard({ pillar, index }: { pillar: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 20%'],
  })

  // Blur Reveal / Fade In Up: entra con blur y desde abajo, sale limpio
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const y       = useTransform(scrollYProgress, [0, 0.4], [60, 0])
  const blur    = useTransform(scrollYProgress, [0, 0.35], [12, 0])
  const filter  = useTransform(blur, (b) => `blur(${b}px)`)

  // La imagen tiene un parallax suave hacia arriba
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, filter }}
      className="w-full"
    >
      {/* workaround for TS: use inline style for height via className */}
      <div className="relative w-full h-[65vh] md:h-[72vh] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] shadow-2xl">
        {/* Imagen con parallax */}
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-[-10%] w-[120%] h-[120%]"
        >
          <Image
            src={pillar.image}
            alt={pillar.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />
        <div className={`absolute inset-0 ${pillar.color} mix-blend-multiply opacity-30 z-10`} />

        {/* Número decorativo */}
        <div className="absolute top-6 right-8 text-white/[0.07] font-serif font-bold text-[9rem] leading-none select-none z-10">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Contenido del card */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <pillar.icon size={20} className="text-white" />
            </div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 font-bold">
              {pillar.tag}
            </span>
          </div>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            {pillar.title}
          </h3>
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-light max-w-2xl">
            {pillar.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Header del story — también con Blur Reveal propio
function StoryHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 10%'] })
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const y       = useTransform(scrollYProgress, [0, 0.5], [40, 0])
  const blur    = useTransform(scrollYProgress, [0, 0.4], [8, 0])
  const filter  = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <motion.div ref={ref} style={{ opacity, y, filter }} className="pt-28 pb-16 px-6 md:px-20 max-w-5xl mx-auto">
      <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-waldorf-terracotta)] font-bold block mb-4">
        Nuestra Comunidad
      </span>
      <h2 className="text-5xl md:text-7xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6 leading-[1.05]">
        Vida<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-waldorf-moss)] to-[var(--color-waldorf-terracotta)]">
          Comunitaria
        </span>
      </h2>
      <p className="text-xl md:text-2xl text-[#1a2e25]/65 max-w-2xl font-light leading-relaxed">
        En Trekan, la comunidad es protagonista. Las familias construyen el proyecto educativo junto a los maestros — porque educar es una tarea de todos.
      </p>
    </motion.div>
  )
}

// Frase intermedia de Scrollytelling — emerge entre pilares para mantener el ritmo narrativo
function NarrativeQuote({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 25%'] })
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0, 1, 1, 0.4])
  const y       = useTransform(scrollYProgress, [0, 0.4], [30, 0])
  const blur    = useTransform(scrollYProgress, [0, 0.35], [6, 0])
  const filter  = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <motion.div ref={ref} style={{ opacity, y, filter }} className="py-16 px-6 md:px-20 max-w-4xl mx-auto text-center">
      <p className="text-2xl md:text-4xl font-serif italic text-[var(--color-waldorf-moss)] leading-relaxed">
        "{text}"
      </p>
    </motion.div>
  )
}

const pillars = [
  {
    title: 'El Maestro Guía',
    tag: 'El pilar pedagógico',
    description: 'Acompaña a la generación durante años, formando un vínculo profundo de respeto, amor y conocimiento de cada niño. Es la autoridad amorosa en el aula.',
    icon: User,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/equipoescolar.jpg',
    color: 'bg-[var(--color-waldorf-mustard)]'
  },
  {
    title: 'Consejo Escolar',
    tag: 'Gestión horizontal',
    description: 'El corazón administrativo de nuestra comunidad. Un espacio transparente donde apoderados y maestros deciden juntos el futuro del colegio.',
    icon: Users,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/photo_2026-06-29_12-10-23.jpg',
    color: 'bg-[#1a2e25]'
  },
  {
    title: 'Asambleas Mensuales',
    tag: 'Ritmo y fraternidad',
    description: 'Encuentros regulares donde compartimos el avance de las clases, las festividades del mes y cultivamos la fraternidad entre las familias.',
    icon: CalendarHeart,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/photo_2026-06-29_12-10-14.jpg',
    color: 'bg-[var(--color-waldorf-terracotta)]'
  },
  {
    title: 'Celebraciones Estacionales',
    tag: 'Naturaleza y celebración',
    description: 'Fiestas de la Cosecha, Faroles, Espiral de Adviento. Marcamos el ritmo de la naturaleza celebrando juntos los cambios de cada estación.',
    icon: Trees,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta-de-la-luz2026.jpg',
    color: 'bg-[var(--color-waldorf-sage)]'
  },
  {
    title: 'Comisiones de Trabajo',
    tag: 'Manos en la tierra',
    description: 'Mantenimiento del espacio, bazar, huerto escolar. Las manos de nuestra comunidad construyen y cuidan el entorno de nuestros niños.',
    icon: Sparkles,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/comisionobraymantencion2.webp',
    color: 'bg-[var(--color-waldorf-moss)]'
  },
  {
    title: 'Trimembración Social',
    tag: 'Transparencia pedagógica',
    description: 'Una gestión participativa, horizontal y transparente que une las esferas pedagógica, administrativa y comunitaria en perfecta armonía.',
    icon: BookOpen,
    image: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/photo_2025-06-24_08-26-33.jpg',
    color: 'bg-[#1a2e25]'
  }
]

// Frases narrativas que aparecen entre cards — mantienen el hilo de la historia
const quotes = [
  'El niño aprende de quienes lo rodean.',
  'Una comunidad viva transforma la educación.',
  'Aquí las manos de los padres también forman al niño.',
  'La fiesta es un acto pedagógico.',
]

export default function ComunidadSection() {
  return (
    <section id="comunidad" className="relative w-full bg-[#FAF8F5]">
      {/* Acto I — Pensar: el header seduce con el concepto */}
      <StoryHeader />

      {/* Acto II — Sentir: las imágenes emergen mientras se cuenta la historia */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-6">
        {pillars.map((pillar, i) => (
          <div key={i}>
            <PillarCard pillar={pillar} index={i} />
            {/* Frase narrativa entre cards — ritmo editorial */}
            {i < quotes.length && (
              <NarrativeQuote text={quotes[i]} index={i} />
            )}
          </div>
        ))}
      </div>

      {/* Acto III — Querer: CTA de admisión al final del journey */}
      <CtaAdmision />
    </section>
  )
}

function CtaAdmision() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 20%'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y       = useTransform(scrollYProgress, [0, 0.5], [50, 0])
  const blur    = useTransform(scrollYProgress, [0, 0.4], [10, 0])
  const filter  = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, filter }}
      className="py-32 px-6 md:px-20 max-w-4xl mx-auto text-center"
    >
      <span className="text-sm font-mono tracking-widest uppercase text-[var(--color-waldorf-terracotta)] font-bold block mb-8">
        Admisión 2026
      </span>
      <h3 className="text-5xl md:text-8xl lg:text-[7rem] font-serif font-bold text-[#1a2e25] mb-8 leading-[1.05]">
        Comencemos<br />el Viaje
      </h3>
      <p className="text-xl md:text-3xl text-[#1a2e25]/60 mb-14 font-light leading-relaxed max-w-2xl mx-auto">
        Las familias de Trekan son protagonistas del proyecto educativo. Hay cupos disponibles para 2026.
      </p>
      <a
        href="#admision"
        className="inline-flex items-center gap-4 px-12 md:px-14 py-6 md:py-7 rounded-full bg-[var(--color-waldorf-moss)] text-white font-bold text-base md:text-lg tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
      >
        Solicitar información
        <span className="text-xl md:text-2xl">→</span>
      </a>
    </motion.div>
  )
}
