'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import Image from 'next/image'

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Mostrar el tooltip unos segundos después de cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-[var(--color-waldorf-sage)]/20 earth-shadow origin-bottom-left"
          >
            <div className="bg-[#128C7E] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 bg-white">
                  <Image 
                    src="/assets/Coordinadora.png" 
                    alt="Ivonne Parada" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Ivonne Parada</h4>
                  <p className="text-xs text-white/80">Coordinadora de Admisión</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-50">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-800 relative max-w-[90%]">
                ¡Hola! 👋 Soy Ivonne. ¿En qué te puedo ayudar sobre el Colegio Waldorf Trekan?
                <span className="text-[10px] text-gray-400 block mt-1 text-right">Ahora</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <a 
                href="https://wa.me/56967765106?text=Hola%20Ivonne,%20me%20gustaría%20recibir%20más%20información%20sobre%20el%20Colegio%20Waldorf%20Trekan."
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-[#25D366] text-white text-center py-2.5 rounded-full font-bold text-sm hover:bg-[#128C7E] transition-colors shadow-md"
              >
                Abrir Chat en WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-[110%] ml-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-[var(--color-waldorf-sage)]/20 whitespace-nowrap text-sm font-medium text-[var(--color-waldorf-moss)]"
            >
              ¿Tienes dudas? ¡Escríbeme! 👋
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-[6px] border-transparent border-r-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            setIsOpen(!isOpen)
            setShowTooltip(false)
          }}
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-110 z-50 group"
          aria-label="Contactar por WhatsApp"
        >
          {isOpen ? (
            <X size={24} className="animate-in spin-in-90 duration-300" />
          ) : (
            <>
              <MessageCircle size={28} className="animate-in zoom-in duration-300" />
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 group-hover:hidden" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
