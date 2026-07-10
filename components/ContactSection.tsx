'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, UserPlus } from 'lucide-react'
import emailjs from '@emailjs/browser'

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleDownloadVCard = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Trekan;Colegio Waldorf;;;
FN:Colegio Waldorf Trekan
ORG:Colegio Waldorf Trekan
TITLE:Institución Educativa
TEL;TYPE=WORK,VOICE:+56967765106
EMAIL;TYPE=PREF,INTERNET:admision@colegiowaldorftrekan.cl
URL:https://www.colegiowaldorftrekan.cl
ADR;TYPE=WORK:;;Las Azaleas 96, Parque Ivian 1;Puerto Varas;;;Chile
END:VCARD`

    const blob = new Blob([vcardData], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'colegio_trekan.vcf'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    // Usando las mismas credenciales de arriendo-salon (deben configurarse según las de Trekan)
    // El template debería estar configurado para recibir: user_name, user_email, message
    emailjs.sendForm('service_46eazsr', 'template_stlro1d', formRef.current!, 'cXLMWeJ-pUVRay1Ia')
      .then(() => {
        setSuccess(true)
        formRef.current?.reset()
      })
      .catch((err) => {
        console.error("Error enviando correo:", err)
        setErrorMsg('Ocurrió un error al enviar tu mensaje. Por favor, contáctanos vía WhatsApp.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <section id="contacto" className="py-24 px-6 relative overflow-hidden bg-[var(--color-waldorf-paper)]">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vh] rounded-[100%] bg-gradient-to-br from-[var(--color-waldorf-sage)]/10 via-[var(--color-waldorf-moss)]/5 to-transparent blur-[80px] pointer-events-none transform -translate-x-1/4 -translate-y-1/4" />
      
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Info Column */}
        <div className="space-y-10">
          <div>
            <span className="font-serif italic text-[var(--color-waldorf-terracotta)] text-lg mb-2 block">Hablemos</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-tight">
              ¿Tienes dudas o quieres visitarnos?
            </h2>
            <p className="mt-6 text-[var(--color-waldorf-text-light)] text-lg leading-relaxed max-w-md">
              Escríbenos. Nos encanta recibir a nuevas familias, responder preguntas y abrir las puertas de nuestra comunidad.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] earth-shadow shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-waldorf-moss)]">Dirección</h4>
                <p className="text-[var(--color-waldorf-text-light)]">Las Azaleas 96, Parque Ivian 1<br/>Puerto Varas, Chile</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] earth-shadow shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-waldorf-moss)]">WhatsApp / Teléfono</h4>
                <a href="https://wa.me/56967765106" target="_blank" rel="noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline font-medium block">
                  +56 9 6776 5106
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] earth-shadow shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-waldorf-moss)]">Correo</h4>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web" target="_blank" rel="noreferrer" className="text-[var(--color-waldorf-text-light)] hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                  admision@colegiowaldorftrekan.cl
                </a>
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={handleDownloadVCard}
              className="inline-flex items-center gap-2 bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-waldorf-sage)]/10 transition-colors earth-shadow group"
            >
              <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
              Guardar Contacto (vCard)
            </button>
          </div>
        </div>

        {/* Form Column */}
        <div className="relative">
          <div className="bg-white p-8 md:p-10 rounded-[40px] earth-shadow border border-[var(--color-waldorf-sage)]/10 relative overflow-hidden">
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-8 text-center"
                >
                  <CheckCircle2 size={64} className="text-[var(--color-waldorf-moss)] mb-4" />
                  <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-[var(--color-waldorf-text-light)] mb-8">Gracias por escribirnos. Nos pondremos en contacto contigo lo antes posible.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 rounded-full bg-[var(--color-waldorf-paper)] text-[var(--color-waldorf-moss)] font-bold hover:bg-[var(--color-waldorf-cream)] transition-colors border border-[var(--color-waldorf-sage)]/20"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">Envíanos un mensaje</h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Nombre</label>
                <input type="text" name="user_name" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors" placeholder="Tu nombre y apellido" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Correo Electrónico</label>
                <input type="email" name="user_email" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors" placeholder="tucorreo@ejemplo.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Mensaje</label>
                <textarea name="message" required rows={4} className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors resize-none" placeholder="¿En qué te podemos ayudar?"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[var(--color-waldorf-moss)] text-white font-bold earth-shadow hover:bg-[#3A4A3F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" size={20} /> Enviando...</>
                ) : (
                  <>Enviar Mensaje <Send size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
