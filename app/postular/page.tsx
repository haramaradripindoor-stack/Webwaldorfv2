import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FormularioPostulacionCompleto from '@/components/FormularioPostulacionCompleto'

export const metadata = {
  title: 'Ficha de Encuentro Familiar (Paso 2) | Colegio Waldorf Trekan',
  description: 'Ficha pedagógica confidencial previa a la visita con la Coordinadora General y maestros de Trekan.',
}

export default function PostularPage() {
  return (
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24 px-4 sm:px-6 relative">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-[var(--color-waldorf-moss)] rounded-b-[4rem] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
          <span className="text-[var(--color-waldorf-mustard)] font-bold tracking-widest uppercase text-sm mb-4 block">
            Paso 2 · Encuentro Pedagógico
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Ficha de Encuentro Familiar
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
            Como ya coordinaste tu visita con <strong>Ivonne Parada Aravena</strong>, esta breve ficha confidencial permite a nuestro equipo de maestros conocer la historia, ritmo y necesidades de tu hijo/a antes de recibirlos en la escuela.
          </p>
        </div>

        <div className="relative z-10">
          <Suspense fallback={<div className="text-center py-12 text-gray-500">Cargando formulario...</div>}>
            <FormularioPostulacionCompleto />
          </Suspense>
        </div>

      </div>

      <Footer />
    </main>
  )
}
