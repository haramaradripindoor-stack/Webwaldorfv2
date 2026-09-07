'use client';
import { Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

export default function WhatsAppConfigPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--color-waldorf-moss)] mb-2 tracking-tight">WhatsApp Engine (Cloud API)</h1>
        <p className="text-[var(--color-waldorf-text-light)] text-sm">Estado de la conexión oficial con Meta for Developers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20 p-8 flex flex-col items-center justify-center text-center">
        
        <div className="flex flex-col items-center p-12">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Conexión Meta Oficial: Activa</h2>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            Este proyecto ya no utiliza el método antiguo de escaneo de QR (Baileys). Está conectado 100% en la nube a través de la <strong>API Oficial de Meta (WhatsApp Cloud API)</strong>.
          </p>

          <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-xl text-sm font-medium border border-blue-100">
            <ShieldCheck className="w-5 h-5" />
            No necesitas mantener tu computador encendido. Funciona 24/7 en Vercel.
          </div>
        </div>

      </div>
    </div>
  );
}
