'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ADMISION_CONFIG from '@/config/admision'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('es')
  
  const navRef = useRef<HTMLElement>(null)

  // Cerrar menús al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setDropdownOpen(null)
        setLangOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang)
    setLangOpen(false)
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = lang
      select.dispatchEvent(new Event('change'))
    }
  }

  return (
    <nav 
      ref={navRef} 
      className="fixed top-0 left-0 right-0 z-50 py-3 px-6 md:px-12 flex justify-between items-center bg-[#FAF8F5] border-b border-[var(--color-waldorf-sage)]/20 shadow-xs"
    >
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3.5 group no-cursor-scale">
        <div className="relative w-11 h-11 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 origin-left">
          <Image 
            src="/assets/logo.png" 
            alt="Colegio Waldorf Trekan" 
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="flex flex-col leading-tight notranslate">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--color-waldorf-sage)]">
            Colegio Waldorf
          </span>
          <span className="text-lg sm:text-xl font-bold font-serif tracking-tight text-[var(--color-waldorf-moss)]">
            Trekan
          </span>
          <span className="text-[9px] font-serif italic tracking-wide text-[var(--color-waldorf-terracotta)]">
            Educamos para la vida
          </span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        <Link 
          href="/" 
          className="text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors"
        >
          Inicio
        </Link>
        
        {/* Dropdown: Nosotros */}
        <div className="relative group">
          <button 
            className="flex items-center gap-1 text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors py-2"
            onMouseEnter={() => setDropdownOpen('nosotros')}
            onClick={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                setDropdownOpen('nosotros');
              } else {
                setDropdownOpen(dropdownOpen === 'nosotros' ? null : 'nosotros');
              }
            }}
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
            <Link href="/trabaja-con-nosotros" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Trabaja con Nosotros</Link>
          </div>
        </div>

        {/* Dropdown: Admisión 2027 */}
        <div className="relative group">
          <button 
            className="flex items-center gap-1 text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors py-2"
            onMouseEnter={() => setDropdownOpen('admision')}
            onClick={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                setDropdownOpen('admision');
              } else {
                setDropdownOpen(dropdownOpen === 'admision' ? null : 'admision');
              }
            }}
          >
            {ADMISION_CONFIG.title} <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen === 'admision' ? 'rotate-180' : ''}`} />
          </button>
          
          <div 
            className={`absolute top-full left-0 mt-1 w-56 bg-[var(--color-waldorf-paper)] rounded-xl earth-shadow border border-[var(--color-waldorf-sage)]/10 flex flex-col py-2 transition-all duration-200 origin-top-left ${dropdownOpen === 'admision' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            onMouseLeave={() => setDropdownOpen(null)}
          >
            <div className="px-5 py-2 border-b border-[var(--color-waldorf-sage)]/10 mb-2">
              <span className="text-[11px] leading-tight text-[var(--color-waldorf-sage)] font-serif italic block">Un proceso pensado para conocernos con calma.</span>
            </div>
            <Link href="/admision" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Valores y Aranceles</Link>
            <Link href="/admision#faq" className="px-5 py-2.5 text-sm text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)] transition-colors">Preguntas Frecuentes</Link>
          </div>
        </div>

        <Link 
          href="/arriendo-salon" 
          className="text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors"
        >
          Arriendo de Salón
        </Link>
        <Link 
          href="/economia-fraterna" 
          className="text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors"
        >
          Economía Fraterna
        </Link>
        <Link 
          href="/#contacto" 
          className="text-sm font-semibold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors"
        >
          Contacto
        </Link>

        {/* Dropdown Selector de Idioma (Despliegue Elegante) */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white hover:bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] border-[var(--color-waldorf-sage)]/30 shadow-xs transition-all duration-300"
            aria-label="Seleccionar idioma"
          >
            <Globe size={13} className="text-[var(--color-waldorf-terracotta)]" />
            <span>{currentLang.toUpperCase()}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-36 bg-[var(--color-waldorf-paper)] rounded-xl earth-shadow border border-[var(--color-waldorf-sage)]/15 py-1.5 flex flex-col z-50 text-xs font-medium text-[var(--color-waldorf-text)] animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setLangOpen(false)}
            >
              <button 
                onClick={() => changeLanguage('es')}
                className={`px-3.5 py-2 text-left hover:bg-[var(--color-waldorf-cream)] flex items-center justify-between transition-colors ${currentLang === 'es' ? 'text-[var(--color-waldorf-moss)] font-bold bg-[var(--color-waldorf-cream)]/50' : ''}`}
              >
                <span>Español</span>
                <span className="text-[10px] opacity-60">ES</span>
              </button>
              <button 
                onClick={() => changeLanguage('de')}
                className={`px-3.5 py-2 text-left hover:bg-[var(--color-waldorf-cream)] flex items-center justify-between transition-colors ${currentLang === 'de' ? 'text-[var(--color-waldorf-moss)] font-bold bg-[var(--color-waldorf-cream)]/50' : ''}`}
              >
                <span>Deutsch</span>
                <span className="text-[10px] opacity-60">DE</span>
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-3.5 py-2 text-left hover:bg-[var(--color-waldorf-cream)] flex items-center justify-between transition-colors ${currentLang === 'en' ? 'text-[var(--color-waldorf-moss)] font-bold bg-[var(--color-waldorf-cream)]/50' : ''}`}
              >
                <span>English</span>
                <span className="text-[10px] opacity-60">EN</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          className="p-2 focus:outline-none text-[var(--color-waldorf-moss)] transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 right-0 bg-[#FAF8F5] border-b border-[var(--color-waldorf-sage)]/20 py-6 px-8 flex flex-col gap-2 lg:hidden shadow-xl max-h-[80vh] overflow-y-auto">
          
          <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-bold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Inicio
          </Link>
          
          {/* Mobile Nosotros */}
          <div className="py-3 border-b border-[var(--color-waldorf-sage)]/10">
            <div className="text-base font-bold text-[var(--color-waldorf-moss)] mb-2">Nosotros</div>
            <div className="flex flex-col pl-4 gap-3">
              <Link href="/#quienes-somos" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Quiénes Somos</Link>
              <Link href="/#pedagogia" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Pedagogía Waldorf</Link>
              <Link href="/recursos" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Recursos Waldorf</Link>
              <Link href="/#comunidad" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Comunidad</Link>
              <Link href="/#actividades" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Actividades</Link>
              <Link href="/noticias" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Noticias</Link>
              <Link href="/trabaja-con-nosotros" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Trabaja con Nosotros</Link>
            </div>
          </div>

          {/* Mobile Admisión */}
          <div className="py-3 border-b border-[var(--color-waldorf-sage)]/10">
            <div className="text-base font-bold text-[var(--color-waldorf-moss)] mb-1">{ADMISION_CONFIG.title}</div>
            <div className="text-xs text-[var(--color-waldorf-sage)] italic font-serif mb-3 leading-tight pr-4">Un proceso pensado para conocernos con calma.</div>
            <div className="flex flex-col pl-4 gap-3">
              <Link href="/admision" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Valores y Aranceles</Link>
              <Link href="/admision#faq" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[var(--color-waldorf-text)] hover:text-[var(--color-waldorf-moss)]">Preguntas Frecuentes</Link>
            </div>
          </div>

          <Link href="/arriendo-salon" onClick={() => setIsOpen(false)} className="text-base font-bold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Arriendo de Salón
          </Link>
          <Link href="/economia-fraterna" onClick={() => setIsOpen(false)} className="text-base font-bold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Economía Fraterna
          </Link>
          <Link href="/#contacto" onClick={() => setIsOpen(false)} className="text-base font-bold text-[var(--color-waldorf-moss)] py-3 border-b border-[var(--color-waldorf-sage)]/10">
            Contacto
          </Link>

          {/* Selector de idioma móvil */}
          <div className="py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-waldorf-moss)] flex items-center gap-2">
              <Globe size={16} className="text-[var(--color-waldorf-terracotta)]" />
              Idioma
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${currentLang === 'es' ? 'bg-[var(--color-waldorf-moss)] text-white' : 'bg-black/5 text-[var(--color-waldorf-text)]'}`}
              >
                ES
              </button>
              <button 
                onClick={() => changeLanguage('de')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${currentLang === 'de' ? 'bg-[var(--color-waldorf-moss)] text-white' : 'bg-black/5 text-[var(--color-waldorf-text)]'}`}
              >
                DE
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${currentLang === 'en' ? 'bg-[var(--color-waldorf-moss)] text-white' : 'bg-black/5 text-[var(--color-waldorf-text)]'}`}
              >
                EN
              </button>
            </div>
          </div>
          
        </div>
      )}
    </nav>
  )
}
