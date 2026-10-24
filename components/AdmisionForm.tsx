'use client'

import { useState } from 'react'
import { Send, CalendarClock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdmisionForm() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  
  // Handlers para el form
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
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
      let leadOrigen = 'Formulario Web';
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get('utm_source');
        const utmContent = params.get('utm_content');
        const utmCampaign = params.get('utm_campaign');
        if (utmSource || utmContent || utmCampaign) {
          leadOrigen = `IG Story: ${utmContent || utmSource} (${utmCampaign || 'admision'})`;
        }
      }

      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apoderado: formData.parentName,
          telefono_apoderado: formData.phone || 'Vía WhatsApp (Pendiente)', 
          email_apoderado: formData.email || 'Pendiente',
          nombre_nino: 'No especificado',
          edad_nino: formData.childrenAges,
          curso_postula: `Visita preferida: ${selectedDay || 'Cualquier día'}. Notas: ${formData.message || 'Ninguna'}`,
          origen: leadOrigen
        })
      });
    } catch (error) {
      console.error('Error saving lead to CRM', error);
      // Si falla, continuamos igual al WhatsApp para no bloquear al apoderado
    }

    // 2. Redirigir a WhatsApp
    const text = `Hola Ivonne, soy ${formData.parentName}, me gustaría coordinar una visita al Colegio Waldorf Trekan para conocer el proyecto para edades: ${formData.childrenAges}.${formData.message ? ` Mensaje: ${formData.message}.` : ''} Día preferido: ${selectedDay || 'por definir'}.`;
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
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-waldorf-mustard)]/20 text-[var(--color-waldorf-mustard)] text-xs font-semibold uppercase tracking-wider mb-3">
                🌿 Paso 1 · Primer Contacto
              </span>
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Agenda tu Visita a la Escuela</h3>
              
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/10 text-left max-w-lg mx-auto">
                <img 
                  src="/assets/Coordinadora.png" 
                  alt="Ivonne Parada Aravena" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-waldorf-mustard)] shadow-md shrink-0 bg-white/10"
                />
                <div>
                  <div className="text-white font-bold text-base font-serif">Ivonne Parada Aravena</div>
                  <div className="text-[var(--color-waldorf-mustard)] text-xs font-semibold">Coordinadora General · Trekan</div>
                  <p className="text-white/80 text-xs mt-1 leading-snug">
                    Te recibiré con cariño para conversar sobre tu familia y coordinar el día de tu visita a la escuela.
                  </p>
                </div>
              </div>
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
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: +569 1234 5678"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">Tu Correo Electrónico (Opcional)</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder="Ej: maria@ejemplo.cl"
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
              {isSubmitting ? 'Conectando...' : 'Coordinar Visita por WhatsApp con Ivonne 🌿'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
