'use client'

import { Phone } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/56967765106?text=Hola%20Ivonne!%20Quiero%20agendar%20una%20visita%20al%20Colegio%20Trekan%20%F0%9F%8C%B1%0AMi%20hijo%2Fa%20tiene%20___%20a%C3%B1os.%0A%C2%BFTienen%20horarios%20disponibles%3F'

export default function WhatsAppWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">
      {/* Floating Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-full shadow-xl shadow-[#25D366]/30 hover:bg-[#128C7E] hover:scale-105 transition-all duration-300"
        aria-label="Abrir chat de WhatsApp"
      >
        <span className="font-bold text-sm">Hablemos</span>
        <Phone size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
        
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      </a>
    </div>
  )
}
