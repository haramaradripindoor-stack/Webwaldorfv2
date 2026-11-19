'use client'

import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ADMISION_CONFIG from '@/config/admision'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1710] text-[#D8D2C5] border-t border-[#2C3E35]/40 py-16 px-6 md:px-12 mt-16 relative overflow-hidden">
      
      {/* Organic Forest Ambient Glow */}
      <div 
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-[#1a3324]/30 to-transparent blur-[100px] pointer-events-none transform translate-x-1/4 translate-y-1/4" 
      />
      <div 
        aria-hidden="true"
        className="absolute top-0 left-10 w-[30vw] h-[30vw] rounded-full bg-[#122118]/40 blur-[90px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative z-10">
        
        {/* Columna 1: Identidad & Monograma Canónico */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-[#1a2e25] border border-[#EBBA7A]/40 flex items-center justify-center font-serif font-bold text-[#EBBA7A] text-lg shadow-lg">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-widest text-[#F7F4EE]">
                  TREKAN
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8DA399]">
                  Colegio Waldorf • Puerto Varas
                </span>
              </div>
            </div>

            <p className="text-[#D8D2C5]/80 text-sm leading-relaxed font-sans mb-4">
              Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
            </p>

            <blockquote className="border-l-2 border-[#EBBA7A]/50 pl-3 py-1 my-4 text-xs italic font-serif text-[#EBBA7A]/90 leading-relaxed">
              «Una educación para la libertad, enraizada en la naturaleza y la voluntad humana.»
            </blockquote>
          </div>

          <div className="flex gap-3 pt-2">
            <a 
              href="https://www.instagram.com/waldorftrekanpv/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Seguir a Colegio Waldorf Trekan en Instagram" 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#EBBA7A] hover:border-[#EBBA7A]/50 hover:bg-[#EBBA7A]/10 transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61573063135723" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Seguir a Colegio Waldorf Trekan en Facebook" 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#EBBA7A] hover:border-[#EBBA7A]/50 hover:bg-[#EBBA7A]/10 transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Columna 2: Contacto & Visitas a la Casona */}
        <div>
          <h4 className="font-serif text-[#F7F4EE] font-bold mb-6 text-base tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EBBA7A]" />
            Contacto & Visitas
          </h4>
          <ul className="space-y-4">
            <li>
              <a 
                href="https://wa.me/56967765106" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm text-[#D8D2C5]/85 hover:text-[#EBBA7A] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#EBBA7A] shrink-0 group-hover:bg-[#EBBA7A]/10 transition-colors">
                  <Phone size={15} />
                </div>
                <span>+56 9 6776 5106</span>
              </a>
            </li>
            <li>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-[#D8D2C5]/85 hover:text-[#EBBA7A] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#EBBA7A] shrink-0 group-hover:bg-[#EBBA7A]/10 transition-colors">
                  <Mail size={15} />
                </div>
                <span className="break-all">admision@colegiowaldorftrekan.cl</span>
              </a>
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-3 text-sm text-[#D8D2C5]/85">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#EBBA7A] shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <span>Las Azaleas 96, Parque Ivian 1, Puerto Varas</span>
              </div>
              <a 
                href="https://maps.google.com/?q=Las+Azaleas+96+Parque+Ivian+1+Puerto+Varas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 ml-11 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#EBBA7A]/40 text-xs font-medium text-[#F7F4EE] hover:text-[#EBBA7A] transition-all duration-300 w-fit group"
              >
                <MapPin size={12} className="text-[#EBBA7A] group-hover:scale-110 transition-transform" />
                <span>Cómo llegar a la Casona →</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Navegación & Vida Escolar */}
        <div>
          <h4 className="font-serif text-[#F7F4EE] font-bold mb-6 text-base tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EBBA7A]" />
            Navegación
          </h4>
          <ul className="space-y-3.5 text-sm text-[#D8D2C5]/80 font-medium">
            <li>
              <Link href="/#quienes-somos" className="hover:text-[#EBBA7A] hover:translate-x-1 inline-block transition-all duration-200">
                Quiénes Somos
              </Link>
            </li>
            <li>
              <Link href="/#pedagogia" className="hover:text-[#EBBA7A] hover:translate-x-1 inline-block transition-all duration-200">
                Pedagogía Waldorf
              </Link>
            </li>
            <li>
              <Link href="/#admision" className="hover:text-[#EBBA7A] hover:translate-x-1 inline-block transition-all duration-200 text-[#EBBA7A] font-semibold">
                {ADMISION_CONFIG.title}
              </Link>
            </li>
            <li>
              <Link href="/noticias" className="hover:text-[#EBBA7A] hover:translate-x-1 inline-block transition-all duration-200">
                Noticias & Crónicas
              </Link>
            </li>
            <li>
              <Link href="/arriendo-salon" className="hover:text-[#EBBA7A] hover:translate-x-1 inline-block transition-all duration-200">
                Arriendo de Salón
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Tarjeta Fast-Track Admisión 2027 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EBBA7A]/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-[#EBBA7A]/15 border border-[#EBBA7A]/30 text-[#EBBA7A] text-[10px] font-mono uppercase tracking-widest font-semibold mb-3">
              {ADMISION_CONFIG.badge}
            </span>
            <h5 className="font-serif text-lg font-bold text-[#F7F4EE] mb-2">
              Admisión {ADMISION_CONFIG.activeYear}
            </h5>
            <p className="text-xs text-[#D8D2C5]/75 leading-relaxed mb-4">
              Vacantes limitadas para Jardín Infantil y Enseñanza Básica. Conoce las etapas de postulación y agenda una visita guiada a la Casona.
            </p>
          </div>

          <Link 
            href="/#admision" 
            className="w-full py-3 px-4 rounded-full bg-[#EBBA7A] hover:bg-[#d9a463] text-[#0B1710] font-bold text-xs tracking-wide text-center transition-all duration-300 shadow-[0_0_30px_rgba(235,186,122,0.25)] hover:shadow-[0_0_45px_rgba(235,186,122,0.45)] flex items-center justify-center gap-2 group"
          >
            <span>Conocer Vacantes</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Sub-Footer & Enlaces de SEO Local Programático (100% Preservados) */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col items-center gap-3 text-xs text-[#8DA399] font-medium relative z-10 text-center">
        <p className="text-[#D8D2C5]/70">
          &copy; {currentYear} Colegio Waldorf Trekan • Puerto Varas, Región de Los Lagos.
        </p>
        <p className="text-[11px] text-[#8DA399]/80">
          Construyendo comunidad, educación y voluntad en el sur de Chile. Todos los derechos reservados.
        </p>
        
        {/* Enlaces de SEO Local Programático (Autopista de Rastreo de Googlebot) */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mt-4 max-w-3xl text-[11px] text-[#8DA399]/70">
          <Link href="/ciudades/puerto-varas" className="hover:text-[#EBBA7A] transition-colors">Puerto Varas</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/puerto-montt" className="hover:text-[#EBBA7A] transition-colors">Puerto Montt</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/frutillar" className="hover:text-[#EBBA7A] transition-colors">Frutillar</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/llanquihue" className="hover:text-[#EBBA7A] transition-colors">Llanquihue</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/osorno" className="hover:text-[#EBBA7A] transition-colors">Osorno</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/valdivia" className="hover:text-[#EBBA7A] transition-colors">Valdivia</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/chiloe" className="hover:text-[#EBBA7A] transition-colors">Chiloé</Link>
          <span className="text-[#EBBA7A]/40">&bull;</span>
          <Link href="/ciudades/santiago" className="hover:text-[#EBBA7A] transition-colors">Santiago (Admisión Zona Central)</Link>
        </div>

        <Link 
          href="/recursos" 
          className="mt-3 text-[11px] text-[#8DA399]/60 hover:text-[#EBBA7A] border-b border-dotted border-[#8DA399]/30 hover:border-[#EBBA7A] transition-colors"
        >
          Directorio de Recursos Waldorf y Antroposóficos en Chile
        </Link>
      </div>
    </footer>
  )
}
