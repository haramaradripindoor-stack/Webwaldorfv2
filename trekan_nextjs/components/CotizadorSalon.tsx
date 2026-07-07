"use client";
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Plus, X, Send, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayEntry {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
}

export default function CotizadorSalon() {
  const [step, setStep] = useState(1);
  const [dias, setDias] = useState<DayEntry[]>([{ id: '1', fecha: '', inicio: '', fin: '' }]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [firma, setFirma] = useState('');
  const [fechaFirma, setFechaFirma] = useState('');
  
  const [kitCompleto, setKitCompleto] = useState(false);
  const [calefaccion, setCalefaccion] = useState(false);
  const [otroServicioCheck, setOtroServicioCheck] = useState(false);
  const [otroServicioText, setOtroServicioText] = useState('');
  const [consultas, setConsultas] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaFirma(today);
  }, []);

  const timeToMinutes = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const calcularCostoSalon = (horas: number) => {
    if (horas <= 0) return 0;
    if (horas <= 3) return horas * 10000;
    if (horas <= 6) return horas * 9000;
    if (horas <= 7) return 50000;
    const jornadas = Math.floor(horas / 7);
    const extra = horas % 7;
    return jornadas * 50000 + extra * 7000;
  };

  const calcularTotalHoras = () => {
    let totalHoras = 0;
    dias.forEach(dia => {
      if (dia.inicio && dia.fin) {
        let h = (timeToMinutes(dia.fin) - timeToMinutes(dia.inicio)) / 60;
        if (h < 0) h += 24;
        if (h > 0) totalHoras += h;
      }
    });
    return totalHoras;
  };

  const totalHoras = calcularTotalHoras();
  const costoSalon = calcularCostoSalon(totalHoras);

  let costoEquipos = 0;
  if (kitCompleto) costoEquipos += 20000;
  if (calefaccion) costoEquipos += 15000;
  if (otroServicioCheck && otroServicioText.trim() !== '') costoEquipos += 10000;

  const total = costoSalon + costoEquipos;
  const reserva = total * 0.3;
  const saldo = total * 0.7;
  const fmt = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(v);

  const addDay = () => setDias([...dias, { id: Math.random().toString(), fecha: '', inicio: '', fin: '' }]);
  const removeDay = (id: string) => setDias(dias.filter(d => d.id !== id));

  const updateDay = (id: string, field: keyof DayEntry, value: string) => {
    setDias(dias.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !telefono || !email.includes('@') || !firma || !fechaFirma) {
      setMessage({ text: 'Por favor, completa todos los campos obligatorios.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const diasInfo = dias.map((d, i) => {
      if (d.fecha && d.inicio && d.fin) return `Día ${i + 1}: ${d.fecha} de ${d.inicio} a ${d.fin}`;
      return null;
    }).filter(Boolean).join(' | ');

    const data = {
      nombre, telefono, email, firma, fecha_firma: fechaFirma,
      detalle_horas: `Total: ${totalHoras.toFixed(1)} horas en ${dias.length} día(s)`,
      costo_salones: `Salón: ${Math.round(costoSalon).toLocaleString('es-CL')} CLP`,
      costo_equipos: `Servicios adicionales: ${costoEquipos.toLocaleString('es-CL')} CLP`,
      total_costo: fmt(total),
      pago_reserva: `Reserva (30%): ${fmt(reserva)}`,
      pago_saldo: `Saldo (70%): ${fmt(saldo)}`,
      kit_completo: kitCompleto ? 'Sí' : 'No solicitado',
      calefaccion: calefaccion ? 'Sí' : 'No solicitada',
      otro_servicio: otroServicioCheck ? otroServicioText : 'Ninguno',
      consultas: consultas || 'Sin consultas adicionales',
      dias_detalle: diasInfo
    };

    try {
      await emailjs.send("service_46eazsr", "template_stlro1d", data, "cXLMWeJ-pUVRay1Ia");
      setMessage({ text: 'Tu solicitud ha sido enviada con éxito.', type: 'success' });
      setStep(4); // Success step
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error de conexión. Intenta contactarnos directo por WhatsApp.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const InputField = ({ label, type = "text", value, onChange, required = false, placeholder = "" }: any) => (
    <div className="relative mb-6">
      <input 
        type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[var(--color-waldorf-moss)] outline-none py-3 text-lg transition-colors peer placeholder-transparent"
        id={label}
      />
      <label htmlFor={label} className="absolute left-0 -top-3.5 text-sm text-[var(--color-waldorf-moss)] font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[var(--color-waldorf-moss)] pointer-events-none">
        {label} {required && '*'}
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden earth-shadow relative min-h-[600px] flex flex-col md:flex-row">
      
      {/* Resumen Lateral (Fijo) */}
      <div className="md:w-1/3 bg-[var(--color-waldorf-moss)] p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <div>
          <h3 className="font-serif text-2xl mb-8">Tu Cotización</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Horas Totales</p>
              <p className="text-3xl font-serif">{totalHoras.toFixed(1)} <span className="text-xl font-sans">hrs</span></p>
            </div>
            
            <div className="h-px w-full bg-white/20" />
            
            <div>
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Valor Salón</p>
              <p className="text-xl font-serif">{fmt(costoSalon)}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Servicios Extra</p>
              <p className="text-xl font-serif">{fmt(costoEquipos)}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
          <p className="text-white/80 text-sm mb-2 uppercase tracking-wider">Total a pagar</p>
          <p className="text-4xl font-serif font-bold text-[var(--color-waldorf-mustard)]">{fmt(total)}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/60 flex justify-between">
            <span>Reserva: {fmt(reserva)}</span>
            <span>Saldo: {fmt(saldo)}</span>
          </div>
        </div>
      </div>

      {/* Formulario Interactivo */}
      <div className="md:w-2/3 p-10 lg:p-16 bg-white relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Fechas */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
              <div className="flex-1">
                <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm tracking-widest uppercase block mb-2">Paso 1 de 3</span>
                <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-8">¿Cuándo necesitas el salón?</h2>
                
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {dias.map((dia, idx) => (
                    <div key={dia.id} className="relative bg-[#FAF8F5] p-6 rounded-2xl border border-gray-100 group transition-colors hover:border-[var(--color-waldorf-sage)]/50">
                      {dias.length > 1 && (
                        <button type="button" onClick={() => removeDay(dia.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                          <X size={20} />
                        </button>
                      )}
                      <h4 className="font-bold text-[var(--color-waldorf-moss)] mb-4">Día {idx + 1}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha</label>
                          <input type="date" min={todayStr} required value={dia.fecha} onChange={e => updateDay(dia.id, 'fecha', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[var(--color-waldorf-moss)] outline-none py-2 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inicio</label>
                          <input type="time" required value={dia.inicio} onChange={e => updateDay(dia.id, 'inicio', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[var(--color-waldorf-moss)] outline-none py-2 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fin</label>
                          <input type="time" required value={dia.fin} onChange={e => updateDay(dia.id, 'fin', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[var(--color-waldorf-moss)] outline-none py-2 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addDay} className="mt-6 flex items-center gap-2 text-sm font-bold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                  <Plus size={18} /> Agregar otro día
                </button>
              </div>

              <div className="mt-12 flex justify-end">
                <button onClick={() => setStep(2)} disabled={!dias[0].fecha || !dias[0].inicio || !dias[0].fin} className="bg-[var(--color-waldorf-moss)] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#1a2e25] transition-colors disabled:opacity-50">
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Servicios Extra */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
              <div className="flex-1">
                <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm tracking-widest uppercase block mb-2">Paso 2 de 3</span>
                <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-8">Servicios adicionales</h2>
                
                <div className="space-y-4">
                  <label className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${kitCompleto ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-sage)]/10' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${kitCompleto ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-moss)] text-white' : 'border-gray-300'}`}>
                      {kitCompleto && <Check size={14} />}
                    </div>
                    <div>
                      <span className="block font-bold text-[var(--color-waldorf-moss)] text-lg">Kit Audiovisual Completo <span className="text-[var(--color-waldorf-terracotta)] ml-2">+$20.000</span></span>
                      <span className="text-gray-500">Proyector, pantalla, parlantes y micrófono. Ideal para charlas.</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${calefaccion ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-sage)]/10' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${calefaccion ? 'border-[var(--color-waldorf-moss)] bg-[var(--color-waldorf-moss)] text-white' : 'border-gray-300'}`}>
                      {calefaccion && <Check size={14} />}
                    </div>
                    <div>
                      <span className="block font-bold text-[var(--color-waldorf-moss)] text-lg">Calefacción a Leña <span className="text-[var(--color-waldorf-terracotta)] ml-2">+$15.000</span></span>
                      <span className="text-gray-500">Incluye 1 vara de leña y encendido previo.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-500 font-bold px-6 py-4 hover:text-[var(--color-waldorf-moss)] transition-colors">Atrás</button>
                <button onClick={() => setStep(3)} className="bg-[var(--color-waldorf-moss)] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#1a2e25] transition-colors">
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Contacto y Enviar */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1">
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold text-sm tracking-widest uppercase block mb-2">Último Paso</span>
                  <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-8">Tus Datos</h2>
                  
                  {message && message.type === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm">{message.text}</div>
                  )}

                  <InputField label="Nombre Completo" value={nombre} onChange={(e:any) => setNombre(e.target.value)} required placeholder="Tu Nombre" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Teléfono" type="tel" value={telefono} onChange={(e:any) => setTelefono(e.target.value)} required placeholder="+56 9..." />
                    <InputField label="Correo Electrónico" type="email" value={email} onChange={(e:any) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-[var(--color-waldorf-moss)] uppercase tracking-wider mb-2">Consultas Adicionales</label>
                    <textarea value={consultas} onChange={e => setConsultas(e.target.value)} rows={2} className="w-full bg-gray-50 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[var(--color-waldorf-sage)] resize-none" placeholder="¿Necesitas algo más específico?" />
                  </div>

                  <div className="bg-[#FAF8F5] p-6 rounded-2xl mt-4">
                    <p className="text-xs text-gray-500 mb-4">Al enviar, confirmas que aceptas las condiciones de arriendo del espacio.</p>
                    <InputField label="Firma Digital (Tu Nombre)" value={firma} onChange={(e:any) => setFirma(e.target.value)} required placeholder="Escribe tu nombre" />
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button type="button" onClick={() => setStep(2)} className="text-gray-500 font-bold px-6 py-4 hover:text-[var(--color-waldorf-moss)] transition-colors">Atrás</button>
                  <button type="submit" disabled={loading} className="bg-[var(--color-waldorf-moss)] text-[var(--color-waldorf-mustard)] px-10 py-5 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-[#1a2e25] hover:text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-70">
                    {loading ? 'Procesando...' : <><Send size={20} /> Solicitar Reserva</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: Éxito */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-[var(--color-waldorf-sage)]/20 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 size={48} className="text-[var(--color-waldorf-moss)]" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-4">¡Solicitud Enviada!</h2>
              <p className="text-[var(--color-waldorf-text-light)] text-lg mb-10 max-w-md mx-auto">
                Hemos recibido tu cotización. Ivonne te contactará muy pronto para confirmar disponibilidad y coordinar la reserva.
              </p>
              <button onClick={() => {
                setStep(1); setDias([{ id: '1', fecha: '', inicio: '', fin: '' }]); setKitCompleto(false); setCalefaccion(false);
              }} className="text-[var(--color-waldorf-moss)] font-bold underline underline-offset-4 hover:text-[var(--color-waldorf-terracotta)]">
                Hacer otra cotización
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
