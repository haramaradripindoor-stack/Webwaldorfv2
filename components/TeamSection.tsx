'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

const BASE = '/imagenes-web'

// Fotos reales del equipo desde Supabase.
// NOTA: Cuando tengas fotos individuales de cada maestro, reemplaza aquí la URL.
const team = [
  {
    name: 'Yabel Painemil',
    role: 'Docente Intercultural',
    bio: 'Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.',
    photo: `${BASE}/photo_2026-06-29_12-10-23.jpg`,
    tag: 'Jardín'
  },
  {
    name: 'Javiera Ortega',
    role: 'Profesora General Básica',
    bio: 'Especialista en lenguaje, cursando formación Waldorf.',
    photo: `${BASE}/actividapedagogicahumedales2.jpg`,
    tag: 'Básica'
  },
  {
    name: 'Hanna Lowen',
    role: 'Profesora de Inglés',
    bio: 'Enseñanza del inglés con enfoque vivencial y artístico.',
    photo: `${BASE}/actividapedagogicahumedales1.jpg`,
    tag: 'Idiomas'
  },
  {
    name: 'Matías Valiente',
    role: 'Profesor de Carpintería',
    bio: 'Maestro de oficios que guía a los niños en el trabajo con la madera y las manos.',
    photo: `${BASE}/paseocerro20261.jpg`,
    tag: 'Oficios'
  },
  {
    name: 'Verónica Sepúlveda',
    role: 'Profesora de Música',
    bio: 'La música como lenguaje del alma en cada jornada escolar.',
    photo: `${BASE}/fiesta%20de%20la%20luz202610.jpg`,
    tag: 'Artes'
  },
  {
    name: 'Ivonne Parada',
    role: 'Familia Fundadora · Convivencia Escolar',
    bio: 'Trabajadora Social UV, especialista en convivencia con formación en peritaje social, polivagal y gestalt.',
    photo: `${BASE}/paseocerro20264.jpg`,
    tag: 'Fundadora'
  },
]

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const cards = sectionRef.current.querySelectorAll('.team-card')

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 80, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="quienes-somos"
      className="py-32 px-6 md:px-12 max-w-7xl mx-auto"
    >
      {/* Encabezado editorial */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="text-[var(--color-waldorf-terracotta)] text-xs font-bold tracking-widest uppercase block mb-4">
            Quiénes Somos
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-waldorf-moss)] leading-[1.1]">
            Nuestro<br />Equipo
          </h2>
        </div>
        <p className="text-[var(--color-waldorf-text-light)] text-lg max-w-md font-light leading-relaxed">
          Educadores y familias comprometidas con el florecimiento integral de cada niño, desde el primer septenio hasta la adolescencia.
        </p>
      </div>

      {/* Grid asimétrico editorial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((person, i) => (
          <div
            key={i}
            className={`team-card group relative overflow-hidden rounded-3xl cursor-default will-change-transform
              ${i === 0 ? 'sm:col-span-2 lg:col-span-1 aspect-[3/2] lg:aspect-[3/4]' : 'aspect-[3/4]'}
            `}
          >
            {/* Foto de fondo */}
            <Image
              src={person.photo}
              alt={`${person.name} — ${person.role}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105"
            />

            {/* Gradiente siempre visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f18]/90 via-[#0d1f18]/30 to-transparent" />

            {/* Tag de categoría */}
            <div className="absolute top-5 left-5">
              <span className="bg-[var(--color-waldorf-terracotta)] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                {person.tag}
              </span>
            </div>

            {/* Texto inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight mb-1">
                {person.name}
              </h3>
              <p className="text-[var(--color-waldorf-terracotta)] text-xs font-semibold tracking-wide mb-3">
                {person.role}
              </p>
              {/* Bio oculta que aparece en hover */}
              <p className="text-white/70 text-sm leading-relaxed font-light
                max-h-0 overflow-hidden opacity-0
                group-hover:max-h-24 group-hover:opacity-100
                transition-all duration-700 ease-[0.16,1,0.3,1]">
                {person.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Nota editorial al pie */}
      <p className="mt-12 text-center text-[var(--color-waldorf-text-light)] text-sm font-light italic">
        * Las fotografías de perfil individuales de cada educador serán actualizadas próximamente.
      </p>
    </section>
  )
}
