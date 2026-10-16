import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Compass, ArrowRight, Home } from 'lucide-react'

export const metadata = {
  title: 'Página no encontrada | Colegio Waldorf Trekan Puerto Varas',
  description: 'El camino que buscas no está disponible o ha cambiado de lugar. Te invitamos a continuar descubriendo nuestra comunidad educativa Waldorf.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between selection:bg-[#D35D3E]/20 selection:text-white">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-36 pb-24 relative overflow-hidden">
        {/* Fondo sutil orgánico */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-waldorf-sage)]/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2C3E35]/5 border border-[#2C3E35]/10 text-[#D35D3E] text-xs font-mono uppercase tracking-[0.25em] mb-8 font-semibold">
            <Compass size={14} className="animate-spin-slow" />
            Error 404 · Camino no encontrado
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#2C3E35] mb-6 leading-tight tracking-tight">
            Un sendero que se ha transformado
          </h1>

          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
            La página que buscas no existe o ha tomado un nuevo rumbo, pero las puertas de nuestra comunidad escolar siguen abiertas.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2C3E35] text-[#FAF9F6] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#D35D3E] transition-all duration-300 earth-shadow hover:scale-105"
            >
              <Home size={15} />
              Volver al Inicio
            </Link>

            <Link
              href="/admision"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D35D3E] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#b04a32] transition-all duration-300 earth-shadow hover:scale-105"
            >
              Admisión 2027
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-[#2C3E35]/10 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <Link href="/noticias" className="hover:text-[#D35D3E] transition-colors">
              Diario y Noticias
            </Link>
            <span>•</span>
            <Link href="/recursos" className="hover:text-[#D35D3E] transition-colors">
              Recursos Waldorf
            </Link>
            <span>•</span>
            <Link href="/#contacto" className="hover:text-[#D35D3E] transition-colors">
              Contacto Directo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
