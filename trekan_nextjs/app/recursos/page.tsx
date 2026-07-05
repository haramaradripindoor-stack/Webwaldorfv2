import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink, BookOpen, HeartPulse, Users, Bookmark, FileText } from 'lucide-react';
import Image from 'next/image';

const RECURSOS = [
  {
    titulo: 'Medicina y Farmacias Antroposóficas',
    icono: <HeartPulse size={24} />,
    descripcion: 'Lugares de confianza para medicina natural, preparados magistrales Wala y cuidado integral bajo la visión antroposófica.',
    items: [
      { name: 'Farmacia Tríodo', desc: 'Expertos en farmacia antroposófica, preparaciones magistrales y medicamentos Wala/Abnoba.' },
      { name: 'Weleda Chile', desc: 'Cosmética natural y remedios homeopáticos inspirados en la antroposofía.' },
      { name: 'Farmacia Alquimist', desc: 'Recetario magistral, fitoterapia y medicina antroposófica en Santiago.' },
      { name: 'AMA Chile', desc: 'Directorio oficial de médicos y terapeutas antroposóficos en Chile.' },
    ]
  },
  {
    titulo: 'Comunidad, Formación y Economía',
    icono: <Users size={24} />,
    descripcion: 'Organizaciones formativas y proyectos de impacto basados en la filosofía impulsada por Rudolf Steiner.',
    items: [
      { name: 'Centro de Formación Arché', desc: 'Centro de investigación y formación pedagógica Waldorf en Chile.' },
      { name: 'Sociedad Antroposófica en Chile', desc: 'Sede nacional para el estudio y la difusión de la antroposofía.' },
      { name: 'Banca Ética / Doble Impacto', desc: 'Plataforma de finanzas éticas inspirada en los principios sociales del banco Triodos.' },
      { name: 'Librería Antroposófica', desc: 'Catálogo completo de obras de Steiner y pedagogía Waldorf.' },
    ]
  },
  {
    titulo: 'Libros Fundamentales',
    icono: <BookOpen size={24} />,
    descripcion: 'Obras clave y más buscadas para comprender a profundidad la pedagogía Waldorf y la antroposofía.',
    items: [
      { name: 'Las 5 dimensiones de la pedagogía Waldorf', desc: 'Por Valentin Wember. Considerada una de las obras más importantes para entender el "ADN" de este sistema educativo.' },
      { name: 'La educación del niño a la luz de la antroposofía', desc: 'Por Rudolf Steiner. El texto fundacional indispensable para padres y maestros.' },
      { name: 'Usted es el primer profesor de su hijo', desc: 'Por Rahima Baldwin Dancy. Guía esencial para aplicar los principios Waldorf en la crianza desde el nacimiento hasta los 7 años.' },
      { name: 'El reino de la infancia', desc: 'Por Rudolf Steiner. Serie de conferencias introductorias que explican la esencia del trato y respeto por la etapa infantil.' },
    ]
  },
  {
    titulo: 'Profesionales de la Salud',
    icono: <FileText size={24} />,
    descripcion: 'Médicos y odontólogos especializados en la visión integrativa de la antroposofía.',
    items: [
      { name: 'Dra. Ana María Toro', desc: 'Especialista en Odontopediatría Antroposófica, certificada por la Sección Médica del Goetheanum.' },
      { name: 'Dr. Pablo Porcel', desc: 'Médico general de adultos y niños, docente y referente en medicina antroposófica en Chile.' },
    ]
  },
  {
    titulo: 'Contenido para Niños (Argentina)',
    icono: <Bookmark size={24} />,
    descripcion: 'Iniciativas destacadas del país vecino para complementar la crianza y el juego en casa.',
    items: [
      { name: 'Jugar i Jugar / Juguetes Naturales', desc: 'Cultura de juego libre con materiales nobles, madera y juguetes no estructurados.' },
      { name: 'Comunidad Waldorf Argentina', desc: 'Recursos, cuentos infantiles y orientación para familias en toda la región.' },
    ]
  }
];

export default function RecursosPage() {
  return (
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] overflow-hidden selection:bg-[var(--color-waldorf-sage)] selection:text-white">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 md:px-12 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-waldorf-sage)]/10 rounded-full blur-[100px] -mr-40 -mt-20 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c6a382]/10 rounded-full blur-[80px] -ml-20 -mb-20 z-0"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-waldorf-sage)]/10 text-[var(--color-waldorf-moss)] text-sm font-bold tracking-widest uppercase mb-6">
            Directorio Nacional
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6 leading-[1.1] tracking-tight">
            Recursos Waldorf en Chile
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-waldorf-text-light)] max-w-2xl mx-auto font-medium leading-relaxed">
            Como parte de nuestra misión de fomentar la educación y la filosofía antroposófica, compartimos este directorio de iniciativas comunitarias, centros de salud, editoriales y asociaciones.
          </p>
        </div>
      </section>

      {/* Directorio Masonry */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            
            {RECURSOS.map((cat, idx) => (
              <div key={idx} className="break-inside-avoid bg-white rounded-3xl p-8 border border-[var(--color-waldorf-sage)]/15 earth-shadow hover:-translate-y-1 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[var(--color-waldorf-sage)]/20 text-[var(--color-waldorf-moss)] rounded-2xl">
                    {cat.icono}
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-tight">{cat.titulo}</h2>
                </div>
                
                <p className="text-[var(--color-waldorf-text-light)] mb-8 text-sm leading-relaxed border-b border-gray-100 pb-6">
                  {cat.descripcion}
                </p>

                <div className="flex flex-col gap-6">
                  {cat.items.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <h4 className="font-bold text-[var(--color-waldorf-text)] mb-2 flex items-center justify-between group-hover:text-[var(--color-waldorf-moss)] transition-colors">
                        {item.name}
                        <ExternalLink size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#c6a382]" />
                      </h4>
                      <p className="text-sm text-[var(--color-waldorf-text-light)] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-[var(--color-waldorf-moss)] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden earth-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6 relative z-10">
            ¿Conoces otra iniciativa?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Ayúdanos a expandir esta red colaborativa. Si conoces algún proyecto o profesional afín, no dudes en escribirnos.
          </p>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=coordinacion@colegiowaldorftrekan.cl&su=Consulta%20sobre%20Recursos%20Waldorf" target="_blank" rel="noreferrer" className="inline-block bg-white text-[var(--color-waldorf-moss)] px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-300 relative z-10">
            Sugerir Recurso
          </a>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
