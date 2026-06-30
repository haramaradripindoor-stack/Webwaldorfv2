'use client'

import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-waldorf-paper)] border-t border-[var(--color-waldorf-sage)]/10 py-16 px-6 md:px-12 mt-12 relative overflow-hidden">
      
      {/* Organic Background shape */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-[100%] bg-gradient-to-tl from-[var(--color-waldorf-sage)]/10 to-transparent blur-[80px] pointer-events-none transform translate-x-1/4 translate-y-1/4" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--color-waldorf-moss)] flex items-center justify-center font-bold text-[var(--color-waldorf-cream)] text-sm">
              T
            </div>
            <span className="font-serif text-xl font-bold tracking-wider text-[var(--color-waldorf-moss)]">
              TREKAN
            </span>
          </div>
          <p className="text-[var(--color-waldorf-text-light)] text-sm max-w-sm mb-8 leading-relaxed font-medium">
            Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/waldorftrekanpv/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-cream)] transition-all duration-300 cursor-none earth-shadow">
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61573063135723" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-cream)] transition-all duration-300 cursor-none earth-shadow">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-[var(--color-waldorf-moss)] font-bold mb-6 text-lg">Contacto</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-[var(--color-waldorf-text-light)] hover:text-[var(--color-waldorf-terracotta)] transition-colors text-sm font-medium">
              <Phone size={16} className="text-[var(--color-waldorf-sage)]" />
              <span>+56 9 6776 5106</span>
            </li>
            <li className="flex items-center gap-3 text-[var(--color-waldorf-text-light)] hover:text-[var(--color-waldorf-terracotta)] transition-colors text-sm font-medium">
              <Mail size={16} className="text-[var(--color-waldorf-sage)]" />
              <a href="mailto:admision@colegiowaldorftrekan.cl">admision@colegiowaldorftrekan.cl</a>
            </li>
            <li className="flex items-start gap-3 text-[var(--color-waldorf-text-light)] hover:text-[var(--color-waldorf-terracotta)] transition-colors text-sm font-medium">
              <MapPin size={16} className="text-[var(--color-waldorf-sage)] shrink-0 mt-0.5" />
              <span>Las Azaleas 96, Parque Ivian 1, Puerto Varas</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-[var(--color-waldorf-moss)] font-bold mb-6 text-lg">Navegación</h4>
          <ul className="space-y-4 text-sm text-[var(--color-waldorf-text-light)] font-medium">
            <li><Link href="/#quienes-somos" className="hover:text-[var(--color-waldorf-terracotta)] transition-colors">Quiénes Somos</Link></li>
            <li><Link href="/#pedagogia" className="hover:text-[var(--color-waldorf-terracotta)] transition-colors">Pedagogía Waldorf</Link></li>
            <li><Link href="/#admision" className="hover:text-[var(--color-waldorf-terracotta)] transition-colors">Admisión 2026</Link></li>
            <li><Link href="/arriendo-salon" className="hover:text-[var(--color-waldorf-terracotta)] transition-colors">Arriendo de Salón</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[var(--color-waldorf-sage)]/10 mt-16 pt-8 flex flex-col items-center gap-2 text-xs text-[var(--color-waldorf-sage)] font-medium relative z-10 text-center">
        <p>&copy; {new Date().getFullYear()} Colegio Waldorf Trekan - Puerto Varas</p>
        <p>Construyendo comunidad, educación y voluntad. Todos los derechos reservados.</p>
        <Link href="/recursos-waldorf-chile" className="mt-2 text-[var(--color-waldorf-sage)]/80 hover:text-[var(--color-waldorf-terracotta)] border-b border-dotted border-[var(--color-waldorf-sage)]/40 hover:border-transparent transition-colors">
          Directorio de Recursos Waldorf y Antroposóficos en Chile
        </Link>
      </div>
    </footer>
  )
}
