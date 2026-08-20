"use client"

import { useState } from 'react'

export default function ShareButtons({ url, title }: { url: string, title: string }) {
  const [copied, setCopied] = useState(false)

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " | " + url)}`, '_blank')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <button onClick={shareFacebook} className="text-left font-serif text-lg text-[#2C3E35] hover:text-[#D35D3E] transition-colors italic">En Facebook</button>
      <button onClick={shareWhatsApp} className="text-left font-serif text-lg text-[#2C3E35] hover:text-[#D35D3E] transition-colors italic">En WhatsApp</button>
      <button onClick={copyLink} className="text-left font-serif text-lg text-[#2C3E35] hover:text-[#D35D3E] transition-colors italic flex items-center gap-2">
        {copied ? '¡Copiado!' : 'Copiar Enlace'}
      </button>
    </div>
  )
}
