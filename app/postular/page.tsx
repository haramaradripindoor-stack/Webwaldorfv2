import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FormularioPostulacionCompleto from '@/components/FormularioPostulacionCompleto'

export const metadata = {
  title: 'Postulación Online | Colegio Waldorf Trekan',
  description: 'Formulario oficial de postulación y admisión para el Colegio Waldorf Trekan en Puerto Varas.',
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
            Admisión 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Conozcámonos a fondo
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Este formulario reemplaza nuestra antigua encuesta de Google. La información que nos confías aquí nos permite entender las necesidades de tu familia y preparar nuestro primer encuentro.
          </p>
        </div>

        <div className="relative z-10">
          <FormularioPostulacionCompleto />
        </div>

      </div>

      <Footer />
    </main>
  )
}
