'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

const ADMISION_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdXbiojPJFncN94G3AS5huINvHKjpv2xFLcEaMjsHiC8sHYSQ/viewform'

const steps = [
  {
    icon: <CalendarCheck className="text-[var(--color-waldorf-mustard)]" size={26} />,
    title: 'Agenda una Visita',
    desc: 'Conoce nuestro espacio, conversa con el equipo y siente la energía del colegio.',
  },
  {
    icon: <Users className="text-[var(--color-waldorf-sage)]" size={26} />,
    title: 'Entrevista Familiar',
    desc: 'Conversamos contigo para entender las necesidades de tu hijo/a y tu familia.',
  },
  {
    icon: <Sparkles className="text-[var(--color-waldorf-terracotta)]" size={26} />,
    title: 'Bienvenida',
    desc: 'Si hay sintonía mutua, ¡celebramos la llegada de una nueva familia a la comunidad Trekan!',
  },
]

export default function AdmisionSection() {
  return (
    <section id="admision" className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Organic Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-[100%] bg-gradient-to-br from-[var(--color-waldorf-moss)]/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <span className="text-[var(--color-waldorf-sage)] text-xs font-bold tracking-widest uppercase block mb-4">
            Admisión 2026
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-[var(--color-waldorf-moss)]">
            Comienza el Camino
          </h2>
          <p className="text-[var(--color-waldorf-text-light)] text-lg max-w-xl mx-auto font-medium">
            El proceso de admisión está abierto todo el año. Estos son los pasos para ser parte de nuestra comunidad.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {/* Conector visual orgánico (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-px border-t-2 border-dashed border-[var(--color-waldorf-sage)]/20 -z-10" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <div className="absolute top-0 right-1/4 md:right-4 w-6 h-6 rounded-full bg-[var(--color-waldorf-cream)] border-2 border-[var(--color-waldorf-sage)]/30 flex items-center justify-center text-[var(--color-waldorf-sage)] text-xs font-bold z-10 group-hover:border-[var(--color-waldorf-moss)] group-hover:text-[var(--color-waldorf-moss)] transition-colors">
                {i + 1}
              </div>
              <div className="w-20 h-20 rounded-full bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 earth-shadow">
                {step.icon}
              </div>
              <h3 className="font-bold text-[var(--color-waldorf-moss)] text-lg mb-3 font-serif">
                {step.title}
              </h3>
              <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed max-w-xs mx-auto font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href={ADMISION_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-waldorf-moss)] text-[var(--color-waldorf-cream)] font-semibold text-base earth-shadow earth-shadow-hover group transition-transform hover:-translate-y-1"
            >
              🌿 Postular Ahora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <Link
              href="/admision"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[var(--color-waldorf-moss)] font-semibold text-base border border-[var(--color-waldorf-sage)]/20 earth-shadow earth-shadow-hover group transition-transform hover:-translate-y-1"
            >
              Ver Valores y Aranceles
            </Link>
          </div>
          <p className="text-[var(--color-waldorf-sage)] font-semibold text-xs mt-4 uppercase tracking-wider text-center max-w-sm mx-auto">Cupos por aula intencionalmente limitados para proteger la pausa y el ritmo de los niños.</p>
        </motion.div>
      </div>
    </section>
  )
}
