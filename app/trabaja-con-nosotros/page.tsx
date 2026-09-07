'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Leaf, Heart, BookOpen, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { submitTeacher } from '@/app/actions/submitTeacher'

export default function TrabajaConNosotrosPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    
    const formData = new FormData(e.currentTarget)
    const result = await submitTeacher(formData)
    
    if (result.success) {
      setSuccess(true)
    } else {
      setErrorMsg(result.error || 'Ocurrió un error inesperado.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] selection:bg-[#E8E3D9]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C3329] tracking-tight">
            Únete a nuestro <br className="hidden md:block" />
            <span className="italic font-light">Impulso Pedagógico</span>
          </h1>
          <p className="font-sans text-xl text-[#5C6656] leading-relaxed max-w-2xl mx-auto">
            Buscamos maestros y profesionales apasionados por el desarrollo humano integral, la belleza y la contención orgánica.
          </p>
        </div>
      </section>

      {/* Filosofía & Propuesta de Valor */}
      <section className="py-20 bg-white border-y border-[#E8E3D9]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#4A5D23]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2C3329]">Estructura y Paz</h3>
            <p className="font-sans text-[#5C6656] leading-relaxed">
              Sabemos que para sostener a los niños, el maestro debe estar sostenido. Ofrecemos un entorno de trabajo ordenado, predecible y respetuoso.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#4A5D23]">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2C3329]">Belleza y Entorno</h3>
            <p className="font-sans text-[#5C6656] leading-relaxed">
              Nuestras aulas están diseñadas con materiales nobles y luz natural. Creemos que la belleza es un pilar fundamental para el desarrollo humano.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#4A5D23]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2C3329]">Desarrollo Integral</h3>
            <p className="font-sans text-[#5C6656] leading-relaxed">
              No somos un proyecto academicista. Buscamos guías que comprendan la profundidad de los septenios y la Antroposofía.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario Elegante */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-[#E8E3D9]/50">
          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-[#2C3329] mb-4">Envíanos tus antecedentes</h2>
            <p className="font-sans text-[#5C6656]">
              Toda información será tratada con absoluta confidencialidad por nuestro equipo directivo.
            </p>
          </div>

          {success ? (
            <div className="bg-[#F5F2EC] rounded-2xl p-8 text-center space-y-4 border border-[#E8E3D9]">
              <CheckCircle2 className="w-12 h-12 text-[#4A5D23] mx-auto" />
              <h3 className="font-serif text-2xl text-[#2C3329]">Antecedentes Recibidos</h3>
              <p className="font-sans text-[#5C6656]">
                Agradecemos tu interés en unirte a nuestro impulso pedagógico. Hemos recibido tus datos y los revisaremos con atención.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sans text-sm font-medium text-[#2C3329]">Nombre Completo</label>
                  <input name="fullName" required type="text" className="w-full bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl px-4 py-3 font-sans text-[#2C3329] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all" placeholder="Ej: María José Silva" />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-sm font-medium text-[#2C3329]">Correo Electrónico</label>
                  <input name="email" required type="email" className="w-full bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl px-4 py-3 font-sans text-[#2C3329] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all" placeholder="tucorreo@ejemplo.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-[#2C3329]">Área de Interés / Cargo</label>
                <select name="area" required className="w-full bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl px-4 py-3 font-sans text-[#2C3329] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all appearance-none">
                  <option value="">Selecciona un área...</option>
                  <option value="maestro_clase">Maestro/a de Clase (Básica)</option>
                  <option value="maestro_jardin">Maestro/a de Jardín de Infancia</option>
                  <option value="maestro_especialidad">Maestro/a de Especialidad (Música, Idiomas, etc.)</option>
                  <option value="administracion">Administración y Gestión</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-[#2C3329]">Adjunta tu CV (PDF o Word)</label>
                <div className="relative">
                  <input 
                    name="cv"
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="w-full bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl px-4 py-3 font-sans text-[#5C6656] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F5F2EC] file:text-[#4A5D23] hover:file:bg-[#E8E3D9] cursor-pointer" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-[#2C3329]">Carta de Motivación Breve</label>
                <textarea name="motivation" rows={4} className="w-full bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl px-4 py-3 font-sans text-[#2C3329] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] transition-all resize-none" placeholder="Cuéntanos brevemente sobre tu relación con la pedagogía Waldorf y por qué te gustaría unirte a Trekan..."></textarea>
              </div>
              
              {errorMsg && (
                <p className="text-red-500 font-sans text-sm text-center">{errorMsg}</p>
              )}

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#4A5D23] hover:bg-[#3A491C] disabled:bg-[#4A5D23]/50 text-white font-sans font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Antecedentes</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
