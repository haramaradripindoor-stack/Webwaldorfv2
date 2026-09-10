'use client';
import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, XCircle, RefreshCw, QrCode, Wifi, WifiOff } from 'lucide-react';

export default function WhatsAppConfigPage() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'qr' | 'disconnected'>('loading');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const BAILEYS_URL = 'http://localhost:3001';

  const checkStatus = async () => {
    setError(null);
    try {
      const res = await fetch(`${BAILEYS_URL}/api/status`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      setStatus(data.status === 'connected' ? 'connected' : data.qr ? 'qr' : 'disconnected');
      if (data.qr) {
        // Generate QR as image URL using a public QR API for display
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(data.qr)}`);
      } else {
        setQrUrl(null);
      }
    } catch {
      setStatus('disconnected');
      setError('El servicio Baileys no está corriendo. Ejecuta: cd whatsapp-service && node server.js');
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--color-waldorf-moss)] mb-2 tracking-tight">Motor WhatsApp</h1>
        <p className="text-[var(--color-waldorf-text-light)] text-sm">Conexión directa vía Baileys (escaneo QR desde el celular del colegio).</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20 p-8">
        
        {/* Estado: Cargando */}
        {status === 'loading' && (
          <div className="flex flex-col items-center p-12">
            <RefreshCw className="w-10 h-10 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500">Consultando estado del servicio...</p>
          </div>
        )}

        {/* Estado: Conectado */}
        {status === 'connected' && (
          <div className="flex flex-col items-center p-12">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">WhatsApp Conectado</h2>
            <p className="text-gray-500 text-sm max-w-md text-center mb-6">
              El celular del colegio está vinculado correctamente. Baileys está activo y escuchando mensajes entrantes.
            </p>
            <div className="flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-xl text-sm font-medium border border-green-100">
              <Wifi className="w-5 h-5" />
              Servicio activo en localhost:3001
            </div>
          </div>
        )}

        {/* Estado: Esperando QR */}
        {status === 'qr' && (
          <div className="flex flex-col items-center p-8">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
              <QrCode className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Escanea el Código QR</h2>
            <p className="text-gray-500 text-sm max-w-md text-center mb-6">
              Abre WhatsApp en el celular del colegio → <strong>Dispositivos Vinculados</strong> → <strong>Vincular Dispositivo</strong> → Escanea este código.
            </p>
            
            {qrUrl && (
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-amber-200 mb-6">
                <img src={qrUrl} alt="Código QR de WhatsApp" className="w-[280px] h-[280px]" />
              </div>
            )}

            <div className="flex items-center gap-3 bg-amber-50 text-amber-700 px-6 py-3 rounded-xl text-sm font-medium border border-amber-100">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Esperando escaneo... (se actualiza automáticamente)
            </div>
          </div>
        )}

        {/* Estado: Desconectado */}
        {status === 'disconnected' && (
          <div className="flex flex-col items-center p-12">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
              <WifiOff className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Servicio Desconectado</h2>
            <p className="text-gray-500 text-sm max-w-md text-center mb-4">
              El motor de WhatsApp (Baileys) no está corriendo en este momento.
            </p>
            
            {error && (
              <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl text-sm border border-red-100 mb-6 max-w-lg text-center">
                <p className="font-medium mb-2">Para activarlo:</p>
                <code className="bg-red-100 px-3 py-1 rounded-lg text-xs font-mono">
                  cd whatsapp-service && node server.js
                </code>
              </div>
            )}

            <button
              onClick={checkStatus}
              className="flex items-center gap-2 bg-[var(--color-waldorf-moss)] text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar Conexión
            </button>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="text-sm font-bold text-blue-800 mb-2">ℹ️ ¿Cómo funciona?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Este motor usa <strong>Baileys</strong> (conexión directa al celular, sin Meta for Developers).</li>
          <li>• El servicio debe estar corriendo en tu computador (<code className="bg-blue-100 px-1 rounded">localhost:3001</code>).</li>
          <li>• Si reinicias el computador, debes volver a ejecutar el comando.</li>
          <li>• Los mensajes de <strong>grupos y estados</strong> son ignorados automáticamente.</li>
        </ul>
      </div>
    </div>
  );
}
