'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre_apoderado: '',
    telefono_apoderado: '',
    email_apoderado: '',
    nombre_nino: '',
    edad_nino: '',
    curso_postula: '',
  })

  // Auto-dismiss pulse
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Error enviando formulario')

      // Disparar evento de Meta Pixel para marcar la conversión
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      setIsSuccess(true)
      
      // Armar el mensaje pre-llenado para WhatsApp
      const mensajeWhatsApp = `Hola Ivonne, soy ${formData.nombre_apoderado} y me gustaría recibir información de admisión.\n\nDatos de mi hijo/a:\n- Nombre: ${formData.nombre_nino}\n- Edad: ${formData.edad_nino}\n- Curso: ${formData.curso_postula}\n\nMi correo es: ${formData.email_apoderado}`;
      const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(mensajeWhatsApp)}`;

      // Redirigir a WhatsApp después de 1.5 segundos
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
        setIsSuccess(false)
        setFormData({
          nombre_apoderado: '', telefono_apoderado: '', email_apoderado: '',
          nombre_nino: '', edad_nino: '', curso_postula: ''
        })
      }, 1500)
    } catch (error) {
      console.error('Error enviando formulario:', error)
      alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[360px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-waldorf-sage)]/20 bg-[var(--color-waldorf-cream)]"
          >
            {/* Header */}
            <div className="bg-[var(--color-waldorf-moss)] p-5 relative shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-waldorf-cream)]/70 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <div className="pr-6">
                <h4 className="text-[var(--color-waldorf-cream)] font-bold text-lg font-serif mb-1">Hablemos</h4>
                <p className="text-[var(--color-waldorf-cream)]/80 text-xs font-medium leading-relaxed">
                  Déjanos tus datos y la coordinadora de admisión te contactará para agendar una visita o resolver tus dudas.
                </p>
              </div>
            </div>

            {/* Body / Form */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                >
                  <div className="w-16 h-16 bg-[#25D366]/20 text-[#128C7E] rounded-full flex items-center justify-center">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[var(--color-waldorf-moss)] mb-2">¡Recibido!</h3>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">Nos pondremos en contacto contigo a la brevedad.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--color-waldorf-terracotta)]">Tus Datos</h5>
                    <input
                      required
                      placeholder="Tu nombre completo"
                      value={formData.nombre_apoderado}
                      onChange={e => setFormData({...formData, nombre_apoderado: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Teléfono (WhatsApp)"
                      value={formData.telefono_apoderado}
                      onChange={e => setFormData({...formData, telefono_apoderado: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.email_apoderado}
                      onChange={e => setFormData({...formData, email_apoderado: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--color-waldorf-terracotta)]">Sobre el Postulante</h5>
                    <input
                      placeholder="Nombre del niño/a"
                      value={formData.nombre_nino}
                      onChange={e => setFormData({...formData, nombre_nino: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Edad"
                        value={formData.edad_nino}
                        onChange={e => setFormData({...formData, edad_nino: e.target.value})}
                        className="w-1/3 bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                      <input
                        placeholder="Curso al que postula"
                        value={formData.curso_postula}
                        onChange={e => setFormData({...formData, curso_postula: e.target.value})}
                        className="w-2/3 bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-[var(--color-waldorf-terracotta)] hover:bg-[#b04a32] text-white font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    {!isSubmitting && <Send size={16} />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {showPulse && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-[110%] mr-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-[var(--color-waldorf-sage)]/20 whitespace-nowrap text-sm font-bold text-[var(--color-waldorf-moss)]"
            >
              Postulación 2026 🌱
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            setIsOpen(!isOpen)
            setShowPulse(false)
          }}
          whileTap={{ scale: 0.9 }}
          className={`relative h-16 ${isOpen ? 'w-16 rounded-full bg-[var(--color-waldorf-sage)]' : 'px-8 rounded-full bg-[var(--color-waldorf-moss)]'} shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-300`}
          aria-label="Abrir Formulario"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center w-full h-full">
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-3">
                <MessageCircle size={26} fill="currentColor" />
                <span className="font-bold text-lg tracking-wide whitespace-nowrap">Hablemos</span>
              </motion.div>
            )}
          </AnimatePresence>
          {showPulse && !isOpen && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-[var(--color-waldorf-moss)] animate-ping opacity-75" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
