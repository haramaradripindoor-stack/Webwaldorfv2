'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, TreePine, Leaf, Info } from 'lucide-react'
import Image from 'next/image'

export default function DeslizadorCompromiso() {
  const [edad, setEdad] = useState(5)
  const [isSolidario, setIsSolidario] = useState(false)

  // Lógica simple de precios base por edad
  const precioBase = edad < 7 ? 220000 : 250000 // Parvulario vs Básica
  const aporteSolidario = 33000
  const total = isSolidario ? precioBase + aporteSolidario : precioBase

  return (
    <section id="aranceles" className="py-24 bg-[#1a2e25] text-[var(--color-waldorf-cream)] relative overflow-hidden">
      {/* Background that "blooms" */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          filter: isSolidario ? 'grayscale(0%) sepia(20%)' : 'grayscale(80%) sepia(50%)',
          scale: isSolidario ? 1.05 : 1
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Image 
          src="/images/equipoescolar.jpg" 
          alt="Bosque Waldorf" 
          fill 
          className="object-cover transition-opacity duration-1000"
          style={{ opacity: isSolidario ? 0.7 : 0.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e25] via-[#1a2e25]/80 to-transparent" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Interactive Calculator */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-serif font-bold mb-2 text-[var(--color-waldorf-mustard)]">Tu Compromiso</h2>
          <p className="text-sm opacity-80 font-sans mb-10">Calculadora transparente de aportes comunitarios.</p>

          <div className="mb-12">
            <label className="flex justify-between text-lg font-bold mb-6 font-serif">
              <span>Edad del Caminante</span>
              <span className="text-[var(--color-waldorf-mustard)]">{edad} años</span>
            </label>
            <input 
              type="range" 
              min="3" 
              max="14" 
              value={edad} 
              onChange={(e) => setEdad(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--color-waldorf-mustard)]"
            />
            <div className="flex justify-between text-xs opacity-50 mt-2 font-mono uppercase tracking-widest">
              <span>Jardín (3)</span>
              <span>Básica (14)</span>
            </div>
          </div>

          <motion.div 
            className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${isSolidario ? 'bg-[var(--color-waldorf-moss)]/30 border-[var(--color-waldorf-moss)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            onClick={() => setIsSolidario(!isSolidario)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full mt-1 ${isSolidario ? 'bg-[var(--color-waldorf-moss)] text-white' : 'bg-white/10'}`}>
                <Heart size={20} className={isSolidario ? 'fill-current' : ''} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1 flex items-center gap-2">
                  Responsabilidad Social
                  {isSolidario && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-1 bg-[var(--color-waldorf-mustard)] text-[#1a2e25] text-xs rounded-full uppercase tracking-wider">Activo</motion.span>
                  )}
                </h4>
                <p className="text-sm opacity-80 mb-2">Aporte de ${aporteSolidario.toLocaleString('es-CL')} para becas y sustentabilidad comunitaria.</p>
                <div className="flex items-center gap-2 text-xs opacity-60">
                  <Info size={14} /> Al activarlo, haces florecer nuestra comunidad.
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-60 font-mono mb-1">Aporte Mensual</p>
              <motion.div 
                key={total}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-serif font-bold text-white"
              >
                ${total.toLocaleString('es-CL')}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Visual Validation "Blooming Forest" */}
        <div className="flex flex-col items-center justify-center h-full relative">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Base dormant tree */}
            <TreePine size={120} strokeWidth={1} className="text-white/20 absolute z-10" />
            
            {/* Blooming effect */}
            <AnimatePresence>
              {isSolidario && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0.8] }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-[var(--color-waldorf-moss)] rounded-full blur-[100px] z-0"
                  />
                  
                  {/* Leaves sprouting */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute z-20 text-[var(--color-waldorf-moss)]"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: Math.random() * 1.5 + 0.5,
                        x: (Math.random() - 0.5) * 200, 
                        y: (Math.random() - 0.5) * 200 - 50 
                      }}
                      exit={{ opacity: 0, scale: 0, y: 100 }}
                      transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                    >
                      <Leaf className="fill-current" size={24} />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-12 whitespace-nowrap font-serif text-2xl text-[var(--color-waldorf-mustard)] italic"
                  >
                    Gracias por hacer crecer el bosque.
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}
