'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function TrimembracionSocial() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45])

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-[#1a2e25] relative overflow-hidden text-[#FAF8F5]">
      {/* Background Organic Shapes */}
      <motion.div 
        style={{ y: y1, rotate }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-waldorf-sage)]/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-waldorf-mustard)]/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Encabezado: Esencia y Enfoque */}
        <div className="text-center mb-24 max-w-4xl mx-auto space-y-8">
          <span className="text-[var(--color-waldorf-mustard)] text-sm font-bold tracking-[0.2em] uppercase block">
            Estructura Orgánica & Esencia
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-light leading-tight">
            Trimembración <span className="font-bold italic">Social</span>
          </h2>
          <p className="text-xl md:text-2xl font-serif text-[var(--color-waldorf-mustard)] font-light italic leading-relaxed">
            "Trekan significa caminante en mapudungun: un ser que decide encaminarse hacia el mundo… y hacia sí mismo."
          </p>
          <p className="text-lg opacity-80 font-medium max-w-3xl mx-auto">
            Inspirados en Rudolf Steiner, entendemos al niño como un ser espiritual en evolución. Nuestra educación armoniza el pensamiento, el sentir y la voluntad. Una escuela Waldorf no es solo un centro educativo, es un organismo vivo bajo tres esferas autónomas.
          </p>
        </div>

        {/* Las Tres Esferas (Trimembración) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32 relative">
          {/* Esfera 1: Cultural / Pedagógica */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] earth-shadow relative overflow-hidden group hover:bg-white/10 transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-waldorf-terracotta)]/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">Esfera Pedagógica</h3>
            <span className="text-[var(--color-waldorf-mustard)] text-sm font-bold tracking-widest uppercase block mb-6 relative z-10">Libertad</span>
            <p className="opacity-80 leading-relaxed relative z-10">
              Formada por el colegio de profesores. Aquí reside la libertad de enseñanza, el desarrollo del currículum Waldorf y el vínculo profundo con cada niño, sin intervenciones burocráticas externas.
            </p>
          </motion.div>

          {/* Esfera 2: Derechos / Administrativa */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] earth-shadow relative overflow-hidden group hover:bg-white/10 transition-colors duration-500 md:mt-12"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-waldorf-moss)]/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">Esfera Administrativa</h3>
            <span className="text-[var(--color-waldorf-moss)] text-sm font-bold tracking-widest uppercase block mb-6 relative z-10">Igualdad</span>
            <p className="opacity-80 leading-relaxed relative z-10">
              El directorio y la gestión institucional. Velan por la equidad, el cumplimiento de los marcos legales y el respeto a los acuerdos que sostienen la estructura formal del colegio.
            </p>
          </motion.div>

          {/* Esfera 3: Económica / Comunitaria */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] earth-shadow relative overflow-hidden group hover:bg-white/10 transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6a382]/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">Esfera Comunitaria</h3>
            <span className="text-[#c6a382] text-sm font-bold tracking-widest uppercase block mb-6 relative z-10">Fraternidad</span>
            <p className="opacity-80 leading-relaxed relative z-10">
              Familias, apoderados y amigos. Un tejido de apoyo mutuo que sostiene material y anímicamente a la escuela. La economía se entiende aquí como colaboración y fraternidad, no como lucro.
            </p>
          </motion.div>
        </div>

        {/* Misión, Visión y Valores (Desde Trekan Antigua) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:pr-8"
          >
            <h3 className="text-3xl font-serif font-bold text-[var(--color-waldorf-mustard)] mb-4">Misión</h3>
            <p className="text-lg opacity-90 leading-relaxed font-medium">
              Formar personas libres, conscientes, creativas y comprometidas con su entorno, mediante una educación que armonice el conocimiento, el arte y la acción.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:px-8 md:border-l md:border-white/10"
          >
            <h3 className="text-3xl font-serif font-bold text-[var(--color-waldorf-terracotta)] mb-4">Visión</h3>
            <p className="text-lg opacity-90 leading-relaxed font-medium">
              Ser una comunidad educativa referente en el sur de Chile, por su capacidad de cultivar el respeto, la belleza y el sentido profundo del aprendizaje.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="md:pl-8 md:border-l md:border-white/10"
          >
            <h3 className="text-3xl font-serif font-bold text-[#c6a382] mb-4">Valores</h3>
            <p className="text-lg opacity-90 leading-relaxed font-medium">
              Respeto, cuidado del entorno, trabajo colaborativo, diversidad, libertad responsable, verdad y belleza.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
