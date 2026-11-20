'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react'

type Category = 'todas' | 'pedagogia' | 'mineduc' | 'vida-escolar' | 'admision'

interface FAQItem {
  id: string
  category: Category
  q: string
  a: React.ReactNode
}

const categories = [
  { id: 'todas' as Category, label: 'Todas las Dudas' },
  { id: 'pedagogia' as Category, label: 'Pedagogía & Evaluación' },
  { id: 'mineduc' as Category, label: 'Validez Mineduc' },
  { id: 'vida-escolar' as Category, label: 'Vida Escolar' },
  { id: 'admision' as Category, label: 'Admisión & Visitas' },
]

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'pedagogia',
    q: '¿Qué es la educación Waldorf?',
    a: (
      <div className="space-y-3">
        <p>
          La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad.
        </p>
        <p className="text-[var(--color-waldorf-moss)] font-serif italic">
          No solo enseñamos contenidos académicos: cultivamos curiosidad, creatividad, templanza y voluntad creadora para toda la vida.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-2',
    category: 'vida-escolar',
    q: '¿Cuántos estudiantes hay por curso?',
    a: (
      <div className="space-y-3">
        <p>
          Funcionamos con un <strong>máximo de 16 niñas y niños por sala</strong>.
        </p>
        <p>
          Este tamaño reducido protege la intimidad pedagógica, evita la sobreestimulación sensorial y garantiza un acompañamiento personalizado donde cada docente conoce profundamente el ritmo madurativo de cada estudiante.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-3',
    category: 'pedagogia',
    q: '¿Cómo es la evaluación y el seguimiento del aprendizaje?',
    a: (
      <div className="space-y-3">
        <p>
          La evaluación es <strong>cualitativa y continua</strong>, documentada mediante informes narrativos biográficos y los propios cuadernos de época (portafolios vivenciales).
        </p>
        <p>
          Observamos el desarrollo integral: su pensamiento reflexivo, su mundo emocional, su motricidad y su convivencia comunitaria. No utilizamos notas numéricas de castigo ni clasificaciones que generen estrés infantil, sino retroalimentación cercana que fortalece el deseo natural de aprender.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-4',
    category: 'mineduc',
    q: '¿Qué significa que el establecimiento no tenga reconocimiento oficial del Mineduc?',
    a: (
      <div className="space-y-4">
        <p>
          Significa que, de acuerdo con la legislación educacional chilena, los estudiantes de proyectos pedagógicos independientes validan sus estudios rindiendo los <strong>Exámenes Libres de Validación de Estudios</strong> ante establecimientos examinadores designados por el Ministerio de Educación.
        </p>
        <div className="p-4 rounded-xl bg-white/60 border border-[#1a2e25]/10 text-sm space-y-2">
          <p className="font-medium text-[var(--color-waldorf-moss)]">
            Equivalencia y Reconocimiento Legal:
          </p>
          <p className="text-[#1a2e25]/75">
            Al aprobar estos exámenes, el Mineduc emite los <strong>certificados oficiales de curso o nivel</strong>, con exactamente el mismo valor legal y académico que los de cualquier colegio del país, permitiendo la continuidad en la educación superior o cualquier otro establecimiento.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="https://www.ayudamineduc.cl/ficha/examenes-libres-menores-de-18-anos-11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--color-waldorf-terracotta)] hover:underline"
          >
            <span>Ficha oficial de Exámenes Libres en Ayuda Mineduc</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'faq-5',
    category: 'mineduc',
    q: '¿Cómo les va a los estudiantes Waldorf en los exámenes libres del Mineduc?',
    a: (
      <div className="space-y-4">
        <p>
          Los estudiantes de escuelas Waldorf en Chile obtienen consistentemente calificaciones de <strong>buenas a sobresalientes</strong> en los exámenes de validación. Cerca del <strong>90% obtiene notas entre 5,0 y 7,0</strong>.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-waldorf-terracotta)] mt-2 shrink-0" />
            <span><strong>Aprobación casi total:</strong> Las reprobaciones son prácticamente inexistentes en este segmento.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-waldorf-terracotta)] mt-2 shrink-0" />
            <span><strong>Rendimiento comparativo:</strong> Desempeño igual o superior al promedio nacional de modalidades de validación libre.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-waldorf-terracotta)] mt-2 shrink-0" />
            <span><strong>Comprensión profunda:</strong> Al no basarse en memorización mecánica, comprenden los principios esenciales de ciencias, lenguaje y matemática.</span>
          </li>
        </ul>
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-[#1a2e25]/50 self-center">Estudios y Prensa:</span>
          <a href="http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-94032017000100001" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-md bg-white/70 border border-[#1a2e25]/10 hover:text-[var(--color-waldorf-terracotta)] transition-colors inline-flex items-center gap-1">
            Scielo <ArrowUpRight size={11} />
          </a>
          <a href="https://ciencialatina.org/index.php/cienciala/article/view/6298" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-md bg-white/70 border border-[#1a2e25]/10 hover:text-[var(--color-waldorf-terracotta)] transition-colors inline-flex items-center gap-1">
            Ciencia Latina <ArrowUpRight size={11} />
          </a>
          <a href="https://trinus.org/el-rendimiento-academico-de-los-alumnos-waldorf-segun-pisa-y-otros-estudios/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-md bg-white/70 border border-[#1a2e25]/10 hover:text-[var(--color-waldorf-terracotta)] transition-colors inline-flex items-center gap-1">
            Estudios PISA <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'faq-6',
    category: 'vida-escolar',
    q: '¿Hay talleres extracurriculares y oficios?',
    a: (
      <div className="space-y-3">
        <p>
          Sí. Oficios como carpintería en madera nativa, tejido y telar, acuarela, cocina consciente, música coral e instrumental, huerta biodinámica, euritmia y juego en el bosque están <strong>incorporados dentro del ritmo de la jornada escolar</strong>.
        </p>
        <p className="text-sm text-[#1a2e25]/80">
          En la pedagogía Waldorf no consideramos el arte como un simple "anexo extracurricular", sino como la respiración medular a través de la cual el pensamiento y la voluntad maduran.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-7',
    category: 'vida-escolar',
    q: '¿Existe servicio de transporte o alimentación?',
    a: (
      <div className="space-y-3">
        <p>
          Actualmente el colegio no cuenta con servicio institucional de transporte ni casino centralizado.
        </p>
        <p className="text-sm text-[#1a2e25]/80">
          Fomentamos que las familias acompañen la llegada y despedida de sus hijos, creando comunidad entre apoderados. En alimentación, cada estudiante trae su colación y almuerzo en envases nobles, reforzando la autonomía y los hábitos de comida saludable y respetuosa.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-8',
    category: 'admision',
    q: '¿Podemos visitar la Casona y las salas antes de postular?',
    a: (
      <div className="space-y-3">
        <p>
          <strong>Absolutamente.</strong> Creemos que la mejor manera de discernir si este es el cobijo adecuado para tu familia es respirar el ambiente, sentir la luz de las salas y recorrer los senderos de Parque Ivian.
        </p>
        <p className="text-sm text-[#1a2e25]/80">
          Coordinamos visitas personalizadas guiadas durante las mañanas escolares para que las familias conozcan el proyecto en su cotidianidad viva.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-9',
    category: 'admision',
    q: '¿Cuándo se abren las postulaciones?',
    a: (
      <div className="space-y-3">
        <p>
          El proceso de admisión permanece <strong>abierto de forma continua</strong> mientras existan cupos en el curso respectivo (límite de 16 estudiantes).
        </p>
        <p className="text-sm text-[#1a2e25]/80">
          Recomendamos postular con debida anticipación para iniciar las entrevistas familiares y asegurar la vacante para el año lectivo.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-10',
    category: 'admision',
    q: '¿Cómo nos contactamos rápidamente con Admisión?',
    a: (
      <div className="space-y-3">
        <p>
          Puedes escribir directamente al WhatsApp institucional del equipo de Admisión o completar el formulario en línea para recibir la ficha informativa detallada y los aranceles vigentes.
        </p>
      </div>
    ),
  },
]

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('todas')
  const [openId, setOpenId] = useState<string | null>('faq-1')

  const filteredFaqs = activeCategory === 'todas'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  return (
    <section id="faq" className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
      {/* Header Editorial */}
      <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1a2e25]/10 pb-10">
        <div>
          <span className="text-[var(--color-waldorf-terracotta)] text-xs font-mono font-bold tracking-[0.25em] uppercase flex items-center justify-center md:justify-start gap-1.5 mb-3">
            <Sparkles size={14} />
            Claridad & Transparencia
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-tight">
            Preguntas Frecuentes
          </h2>
        </div>
        <p className="text-[#1a2e25]/60 text-sm md:text-base max-w-sm text-center md:text-left font-medium">
          Todo lo que necesitas conocer sobre nuestra metodología vivencial, validez ministerial y vida comunitaria.
        </p>
      </div>

      {/* Selector de Categorías (Pills Estilo Boutique / Quiet Luxury) */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-10 pb-2">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                // Si la pregunta abierta no pertenece a la nueva categoría, cerramos o dejamos la primera
                setOpenId(null)
              }}
              className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? 'bg-[var(--color-waldorf-moss)] text-[#F7F4EE] shadow-md'
                  : 'bg-white/70 hover:bg-white text-[#1a2e25]/70 hover:text-[#1a2e25] border border-[#1a2e25]/10'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Lista Accordion Editorial */}
      <div className="border-t border-[#1a2e25]/10">
        {filteredFaqs.map((faq, i) => {
          const isOpen = openId === faq.id
          const num = (i + 1).toString().padStart(2, '0')

          return (
            <motion.div
              key={faq.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`border-b border-[#1a2e25]/10 transition-colors duration-300 ${
                isOpen ? 'bg-[#FAF8F5]/60' : 'hover:bg-black/[0.01]'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${faq.id}`}
                id={`faq-button-${faq.id}`}
                className="w-full flex items-start gap-4 md:gap-6 py-7 px-2 md:px-4 text-left group transition-all duration-300"
              >
                {/* Número correlativo en monospace */}
                <span className={`text-[11px] font-mono tracking-widest mt-1.5 transition-colors duration-300 shrink-0 ${
                  isOpen ? 'text-[var(--color-waldorf-terracotta)] font-bold' : 'text-[#1a2e25]/35 group-hover:text-[var(--color-waldorf-moss)]'
                }`}>
                  {num}
                </span>

                {/* Pregunta en Serif */}
                <span className={`flex-1 font-serif text-lg md:text-2xl transition-colors duration-300 leading-snug font-medium ${
                  isOpen ? 'text-[var(--color-waldorf-terracotta)]' : 'text-[#1a2e25] group-hover:text-[var(--color-waldorf-moss)]'
                }`}>
                  {faq.q}
                </span>

                {/* Indicador táctil plus/minus */}
                <div className={`relative w-6 h-6 mt-1 shrink-0 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  isOpen 
                    ? 'border-[var(--color-waldorf-terracotta)] bg-[var(--color-waldorf-terracotta)]/10 text-[var(--color-waldorf-terracotta)] rotate-180' 
                    : 'border-[#1a2e25]/20 text-[#1a2e25]/60 group-hover:border-[#1a2e25]/40'
                }`}>
                  <div className={`absolute w-3 h-[1.5px] transition-colors duration-300 ${isOpen ? 'bg-[var(--color-waldorf-terracotta)]' : 'bg-[#1a2e25]'}`} />
                  <div className={`absolute h-3 w-[1.5px] transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 bg-[var(--color-waldorf-terracotta)]' : 'opacity-100 bg-[#1a2e25]'}`} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={`faq-content-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-8 md:pl-14 pr-4 md:pr-12 pb-8 pt-1 text-[#1a2e25]/80 text-base md:text-lg font-light leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Callout Consultivo de Cierre (Toque High-End / Acompañamiento Familiar) */}
      <div className="mt-16 p-8 md:p-10 rounded-[28px] bg-[#F4EFEA] border border-[#1a2e25]/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-waldorf-terracotta)] font-bold block mb-1">
            Atención Personalizada
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-waldorf-moss)]">
            ¿Tienes una inquietud específica para tu familia?
          </h3>
          <p className="text-[#1a2e25]/70 text-sm mt-1 max-w-lg">
            Cada niño y niña es una biografía única. Conversa directamente con el equipo de Admisión para evaluar traslados, cupos por curso o agendar un recorrido presencial por Parque Ivian.
          </p>
        </div>

        <a
          href="https://wa.me/56976866299?text=Hola,%20quisiera%20conversar%20sobre%20el%20proceso%20educativo%20en%20el%20Colegio%20Waldorf%20Trekan."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-7 py-3.5 rounded-full bg-[var(--color-waldorf-moss)] hover:bg-[#122118] text-[#F7F4EE] font-serif font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2.5 active:scale-95"
        >
          <MessageCircle size={18} className="text-[#EBBA7A]" />
          <span>Conversar por WhatsApp</span>
          <ArrowUpRight size={15} className="text-white/60" />
        </a>
      </div>
    </section>
  )
}
