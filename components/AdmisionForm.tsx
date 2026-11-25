'use client'

import { useState } from 'react'
import { Send, CalendarClock, Check, Sparkles, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ADMISION_CONFIG, CURSOS_DISPONIBLES } from '@/config/admision'

export default function AdmisionForm() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<string[]>(['Jardín Infantil (3 a 5 años)'])
  
  // Handlers para el form
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childrenNamesAges: '',
    message: ''
  })

  const isHermanoMode = selectedCourses.length >= 2

  const toggleCourse = (curso: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(curso)) {
        if (prev.length === 1) return prev // Mínimo 1 curso seleccionado
        return prev.filter(c => c !== curso)
      } else {
        return [...prev, curso]
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleWhatsAppRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const serializedCourses = selectedCourses.join(', ')

    // Disparar Eventos de Conversión Meta Pixel y DataLayer
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        // @ts-ignore
        window.fbq('track', 'Lead', {
          content_name: serializedCourses,
          content_category: 'Admisión ' + ADMISION_CONFIG.activeYear,
          currency: 'CLP',
          value: 0
        });
      }
      // @ts-ignore
      if (typeof window !== 'undefined' && window.dataLayer) {
        // @ts-ignore
        window.dataLayer.push({
          'event': 'generar_lead',
          'cursos': serializedCourses,
          'modo_hermanos': isHermanoMode
        });
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
          nombre_nino: formData.childrenNamesAges || (isHermanoMode ? 'Hermanos' : 'Postulante'),
          edad_nino: formData.childrenNamesAges,
          curso_postula: `${serializedCourses} | Visita: ${selectedDay || 'Cualquier día'}${formData.message ? ` | Notas: ${formData.message}` : ''}`,
          origen: leadOrigen
        })
      });
    } catch (error) {
      console.error('Error saving lead to CRM', error);
      // Si falla, continuamos igual al WhatsApp para no bloquear al apoderado
    }

    // 2. Redirigir a WhatsApp con texto adaptado
    const cursosText = isHermanoMode ? `cursos: ${serializedCourses}` : `curso: ${serializedCourses}`;
    const ninosText = formData.childrenNamesAges ? ` para: ${formData.childrenNamesAges}` : '';
    const text = `Hola Ivonne, soy ${formData.parentName}, me gustaría coordinar una visita al Colegio Waldorf Trekan para la Admisión ${ADMISION_CONFIG.activeYear} (${cursosText}${ninosText}).${formData.message ? ` Mensaje: ${formData.message}.` : ''} Día preferido: ${selectedDay || 'por coordinar'}.`;
    const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(text)}`;
    
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
                🌿 Paso 1 · Primer Contacto · Admisión {ADMISION_CONFIG.activeYear}
              </span>
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Agenda tu Visita a la Escuela</h3>
              
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/10 text-left max-w-lg mx-auto">
                <img 
                  src="/assets/Coordinadora.png" 
                  alt="Ivonne Parada Aravena" 
                  width={56}
                  height={56}
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

            <div className="space-y-5">
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

              {/* Selector Táctil Multicurso (Regla CRO) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/90">
                    Cursos a Postular * <span className="text-xs text-white/60">(puedes seleccionar varios)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CURSOS_DISPONIBLES.map(curso => {
                    const isSelected = selectedCourses.includes(curso)
                    return (
                      <button
                        key={curso}
                        type="button"
                        onClick={() => toggleCourse(curso)}
                        className={`py-2.5 px-3 rounded-xl border transition-all text-xs font-semibold flex items-center justify-between gap-1.5 cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[var(--color-waldorf-mustard)] text-[#1a2e25] border-transparent shadow-md scale-[1.02]'
                            : 'bg-white/5 border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className="truncate">{curso}</span>
                        {isSelected && <Check size={14} className="shrink-0 stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>

                {/* Banner Modo Hermanos Dinámico */}
                <AnimatePresence>
                  {isHermanoMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="bg-[var(--color-waldorf-mustard)]/15 border border-[var(--color-waldorf-mustard)]/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[var(--color-waldorf-mustard)] font-semibold"
                    >
                      <Sparkles size={16} className="shrink-0" />
                      <span>✨ Modo Hermanos Activo: Postulación familiar conjunta ({selectedCourses.length} cursos seleccionados).</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="childrenNamesAges" className="block text-sm font-medium text-white/90 mb-1">
                  {isHermanoMode ? 'Nombres y edades de tus hijos/as *' : 'Nombre y edad de tu hijo/a *'}
                </label>
                <input 
                  type="text" 
                  id="childrenNamesAges"
                  name="childrenNamesAges"
                  required
                  value={formData.childrenNamesAges}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
                  placeholder={isHermanoMode ? "Ej: Sofía (4 años) y Mateo (7 años)" : "Ej: Sofía (4 años)"}
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
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 mt-8 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-white">
                <CalendarClock className="text-[var(--color-waldorf-mustard)]" />
                Día preferido para la visita
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
                  <button 
                    key={dia} 
                    type="button"
                    onClick={() => setSelectedDay(dia)}
                    className={`py-3 px-2 md:px-4 rounded-xl border transition-colors text-sm font-medium cursor-pointer ${selectedDay === dia ? 'bg-[var(--color-waldorf-mustard)] text-[#1a2e25] border-transparent scale-105 shadow-lg font-bold' : 'bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30 text-white'}`}
                  >
                    {dia} <br/>
                    <span className={`text-xs ${selectedDay === dia ? 'opacity-90' : 'opacity-60'}`}>Mañana</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full text-[#1a2e25] py-4.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-8 mb-4 text-lg shadow-[0_0_20px_rgba(224,169,109,0.2)] hover:shadow-[0_0_30px_rgba(224,169,109,0.4)] active:scale-[0.98] cursor-pointer ${
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
