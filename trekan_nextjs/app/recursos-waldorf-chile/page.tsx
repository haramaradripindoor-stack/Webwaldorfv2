import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ExternalLink, Leaf, Users, BookOpen, HeartPulse, Puzzle, Film } from 'lucide-react'
import SmoothScroll from '@/components/SmoothScroll'

export default function RecursosPage() {
  const recursos = [
    {
      categoria: "Medicina y Farmacias Antroposóficas",
      icon: <Leaf className="text-[var(--color-waldorf-sage)]" size={24} />,
      desc: "Lugares de confianza para medicina natural, preparados magistrales Wala y cuidado integral.",
      links: [
        { name: "Farmacia Tríodo", url: "https://farmaciatriodo.cl/" },
        { name: "Weleda Chile", url: "https://www.weleda.cl/" },
        { name: "Farmacia Alquimist", url: "https://www.alquimist.cl/" },
        { name: "AMA Chile", url: "https://medicinaantroposofica.cl/" }
      ]
    },
    {
      categoria: "Comunidad, Formación y Economía",
      icon: <Users className="text-[var(--color-waldorf-mustard)]" size={24} />,
      desc: "Organizaciones formativas y proyectos de impacto.",
      links: [
        { name: "Centro de Formación Arché", url: "https://fundacionarche.cl/" },
        { name: "Sociedad Antroposófica en Chile", url: "https://antroposofiachile.cl/" },
        { name: "Banca Ética / Doble Impacto", url: "https://bancaeticalat.com/" },
        { name: "Librería Antroposófica", url: "https://www.libreriaantroposofica.cl/" }
      ]
    },
    {
      categoria: "Libros Fundamentales",
      icon: <BookOpen className="text-[var(--color-waldorf-terracotta)]" size={24} />,
      desc: "Obras clave para comprender la pedagogía.",
      links: [
        { name: '"Las 5 dimensiones de la pedagogía Waldorf" (Valentin Wember)', url: "#" },
        { name: '"La educación del niño a la luz de la antroposofía" (Rudolf Steiner)', url: "#" },
        { name: '"Usted es el primer profesor de su hijo" (Rahima Baldwin Dancy)', url: "#" },
        { name: '"El reino de la infancia" (Rudolf Steiner)', url: "#" }
      ]
    },
    {
      categoria: "Profesionales de la Salud",
      icon: <HeartPulse className="text-[#c6a382]" size={24} />,
      desc: "Médicos y odontólogos especializados en la visión integrativa de la antroposofía.",
      links: [
        { name: "Dra. Ana María Toro (Odontopediatría)", url: "https://draanamariatoro.com/" },
        { name: "Dr. Pablo Porcel (Médico general)", url: "https://medicina-antroposofica.cl/" }
      ]
    },
    {
      categoria: "Contenido para Niños (Argentina)",
      icon: <Puzzle className="text-[#8AA898]" size={24} />,
      desc: "Iniciativas destacadas del país vecino.",
      links: [
        { name: "Jugar i Jugar / Juguetes Naturales", url: "https://jugarijugar.com/" },
        { name: "Comunidad Waldorf Argentina", url: "https://www.waldorfenespanol.com/" }
      ]
    },
    {
      categoria: "Prensa y Documentales",
      icon: <Film className="text-[var(--color-waldorf-moss)]" size={24} />,
      desc: "Apariciones en medios y documentales clave.",
      links: [
        { name: "Waldorf 100: Documental 100 años", url: "https://www.google.com/search?q=100+esucals+waldrof" },
        { name: "El Heraldo Austral: Trekan Puerto Varas", url: "https://www.eha.cl/noticia/local/abrio-sus-puertas-trekan-un-nuevo-colegio-waldorf-en-puerto-varas" }
      ]
    }
  ]

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)]">
        <Navbar />

        <section className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-[var(--color-waldorf-mustard)] text-xs font-bold tracking-widest uppercase block mb-4">
              Comunidad y Enlaces
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">
              Directorio de Recursos <br/> Waldorf en Chile
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] text-lg leading-relaxed max-w-2xl mx-auto">
              Como parte de nuestra misión de fomentar la educación y la filosofía antroposófica, compartimos este directorio de iniciativas comunitarias, centros de salud integrativa, editoriales y asociaciones Waldorf a lo largo de todo Chile.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {recursos.map((seccion, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-waldorf-sage)]/20 hover:border-[var(--color-waldorf-sage)]/40 transition-colors earth-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[var(--color-waldorf-cream)] rounded-2xl">
                    {seccion.icon}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">
                    {seccion.categoria}
                  </h2>
                </div>
                <p className="text-[var(--color-waldorf-text-light)] text-sm mb-6">
                  {seccion.desc}
                </p>
                <ul className="space-y-3">
                  {seccion.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[var(--color-waldorf-moss)] font-semibold text-sm hover:text-[var(--color-waldorf-terracotta)] transition-colors group cursor-none">
                        <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <Footer />
      </main>
    </SmoothScroll>
  )
}
