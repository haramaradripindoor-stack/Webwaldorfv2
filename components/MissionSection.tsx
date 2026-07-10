'use client'

import { motion } from 'framer-motion'

const values = [
  {
    title: 'Misión',
    text: 'Formar personas libres, conscientes, creativas y comprometidas con su entorno, mediante una educación que armonice el conocimiento, el arte y la acción.',
    gradient: 'from-[var(--color-waldorf-mustard)]/20 to-[var(--color-waldorf-paper)]',
  },
  {
    title: 'Visión',
    text: 'Ser una comunidad educativa referente en el sur de Chile, por su capacidad de cultivar el respeto, la belleza y el sentido profundo del aprendizaje.',
    gradient: 'from-[var(--color-waldorf-sage)]/20 to-[var(--color-waldorf-paper)]',
  },
  {
    title: 'Valores',
    text: 'Respeto, cuidado del entorno, trabajo colaborativo, diversidad, libertad responsable, verdad y belleza.',
    gradient: 'from-[var(--color-waldorf-terracotta)]/20 to-[var(--color-waldorf-paper)]',
  },
]

export default function MissionSection() {
  return (
    <section id="quienes-somos" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <span className="text-[var(--color-waldorf-sage)] text-xs font-bold tracking-widest uppercase block mb-4">
          Nuestra Esencia
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          Trekan: <em className="text-[var(--color-waldorf-moss)]/70">Caminante</em>
        </h2>
        <p className="text-[var(--color-waldorf-text-light)] text-lg mt-4 max-w-2xl">
          En mapudungun, <strong className="text-[var(--color-waldorf-text)]">Trekan</strong> significa <em>caminante</em>: un ser que decide encaminarse hacia el mundo… y hacia sí mismo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((item, i) => (
          <motion.div
            key={i}
            className={`rounded-3xl p-8 md:p-10 bg-gradient-to-br ${item.gradient} border border-[var(--color-waldorf-sage)]/10 hover:border-[var(--color-waldorf-sage)]/30 transition-all duration-500 flex flex-col justify-between min-h-[280px] group earth-shadow earth-shadow-hover`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
          >
            <div>
              <span className="text-[var(--color-waldorf-sage)]/60 text-xs font-bold tracking-widest uppercase">
                0{i + 1}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-serif mt-2 text-[var(--color-waldorf-moss)] group-hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed mt-6 font-medium">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
