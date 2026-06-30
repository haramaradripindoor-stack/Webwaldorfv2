'use client'

import { motion } from 'framer-motion'

const team = [
  {
    name: 'Yabel Painemil',
    role: 'Docente Intercultural',
    bio: 'Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.',
    emoji: '🌿',
  },
  {
    name: 'Javiera Ortega',
    role: 'Profesora General Básica',
    bio: 'Especialista en lenguaje, cursando formación Waldorf.',
    emoji: '📖',
  },
  {
    name: 'Hanna Lowen',
    role: 'Profesora de Inglés',
    bio: 'Enseñanza del inglés con enfoque vivencial y artístico.',
    emoji: '🌍',
  },
  {
    name: 'Matías Valiente',
    role: 'Profesor de Carpintería',
    bio: 'Maestro de oficios que guía a los niños en el trabajo con la madera y las manos.',
    emoji: '🪵',
  },
  {
    name: 'Sofía González Rodríguez',
    role: 'Profesora de Música',
    bio: 'La música como lenguaje del alma en cada jornada escolar.',
    emoji: '🎵',
  },
  {
    name: 'Ivonne Parada',
    role: 'Familia Fundadora · Convivencia Escolar',
    bio: 'Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal y gestalt.',
    emoji: '💛',
  },
  {
    name: 'Sleater Martínez',
    role: 'Familia Fundadora · Educadora de Párvulos',
    bio: 'Cursando formación Waldorf en Fundación Arche.',
    emoji: '🌸',
  },
  {
    name: 'Felipe Vivanco Cornejo',
    role: 'Familia Fundadora · Administración',
    bio: 'Administrador Público UV, formación en NICSP, Neurociencias y GYDP. Terapeuta, Escuela Arica.',
    emoji: '🧭',
  },
  {
    name: 'Gerard Muñoz',
    role: 'Familia Fundadora · Tecnología',
    bio: 'Ingeniero en Informática.',
    emoji: '💻',
  },
]

export default function TeamSection() {
  return (
    <section id="equipo" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-[var(--color-waldorf-paper)] rounded-[40px] my-12 earth-shadow">
      <div className="mb-16 text-center md:text-left">
        <span className="text-[var(--color-waldorf-mustard)] text-xs font-bold tracking-widest uppercase block mb-4">
          Quiénes Somos
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          Nuestro Equipo
        </h2>
        <p className="text-[var(--color-waldorf-text-light)] text-lg mt-4 max-w-2xl font-medium">
          Un grupo de educadores y familias comprometidas con el florecimiento integral de la infancia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((person, i) => (
          <motion.div
            key={i}
            className="rounded-2xl p-6 bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/10 hover:border-[var(--color-waldorf-sage)]/30 transition-all duration-500 group earth-shadow-hover"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-waldorf-sage)]/10 flex items-center justify-center text-2xl shrink-0 shadow-sm transition-colors group-hover:border-[var(--color-waldorf-mustard)]/40">
                {person.emoji}
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-waldorf-moss)] text-sm group-hover:text-[var(--color-waldorf-terracotta)] transition-colors font-serif">
                  {person.name}
                </h3>
                <p className="text-[var(--color-waldorf-sage)] text-xs font-semibold mt-0.5">{person.role}</p>
                <p className="text-[var(--color-waldorf-text-light)] text-xs mt-2 leading-relaxed font-medium">{person.bio}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
