'use client';
import { useState } from 'react';
import { Bell, Send, Smartphone, AlertCircle } from 'lucide-react';

export default function PushAdminPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      setMessage({ type: 'error', text: 'El título y el mensaje son obligatorios.' });
      return;
    }

    if (!confirm('¿Estás seguro de enviar esta notificación a TODOS los pacientes registrados? Esta acción no se puede deshacer.')) {
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const res = await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, url: url || '/' })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: `¡Éxito! Mensaje enviado a ${data.sent} dispositivos. (Fallaron ${data.failed}).` });
        setTitle('');
        setBody('');
        setUrl('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al enviar.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de red.' });
    }
    setSending(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bell className="text-cyan-400" size={32} />
          Push Marketing
        </h1>
        <p className="text-gray-400 mt-2">Envía notificaciones directas al celular y PC de tus pacientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulario */}
        <div className="bg-[#12121A] border border-hairline-soft p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Send className="text-cyan-400" size={20} />
            Nueva Campaña Push
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Título de la Notificación</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. ¡50% de Descuento en Calistenia!"
                className="w-full bg-[#0A0A10] border border-hairline rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                maxLength={50}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{title.length}/50</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Mensaje Corto</label>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Agenda hoy y asegura tu cupo para esta semana. Quedan pocas horas."
                className="w-full bg-[#0A0A10] border border-hairline rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none h-24"
                maxLength={150}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{body.length}/150</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">URL de Destino (Opcional)</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ej. /reservar o https://google.com"
                className="w-full bg-[#0A0A10] border border-hairline rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={sending}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send size={18} />
              {sending ? 'Enviando a todos...' : 'Disparar Notificación a Todos'}
            </button>
          </form>
        </div>

        {/* Simulador / Preview */}
        <div className="bg-[#12121A] border border-hairline-soft p-6 rounded-2xl flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-8 w-full flex items-center gap-2">
            <Smartphone className="text-cyan-400" size={20} />
            Previsualización en Vivo
          </h2>

          <div className="relative w-[300px] h-[600px] bg-black border-[12px] border-gray-800 rounded-[3rem] shadow-2xl flex items-start justify-center p-4 overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>

            {/* Lock Screen UI Base */}
            <div className="w-full h-full pt-12 flex flex-col gap-4">
              <div className="text-center text-gray-500 font-bold mb-4">
                12:45
                <div className="text-xs font-normal">Martes, 14 Nov</div>
              </div>

              {/* Notification Bubble */}
              {(title || body) ? (
                <div className="w-full bg-foreground/10 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-hairline-soft animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/logo.png" alt="Icon" className="w-5 h-5 rounded bg-black" />
                    <span className="text-xs text-gray-300 font-medium">Clínica GAP</span>
                    <span className="text-xs text-gray-500 ml-auto">ahora</span>
                  </div>
                  <h4 className="text-white font-bold text-sm leading-tight mb-1">{title || 'Título de Notificación'}</h4>
                  <p className="text-gray-300 text-xs leading-snug">{body || 'El mensaje que escribas aparecerá aquí para que veas cómo se lee.'}</p>
                </div>
              ) : (
                <div className="text-center text-gray-600 text-sm mt-10">
                  Escribe en el formulario para ver cómo lucirá la notificación.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
