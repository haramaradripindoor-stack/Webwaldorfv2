'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, MailX } from 'lucide-react'
import Link from 'next/link'

export default function DarseDeBaja() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error al procesar tu solicitud')

      setStatus('success')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center relative overflow-hidden">
        {/* Adorno superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-waldorf-mustard)]" />
        
        {status === 'success' ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">
              Te has dado de baja
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] mb-8">
              Tu correo <strong>{email}</strong> ha sido eliminado de nuestra lista de envíos de campañas. Ya no recibirás más correos de este tipo.
            </p>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 text-[var(--color-waldorf-sage)] hover:text-[var(--color-waldorf-moss)] font-semibold transition-colors"
            >
              Volver al inicio <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] rounded-full flex items-center justify-center mx-auto mb-6">
              <MailX size={36} />
            </div>
            <h1 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">
              Darse de baja
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] text-sm mb-8">
              Si ya no deseas recibir nuestros correos, ingresa tu dirección de email a continuación. Te eliminaremos de nuestra base de datos de campañas inmediatamente.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-waldorf-sage)] bg-gray-50 text-center text-gray-800"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--color-waldorf-terracotta)] hover:bg-[#c9664d] transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Procesando...' : 'Darme de baja'}
              </button>

              {status === 'error' && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </form>
          </>
        )}
      </div>
    </main>
  )
}
