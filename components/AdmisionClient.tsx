'use client'

import { useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Users, MapPin, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SmoothScroll from '@/components/SmoothScroll'
import AdmisionForm from '@/components/AdmisionForm'
import FAQSection from '@/components/FAQSection'

export default function AdmisionClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const yHero = useTransform(heroScroll, [0, 1], ["0%", "30%"])
  const opacityHero = useTransform(heroScroll, [0, 1], [1, 0])

  const steps = [
    { title: "Agendas una visita", text: "Coordinamos una mañana para que conozcas el colegio en vivo — un mensaje por WhatsApp y buscamos juntos un día. Sin formularios, sin requisitos. Solo ven." },
    { title: "Vives una mañana", text: "Caminas por los espacios, ves a los niños en su día, conversas con maestros. La mejor manera de conocer Trekan es vivirlo." },
    { title: "Conversamos en familia", text: "Una entrevista — no para evaluar, sino para conocernos. Queremos entender a tu hijo como persona, no solo como postulante." },
    { title: "Postulan formalmente", text: "Cuando ambos sentimos que el camino calza, completas el formulario de postulación y trabajamos juntos para que la llegada sea suave." }
  ]

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)]">
        <Navbar />

        {/* HERO ADMISIÓN */}
        <section ref={heroRef} className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center justify-center">
          {/* Fondo fotográfico con zoom lento */}
          <motion.div 
            style={{ y: yHero, scale: useTransform(heroScroll, [0, 1], [1, 1.1]) }} 
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-[#0A0A10]/50 z-10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/20 z-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e25] via-transparent to-transparent z-10" />
            <img 
              src="https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20264.jpg" 
              alt="Bosque Sur" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div style={{ y: yHero, opacity: opacityHero }} className="max-w-5xl mx-auto text-center relative z-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[var(--color-waldorf-cream)] text-sm font-bold tracking-widest uppercase mb-8 shadow-2xl"
            >
              Admisión 2026 · Abierta todo el año
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold font-serif text-white mb-8 leading-tight tracking-tight drop-shadow-2xl"
            >
              Donde el niño camina <br/>
              <span className="text-[var(--color-waldorf-mustard)] italic font-light drop-shadow-lg">con voluntad</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="text-[var(--color-waldorf-cream)]/90 text-lg md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto font-medium drop-shadow-md"
            >
              <em>Trekan</em> significa caminante en mapudungun. Un espacio donde niñas y niños de 3 a 14 años aprenden a través del arte, el ritmo y la vida — en grupos de no más de 16.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            >
              <a href="https://wa.me/56967765106?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20visita%20al%20Colegio%20Waldorf%20Trekan%20para%20conocer%20el%20proyecto%20educativo.%20%F0%9F%8C%BF" target="_blank" rel="noreferrer" className="group relative overflow-hidden bg-[var(--color-waldorf-moss)] text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3">
                <span className="relative z-10">Agendar visita al colegio</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
              </a>
              <a href="#proceso" className="text-[var(--color-waldorf-moss)] font-bold text-lg hover:text-[var(--color-waldorf-terracotta)] transition-colors underline-offset-4 hover:underline">
                Ver proceso de admisión
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-16 md:gap-32 text-[var(--color-waldorf-moss)] border-t border-[var(--color-waldorf-moss)]/10 pt-10"
            >
              <div className="text-center group">
                <span className="block text-5xl font-serif font-bold text-[var(--color-waldorf-terracotta)] mb-2 group-hover:scale-110 transition-transform">3-14</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-60">años de edad</span>
              </div>
              <div className="text-center group">
                <span className="block text-5xl font-serif font-bold text-[var(--color-waldorf-terracotta)] mb-2 group-hover:scale-110 transition-transform">16</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-60">alumnos máx.</span>
              </div>
              <div className="text-center group">
                <span className="block text-5xl font-serif font-bold text-[var(--color-waldorf-terracotta)] mb-2 group-hover:scale-110 transition-transform">📍</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-60">Puerto Varas</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="py-32 px-6 bg-[#1a2e25] text-[var(--color-waldorf-cream)] relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <span className="font-serif italic text-[var(--color-waldorf-mustard)] text-xl mb-4 block">El camino juntos</span>
              <h2 className="text-5xl font-bold font-serif mb-8">Cómo es llegar a Trekan</h2>
              <p className="text-white/70 text-xl max-w-2xl mx-auto">
                No es una inscripción — es un encuentro. Por eso, el primer paso siempre es visitarnos.
              </p>
            </div>

            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-[var(--color-waldorf-mustard)]/20">
              {steps.map((step, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.8 }}
                   className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-12"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-serif font-bold text-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_30px_rgba(224,169,109,0.3)] z-10">
                    {idx + 1}
                  </div>
                  <div className="w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-mustard)] mb-4">{step.title}</h3>
                    <p className="text-white/70 text-base leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VALORES Y ARANCELES */}
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="font-serif italic text-[var(--color-waldorf-terracotta)] text-xl mb-4 block">Transparencia</span>
            <h2 className="text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">Valores 2026</h2>
            <p className="text-[var(--color-waldorf-text-light)] text-xl max-w-2xl mx-auto">
              Queremos que las familias conozcan los costos desde el principio. 
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
            <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-[var(--color-waldorf-moss)] text-xl mb-2">Matrícula</h4>
                <p className="text-sm text-gray-500 mb-8">En 2 cuotas: enero y febrero. No reembolsable.</p>
              </div>
              <div className="text-4xl font-serif font-bold text-[var(--color-waldorf-terracotta)]">$500.000</div>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="bg-[#1a2e25] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between scale-105 z-10">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-waldorf-sage)]/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <span className="inline-block bg-[var(--color-waldorf-mustard)] text-[#1a2e25] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Mensual</span>
                <h4 className="font-bold text-2xl mb-2">Escolaridad</h4>
                <p className="text-sm text-white/60 mb-8">Pago hasta el día 5 de cada mes.</p>
              </div>
              <div className="relative z-10 flex items-baseline gap-2">
                <div className="text-5xl font-serif font-bold text-[var(--color-waldorf-mustard)]">$330.000</div>
                <span className="text-white/60">/mes</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-between">
               <div>
                 <span className="inline-block bg-[var(--color-waldorf-terracotta)]/10 text-[var(--color-waldorf-terracotta)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Aporte Comunitario</span>
                 <h4 className="font-bold text-[var(--color-waldorf-moss)] text-xl mb-2">Resp. Social</h4>
                 <p className="text-sm text-gray-500 mb-8">Aporte voluntario sugerido para sostener becas internas.</p>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className="text-4xl font-serif font-bold text-[var(--color-waldorf-terracotta)]">$33.000</div>
                 <span className="text-gray-500 font-medium">/mes</span>
               </div>
            </motion.div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-[#FAF8F5] p-8 rounded-3xl">
               <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg mb-2 flex justify-between items-center">
                 Cuota de Materiales <span className="font-serif text-2xl text-[var(--color-waldorf-terracotta)]">$160.000</span>
               </h4>
               <p className="text-sm text-gray-600">Anual, en 2 cuotas (marzo y junio).</p>
             </div>
             <div className="bg-[#FAF8F5] p-8 rounded-3xl">
               <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg mb-2 flex justify-between items-center">
                 Cuota Incorporación <span className="font-serif text-2xl text-[var(--color-waldorf-terracotta)]">$330.000</span>
               </h4>
               <p className="text-sm text-gray-600">Pago único al ingresar al colegio por primera vez.</p>
             </div>
          </div>
        </section>

        {/* PARA TI */}
        <section className="py-32 px-6 bg-[var(--color-waldorf-moss)] text-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <span className="font-serif italic text-[var(--color-waldorf-mustard)] text-xl mb-4 block">Honestidad antes que todo</span>
              <h2 className="text-5xl font-bold font-serif mb-6">¿Es Trekan para tu familia?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-waldorf-mustard)] mb-8 flex items-center gap-3">
                  <CheckCircle2 size={28}/> Puede ser para ti si…
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4 text-white/80 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-[var(--color-waldorf-mustard)] mt-2 shrink-0"/> Buscas una educación que vea al niño completo — no solo lo académico.</li>
                  <li className="flex gap-4 text-white/80 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-[var(--color-waldorf-mustard)] mt-2 shrink-0"/> Valoras el arte, la naturaleza y el ritmo como parte del aprendizaje.</li>
                  <li className="flex gap-4 text-white/80 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-[var(--color-waldorf-mustard)] mt-2 shrink-0"/> Quieres que tu hijo sea conocido por su maestro — no solo atendido.</li>
                </ul>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-black/20 backdrop-blur-md p-10 rounded-3xl border border-black/10">
                <h3 className="font-serif font-bold text-2xl text-white/50 mb-8 flex items-center gap-3">
                  <XCircle size={28}/> Puede que no calce si…
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4 text-white/50 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-white/20 mt-2 shrink-0"/> Priorizas notas numéricas y rendimiento medible como principal referencia.</li>
                  <li className="flex gap-4 text-white/50 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-white/20 mt-2 shrink-0"/> Necesitas un colegio con reconocimiento Mineduc directo (usamos Exámenes Libres).</li>
                  <li className="flex gap-4 text-white/50 leading-relaxed text-lg"><div className="w-2 h-2 rounded-full bg-white/20 mt-2 shrink-0"/> No puedes comprometerte con la participación familiar.</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <FAQSection />
        
        {/* INVITACIÓN */}
        <section className="bg-[#FAF8F5] py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-6">Ven a conocernos</h2>
            <p className="text-[var(--color-waldorf-text-light)] text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
              No necesitas tener todo claro para dar el primer paso. El camino empieza con una conversación sincera.
            </p>
            
            <AdmisionForm />
            
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  )
}
