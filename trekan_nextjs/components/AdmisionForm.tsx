'use client'

import { useState } from 'react'
import { submitLead } from '@/app/actions/submitLead'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdmisionForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleAction(formData: FormData) {
    setStatus('loading')
    const result = await submitLead(formData)
    
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Ocurrió un error inesperado.')
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-left">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-16 h-16 bg-[var(--color-waldorf-sage)]/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-[#25D366]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">¡Solicitud Enviada!</h3>
            <p className="text-white/80">
              Hemos recibido tus datos correctamente. Ivonne te contactará muy pronto para coordinar el siguiente paso.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <form action={handleAction} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Postulación 2026</h3>
                <p className="text-white/70 text-sm">Completa tus datos y nos pondremos en contacto contigo.</p>
              </div>

              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-white/90 mb-1">Tu Nombre Completo *</label>
                <input 
                  type="text" 
                  id="parentName"
                  name="parentName"
                  required 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: María González"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-1">Teléfono (WhatsApp)</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="childrenAges" className="block text-sm font-medium text-white/90 mb-1">Edades de los niños/as a postular</label>
                <input 
                  type="text" 
                  id="childrenAges"
                  name="childrenAges"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: 4 y 7 años"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">Mensaje o consulta breve (Opcional)</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors resize-none"
                  placeholder="¿Hay algo más que debamos saber?"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-white text-[var(--color-waldorf-moss)] py-4 rounded-xl font-bold hover:bg-[var(--color-waldorf-paper)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Postulación
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
