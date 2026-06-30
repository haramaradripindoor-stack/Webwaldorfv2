import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Users, MapPin, ArrowRight, CheckCircle2, XCircle, Info, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import SmoothScroll from '@/components/SmoothScroll'
import AdmisionForm from '@/components/AdmisionForm'
import FAQSection from '@/components/FAQSection'

export default function AdmisionPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)]">
        <Navbar />

        {/* HERO ADMISIÓN */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 right-10 w-[40vw] h-[40vw] rounded-full bg-[var(--color-waldorf-mustard)]/10 blur-[80px]" />
             <div className="absolute bottom-1/4 left-10 w-[30vw] h-[30vw] rounded-full bg-[var(--color-waldorf-sage)]/10 blur-[80px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-[var(--color-waldorf-mustard)] text-xs font-bold tracking-widest uppercase block mb-4">
              Admisión 2026 · Abierta todo el año
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6 leading-tight">
              Donde el niño camina <br/>
              <span className="text-[var(--color-waldorf-terracotta)] italic">con voluntad</span>
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              <em>Trekan</em> significa caminante en mapudungun. Es el nombre que elegimos para este espacio donde niñas y niños de 3 a 14 años aprenden a través del arte, el ritmo y la vida — acompañados por maestros que los conocen de verdad, en grupos de no más de 16.
            </p>
            <p className="font-serif italic text-xl text-[var(--color-waldorf-moss)] mb-10">
              La mejor forma de saber si es para tu familia es venir una mañana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a href="https://wa.me/56967765106" target="_blank" rel="noreferrer" className="bg-[var(--color-waldorf-moss)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-waldorf-moss)]/90 transition-all flex items-center gap-2">
                🌿 Agendar visita al colegio
              </a>
              <a href="#proceso" className="bg-transparent text-[var(--color-waldorf-moss)] border-2 border-[var(--color-waldorf-sage)] px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-waldorf-sage)]/20 transition-all">
                Ver proceso de admisión
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-[var(--color-waldorf-moss)]">
              <div className="text-center">
                <span className="block text-4xl font-serif font-bold text-[var(--color-waldorf-terracotta)]">3 - 14</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-70">años de edad</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-serif font-bold text-[var(--color-waldorf-terracotta)]">16</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-70">alumnos máx.</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-serif font-bold text-[var(--color-waldorf-terracotta)] text-center w-full">📍</span>
                <span className="text-sm font-bold tracking-widest uppercase opacity-70">Puerto Varas</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="py-24 px-6 bg-[var(--color-waldorf-paper)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-serif italic text-[var(--color-waldorf-terracotta)] text-lg mb-2 block">El camino juntos</span>
              <h2 className="text-4xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">Cómo es llegar a Trekan</h2>
              <p className="text-[var(--color-waldorf-text-light)] text-lg">
                No es una inscripción — es un encuentro. Por eso, el primer paso siempre es visitarnos — que vengas con tu familia a conocer el lugar antes de cualquier formulario.
              </p>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-waldorf-sage)] before:to-transparent">
              {/* Paso 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-waldorf-moss)] text-white font-serif font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">1</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20">
                  <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-2">Agendas una visita</h3>
                  <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">Coordinamos una mañana para que conozcas el colegio en vivo — un mensaje por WhatsApp y buscamos juntos un día. Sin formularios, sin requisitos. Solo ven.</p>
                </div>
              </div>
              {/* Paso 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-waldorf-moss)] text-white font-serif font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">2</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20">
                  <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-2">Vives una mañana</h3>
                  <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">Caminas por los espacios, ves a los niños en su día, conversas con maestros. La mejor manera de conocer Trekan es vivirlo.</p>
                </div>
              </div>
              {/* Paso 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-waldorf-moss)] text-white font-serif font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">3</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20">
                  <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-2">Conversamos en familia</h3>
                  <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">Una entrevista — no para evaluar, sino para conocernos. Queremos entender a tu hijo como persona, no solo como postulante.</p>
                </div>
              </div>
              {/* Paso 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-waldorf-moss)] text-white font-serif font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">4</div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20">
                  <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-2">Postulan formalmente</h3>
                  <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">Cuando ambos sentimos que el camino calza, completas el formulario de postulación y trabajamos juntos para que la llegada sea suave.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALORES Y ARANCELES */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="font-serif italic text-[var(--color-waldorf-terracotta)] text-lg mb-2 block">Transparencia</span>
            <h2 className="text-4xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">Valores 2026</h2>
            <p className="text-[var(--color-waldorf-text-light)] text-lg">
              Queremos que las familias conozcan los costos desde el principio. Si necesitan apoyo económico, conversamos — siempre con empatía y sin juicio.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-waldorf-sage)]/20 overflow-hidden mb-12">
            <div className="divide-y divide-[var(--color-waldorf-sage)]/10">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg">Matrícula</h4>
                  <p className="text-sm text-[var(--color-waldorf-text-light)]">En 2 cuotas: enero y febrero. No reembolsable.</p>
                </div>
                <div className="text-2xl font-serif font-bold text-[var(--color-waldorf-terracotta)] whitespace-nowrap">$500.000</div>
              </div>
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg">Escolaridad mensual</h4>
                  <p className="text-sm text-[var(--color-waldorf-text-light)]">Pago hasta el día 5 de cada mes.</p>
                </div>
                <div className="text-2xl font-serif font-bold text-[var(--color-waldorf-terracotta)] whitespace-nowrap">$330.000<span className="text-sm text-[var(--color-waldorf-text-light)] font-sans font-normal">/mes</span></div>
              </div>
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg">Responsabilidad Social</h4>
                  <p className="text-sm text-[var(--color-waldorf-text-light)]">Aporte voluntario. Sostiene becas para familias que necesitan apoyo.</p>
                </div>
                <div className="text-2xl font-serif font-bold text-[var(--color-waldorf-terracotta)] whitespace-nowrap">$33.000<span className="text-sm text-[var(--color-waldorf-text-light)] font-sans font-normal">/mes</span></div>
              </div>
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg">Cuota de Materiales</h4>
                  <p className="text-sm text-[var(--color-waldorf-text-light)]">Anual, en 2 cuotas: marzo y junio.</p>
                </div>
                <div className="text-2xl font-serif font-bold text-[var(--color-waldorf-terracotta)] whitespace-nowrap">$160.000</div>
              </div>
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg">Cuota de Incorporación</h4>
                  <p className="text-sm text-[var(--color-waldorf-text-light)]">Se paga una sola vez al ingresar.</p>
                </div>
                <div className="text-2xl font-serif font-bold text-[var(--color-waldorf-terracotta)] whitespace-nowrap">$330.000</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border-l-4 border-[var(--color-waldorf-sage)] shadow-sm">
              <h4 className="font-serif font-bold text-lg text-[var(--color-waldorf-moss)] mb-2 flex items-center gap-2">🤝 Aranceles diferenciados</h4>
              <p className="text-sm text-[var(--color-waldorf-text-light)] leading-relaxed">
                Si quieres participar en el proyecto pero necesitas apoyo económico, conversaremos contigo con empatía. Evaluamos cada situación y buscamos opciones sostenibles, incluso con aporte en labores según tus habilidades.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-l-4 border-[var(--color-waldorf-terracotta)]/50 shadow-sm">
              <h4 className="font-serif font-bold text-lg text-[var(--color-waldorf-moss)] mb-2 flex items-center gap-2">💛 Política de devoluciones</h4>
              <ul className="text-sm text-[var(--color-waldorf-text-light)] leading-relaxed space-y-1 list-disc pl-4">
                <li><strong>Antes de marzo:</strong> 100% de la escolaridad devuelta.</li>
                <li><strong>Hasta el 2° semestre:</strong> Se devuelve la escolaridad del 2° semestre.</li>
                <li><strong>Después del 2° semestre:</strong> Sin devoluciones.</li>
                <li><strong>Matrícula:</strong> No reembolsable.</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border-l-4 border-[var(--color-waldorf-mustard)] shadow-sm md:col-span-2">
              <h4 className="font-serif font-bold text-lg text-[#5A3E12] mb-2 flex items-center gap-2">📋 Exámenes Libres (Mineduc)</h4>
              <p className="text-sm text-[#6B4F1C] leading-relaxed">
                Trekan no cuenta con reconocimiento oficial del Mineduc. Los estudiantes rinden <strong>Exámenes Libres de Validación de Estudios</strong> para certificar sus niveles — al aprobar reciben certificados equivalentes a los de cualquier colegio reconocido. Es una práctica habitual en la educación libre en Chile, y nuestros estudiantes la enfrentan con muy buenas calificaciones.
              </p>
            </div>
          </div>
        </section>

        {/* PARA TI */}
        <section className="py-24 px-6 bg-[var(--color-waldorf-paper)]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-serif italic text-[var(--color-waldorf-terracotta)] text-lg mb-2 block">Honestidad antes que todo</span>
              <h2 className="text-4xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">¿Es Trekan para tu familia?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h3 className="font-serif font-bold text-xl text-[var(--color-waldorf-moss)] mb-6 flex items-center gap-2">🌿 Puede ser para ti si…</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><CheckCircle2 className="text-[var(--color-waldorf-sage)] shrink-0" size={20}/> Buscas una educación que vea al niño completo — no solo lo académico.</li>
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><CheckCircle2 className="text-[var(--color-waldorf-sage)] shrink-0" size={20}/> Valoras el arte, la naturaleza y el ritmo como parte del aprendizaje.</li>
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><CheckCircle2 className="text-[var(--color-waldorf-sage)] shrink-0" size={20}/> Quieres que tu hijo sea conocido por su maestro — no solo atendido.</li>
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><CheckCircle2 className="text-[var(--color-waldorf-sage)] shrink-0" size={20}/> Te interesa participar en la vida comunitaria del colegio.</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h3 className="font-serif font-bold text-xl text-[var(--color-waldorf-moss)] mb-6 flex items-center gap-2">🍂 Puede que no sea el momento si…</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><XCircle className="text-[var(--color-waldorf-mustard)] opacity-50 shrink-0" size={20}/> Priorizas notas numéricas y rendimiento medible como principal referencia.</li>
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><XCircle className="text-[var(--color-waldorf-mustard)] opacity-50 shrink-0" size={20}/> Necesitas un colegio con reconocimiento Mineduc sin proceso de exámenes libres.</li>
                  <li className="flex gap-3 text-sm text-[var(--color-waldorf-text-light)]"><XCircle className="text-[var(--color-waldorf-mustard)] opacity-50 shrink-0" size={20}/> No puedes comprometerte con la participación familiar que requiere la comunidad.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <FAQSection />
        
        {/* INVITACIÓN */}
        <section className="bg-[var(--color-waldorf-moss)] py-24 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-6">Ven a conocernos</h2>
            <p className="text-white/80 text-lg mb-4 leading-relaxed max-w-2xl mx-auto">
              No necesitas tener todo claro para dar el primer paso. Muchas familias llegaron con dudas y encontraron aquí algo que no sabían que buscaban. El camino empieza con una conversación.
            </p>
            
            <AdmisionForm />
            
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  )
}
