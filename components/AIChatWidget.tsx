'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, CheckCircle, Check, Users } from 'lucide-react'

// Cursos oficiales disponibles para Admisión 2027
const AVAILABLE_COURSES = [
  { id: 'kinder', label: 'Kinder', tag: 'Kinder (2027)' },
  { id: '1basico', label: '1° Básico', tag: '1ro Básico (2027)' },
  { id: '2basico', label: '2° Básico', tag: '2do Básico (2027)' },
  { id: '3basico', label: '3° Básico', tag: '3ro Básico (2027)' },
  { id: '4basico', label: '4° Básico', tag: '4to Básico (2027)' },
  { id: '5basico', label: '5° Básico', tag: '5to Básico (2027)' },
  { id: '6basico', label: '6° Básico', tag: '6to Básico (2027)' },
  { id: '7-8basico', label: '7°-8° Básico', tag: '7mo Básico (2027)' },
  { id: 'otro', label: 'Otro / Consulta', tag: 'Consultas / Por coordinar' },
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [customCourse, setCustomCourse] = useState('')
  const [formData, setFormData] = useState({
    nombre_apoderado: '',
    telefono_apoderado: '',
    email_apoderado: '',
    nombre_nino: '',
    edad_nino: '',
  })

  // Auto-dismiss pulse
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  // Manejo de multiselección de cursos
  const toggleCourse = (tag: string) => {
    setSelectedCourses(prev => 
      prev.includes(tag) 
        ? prev.filter(c => c !== tag)
        : [...prev, tag]
    )
  }

  const isMultipleSiblings = selectedCourses.length > 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Formatear cursos seleccionados
    const activeCourses = selectedCourses.length > 0 
      ? selectedCourses 
      : (customCourse.trim() ? [customCourse.trim()] : ['Admisión 2027'])
    
    const cursoPostulaFinal = activeCourses.join(', ') + (customCourse.trim() && !activeCourses.includes(customCourse.trim()) ? ` | ${customCourse.trim()}` : '')
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apoderado: formData.nombre_apoderado,
          telefono_apoderado: formData.telefono_apoderado,
          email_apoderado: formData.email_apoderado,
          nombre_nino: formData.nombre_nino,
          edad_nino: formData.edad_nino,
          curso_postula: cursoPostulaFinal,
          origen: isMultipleSiblings ? 'Boton WhatsApp (Hermanos)' : 'Boton WhatsApp (Flotante)'
        })
      })

      if (!response.ok) throw new Error('Error enviando formulario')

      // Disparar evento de Meta Pixel para marcar la conversión
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: cursoPostulaFinal,
          content_category: isMultipleSiblings ? 'Hermanos' : 'Individual',
        })
      }

      setIsSuccess(true)
      
      // Armar el mensaje pre-llenado para WhatsApp hacia Ivonne Parada Aravena
      let mensajeWhatsApp = ''
      if (isMultipleSiblings) {
        const cursosLista = activeCourses.map(c => `  • ${c}`).join('\n')
        mensajeWhatsApp = `Hola Ivonne, soy ${formData.nombre_apoderado} y me gustaría recibir información de admisión 2027 para mis hijos/as 🌱\n\n*Cursos de interés (Hermanos):*\n${cursosLista}\n\n*Hijos/as postulantes:*\n- Nombres: ${formData.nombre_nino || 'Por coordinar'}\n- Edades: ${formData.edad_nino || 'Por coordinar'}\n\nMi correo es: ${formData.email_apoderado || 'Te lo comparto por aquí'}\n\n¡Quedo muy atento/a para coordinar una visita a Trekan!`
      } else {
        const cursoUnico = activeCourses[0] || 'Admisión 2027'
        mensajeWhatsApp = `Hola Ivonne, soy ${formData.nombre_apoderado} y me gustaría recibir información sobre el proceso de admisión 2027 en Trekan 🌱\n\n*Curso de interés:*\n• ${cursoUnico}\n\n*Datos del postulante:*\n- Nombre: ${formData.nombre_nino || 'Por coordinar'}\n- Edad: ${formData.edad_nino ? `${formData.edad_nino} años` : 'Por coordinar'}\n\nMi correo es: ${formData.email_apoderado || 'Te lo comparto por aquí'}\n\n¡Quedo muy atento/a para coordinar una visita a la escuela!`
      }

      const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(mensajeWhatsApp)}`

      // Redirigir a WhatsApp después de 1.2 segundos
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
        setIsSuccess(false)
        setFormData({
          nombre_apoderado: '', telefono_apoderado: '', email_apoderado: '',
          nombre_nino: '', edad_nino: ''
        })
        setSelectedCourses([])
        setCustomCourse('')
      }, 1200)
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
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-[390px] max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-waldorf-sage)]/25 bg-[var(--color-waldorf-cream)]"
          >
            {/* Header con Ivonne Parada Aravena */}
            <div className="bg-[var(--color-waldorf-moss)] p-4 sm:p-5 relative shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-waldorf-cream)]/75 hover:text-white transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3.5 pr-6">
                <img 
                  src="/assets/Coordinadora.png" 
                  alt="Ivonne Parada Aravena" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-waldorf-mustard)]/60 shadow-md shrink-0 bg-white/10"
                />
                <div>
                  <h4 className="text-[var(--color-waldorf-cream)] font-bold text-base font-serif leading-tight">
                    Ivonne Parada Aravena
                  </h4>
                  <p className="text-[var(--color-waldorf-mustard)] text-xs font-semibold tracking-wide">
                    Coordinadora General · Trekan
                  </p>
                  <p className="text-[var(--color-waldorf-cream)]/85 text-[11px] leading-tight mt-1">
                    Déjanos tus datos y coordinamos una visita guiada para tu familia.
                  </p>
                </div>
              </div>
            </div>

            {/* Body / Formulario */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                >
                  <div className="w-16 h-16 bg-[#25D366]/20 text-[#128C7E] rounded-full flex items-center justify-center">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[var(--color-waldorf-moss)] mb-1">¡Conectando con WhatsApp!</h3>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">Abriendo la conversación directa con Ivonne...</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* SECCIÓN 1: Datos de Contacto */}
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-waldorf-terracotta)]">
                      Tus Datos de Contacto
                    </h5>
                    <input
                      required
                      placeholder="Tu nombre completo *"
                      value={formData.nombre_apoderado}
                      onChange={e => setFormData({...formData, nombre_apoderado: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/25 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="tel"
                        placeholder="WhatsApp *"
                        value={formData.telefono_apoderado}
                        onChange={e => setFormData({...formData, telefono_apoderado: e.target.value})}
                        className="w-full bg-white border border-[var(--color-waldorf-sage)]/25 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                      <input
                        type="email"
                        placeholder="Email (opcional)"
                        value={formData.email_apoderado}
                        onChange={e => setFormData({...formData, email_apoderado: e.target.value})}
                        className="w-full bg-white border border-[var(--color-waldorf-sage)]/25 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                    </div>
                  </div>

                  {/* SECCIÓN 2: Selector Táctil Multiselección de Cursos (CRO Boost) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-waldorf-terracotta)]">
                        Curso(s) de Interés 2027
                      </h5>
                      <span className="text-[10px] text-[var(--color-waldorf-moss)] font-semibold bg-[var(--color-waldorf-moss)]/10 px-2 py-0.5 rounded-full">
                        {isMultipleSiblings ? '👫 Modo Hermanos' : 'Multiselección activa'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--color-waldorf-text-light)] leading-tight">
                      Toca uno o más cursos si postulas con hermanos:
                    </p>

                    {/* Chips de cursos */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {AVAILABLE_COURSES.map(curso => {
                        const isSelected = selectedCourses.includes(curso.tag)
                        return (
                          <button
                            type="button"
                            key={curso.id}
                            onClick={() => toggleCourse(curso.tag)}
                            className={`py-2 px-1 text-xs rounded-xl font-medium transition-all text-center flex items-center justify-center gap-1 border ${
                              isSelected
                                ? 'bg-[var(--color-waldorf-moss)] text-white border-[var(--color-waldorf-moss)] shadow-sm font-bold scale-[1.02]'
                                : 'bg-white text-[var(--color-waldorf-text)] border-[var(--color-waldorf-sage)]/30 hover:border-[var(--color-waldorf-moss)]/50 hover:bg-[#faf7f2]'
                            }`}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                            <span className="truncate">{curso.label}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Badge dinámico de hermanos */}
                    {isMultipleSiblings && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--color-waldorf-terracotta)]/10 border border-[var(--color-waldorf-terracotta)]/25 text-[var(--color-waldorf-terracotta)] text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2 mt-1.5"
                      >
                        <Users size={14} className="shrink-0" />
                        <span>Has seleccionado {selectedCourses.length} cursos para hermanos</span>
                      </motion.div>
                    )}
                  </div>

                  {/* SECCIÓN 3: Datos de Postulante(s) adaptativo */}
                  <div className="space-y-2 pt-1">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-waldorf-terracotta)]">
                      {isMultipleSiblings ? 'Sobre tus Hijos/as' : 'Sobre el Niño/a'}
                    </h5>
                    <input
                      placeholder={isMultipleSiblings ? 'Nombres de tus hijos/as (ej: Mateo y Clara)' : 'Nombre del niño o niña'}
                      value={formData.nombre_nino}
                      onChange={e => setFormData({...formData, nombre_nino: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/25 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                    <input
                      placeholder={isMultipleSiblings ? 'Edades (ej: 5 y 8 años)' : 'Edad actual (ej: 6 años)'}
                      value={formData.edad_nino}
                      onChange={e => setFormData({...formData, edad_nino: e.target.value})}
                      className="w-full bg-white border border-[var(--color-waldorf-sage)]/25 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                    />
                  </div>

                  {/* Botón WhatsApp de Alta Conversión */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Conectando con WhatsApp...</span>
                    ) : (
                      <>
                        <MessageCircle size={18} fill="currentColor" />
                        <span className="tracking-wide">
                          {isMultipleSiblings ? 'Postular Hermanos por WhatsApp' : 'Hablar con Ivonne por WhatsApp'}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-[var(--color-waldorf-text-light)]/80 leading-tight">
                    🔒 Tus datos están protegidos. Te respondemos directo por WhatsApp.
                  </p>
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
              Admisión 2027 🌱
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
          className={`relative h-16 ${isOpen ? 'w-16 rounded-full bg-[var(--color-waldorf-sage)]' : 'px-8 rounded-full bg-[var(--color-waldorf-moss)]'} shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-300 cursor-pointer`}
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

