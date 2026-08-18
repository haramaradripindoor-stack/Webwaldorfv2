'use client'

import { useState } from 'react'
import { Send, CalendarClock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdmisionForm() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  
  // Handlers para el form
  const [formData, setFormData] = useState({
    parentName: '',
    childrenAges: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleWhatsAppRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Disparar Eventos de Conversión
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        // @ts-ignore
        window.fbq('track', 'Lead');
      }
      // @ts-ignore
      if (typeof window !== 'undefined' && window.dataLayer) {
        // @ts-ignore
        window.dataLayer.push({'event': 'generar_lead'});
      }
    } catch (error) {
      console.error('Error tracking conversion', error);
    }

    // 1. Guardar silenciosamente el lead en Supabase CRM antes del redirect
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apoderado: formData.parentName,
          telefono_apoderado: (formData as any).phone || 'Vía WhatsApp (Pendiente)', 
          email_apoderado: 'Pendiente',
          nombre_nino: 'No especificado',
          edad_nino: formData.childrenAges,
          curso_postula: `Visita preferida: ${selectedDay || 'Cualquier día'}. Notas: ${formData.message || 'Ninguna'}`
        })
      });
    } catch (error) {
      console.error('Error saving lead to CRM', error);
      // Si falla, continuamos igual al WhatsApp para no bloquear al apoderado
    }

    // 2. Redirigir a WhatsApp
    const text = `Hola Ivonne, soy ${formData.parentName}, me interesa postular para edades: ${formData.childrenAges}. ${formData.message ? `Adicionalmente: ${formData.message}` : ''} Me gustaría agendar una visita el día ${selectedDay || 'que tengan disponibilidad'}.`;
    const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(text)}`;
    
    // Usamos location.href en lugar de window.open porque los navegadores bloquean 
    // ventanas nuevas (popups) que ocurren después de un await asíncrono
    window.location.href = whatsappUrl;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-[var(--color-waldorf-moss)] p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-waldorf-mustard)]/20 shadow-2xl text-left">
      <AnimatePresence mode="wait">
        <motion.div 
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <form onSubmit={handleWhatsAppRoute} className="space-y-6">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">Postulación 2026</h3>
              <p className="text-white/70 text-sm">Conversemos directamente por WhatsApp para coordinar tu visita.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-white/90 mb-1">Tu Nombre Completo *</label>
                <input 
                  type="text" 
                  id="parentName"
                  name="parentName"
                  required 
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: María González"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-1">Tu WhatsApp *</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  required 
                  value={(formData as any).phone || ''}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: +569 1234 5678"
                />
              </div>

              <div>
                <label htmlFor="childrenAges" className="block text-sm font-medium text-white/90 mb-1">Edades de los niños/as a postular *</label>
                <input 
                  type="text" 
                  id="childrenAges"
                  name="childrenAges"
                  required
                  value={formData.childrenAges}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: 4 y 7 años"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">Mensaje o consulta breve (Opcional)</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors resize-none"
                  placeholder="¿Hay algo más que debamos saber?"
                />
              </div>
            </div>

            {/* Selector de Días Integrado */}
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 mt-8">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-3 text-white">
                <CalendarClock className="text-[var(--color-waldorf-mustard)]" />
                Día preferido para la visita
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
                  <button 
                    key={dia} 
                    type="button"
                    onClick={() => setSelectedDay(dia)}
                    className={`py-3 px-2 md:px-4 rounded-xl border transition-colors text-sm font-medium ${selectedDay === dia ? 'bg-[var(--color-waldorf-mustard)] text-[#1a2e25] border-transparent scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30 text-white'}`}
                  >
                    {dia} <br/>
                    <span className={`text-xs ${selectedDay === dia ? 'opacity-80' : 'opacity-60'}`}>Mañana</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full text-[#1a2e25] py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8 text-lg shadow-[0_0_20px_rgba(224,169,109,0.2)] hover:shadow-[0_0_30px_rgba(224,169,109,0.4)] ${
                isSubmitting ? 'bg-[#e6a55e]/70 cursor-not-allowed' : 'bg-[var(--color-waldorf-mustard)] hover:bg-[#e6a55e]'
              }`}
            >
              <Send size={20} className={isSubmitting ? "animate-pulse" : ""} />
              {isSubmitting ? 'Conectando...' : 'Conversar con Ivonne'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
