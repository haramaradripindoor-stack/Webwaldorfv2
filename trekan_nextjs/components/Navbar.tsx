'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  
  const navRef = useRef<HTMLElement>(null)

  // Cerrar menús al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-[var(--color-waldorf-sage)]/10 py-3 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group no-cursor-scale">
        <div className="relative w-14 h-14 flex-shrink-0 group-hover:scale-105 transition-transform origin-left">
          <Image 
            src="/assets/logo-mini.webp" 
            alt="Colegio Waldorf Trekan" 
            fill
            className="object-contain mix-blend-multiply"
            priority
            sizes="56px"
          />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-sm font-bold text-[var(--color-waldorf-moss)] tracking-tight">Colegio Waldorf</span>
          <span className="text-lg font-bold font-serif text-[var(--color-waldorf-moss)] tracking-tight leading-none">Trekan</span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        <Link href="/" className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] transition-colors">
          Inicio
        </Link>
        
        {/* Dropdown: Nosotros */}
        <div className="relative group">
          <button 
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] transition-colors py-2"
            onMouseEnter={() => setDropdownOpen('nosotros')}
            onClick={() => setDropdownOpen(dropdownOpen === 'nosotros' ? null : 'nosotros')}
          >
            Nosotros <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen === 'nosotros' ? 'rotate-180' : ''}`} />
          </button>
          
          <div 
            className={`absolute top-full left-0 mt-1 w-56 bg-[var(--color-waldorf-paper)] rounded-xl earth-shadow border border-[var(--color-waldorf-sage)]/10 flex flex-col py-2 transition-all duration-200 origin-top-left ${dropdownOpen === 'nosotros' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <Link href="/#quienes-somos" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Quiénes Somos</Link>
            <Link href="/#pedagogia" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Pedagogía Waldorf</Link>
            <Link href="/recursos" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Recursos Waldorf</Link>
            <Link href="/#comunidad" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Comunidad</Link>
            <Link href="/#actividades" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Actividades</Link>
            <Link href="/noticias" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Noticias</Link>
          </div>
        </div>

        {/* Dropdown: Admisión 2026 */}
        <div className="relative group">
          <button 
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] transition-colors py-2"
            onMouseEnter={() => setDropdownOpen('admision')}
            onClick={() => setDropdownOpen(dropdownOpen === 'admision' ? null : 'admision')}
          >
            Admisión 2026 <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen === 'admision' ? 'rotate-180' : ''}`} />
          </button>
          
          <div 
            className={`absolute top-full left-0 mt-1 w-56 bg-[var(--color-waldorf-paper)] rounded-xl earth-shadow border border-[var(--color-waldorf-sage)]/10 flex flex-col py-2 transition-all duration-200 origin-top-left ${dropdownOpen === 'admision' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <Link href="/admision" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Valores y Aranceles</Link>
            <Link href="/admision#faq" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Preguntas Frecuentes</Link>
          </div>
        </div>

        <Link href="/arriendo-salon" className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] transition-colors">
          Arriendo de Salón
        </Link>
        <Link href="/#contacto" className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] transition-colors">
          Contacto
        </Link>

        {/* Language Switcher */}
        <div className="flex gap-2 text-xs font-semibold text-[var(--color-waldorf-sage)] border-l border-[var(--color-waldorf-sage)]/20 pl-4 ml-2">
          <button onClick={() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) { select.value = 'es'; select.dispatchEvent(new Event('change')); }
          }} className="hover:text-[var(--color-waldorf-moss)] transition-colors">ES</button>
          <span>|</span>
          <button onClick={() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) { select.value = 'de'; select.dispatchEvent(new Event('change')); }
          }} className="hover:text-[var(--color-waldorf-moss)] transition-colors">DE</button>
          <span>|</span>
          <button onClick={() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) { select.value = 'en'; select.dispatchEvent(new Event('change')); }
          }} className="hover:text-[var(--color-waldorf-moss)] transition-colors">EN</button>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button className="lg:hidden text-[var(--color-waldorf-moss)] p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[var(--color-waldorf-paper)]/95 backdrop-blur-md border-b border-[var(--color-waldorf-sage)]/10 py-6 px-8 flex flex-col gap-2 lg:hidden shadow-xl max-h-[80vh] overflow-y-auto">
          
          <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-semibold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Inicio
          </Link>
          
          {/* Mobile Nosotros */}
          <div className="py-3 border-b border-[var(--color-waldorf-sage)]/10">
            <div className="text-base font-semibold text-[var(--color-waldorf-moss)] mb-2">Nosotros</div>
            <div className="flex flex-col pl-4 gap-3">
              <Link href="/#quienes-somos" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Quiénes Somos</Link>
              <Link href="/#pedagogia" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Pedagogía Waldorf</Link>
              <Link href="/recursos" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Recursos Waldorf</Link>
              <Link href="/#comunidad" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Comunidad</Link>
              <Link href="/#actividades" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Actividades</Link>
              <Link href="/noticias" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Noticias</Link>
            </div>
          </div>

          {/* Mobile Admisión */}
          <div className="py-3 border-b border-[var(--color-waldorf-sage)]/10">
            <div className="text-base font-semibold text-[var(--color-waldorf-moss)] mb-2">Admisión 2026</div>
            <div className="flex flex-col pl-4 gap-3">
              <Link href="/admision" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Valores y Aranceles</Link>
              <Link href="/admision#faq" onClick={() => setIsOpen(false)} className="text-sm text-[var(--color-waldorf-text-light)]">Preguntas Frecuentes</Link>
            </div>
          </div>

          <Link href="/arriendo-salon" onClick={() => setIsOpen(false)} className="text-base font-semibold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Arriendo de Salón
          </Link>
          <Link href="/#contacto" onClick={() => setIsOpen(false)} className="text-base font-semibold text-[var(--color-waldorf-moss)] py-3">
            Contacto
          </Link>
          
        </div>
      )}
    </nav>
  )
}
