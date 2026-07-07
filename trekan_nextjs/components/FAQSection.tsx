'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '🌱 ¿Qué es la educación Waldorf?',
    a: 'La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad.',
  },
  {
    q: '👩‍🏫 ¿Cuántos estudiantes hay por curso?',
    a: 'Funcionamos con un máximo de 16 niñas y niños por curso. Este tamaño permite un acompañamiento personalizado y una relación cercana entre estudiantes, docentes y familias.',
  },
  {
    q: '📝 ¿Cómo es la evaluación?',
    a: 'La evaluación es cualitativa y continua, basada en informes narrativos y portafolios. Observamos el desarrollo integral del niño: su pensamiento, sentimientos, voluntad y habilidades sociales. No usamos notas ni calificaciones, sino retroalimentación detallada que acompaña el proceso de aprendizaje.',
  },
  {
    q: '📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?',
    a: (
      <>
        Significa que, la normativa chilena establece que los estudiantes de colegios sin reconocimiento deben rendir <strong>Exámenes Libres de Validación de Estudios</strong> en establecimientos designados por el Mineduc. Al aprobar, reciben sus certificados oficiales de curso o nivel, equivalentes a los de cualquier colegio reconocido. Es responsabilidad de cada familia realizar la inscripción de manera <strong>online</strong> o presencial en el <strong>Departamento Provincial de Educación</strong> por parte del padre/madre/tutor.
        <br/><br/>
        👉 Más información oficial en el sitio del Ministerio de Educación de Chile:{' '}
        <a href="https://www.ayudamineduc.cl/ficha/examenes-libres-menores-de-18-anos-11" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">
          Exámenes de Validación de Estudios – Ayuda Mineduc
        </a>
      </>
    )
  },
  {
    q: '📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?',
    a: (
      <>
        Los estudiantes Waldorf en Chile suelen obtener <strong>calificaciones de buenas a muy buenas</strong> en los exámenes libres del Ministerio de Educación. La gran mayoría alcanza promedios superiores al aprobado, y cerca del <strong>90% obtiene notas entre 5,0 y 7,0</strong>, lo que corresponde a un desempeño bueno o sobresaliente según la escala chilena.
        <br/><br/>
        • Las <strong>reprobaciones son prácticamente inexistentes</strong> en este grupo.<br/>
        • El rendimiento suele ser <strong>igual o mejor</strong> que el de estudiantes de otras modalidades alternativas.<br/>
        • Los alumnos logran certificar sus estudios básicos y medios sin dificultades.<br/><br/>
        Aunque la pedagogía Waldorf no se basa en pruebas tradicionales, los estudiantes cuentan con <strong>herramientas sólidas de aprendizaje</strong> que les permiten enfrentar con éxito las evaluaciones del Estado.
        <br/><br/>
        👉 Puedes leer más en estas fuentes:{' '}
        <a href="http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-94032017000100001" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">Estudio (Scielo)</a> |{' '}
        <a href="https://ciencialatina.org/index.php/cienciala/article/view/6298" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">Ciencia Latina</a> |{' '}
        <a href="https://www.ciperchile.cl/2021/10/08/la-educacion-alternativa-como-un-derecho/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">CIPER Chile</a> |{' '}
        <a href="https://trinus.org/el-rendimiento-academico-de-los-alumnos-waldorf-segun-pisa-y-otros-estudios/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">Trinus</a> |{' '}
        <a href="https://www.latercera.com/noticia/generacion-waldorf/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-waldorf-terracotta)] hover:underline">La Tercera</a>
      </>
    )
  },
  {
    q: '🎨 ¿Hay talleres extracurriculares?',
    a: 'Sí, ofrecemos experiencias en carpintería, arte y manualidades, cocina, música, cuentos, huerta, euritmia y movimiento. Estas actividades están integradas en la jornada escolar, entendiendo que el aprendizaje se vive con todo el ser.',
  },
  {
    q: '🚍 ¿Hay transporte o alimentación disponible?',
    a: 'Actualmente no ofrecemos transporte ni alimentación. Valoramos que las familias puedan acompañar a sus hijos al inicio y término del día. En cuanto a la alimentación, los niños traen su propio almuerzo, y promovemos hábitos saludables y conciencia sobre los alimentos.',
  },
  {
    q: '🏡 ¿Puedo visitar el colegio antes de postular?',
    a: '¡Por supuesto! Creemos que la mejor manera de conocer Trekan es viviendo una mañana en nuestra comunidad. Escríbenos por WhatsApp para agendar tu visita.',
  },
  {
    q: '📅 ¿Cuándo puedo postular?',
    a: 'El proceso de admisión está abierto todo el año, siempre que haya cupos disponibles. Te recomendamos postular con anticipación para asegurar tu lugar.',
  },
  {
    q: '💌 ¿Cómo me contacto rápidamente?',
    a: 'Puedes escribirnos directamente a través del botón de WhatsApp que ves en pantalla o usar el formulario "Postula aquí" para que podamos enviarte toda la información.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <span className="text-[var(--color-waldorf-mustard)] text-xs font-bold tracking-widest uppercase block mb-4">
          Resuelve tus Dudas
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          Preguntas Frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <motion.div
              key={i}
              className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                isOpen
                  ? 'border-[var(--color-waldorf-sage)]/30 bg-[var(--color-waldorf-paper)] earth-shadow'
                  : 'border-[var(--color-waldorf-sage)]/10 bg-[var(--color-waldorf-cream)] hover:border-[var(--color-waldorf-sage)]/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${i}`}
                id={`faq-button-${i}`}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
              >
                <span className={`font-semibold text-[15px] transition-colors ${isOpen ? 'text-[var(--color-waldorf-terracotta)]' : 'text-[var(--color-waldorf-text)]'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[var(--color-waldorf-sage)] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-waldorf-terracotta)]' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={`faq-content-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className="px-6 pb-6 text-[var(--color-waldorf-text-light)] text-sm leading-relaxed font-medium border-t border-[var(--color-waldorf-sage)]/10 pt-4 mt-2 mx-2">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
