// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  // Lead capture solo al derivar a humano
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({ name: '', phone: '' })
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // @ts-expect-error: input is valid in runtime but ai-sdk types fail here
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! 🌱 Soy el Asistente del Colegio Trekan. ¿En qué te puedo ayudar? Puedes preguntarme sobre aranceles, horarios, pedagogía o el proceso de admisión 2026.'
      }
    ]
  })

  // Auto-dismiss pulse
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showLeadForm])

  const getWhatsAppUrl = () => {
    const name = leadData.name ? leadData.name : 'alguien interesado'
    const text = `Hola Ivonne! Soy ${name}. Estuve hablando con tu asistente por la página web y me gustaría agendar una visita o resolver dudas finales. 🌱`
    return `https://wa.me/56967765106?text=${encodeURIComponent(text)}`
  }

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLeadSubmitted(true)
    // Abrir WhatsApp directamente
    window.open(getWhatsAppUrl(), '_blank')
  }

  const handleFaqClick = (question: string) => {
    // @ts-ignore
    handleInputChange({ target: { value: question } })
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement
      if (form) form.requestSubmit()
    }, 100)
  }

  const faqs = [
    { q: '¿Cuál es el valor de la mensualidad?' },
    { q: '¿Aún quedan cupos para 2026?' },
    { q: '¿Cómo es el proceso de admisión?' },
    { q: '¿Dónde están ubicados?' },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] h-[520px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-waldorf-sage)]/20 bg-[var(--color-waldorf-paper)]"
          >
            {/* Header */}
            <div className="bg-[var(--color-waldorf-moss)] p-4 relative shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-waldorf-cream)]/70 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-waldorf-cream)] flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <h4 className="text-[var(--color-waldorf-cream)] font-bold text-sm font-serif">Asistente</h4>
                  <p className="text-[var(--color-waldorf-cream)]/80 text-xs font-medium">Admisión Trekan</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#00d4a4] animate-pulse" />
                    <span className="text-[#00d4a4] text-[10px] font-bold">En línea ahora</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-[var(--color-waldorf-cream)]">
              <div className="space-y-4">
                {/* Messages */}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-[var(--color-waldorf-sage)] text-white rounded-tr-sm' : 'bg-white text-[var(--color-waldorf-text)] border border-[var(--color-waldorf-sage)]/10 rounded-tl-sm'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-p:leading-relaxed prose-p:mb-2 last:prose-p:mb-0">
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[var(--color-waldorf-sage)]/10 rounded-2xl rounded-tl-sm p-4 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-waldorf-sage)]/50 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-waldorf-sage)]/50 animate-bounce delay-75" />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-waldorf-sage)]/50 animate-bounce delay-150" />
                    </div>
                  </div>
                )}

                {/* FAQs rápidas — solo al inicio */}
                {messages.length <= 1 && !isLoading && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs text-[var(--color-waldorf-moss)] font-bold uppercase tracking-wider mb-1">Preguntas Frecuentes</p>
                    {faqs.map((faq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFaqClick(faq.q)}
                        className="text-left text-sm bg-white border border-[var(--color-waldorf-sage)]/20 p-3 rounded-xl hover:bg-[var(--color-waldorf-sage)]/5 transition-colors text-[var(--color-waldorf-text)] shadow-sm flex items-center justify-between group"
                      >
                        <span>{faq.q}</span>
                        <span className="text-[var(--color-waldorf-moss)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Card de derivación a Ivonne — aparece tras 2+ intercambios */}
                {messages.length > 2 && !isLoading && !showLeadForm && !leadSubmitted && (
                  <div className="pt-2">
                    <div className="bg-white border-2 border-[#25D366]/20 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#25D366]/10 rounded-bl-full -z-10" />
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#25D366] shrink-0 bg-gray-100">
                          <Image src="/assets/Coordinadora.png" alt="Ivonne Parada" fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#128C7E] text-sm leading-tight">Ivonne Parada</h4>
                          <p className="text-[11px] text-gray-500 uppercase tracking-wider">Coordinadora de Admisión</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        ¿Quieres agendar una visita o tienes dudas más específicas?
                      </p>
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#128C7E] transition-all duration-300 shadow-lg shadow-[#25D366]/30"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Hablar con Ivonne
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini form — solo al querer derivar */}
                {showLeadForm && !leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-4 shadow-sm"
                  >
                    <p className="text-sm text-[var(--color-waldorf-text)] font-medium mb-3 text-center">
                      ¡Genial! ¿Cómo te llamas? (opcional)
                    </p>
                    <form onSubmit={handleLeadFormSubmit} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Tu nombre (opcional)"
                        value={leadData.name}
                        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                        className="w-full bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono (opcional)"
                        value={leadData.phone}
                        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                        className="w-full bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)]"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 bg-[#25D366] text-white font-bold text-sm py-2.5 rounded-xl hover:bg-[#128C7E] transition-colors"
                        >
                          Abrir WhatsApp →
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(getWhatsAppUrl(), '_blank')}
                          className="text-xs text-[var(--color-waldorf-moss)] underline px-2"
                        >
                          Saltar
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {leadSubmitted && (
                  <div className="text-center text-sm text-[var(--color-waldorf-moss)] font-medium py-2">
                    ✅ ¡Gracias! Ivonne te contactará pronto.
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-[var(--color-waldorf-sage)]/10 shrink-0">
              <form id="chat-form" onSubmit={handleSubmit} className="flex items-end gap-2 relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20 rounded-full px-4 py-2 text-sm outline-none focus:border-[var(--color-waldorf-moss)] text-[var(--color-waldorf-text)] placeholder-[var(--color-waldorf-text-light)]/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="w-10 h-10 rounded-full bg-[var(--color-waldorf-moss)] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-[var(--color-waldorf-sage)] transition-colors shrink-0"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
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
              ¿Dudas? ¡Pregúntame! 🌱
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
          className={`relative h-16 ${isOpen ? 'w-16 rounded-full' : 'px-8 rounded-full'} bg-gradient-to-tr from-[#128C7E] to-[#25D366] shadow-xl shadow-[#25D366]/40 flex items-center justify-center text-white hover:scale-105 transition-all duration-300`}
          aria-label="Abrir Chat"
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
              <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">1</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
