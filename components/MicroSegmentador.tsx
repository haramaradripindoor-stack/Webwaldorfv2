'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, CalendarClock } from 'lucide-react'

type SegmentData = {
  nivel: string | null;
  enfoque: string | null;
  experiencia: string | null;
}

export default function MicroSegmentador() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<SegmentData>({
    nivel: null,
    enfoque: null,
    experiencia: null
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  
  // Para la micro-interacción de selección
  const [animatingId, setAnimatingId] = useState<string | null>(null)

  const handleSelect = (key: keyof SegmentData, value: string) => {
    setAnimatingId(value)
    
    setTimeout(() => {
      setData(prev => ({ ...prev, [key]: value }))
      setAnimatingId(null)
      setStep(prev => prev + 1)
    }, 600) // tiempo para ver la animación del check
  }

  return (
    <section id="admision" className="py-32 px-6 bg-[var(--color-waldorf-cream)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header (Fades out when done) */}
        <AnimatePresence mode="wait">
          {step < 3 && (
            <motion.div 
              key="header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-waldorf-text)] mb-4">
                Comencemos el Viaje
              </h2>
              <p className="text-lg text-[var(--color-waldorf-moss)] max-w-2xl mx-auto opacity-80">
                Queremos conocer qué buscas para tu familia y así ofrecerte la experiencia pedagógica ideal.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions Container */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Edad */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-waldorf-moss)]/5 border border-[var(--color-waldorf-moss)]/10"
              >
                <h3 className="text-2xl font-serif font-bold text-center mb-8">¿Para qué nivel buscas matrícula?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Jardín y Kínder (3 a 6 años)', 'Educación Básica (1º a 8º)'].map((opcion) => (
                    <button
                      key={opcion}
                      onClick={() => handleSelect('nivel', opcion)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden
                        ${animatingId === opcion ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-moss)] text-white scale-95' : 'border-[var(--color-waldorf-moss)]/20 hover:border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-cream)]/50 hover:bg-white text-[var(--color-waldorf-text)]'}
                      `}
                    >
                      <span className="font-semibold">{opcion}</span>
                      <AnimatePresence>
                        {animatingId === opcion && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-[var(--color-waldorf-moss)]"
                          >
                            <Check size={32} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Enfoque */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-waldorf-moss)]/5 border border-[var(--color-waldorf-moss)]/10"
              >
                <h3 className="text-2xl font-serif font-bold text-center mb-8">¿Qué es prioritario en su educación?</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'Conexión Natural', desc: 'Contacto diario con la naturaleza' },
                    { id: 'Desarrollo Integral', desc: 'Equilibrio emocional y cognitivo' },
                    { id: 'Creatividad', desc: 'Fomento del arte y habilidades manuales' }
                  ].map((opcion) => (
                    <button
                      key={opcion.id}
                      onClick={() => handleSelect('enfoque', opcion.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden
                        ${animatingId === opcion.id ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-moss)] text-white scale-[0.98]' : 'border-[var(--color-waldorf-moss)]/20 hover:border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-cream)]/50 hover:bg-white text-[var(--color-waldorf-text)]'}
                      `}
                    >
                      <div className={animatingId === opcion.id ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                        <span className="block font-bold text-lg">{opcion.id}</span>
                        <span className="block text-sm opacity-70 mt-1">{opcion.desc}</span>
                      </div>
                      <AnimatePresence>
                        {animatingId === opcion.id && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-[var(--color-waldorf-moss)]"
                          >
                            <Check size={32} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Experiencia */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-waldorf-moss)]/5 border border-[var(--color-waldorf-moss)]/10"
              >
                <h3 className="text-2xl font-serif font-bold text-center mb-8">¿Has tenido experiencia previa en Waldorf?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Sí', 'No'].map((opcion) => (
                    <button
                      key={opcion}
                      onClick={() => handleSelect('experiencia', opcion)}
                      className={`relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden
                        ${animatingId === opcion ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-moss)] text-white scale-95' : 'border-[var(--color-waldorf-moss)]/20 hover:border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-cream)]/50 hover:bg-white text-[var(--color-waldorf-text)]'}
                      `}
                    >
                      <span className="font-bold text-xl">{opcion}</span>
                      <AnimatePresence>
                        {animatingId === opcion && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-[var(--color-waldorf-moss)]"
                          >
                            <Check size={32} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Phygital Booking CTA */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="w-full max-w-3xl bg-[var(--color-waldorf-moss)] text-white p-10 md:p-16 rounded-3xl shadow-2xl text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] mb-6">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-balance">
                  Diseñado para tu Familia
                </h3>
                <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 text-balance">
                  Gracias por compartir. Vemos que buscas una educación con <span className="font-bold text-white">{data.enfoque?.toLowerCase()}</span> para nivel <span className="font-bold text-white">{data.nivel?.toLowerCase()}</span>.
                </p>
                
                <div className="bg-white/10 p-6 md:p-8 rounded-2xl border border-white/20 backdrop-blur-sm mb-10 text-left">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <CalendarClock className="text-[var(--color-waldorf-mustard)]" />
                    Agenda tu Visita Pedagógica (Proceso 2026)
                  </h4>
                  <p className="text-sm opacity-80 mb-6">En el modelo Waldorf, preferimos que conozcas nuestro espacio y conversemos antes de cualquier trámite formal. Selecciona un horario para visitarnos.</p>
                  
                  {/* Phygital Simulated Calendar Interface */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
                      <button 
                        key={dia} 
                        onClick={() => setSelectedDay(dia)}
                        className={`py-3 px-4 rounded-xl border transition-colors text-sm font-medium ${selectedDay === dia ? 'bg-[var(--color-waldorf-mustard)] text-[#1a2e25] border-transparent scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30 text-white'}`}
                      >
                        {dia} <br/>
                        <span className={`text-xs ${selectedDay === dia ? 'opacity-80' : 'opacity-60'}`}>Mañana</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      const text = `Hola Ivonne, soy familia buscando nivel para ${data.nivel || 'mi hijo'}. Me encantaría agendar una visita el día ${selectedDay || 'que tengan disponibilidad'}.`;
                      const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(text)}`;
                      window.open(whatsappUrl, '_blank');
                    }} 
                    className="px-8 py-4 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25] font-bold text-sm shadow-[0_0_30px_rgba(224,169,109,0.3)] hover:shadow-[0_0_50px_rgba(224,169,109,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    Confirmar Entrevista
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setStep(0)} className="px-8 py-4 rounded-full bg-transparent text-white font-semibold text-sm hover:bg-white/10 transition-colors border border-white/20 flex items-center justify-center">
                    Volver a empezar
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
