'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, User, Baby, Users, HeartPulse, MapPin, Send } from 'lucide-react'

// Definimos la estructura de datos que enviaremos al API
interface PostulacionData {
  // S2
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  contactTime: string;
  // S3
  childName: string;
  childAge: string;
  appliedCourse: string[];
  // S4
  moreChildren: string;
  howManyChildren: string;
  sameSchoolImportant: string;
  // S5
  hasNee: string;
  neeType: string;
  // S6
  city: string;
  movingCity: string;
  interestLevel: string;
  whatToKnow: string[];
  extraQuestions: string;
}

export default function FormularioPostulacionCompleto() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PostulacionData>({
    parentName: '', parentEmail: '', parentPhone: '', contactTime: '',
    childName: '', childAge: '', appliedCourse: [],
    moreChildren: '', howManyChildren: '', sameSchoolImportant: '',
    hasNee: '', neeType: '',
    city: '', movingCity: '', interestLevel: '', whatToKnow: [], extraQuestions: ''
  });

  const updateForm = (field: keyof PostulacionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'appliedCourse' | 'whatToKnow', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(i => i !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const nextStep = () => {
    // Scroll suave y focalizado solo al inicio del formulario, no a toda la página
    if (formRef.current) {
      const y = formRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setStep(s => s + 1);
  };
  const prevStep = () => {
    if (formRef.current) {
      const y = formRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Disparar Eventos de Conversión (Meta/GA)
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        // @ts-ignore
        window.fbq('track', 'Lead', { content_name: 'Postulacion Completa' });
      }
    } catch (error) { console.error(error) }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apoderado: formData.parentName,
          telefono_apoderado: formData.parentPhone,
          email_apoderado: formData.parentEmail,
          nombre_nino: formData.childName,
          edad_nino: formData.childAge,
          curso_postula: formData.appliedCourse.join(', '),
          // Enviaremos todo el raw data extra en un objeto anidado para que el backend lo parsee al email y DB
          datos_extra_postulacion: formData
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Ocurrió un error al enviar tu postulación. Por favor intenta de nuevo.");
      }
    } catch (error) {
      alert("Ocurrió un error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-[var(--color-waldorf-mustard)] rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={48} className="text-[#1a2e25]" />
        </motion.div>
        <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-4">¡Postulación Recibida!</h2>
        <p className="text-xl text-[var(--color-waldorf-text-light)] max-w-xl mx-auto">
          Gracias por confiar en el proyecto educativo Trekan. Nuestro equipo revisará los antecedentes y te contactaremos muy pronto al correo y teléfono que nos indicaste.
        </p>
        <a href="/" className="mt-8 text-[var(--color-waldorf-moss)] font-bold underline underline-offset-4">Volver al inicio</a>
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[600px] flex flex-col relative">
      
      {/* ProgressBar Header */}
      <div className="bg-[var(--color-waldorf-moss)] h-2 w-full flex">
         <motion.div 
           className="bg-[var(--color-waldorf-mustard)] h-full"
           initial={{ width: 0 }}
           animate={{ width: `${((step - 1) / 5) * 100}%` }}
           transition={{ duration: 0.3 }}
         />
      </div>

      <div className="flex-1 p-8 md:p-12">
        <AnimatePresence mode="wait">
          
          {/* SECCIÓN 1: INTRO */}
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full justify-center">
              <span className="text-[var(--color-waldorf-terracotta)] font-bold uppercase tracking-widest text-sm mb-4 block">Bienvenido/a</span>
              <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-6">Proceso de Admisión Trekan</h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed mb-10">
                <p>
                  Escuela Waldorf TREKAN, es una iniciativa que nace para acompañar a niñas, niños y sus familias desde los 3 a 14 años, durante toda su Enseñanza Básica, al alero de la Antroposofía, que considera a la Pedagogía Waldorf como guía para el camino de aprendizaje.
                </p>
                <p>
                  Para que podamos tener una conversación preliminar donde te podamos contar del proyecto de manera general y resolver tus dudas iniciales, te pedimos completar este formulario. Nos pondremos en contacto a la brevedad contigo.
                </p>
              </div>
              <button onClick={nextStep} className="bg-[var(--color-waldorf-moss)] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#112019] transition-colors self-start">
                Comenzar Postulación <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* SECCIÓN 2: APODERADO */}
          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
                  <User size={24} />
                </div>
                <div>
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm">Sección 2 de 6</span>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">Datos del Apoderado</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre y Apellido, de Padre o Madre *</label>
                  <input type="text" value={formData.parentName} onChange={e => updateForm('parentName', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico *</label>
                  <input type="email" value={formData.parentEmail} onChange={e => updateForm('parentEmail', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono (+569...) *</label>
                  <input type="tel" value={formData.parentPhone} onChange={e => updateForm('parentPhone', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" placeholder="+56 9 1234 5678" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Horario que más te acomode para ser contactada(o)</label>
                  <select value={formData.contactTime} onChange={e => updateForm('contactTime', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors">
                    <option value="">Selecciona un horario</option>
                    <option value="Mañana (08:30 – 13:00)">Mañana (08:30 – 13:00)</option>
                    <option value="Tarde (13:00 – 18:00)">Tarde (13:00 – 18:00)</option>
                    <option value="Vespertino (18:00 – 20:00)">Vespertino (18:00 – 20:00)</option>
                    <option value="Cualquier horario">Cualquier horario</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 3: NIÑO/A */}
          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
                  <Baby size={24} />
                </div>
                <div>
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm">Sección 3 de 6</span>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">Datos del Niño/a</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Niño o Niña *</label>
                  <input type="text" value={formData.childName} onChange={e => updateForm('childName', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Edad *</label>
                  <div className="flex flex-wrap gap-2">
                    {[3,4,5,6,7,8,9,10,11,12,13,14].map(age => (
                      <button key={age} onClick={() => updateForm('childAge', age.toString())} className={`w-12 h-12 rounded-xl font-bold transition-colors ${formData.childAge === age.toString() ? 'bg-[var(--color-waldorf-mustard)] text-[#1a2e25]' : 'bg-gray-50 text-gray-600 hover:bg-gray-200'}`}>
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿A qué curso postularías? (puedes seleccionar más de uno) *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Medio Menor-Medio Mayor-Transición', '1ro Básico', '2do Básico', '3ro Básico', '4to Básico', '5to Básico', '6to Básico', '7mo Básico', '8vo Básico'].map(curso => (
                      <label key={curso} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors">
                        <input type="checkbox" checked={formData.appliedCourse.includes(curso)} onChange={() => toggleArrayItem('appliedCourse', curso)} className="w-5 h-5 rounded text-[var(--color-waldorf-moss)] focus:ring-[var(--color-waldorf-moss)]" />
                        <span className="text-sm font-medium text-gray-700">{curso}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 4: FAMILIA */}
          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
                  <Users size={24} />
                </div>
                <div>
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm">Sección 4 de 6</span>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">Información Familiar</h3>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">¿Postula más de un hijo/a?</label>
                  <div className="flex gap-4">
                    <button onClick={() => updateForm('moreChildren', 'Sí')} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${formData.moreChildren === 'Sí' ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/10 text-[var(--color-waldorf-moss)]' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>Sí</button>
                    <button onClick={() => { updateForm('moreChildren', 'No'); updateForm('howManyChildren', ''); }} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${formData.moreChildren === 'No' ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/10 text-[var(--color-waldorf-moss)]' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>No</button>
                  </div>
                </div>

                {formData.moreChildren === 'Sí' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Si respondiste sí, ¿cuántos hijos postulan?</label>
                    <input type="number" min="2" max="6" value={formData.howManyChildren} onChange={e => updateForm('howManyChildren', e.target.value)} className="w-full max-w-[150px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" />
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">¿Es importante que sus hijos estén en el mismo establecimiento?</label>
                  <div className="flex flex-col gap-3">
                    {['Sí', 'No', 'Idealmente sí'].map(opt => (
                       <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-colors ${formData.sameSchoolImportant === opt ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                         <input type="radio" name="sameSchool" value={opt} checked={formData.sameSchoolImportant === opt} onChange={e => updateForm('sameSchoolImportant', e.target.value)} className="w-5 h-5 text-[var(--color-waldorf-moss)] focus:ring-[var(--color-waldorf-moss)]" />
                         <span className="font-medium text-gray-700">{opt}</span>
                       </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 5: NEE */}
          {step === 5 && (
            <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm">Sección 5 de 6</span>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">Necesidades Educativas</h3>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">¿Tu hijo/a presenta alguna necesidad educativa especial (NEE)?</label>
                  <div className="flex gap-4">
                    <button onClick={() => updateForm('hasNee', 'Sí')} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${formData.hasNee === 'Sí' ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/10 text-[var(--color-waldorf-moss)]' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>Sí</button>
                    <button onClick={() => { updateForm('hasNee', 'No'); updateForm('neeType', ''); }} className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${formData.hasNee === 'No' ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/10 text-[var(--color-waldorf-moss)]' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>No</button>
                  </div>
                </div>

                {formData.hasNee === 'Sí' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Si respondiste sí, ¿cuál?</label>
                    <div className="flex flex-col gap-3">
                      {['TEA', 'TDAH', 'Lenguaje', 'Sensorial', 'Otra (especificar)'].map(opt => (
                         <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-colors ${formData.neeType === opt ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                           <input type="radio" name="neeType" value={opt} checked={formData.neeType === opt} onChange={e => updateForm('neeType', e.target.value)} className="w-5 h-5 text-[var(--color-waldorf-moss)] focus:ring-[var(--color-waldorf-moss)]" />
                           <span className="font-medium text-gray-700">{opt}</span>
                         </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* SECCIÓN 6: UBICACIÓN E INTERÉS */}
          {step === 6 && (
            <motion.div key="step6" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm">Sección 6 de 6</span>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">Ubicación e Interés</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ciudad actual de residencia</label>
                  <input type="text" value={formData.city} onChange={e => updateForm('city', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors" placeholder="Ej. Puerto Varas" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">¿Se están trasladando de ciudad?</label>
                  <div className="flex gap-3">
                    {['Sí', 'No', 'Evaluándolo'].map(opt => (
                       <label key={opt} className={`flex-1 flex justify-center items-center gap-2 p-3 rounded-xl cursor-pointer border transition-colors ${formData.movingCity === opt ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/10 text-[var(--color-waldorf-moss)] font-bold' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'}`}>
                         <input type="radio" name="movingCity" value={opt} checked={formData.movingCity === opt} onChange={e => updateForm('movingCity', e.target.value)} className="hidden" />
                         <span>{opt}</span>
                       </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Nivel de Interés y Decisión</label>
                  <div className="flex flex-col gap-3">
                    {[
                      { emoji: '🔴', label: 'Solo estoy consultando' },
                      { emoji: '🟡', label: 'Evaluando opciones' },
                      { emoji: '🟢', label: 'Muy interesado/a' },
                      { emoji: '🔵', label: 'Listo/a para matricular' }
                    ].map(opt => (
                       <label key={opt.label} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-colors ${formData.interestLevel === opt.label ? 'border-[var(--color-waldorf-mustard)] bg-[var(--color-waldorf-mustard)]/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                         <input type="radio" name="interestLevel" value={opt.label} checked={formData.interestLevel === opt.label} onChange={e => updateForm('interestLevel', e.target.value)} className="w-5 h-5 text-[var(--color-waldorf-moss)] focus:ring-[var(--color-waldorf-moss)]" />
                         <span className="font-medium text-gray-700">{opt.emoji} {opt.label}</span>
                       </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Qué te gustaría saber principalmente?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Valores (matrícula/mensualidad)', 'Ubicación', 'Metodología', 'Horarios', 'Proceso de admisión', 'Otro'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors">
                        <input type="checkbox" checked={formData.whatToKnow.includes(opt)} onChange={() => toggleArrayItem('whatToKnow', opt)} className="w-5 h-5 rounded text-[var(--color-waldorf-moss)] focus:ring-[var(--color-waldorf-moss)]" />
                        <span className="text-sm font-medium text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">¿Tienes alguna duda en particular? Déjanos tus comentarios (Opcional)</label>
                  <textarea rows={3} value={formData.extraQuestions} onChange={e => updateForm('extraQuestions', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors resize-none" />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER BUTTONS */}
      {step > 1 && (
        <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center mt-auto rounded-b-3xl">
          <button onClick={prevStep} type="button" className="text-gray-500 font-medium flex items-center gap-2 hover:text-[var(--color-waldorf-moss)] transition-colors px-4 py-2">
            <ArrowLeft size={18} /> Atrás
          </button>
          
          {step < 6 ? (
            <button onClick={nextStep} type="button" className="bg-[var(--color-waldorf-moss)] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#112019] transition-colors shadow-lg">
              Siguiente <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} type="submit" className={`bg-[var(--color-waldorf-mustard)] text-[#1a2e25] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e6a55e] transition-colors shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              <Send size={18} className={isSubmitting ? "animate-pulse" : ""} /> 
              {isSubmitting ? 'Enviando postulación...' : 'Enviar Postulación'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
