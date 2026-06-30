'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, Home, ArrowLeft, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import emailjs from '@emailjs/browser'

interface DiaCotizacion {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
}

export default function ArriendoSalon() {
  const [dias, setDias] = useState<DiaCotizacion[]>([{ id: '1', fecha: '', inicio: '', fin: '' }]);
  const [kitAudiovisual, setKitAudiovisual] = useState(false);
  const [calefaccion, setCalefaccion] = useState(false);
  const [otroServicio, setOtroServicio] = useState(false);
  const [detalleOtroServicio, setDetalleOtroServicio] = useState('');
  
  // Totals
  const [totalHoras, setTotalHoras] = useState(0);
  const [costoSalon, setCostoSalon] = useState(0);
  const [costoEquipos, setCostoEquipos] = useState(0);
  
  // Form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);

  const formatCLP = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  const timeToMinutes = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    // Calcular Total Horas
    let horas = 0;
    dias.forEach(d => {
      if (d.inicio && d.fin) {
        let h = (timeToMinutes(d.fin) - timeToMinutes(d.inicio)) / 60;
        if (h < 0) h += 24;
        if (h > 0) horas += h;
      }
    });
    setTotalHoras(horas);

    // Calcular Costo Salón
    let cSalon = 0;
    if (horas > 0) {
      if (horas <= 3) cSalon = horas * 10000;
      else if (horas <= 6) cSalon = horas * 9000;
      else if (horas <= 7) cSalon = 50000;
      else {
        const jornadas = Math.floor(horas / 7);
        const extra = horas % 7;
        cSalon = (jornadas * 50000) + (extra * 7000);
      }
    }
    setCostoSalon(cSalon);

    // Calcular Equipos
    let cEquipos = 0;
    if (kitAudiovisual) cEquipos += 20000;
    if (calefaccion) cEquipos += 15000;
    if (otroServicio && detalleOtroServicio.trim() !== '') cEquipos += 10000;
    setCostoEquipos(cEquipos);

  }, [dias, kitAudiovisual, calefaccion, otroServicio, detalleOtroServicio]);

  const total = costoSalon + costoEquipos;
  const reserva = total * 0.3;
  const saldo = total * 0.7;

  const handleAddDia = () => {
    setDias([...dias, { id: Date.now().toString(), fecha: '', inicio: '', fin: '' }]);
  };

  const handleRemoveDia = (id: string) => {
    setDias(dias.filter(d => d.id !== id));
  };

  const handleChangeDia = (id: string, field: keyof DiaCotizacion, value: string) => {
    setDias(dias.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validación manual de fechas
    const diasInvalidos = dias.some(d => !d.fecha || !d.inicio || !d.fin);
    if (diasInvalidos) {
      setErrorMsg('Por favor, completa la fecha y horas para todos los días seleccionados.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Adjuntar cálculos
    const diasInfo = dias.map((d, i) => `Día ${i+1}: ${d.fecha} de ${d.inicio} a ${d.fin}`).join(' | ');
    
    const payload = {
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      firma: data.firma,
      fecha_firma: data.fecha_firma,
      consultas: data.consultas || 'Sin consultas',
      dias_detalle: diasInfo,
      detalle_horas: `Total: ${totalHoras.toFixed(1)} horas en ${dias.length} día(s)`,
      costo_salones: `Salón: ${formatCLP(costoSalon)}`,
      costo_equipos: `Servicios: ${formatCLP(costoEquipos)}`,
      total_costo: formatCLP(total),
      pago_reserva: formatCLP(reserva),
      pago_saldo: formatCLP(saldo),
      kit_completo: kitAudiovisual ? 'Sí' : 'No',
      calefaccion: calefaccion ? 'Sí' : 'No',
      otro_servicio: (otroServicio && detalleOtroServicio) ? detalleOtroServicio : 'Ninguno'
    };

    emailjs.send("service_46eazsr", "template_stlro1d", payload, "cXLMWeJ-pUVRay1Ia")
      .then(() => {
        setSuccess(true);
        formRef.current?.reset();
        setDias([{ id: '1', fecha: '', inicio: '', fin: '' }]);
        setKitAudiovisual(false);
        setCalefaccion(false);
        setOtroServicio(false);
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        setErrorMsg('Ocurrió un error al enviar. Por favor contáctanos por WhatsApp.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] pt-24 pb-24 overflow-hidden relative">
      
      {/* Organic Backgrounds */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] rounded-[100%] bg-gradient-to-bl from-[var(--color-waldorf-mustard)]/10 via-[var(--color-waldorf-sage)]/5 to-transparent blur-[80px] pointer-events-none transform translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[60vh] rounded-[100%] bg-gradient-to-tr from-[var(--color-waldorf-terracotta)]/10 via-[var(--color-waldorf-moss)]/5 to-transparent blur-[80px] pointer-events-none transform -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-waldorf-moss)] font-semibold text-sm hover:text-[var(--color-waldorf-terracotta)] transition-colors mb-8 cursor-none">
          <ArrowLeft size={16} />
          Volver al Inicio
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1] font-serif text-[var(--color-waldorf-moss)]">
            Cotización de <span className="text-[var(--color-waldorf-terracotta)]">Salón</span>
          </h1>
          <p className="text-lg text-[var(--color-waldorf-text-light)] font-medium max-w-2xl mx-auto">
            Un espacio construido con amor y luz natural, ideal para talleres, terapias y comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* GALERÍA / INFO */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              className="relative h-[400px] w-full rounded-[40px] rounded-tl-[120px] rounded-br-[120px] overflow-hidden earth-shadow border-4 border-[var(--color-waldorf-cream)]"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Image 
                src="/images/salon-principal.webp" 
                alt="Salón Principal Trekan" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-waldorf-moss)]/40 to-transparent mix-blend-multiply" />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-waldorf-paper)] p-6 rounded-3xl border border-[var(--color-waldorf-sage)]/10 earth-shadow">
                <Users size={24} className="text-[var(--color-waldorf-terracotta)] mb-3" />
                <h3 className="font-bold text-[var(--color-waldorf-moss)] mb-1">Capacidad</h3>
                <p className="text-sm text-[var(--color-waldorf-text-light)]">~20 personas cómodas (25m²)</p>
              </div>
              <div className="bg-[var(--color-waldorf-paper)] p-6 rounded-3xl border border-[var(--color-waldorf-sage)]/10 earth-shadow">
                <Home size={24} className="text-[var(--color-waldorf-mustard)] mb-3" />
                <h3 className="font-bold text-[var(--color-waldorf-moss)] mb-1">Equipamiento</h3>
                <p className="text-sm text-[var(--color-waldorf-text-light)]">Cocina equipada, baño común y leña.</p>
              </div>
            </div>

            <div className="bg-[var(--color-waldorf-cream)]/50 p-6 rounded-3xl border border-[var(--color-waldorf-sage)]/20">
              <h3 className="font-bold text-[var(--color-waldorf-moss)] mb-3 border-b border-[var(--color-waldorf-sage)]/20 pb-2">Información Adicional</h3>
              <ul className="text-sm text-[var(--color-waldorf-text-light)] space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold mt-0.5">•</span>
                  <span><strong>Disponibilidad:</strong> Lunes a viernes a partir de las 15:00 hrs. Fines de semana horario completo. (Vacaciones escolares flexible).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold mt-0.5">•</span>
                  <span><strong>Catering:</strong> Se permite el ingreso de catering externo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-waldorf-terracotta)] font-bold mt-0.5">•</span>
                  <span><strong>Estacionamiento:</strong> Capacidad para hasta 10 vehículos en el recinto.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-waldorf-sage)]/10 p-6 rounded-3xl border border-[var(--color-waldorf-moss)]/10">
              <h3 className="font-bold text-[var(--color-waldorf-moss)] mb-2">Tabla de Tarifas</h3>
              <ul className="text-sm text-[var(--color-waldorf-text-light)] space-y-2">
                <li className="flex justify-between border-b border-[var(--color-waldorf-sage)]/20 pb-1"><span>1 – 3 horas</span> <strong>$10.000 / hr</strong></li>
                <li className="flex justify-between border-b border-[var(--color-waldorf-sage)]/20 pb-1"><span>4 – 6 horas</span> <strong>$9.000 / hr</strong></li>
                <li className="flex justify-between border-b border-[var(--color-waldorf-sage)]/20 pb-1"><span>Jornada (7 hrs)</span> <strong>$50.000 total</strong></li>
                <li className="flex justify-between pb-1"><span>Extras (&gt;7 hrs)</span> <strong>$7.000 / hr adicional</strong></li>
              </ul>
            </div>
          </div>

          {/* FORMULARIO COTIZADOR */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[40px] earth-shadow border border-[var(--color-waldorf-sage)]/10 relative">
              
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white rounded-[40px] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <CheckCircle2 size={64} className="text-[var(--color-waldorf-moss)] mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--color-waldorf-moss)] mb-2">¡Cotización Enviada!</h2>
                    <p className="text-[var(--color-waldorf-text-light)] mb-8">Hemos recibido tu solicitud y una copia fue enviada a tu correo. Nos pondremos en contacto contigo a la brevedad.</p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="px-8 py-3 rounded-full bg-[var(--color-waldorf-paper)] text-[var(--color-waldorf-moss)] font-bold hover:bg-[var(--color-waldorf-cream)] transition-colors border border-[var(--color-waldorf-sage)]/20"
                    >
                      Hacer otra cotización
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {errorMsg}
                  </div>
                )}

                {/* Cliente */}
                <section>
                  <h2 className="text-xl font-bold text-[var(--color-waldorf-moss)] mb-4 font-serif border-b border-[var(--color-waldorf-cream)] pb-2">Datos del Cliente</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Nombre</label>
                      <input type="text" name="nombre" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Teléfono</label>
                      <input type="text" name="telefono" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[var(--color-waldorf-text)] mb-1">Correo Electrónico</label>
                      <input type="email" name="email" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors" />
                    </div>
                  </div>
                </section>

                {/* Días */}
                <section>
                  <h2 className="text-xl font-bold text-[var(--color-waldorf-moss)] mb-4 font-serif border-b border-[var(--color-waldorf-cream)] pb-2">Fechas y Horarios</h2>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {dias.map((dia, index) => (
                        <motion.div 
                          key={dia.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[var(--color-waldorf-cream)] p-4 rounded-2xl relative border border-[var(--color-waldorf-sage)]/10"
                        >
                          {dias.length > 1 && (
                            <button type="button" onClick={() => handleRemoveDia(dia.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          )}
                          <strong className="block text-sm text-[var(--color-waldorf-moss)] mb-3">Día {index + 1}</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-[var(--color-waldorf-text-light)] mb-1">Fecha</label>
                              <input type="date" value={dia.fecha} min={new Date().toISOString().split('T')[0]} onChange={(e) => handleChangeDia(dia.id, 'fecha', e.target.value)} required className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-waldorf-moss)]" />
                            </div>
                            <div>
                              <label className="block text-xs text-[var(--color-waldorf-text-light)] mb-1">Inicio</label>
                              <input type="time" value={dia.inicio} onChange={(e) => handleChangeDia(dia.id, 'inicio', e.target.value)} required className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-waldorf-moss)]" />
                            </div>
                            <div>
                              <label className="block text-xs text-[var(--color-waldorf-text-light)] mb-1">Término</label>
                              <input type="time" value={dia.fin} onChange={(e) => handleChangeDia(dia.id, 'fin', e.target.value)} required className="w-full bg-white border border-[var(--color-waldorf-sage)]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-waldorf-moss)]" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <button type="button" onClick={handleAddDia} className="mt-4 flex items-center gap-2 text-sm font-bold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                    <Plus size={16} /> Agregar otro día
                  </button>
                </section>

                {/* Servicios Opcionales */}
                <section>
                  <h2 className="text-xl font-bold text-[var(--color-waldorf-moss)] mb-4 font-serif border-b border-[var(--color-waldorf-cream)] pb-2">Servicios Opcionales</h2>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-1">
                        <input type="checkbox" checked={kitAudiovisual} onChange={(e) => setKitAudiovisual(e.target.checked)} className="w-4 h-4 text-[var(--color-waldorf-moss)] rounded border-gray-300 focus:ring-[var(--color-waldorf-moss)]" />
                      </div>
                      <div>
                        <span className="block font-medium text-[var(--color-waldorf-text)] group-hover:text-[var(--color-waldorf-moss)] transition-colors">Kit Audiovisual Completo (+$20.000)</span>
                        <span className="text-xs text-[var(--color-waldorf-text-light)]">Proyector, pantalla, parlantes y micrófono.</span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-1">
                        <input type="checkbox" checked={calefaccion} onChange={(e) => setCalefaccion(e.target.checked)} className="w-4 h-4 text-[var(--color-waldorf-moss)] rounded border-gray-300 focus:ring-[var(--color-waldorf-moss)]" />
                      </div>
                      <div>
                        <span className="block font-medium text-[var(--color-waldorf-text)] group-hover:text-[var(--color-waldorf-moss)] transition-colors">Calefacción a leña (+$15.000)</span>
                        <span className="text-xs text-[var(--color-waldorf-text-light)]">Incluye 1 vara y encendido inicial (autogestionada).</span>
                      </div>
                    </label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-1">
                          <input type="checkbox" checked={otroServicio} onChange={(e) => setOtroServicio(e.target.checked)} className="w-4 h-4 text-[var(--color-waldorf-moss)] rounded border-gray-300 focus:ring-[var(--color-waldorf-moss)]" />
                        </div>
                        <span className="block font-medium text-[var(--color-waldorf-text)] group-hover:text-[var(--color-waldorf-moss)] transition-colors">Otro requerimiento especial (+$10.000 referencial)</span>
                      </label>
                      {otroServicio && (
                        <input 
                          type="text" 
                          placeholder="Ej: Sillas extra, mesas adicionales, etc." 
                          value={detalleOtroServicio}
                          onChange={(e) => setDetalleOtroServicio(e.target.value)}
                          className="ml-7 w-full md:w-3/4 bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-waldorf-moss)] transition-colors"
                        />
                      )}
                    </div>
                  </div>
                </section>

                {/* Resumen Total */}
                <div className="bg-[var(--color-waldorf-moss)] rounded-3xl p-6 text-white earth-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                  
                  <h3 className="font-serif text-xl mb-4 text-[var(--color-waldorf-cream)] border-b border-white/20 pb-2">Resumen Estimado</h3>
                  
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Total horas ({dias.length} días)</span>
                      <span>{totalHoras.toFixed(1)} hrs</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Arriendo Salón</span>
                      <span>{formatCLP(costoSalon)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Servicios Extras</span>
                      <span>{formatCLP(costoEquipos)}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-4 border-t border-white/20 pt-4">
                    <span className="font-medium text-[var(--color-waldorf-cream)]">Total Cotización</span>
                    <span className="text-3xl font-bold font-serif">{formatCLP(total)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mt-4 pt-4 border-t border-white/10 text-white/70">
                    <div>
                      <span className="block mb-1">Para Reservar (30%)</span>
                      <strong className="text-white text-sm">{formatCLP(reserva)}</strong>
                    </div>
                    <div>
                      <span className="block mb-1">Saldo Final (70%)</span>
                      <strong className="text-white text-sm">{formatCLP(saldo)}</strong>
                    </div>
                  </div>
                </div>

                {/* Disclaimer / Firma */}
                <section>
                  <p className="text-xs text-[var(--color-waldorf-text-light)] mb-4">
                    Al enviar esta solicitud, confirmas tu interés en la fecha. La reserva oficial se realiza con el pago del 30%. Si cancelas con menos de 3 días, no hay devolución.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-waldorf-text)] mb-1">Firma Digital (Nombre Completo)</label>
                      <input type="text" name="firma" required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-waldorf-text)] mb-1">Fecha</label>
                      <input type="date" name="fecha_firma" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-[var(--color-waldorf-cream)]/50 border border-[var(--color-waldorf-sage)]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-waldorf-moss)] text-sm" />
                    </div>
                  </div>
                </section>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || total === 0}
                    className="w-full py-4 rounded-full bg-[var(--color-waldorf-terracotta)] text-white font-bold earth-shadow hover:bg-[#c06b52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-none"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={20} /> Procesando...</>
                    ) : (
                      <>Enviar Solicitud y Bloquear Fecha</>
                    )}
                  </button>
                  {total === 0 && (
                    <p className="text-center text-xs text-red-400 mt-2">Agrega horas válidas para habilitar el botón.</p>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Contact Widget */}
      <a 
        href="https://wa.me/56967765106?text=Hola%20Ivonne,%20me%20gustar%C3%ADa%20cotizar%20o%20hacer%20consultas%20sobre%20el%20Arriendo%20del%20Sal%C3%B3n%20en%20el%20Colegio." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-4 group cursor-none"
      >
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-green-100 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden md:block">
          <p className="text-sm font-medium text-gray-700">Hola 👋 Soy Ivonne.</p>
          <p className="text-xs text-gray-500">¿Dudas con el salón? Escríbeme.</p>
        </div>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:shadow-green-500/30">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937s-3.113 6.937-6.938 6.937z"/></svg>
        </div>
      </a>
    </main>
  )
}
