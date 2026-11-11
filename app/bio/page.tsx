import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageCircle, 
  Globe, 
  TreePine, 
  BookOpen, 
  Home, 
  MapPin, 
  Instagram, 
  Facebook, 
  Mail, 
  Phone,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Colegio Waldorf Trekan | Enlaces Oficiales y Admisión 2027',
  description: 'Acceso directo a Admisión 2027, WhatsApp del equipo pedagógico, sitio web oficial y vida comunitaria en Puerto Varas.',
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/bio',
  },
  openGraph: {
    title: 'Colegio Waldorf Trekan | Enlaces Oficiales',
    description: 'Donde la infancia respira. Admisión 2027, contacto directo y comunidad escolar en Puerto Varas.',
    url: 'https://www.colegiowaldorftrekan.cl/bio',
    images: [{ url: '/imagenes-web/paseocerro20261.jpg' }],
  }
};

export default function BioLinksPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F4EE] via-[#FDFBF7] to-[#F3EFE8] text-[var(--color-waldorf-text)] relative overflow-hidden py-10 px-4 sm:px-6">
      
      {/* Luces atmosféricas orgánicas de fondo */}
      <div 
        aria-hidden="true" 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-waldorf-sage)]/15 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 -right-20 w-80 h-80 bg-[var(--color-waldorf-terracotta)]/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 -left-20 w-80 h-80 bg-[var(--color-waldorf-mustard)]/15 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-md mx-auto relative z-10 flex flex-col items-center">
        
        {/* AVATAR / LOGO CIRCULAR OFICIAL */}
        <div className="relative mb-4 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[var(--color-waldorf-mustard)] via-[var(--color-waldorf-sage)] to-[var(--color-waldorf-moss)] shadow-lg shadow-[var(--color-waldorf-moss)]/10 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center p-1.5 border border-white">
              <Image
                src="/assets/logo.png"
                alt="Logo Colegio Waldorf Trekan"
                width={120}
                height={120}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          {/* Badge oficial */}
          <span 
            title="Cuenta Oficial de Colegio Waldorf Trekan"
            className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[var(--color-waldorf-moss)] text-white border-2 border-white flex items-center justify-center shadow-xs"
          >
            <ShieldCheck size={14} className="text-[var(--color-waldorf-mustard)]" />
          </span>
        </div>

        {/* IDENTIDAD / BIO HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--color-waldorf-moss)]/10 text-[var(--color-waldorf-moss)] text-[11px] font-bold tracking-wider uppercase mb-2">
            <Sparkles size={12} className="text-[var(--color-waldorf-mustard)]" />
            Puerto Varas · Chile
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-waldorf-moss)] tracking-tight">
            Colegio Waldorf Trekan
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-waldorf-text-light)] mt-1.5 font-medium max-w-xs mx-auto leading-relaxed">
            Donde la infancia respira. Comunidad educativa inspirada en la pedagogía Waldorf · Jardín Infantil a 8° Básico.
          </p>
        </div>

        {/* BOTONERA DE ENLACES PRINCIPALES */}
        <div className="w-full flex flex-col gap-3.5 mb-8">

          {/* BOTÓN 1 (DESTACADO HERO TOFU/MOFU): POSTULACIÓN ADMISIÓN 2027 */}
          <Link
            href="/admision"
            className="relative group p-4 rounded-2xl bg-[var(--color-waldorf-moss)] text-white border border-[var(--color-waldorf-mustard)]/40 shadow-md shadow-[var(--color-waldorf-moss)]/20 hover:bg-[#1f372e] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10 transition-colors" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Calendar size={22} className="text-[var(--color-waldorf-mustard)]" />
              </div>
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-waldorf-mustard)] text-[#1a2e25]">
                    Vacantes 2027
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-serif font-bold text-white mt-0.5">
                  Postulaciones Admisión 2027
                </h2>
                <p className="text-[11px] text-white/80 font-medium">
                  Formulario directo de postulación por curso
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 relative z-10" />
          </Link>

          {/* BOTÓN 2: WHATSAPP DIRECTO CON EL EQUIPO DE ADMISIÓN */}
          <a
            href="https://wa.me/56967765106?text=Hola,%20vengo%20desde%20Instagram%20y%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20el%20Colegio%20Waldorf%20Trekan"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-emerald-600/25 hover:border-emerald-600/50 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  WhatsApp Admisiones
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  Atención directa y resolución de dudas familiares
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </a>

          {/* BOTÓN 3: SITIO WEB OFICIAL */}
          <Link
            href="/"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/25 hover:border-[var(--color-waldorf-moss)]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-waldorf-moss)]/10 text-[var(--color-waldorf-moss)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Globe size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  Sitio Web Oficial
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  colegiowaldorftrekan.cl · Todo nuestro proyecto
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* BOTÓN 4: PEDAGOGÍA WALDORF */}
          <Link
            href="/#pedagogia"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/25 hover:border-[var(--color-waldorf-moss)]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[var(--color-waldorf-mustard)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TreePine size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  ¿Qué es la Pedagogía Waldorf?
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  Educación que protege los ritmos y etapas evolutivas
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* BOTÓN 5: NOTICIAS Y VIDA ESCOLAR */}
          <Link
            href="/noticias"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/25 hover:border-[var(--color-waldorf-moss)]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[var(--color-waldorf-terracotta)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  Noticias y Crónicas Escolares
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  Teatro del Lago, salidas a la naturaleza y vida viva
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* BOTÓN 6: ARRIENDO DE SALÓN MULTIUSO */}
          <Link
            href="/arriendo-salon"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/25 hover:border-[var(--color-waldorf-moss)]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Home size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  Arriendo de Salón Multiuso
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  Espacio cálido y acústico para talleres y encuentros
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          {/* BOTÓN 7: UBICACIÓN GOOGLE MAPS */}
          <a
            href="https://maps.google.com/?q=Las+Azaleas+96,+Parque+Ivian+1,+Puerto+Varas"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/25 hover:border-[var(--color-waldorf-moss)]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin size={22} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-serif font-bold text-[var(--color-waldorf-moss)]">
                  Ubicación en Puerto Varas
                </h3>
                <p className="text-[11px] text-[var(--color-waldorf-text-light)] font-medium">
                  Las Azaleas 96, Parque Ivian 1 · Abrir en Maps
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-waldorf-moss)] group-hover:translate-x-1 transition-all shrink-0" />
          </a>

        </div>

        {/* REDES SOCIALES Y CONTACTO DIRECTO */}
        <div className="w-full pt-4 pb-2 border-t border-[var(--color-waldorf-sage)]/20 flex flex-col items-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-waldorf-moss)]/70 mb-3">
            Comunidad y Contacto
          </p>
          
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://www.instagram.com/waldorftrekanpv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @waldorftrekanpv"
              className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-white transition-all shadow-xs"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61573063135723"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Colegio Trekan"
              className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-white transition-all shadow-xs"
            >
              <Facebook size={18} />
            </a>
            <a
              href="mailto:admision@colegiowaldorftrekan.cl"
              aria-label="Email admision@colegiowaldorftrekan.cl"
              className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-white transition-all shadow-xs"
            >
              <Mail size={18} />
            </a>
            <a
              href="tel:+56967765106"
              aria-label="Llamar a +56 9 6776 5106"
              className="w-10 h-10 rounded-full bg-white border border-[var(--color-waldorf-sage)]/20 flex items-center justify-center text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-moss)] hover:text-white transition-all shadow-xs"
            >
              <Phone size={18} />
            </a>
          </div>

          {/* FOOTER DEL LINK IN BIO */}
          <div className="text-center text-[11px] text-[var(--color-waldorf-text-light)] space-y-1">
            <p className="font-serif font-bold text-[var(--color-waldorf-moss)]">
              Colegio Waldorf Trekan
            </p>
            <p className="text-[10px] text-gray-500">
              © {currentYear} · Todos los derechos reservados
            </p>
            <p className="text-[10px] italic text-[var(--color-waldorf-sage)] pt-1">
              «Hacia una infancia con raíces profundas y alas libres»
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
