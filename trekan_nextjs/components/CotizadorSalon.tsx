"use client";
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Plus, X, Calculator, Send } from 'lucide-react';

interface DayEntry {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
}

export default function CotizadorSalon() {
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
      setMessage({ text: '✅ ¡Perfecto! Hemos recibido tu solicitud. Nos contactaremos pronto.', type: 'success' });
      setNombre(''); setTelefono(''); setEmail(''); setConsultas(''); setFirma('');
      setKitCompleto(false); setCalefaccion(false); setOtroServicioCheck(false); setOtroServicioText('');
      setDias([{ id: '1', fecha: '', inicio: '', fin: '' }]);
    } catch (error) {
      console.error(error);
      setMessage({ text: '❌ Error al enviar. Por favor intenta más tarde o escríbenos por WhatsApp.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[var(--color-waldorf-sage)]/20 shadow-xl earth-shadow">
      <div className="flex items-center gap-3 mb-8 border-b border-[var(--color-waldorf-sage)]/20 pb-6">
        <div className="p-3 bg-[var(--color-waldorf-sage)]/20 rounded-full text-[var(--color-waldorf-moss)]">
          <Calculator size={24} />
        </div>
        <h2 className="text-3xl font-bold font-serif text-[var(--color-waldorf-moss)]">
          Cotizador Interactivo
        </h2>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 border ${message.type === 'success' ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Info Cliente */}
        <section>
          <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4 border-b border-[var(--color-waldorf-sage)]/20 pb-2">📋 Información del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-2">Nombre Completo *</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-2">Teléfono *</label>
              <input type="tel" required value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-2">Correo Electrónico *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] outline-none" />
            </div>
          </div>
        </section>

        {/* Fechas */}
        <section>
          <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4 border-b border-[var(--color-waldorf-sage)]/20 pb-2">📅 Duración del Evento</h3>
          <div className="space-y-4">
            {dias.map((dia, idx) => (
              <div key={dia.id} className="relative bg-[#f9fcef] p-6 rounded-2xl border border-[#e0eed0]">
                {dias.length > 1 && (
                  <button type="button" onClick={() => removeDay(dia.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-white rounded-full shadow-sm">
                    <X size={16} />
                  </button>
                )}
                <strong className="block text-[var(--color-waldorf-moss)] mb-4">Día {idx + 1}</strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                    <input type="date" min={todayStr} required value={dia.fecha} onChange={e => updateDay(dia.id, 'fecha', e.target.value)} className="w-full p-2 rounded-lg border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Inicio</label>
                    <input type="time" required value={dia.inicio} onChange={e => updateDay(dia.id, 'inicio', e.target.value)} className="w-full p-2 rounded-lg border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Fin</label>
                    <input type="time" required value={dia.fin} onChange={e => updateDay(dia.id, 'fin', e.target.value)} className="w-full p-2 rounded-lg border border-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addDay} className="mt-4 flex items-center gap-2 text-sm font-bold text-[#2c5530] bg-[#a8d8b9]/30 hover:bg-[#a8d8b9]/60 px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Agregar otro día
          </button>
        </section>

        {/* Servicios */}
        <section>
          <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4 border-b border-[var(--color-waldorf-sage)]/20 pb-2">🔌 Equipamiento Opcional</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <input type="checkbox" checked={kitCompleto} onChange={e => setKitCompleto(e.target.checked)} className="mt-1 w-4 h-4 text-[var(--color-waldorf-moss)]" />
              <div>
                <span className="block font-medium text-gray-800">Kit Audiovisual Completo — $20.000</span>
                <span className="text-sm text-gray-500">Proyector + pantalla + parlantes + micrófono</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <input type="checkbox" checked={calefaccion} onChange={e => setCalefaccion(e.target.checked)} className="mt-1 w-4 h-4 text-[var(--color-waldorf-moss)]" />
              <div>
                <span className="block font-medium text-gray-800">Calefacción a leña — $15.000</span>
                <span className="text-sm text-gray-500">Incluye 1 vara y encendido. El cliente alimenta el fuego.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <input type="checkbox" checked={otroServicioCheck} onChange={e => setOtroServicioCheck(e.target.checked)} className="mt-1 w-4 h-4 text-[var(--color-waldorf-moss)]" />
              <div className="w-full">
                <span className="block font-medium text-gray-800">Otra necesidad ($10.000 aprox)</span>
                {otroServicioCheck && (
                  <input type="text" value={otroServicioText} onChange={e => setOtroServicioText(e.target.value)} placeholder="Ej: pizarra, sillas extra..." className="mt-2 w-full p-2 rounded-lg border border-gray-200" />
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Resumen */}
        <section className="bg-[#f0f8ff] p-6 rounded-2xl border border-[#cce0ff]">
          <h3 className="text-xl font-bold font-serif text-[#1a4a2a] mb-4 border-b border-[#cce0ff] pb-2">💰 Resumen de Cotización</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Total de horas:</strong> {totalHoras.toFixed(1)} hrs</p>
            <p><strong>Subtotal Salón:</strong> {fmt(costoSalon)}</p>
            <p><strong>Subtotal Servicios:</strong> {fmt(costoEquipos)}</p>
            <div className="border-t border-[#cce0ff] my-3 pt-3">
              <p className="text-2xl font-bold text-[#1a4a2a]">Total Estimado: {fmt(total)}</p>
            </div>
            <div className="pt-2 text-sm text-gray-600 bg-white p-4 rounded-xl">
              <p>💳 Para reservar fecha se abona el 30%: <strong>{fmt(reserva)}</strong></p>
              <p>💳 Saldo restante antes del evento (70%): <strong>{fmt(saldo)}</strong></p>
            </div>
          </div>
        </section>

        {/* Consultas */}
        <section>
          <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-2">Dudas o Inquietudes Adicionales</label>
          <textarea rows={3} value={consultas} onChange={e => setConsultas(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[var(--color-waldorf-moss)] focus:ring-1 focus:ring-[var(--color-waldorf-moss)] outline-none" placeholder="Escríbenos aquí..." />
        </section>

        {/* Firma */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Al enviar este formulario confirmo que acepto los términos y condiciones de uso del espacio.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Firma Digital (Tu Nombre) *</label>
              <input type="text" required value={firma} onChange={e => setFirma(e.target.value)} className="w-full p-2 rounded-lg border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha *</label>
              <input type="date" required value={fechaFirma} onChange={e => setFechaFirma(e.target.value)} className="w-full p-2 rounded-lg border border-gray-300" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={loading} className="w-full py-4 bg-[var(--color-waldorf-moss)] hover:bg-[#1e3d22] text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
          {loading ? 'Enviando...' : <><Send size={20} /> Enviar Cotización y Reservar Fecha</>}
        </button>
      </form>
    </div>
  );
}
