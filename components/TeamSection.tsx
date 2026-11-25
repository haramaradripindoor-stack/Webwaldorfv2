'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Compass, BookOpen, Music, Hammer, HeartHandshake } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const facultyMembers = [
  {
    name: 'Yabel Painemil',
    discipline: 'Interculturalidad & Gimnasia Bothmer',
    tag: 'Jardín & Raíces',
    icon: Compass,
    accent: 'border-[#946820]/30 hover:border-[#946820]',
    bgBadge: 'bg-[#946820]/10 text-[#946820]',
    bio: 'Comunicadora audiovisual, docente bilingüe y especialista en gimnasia Bothmer. Conecta el desarrollo espacial y motriz con la cosmovisión territorial y el respeto por los pueblos originarios.'
  },
  {
    name: 'Javiera Ortega',
    discipline: 'Profesora General Básica',
    tag: 'Lenguaje & Épocas',
    icon: BookOpen,
    accent: 'border-[#A84126]/30 hover:border-[#A84126]',
    bgBadge: 'bg-[#A84126]/10 text-[#A84126]',
    bio: 'Especialista en lenguaje y procesos lectoescritores. Acompaña a los estudiantes de básica mediante la narración viva, el dibujo de formas y el despertar armónico del pensamiento.'
  },
  {
    name: 'Hanna Lowen',
    discipline: 'Lengua Inglesa Vivencial',
    tag: 'Idiomas',
    icon: Sparkles,
    accent: 'border-[#2D5A43]/30 hover:border-[#2D5A43]',
    bgBadge: 'bg-[#2D5A43]/10 text-[#2D5A43]',
    bio: 'Inmersión en la lengua inglesa a través del ritmo, la dramatización, rimas y canciones tradicionales, permitiendo una apropiación natural y afectiva del segundo idioma.'
  },
  {
    name: 'Matías Valiente',
    discipline: 'Maestro de Oficios & Carpintería',
    tag: 'Manos & Voluntad',
    icon: Hammer,
    accent: 'border-[#946820]/30 hover:border-[#946820]',
    bgBadge: 'bg-[#946820]/10 text-[#946820]',
    bio: 'Formación del carácter y la perseverancia a través del trabajo manual en maderas nobles del sur, enseñando el cuidado de las herramientas y el respeto a la materia prima.'
  },
  {
    name: 'Verónica Sepúlveda',
    discipline: 'Educación Musical & Canto Coral',
    tag: 'Artes Sonoras',
    icon: Music,
    accent: 'border-[#A84126]/30 hover:border-[#A84126]',
    bgBadge: 'bg-[#A84126]/10 text-[#A84126]',
    bio: 'Guía la experiencia musical colectiva a través de flautas pentatónicas, cítaras y canto a voces. La música actúa como respiración y armonización diaria del aula.'
  },
  {
    name: 'Comunidad Educativa',
    discipline: 'Acompañamiento & Convivencia',
    tag: 'Sostén Colectivo',
    icon: HeartHandshake,
    accent: 'border-[#2D5A43]/30 hover:border-[#2D5A43]',
    bgBadge: 'bg-[#2D5A43]/10 text-[#2D5A43]',
    bio: 'El claustro de maestros y las comisiones de apoderados operan en co-responsabilidad fraterna, garantizando un entorno sano, libre de pantallas y de profundo cobijo humano.'
  }
]

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const rosterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Entrada del bloque principal
      if (heroCardRef.current) {
        gsap.fromTo(
          heroCardRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: heroCardRef.current,
              start: 'top 80%',
            }
          }
        )
      }

      // Entrada secuencial del directorio de disciplinas
      if (rosterRef.current) {
        const cards = rosterRef.current.children
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rosterRef.current,
              start: 'top 82%',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="quienes-somos"
      className="py-28 px-6 md:px-12 max-w-7xl mx-auto"
    >
      {/* 1. Encabezado Editorial */}
      <div className="mb-16 md:mb-20 max-w-3xl">
        <span className="text-[#A84126] text-xs font-bold tracking-[0.25em] uppercase block mb-4 border-l-2 border-[#A84126] pl-3.5">
          Gobierno Escolar & Claustro Colegiado
        </span>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1A3526] leading-[1.1] mb-6">
          Educadores y Familias <br />
          <span className="font-serif italic font-normal text-[#946820]">al cuidado de la infancia</span>
        </h2>
        <p className="text-[#1A3526]/75 text-lg font-light leading-relaxed">
          En la pedagogía Waldorf no existe una jerarquía piramidal abstracta. El colegio es guiado por un <strong className="font-semibold text-[#1A3526]">Claustro Docente colegiado</strong> y una comunidad de familias fundadoras que sostienen con amor y presencia cada ciclo de desarrollo.
        </p>
      </div>

      {/* 2. Bloque Principal: Claustro de Profesores & Fundadora (Elemento Visual Distintivo) */}
      <div
        ref={heroCardRef}
        className="mb-16 bg-[#FAF8F5] border border-[#2D5A43]/15 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Foto Oficial del Claustro Colectivo */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
            <Image
              src="/imagenes-web/equipoescolar.jpg"
              alt="Claustro de profesores y comunidad educativa Colegio Waldorf Trekan"
              fill
              priority={false}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1710]/80 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white text-xs font-mono tracking-wider bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg">
              Claustro Docente · Colegio Waldorf Trekan
            </div>
          </div>

          {/* Coordinación y Familia Fundadora: Ivonne Parada */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-[#F4F0E8] border-t lg:border-t-0 lg:border-l border-[#2D5A43]/10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#1A3526] border border-[#946820]/40 shadow-md shrink-0 flex items-center justify-center p-2.5">
                  <Image
                    src="/brand/trekan_isotipo_puro_crema.svg"
                    alt="Colegio Waldorf Trekan Monograma Institucional"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#A84126]/10 text-[#A84126]">
                    Familia Fundadora
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1A3526] mt-1.5">
                    Ivonne Parada
                  </h3>
                  <p className="text-xs font-medium text-[#946820]">
                    Coordinación & Convivencia Escolar
                  </p>
                </div>
              </div>

              <p className="text-sm md:text-base text-[#1A3526]/85 font-light leading-relaxed mb-6">
                Trabajadora Social por la Universidad de Valparaíso, especialista en convivencia escolar y peritaje social, con formación en enfoque polivagal y gestalt. Como familia fundadora, impulsa el cobijo socioemocional y la alianza virtuosa entre la escuela y el hogar.
              </p>

              <blockquote className="border-l-2 border-[#946820] pl-4 py-1 italic text-xs md:text-sm font-serif text-[#1A3526]/80 leading-relaxed bg-[#FAF8F5]/60 rounded-r-xl">
                «La escuela no es una fábrica de contenidos, sino un santuario vivo donde el niño es acogido en su ritmo natural y sostenido con presencia real.»
              </blockquote>
            </div>

            <div className="pt-8 border-t border-[#2D5A43]/10 mt-6 flex items-center justify-between text-xs text-[#1A3526]/60 font-mono">
              <span>Parque Ivian · Puerto Varas</span>
              <span className="text-[#A84126] font-semibold">Fundado con Amor</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Directorio de Disciplinas Pedagógicas (Elemento 2: Roster Tipográfico y Riguroso) */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A3526]">
            Disciplinas & Maestros Guías
          </h3>
          <span className="text-xs font-mono text-[#1A3526]/60">
            6 Áreas Formativas
          </span>
        </div>

        <div
          ref={rosterRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {facultyMembers.map((member, i) => {
            const Icon = member.icon
            return (
              <div
                key={i}
                className={`p-7 rounded-2xl bg-[#FAF8F5] border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between ${member.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${member.bgBadge}`}>
                      {member.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F4F0E8] flex items-center justify-center text-[#1A3526]/70">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h4 className="text-xl font-serif font-bold text-[#1A3526] mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#A84126] mb-3">
                    {member.discipline}
                  </p>
                  <p className="text-xs md:text-sm text-[#1A3526]/75 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#2D5A43]/10 flex items-center justify-between text-[11px] font-mono text-[#1A3526]/50">
                  <span>Waldorf Trekan</span>
                  <span>Pedagogía Viva</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
