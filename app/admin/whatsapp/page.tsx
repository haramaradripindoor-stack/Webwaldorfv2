'use client';
import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function WhatsAppConfigPage() {
  const [status, setStatus] = useState('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/status');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        setStatus(data.status);
        setQrCode(data.qr);
        setError(null);
      } catch (err) {
        setStatus('error');
        setError('No se pudo conectar con el servidor Baileys local. Asegúrate de correr "node server.js" en la carpeta whatsapp-service.');
      }
    };

    fetchStatus();
    // Poll every 3 seconds
    interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--color-waldorf-moss)] mb-2 tracking-tight">WhatsApp Engine</h1>
        <p className="text-[var(--color-waldorf-text-light)] text-sm">Vincula el dispositivo móvil de Coordinación para los saludos masivos.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20 p-8 flex flex-col items-center justify-center text-center">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center p-12">
            <RefreshCw className="w-8 h-8 text-[var(--color-waldorf-sage)] animate-spin mb-4" />
            <h2 className="text-lg font-bold text-[var(--color-waldorf-moss)]">Conectando al Motor...</h2>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center p-12 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Servidor Apagado</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <div className="bg-gray-50 p-4 rounded-lg w-full text-left text-xs font-mono text-gray-600 border border-gray-200">
              cd whatsapp-service<br/>
              node server.js
            </div>
          </div>
        )}

        {status === 'connected' && (
          <div className="flex flex-col items-center p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Dispositivo Vinculado</h2>
            <p className="text-gray-500 text-sm max-w-md">
              El WhatsApp de Coordinación está activo y listo. Ya puedes usar el botón de "Enviar Saludo Masivo" en el panel de Admisiones.
            </p>
          </div>
        )}

        {status === 'qr' && qrCode && (
          <div className="flex flex-col items-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Escanea el Código QR</h2>
            <p className="text-gray-500 text-sm max-w-md mb-8">
              Abre WhatsApp en el celular de Ivonne, ve a "Dispositivos Vinculados" y apunta la cámara hacia este código.
            </p>
            
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
              {/* Usamos una API gratuita para renderizar el string como imagen QR sin dependencias extra */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`} 
                alt="WhatsApp QR Code" 
                className="w-64 h-64"
              />
            </div>
            
            <p className="text-xs text-gray-400 mt-6 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" /> Actualizando en tiempo real...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
