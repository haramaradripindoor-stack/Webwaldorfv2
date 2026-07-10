'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Trash2 } from 'lucide-react';

type MediaItem = { id: string; type: 'photo' | 'video'; title: string | null; url: string; created_at: string; };

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function CMSDashboard() {
  const [mainTab, setMainTab] = useState<'galeria'>('galeria');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -- STATE: GALERIA --
  const [galleryTab, setGalleryTab] = useState<'fotos' | 'videos'>('fotos');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const videoTitleRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoTitleRef = useRef<HTMLInputElement>(null);



  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (mainTab === 'galeria') {
        const res = await fetch('/api/cms');
        const json = await res.json();
        if (json.success) setMediaItems(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainTab]);

  // -- HANDLERS: GALERIA --
  const handleVideoSubmit = async () => {
    const title = videoTitleRef.current?.value;
    const url = videoUrlRef.current?.value;
    if (!title || !url) return showMessage('error', 'Por favor completa título y enlace.');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', 'video'); formData.append('title', title); formData.append('url', url);
      const res = await fetch('/api/cms', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error al guardar');
      showMessage('success', 'Video publicado exitosamente.');
      if (videoTitleRef.current) videoTitleRef.current.value = '';
      if (videoUrlRef.current) videoUrlRef.current.value = '';
      fetchData();
    } catch (e) { showMessage('error', 'Error al subir video'); }
    setIsLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showMessage('error', 'La imagen supera los 2MB permitidos.');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', 'photo'); formData.append('file', file);
      formData.append('title', photoTitleRef.current?.value || file.name);
      const res = await fetch('/api/cms', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error');
      showMessage('success', 'Imagen subida.');
      if (photoTitleRef.current) photoTitleRef.current.value = '';
      fetchData();
    } catch (e) { showMessage('error', 'Error al subir imagen'); }
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('¿Eliminar este elemento?')) return;
    setIsLoading(true);
    try {
      await fetch(`/api/cms?id=${id}`, { method: 'DELETE' });
      showMessage('success', 'Elemento eliminado.');
      fetchData();
    } catch (e) { showMessage('error', 'Error al eliminar'); }
    setIsLoading(false);
  };



  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-8 border-b border-hairline pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Sistema de Gestión Integral (CMS)
          </h1>
          <p className="text-gray-400 mt-2">Administra tu Galería, Servicios Médicos y Zonas de Cobertura.</p>
        </div>
        
        {/* Main Tabs */}
        <div className="flex bg-surface border border-hairline rounded-xl p-1 shadow-lg">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-cyan-500/20 text-cyan-400">
            <Image className="w-4 h-4" /> Galería Visual
          </button>
        </div>
      </header>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mb-6 p-4 rounded-xl border font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario Lateral */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl">
            
            {/* Formulario Galería */}
            {mainTab === 'galeria' && (
              <>
                <h2 className="text-xl font-bold mb-4">Añadir Medio</h2>
                <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-full border border-hairline-soft">
                  <button onClick={() => setGalleryTab('fotos')} className={`flex-1 py-2 rounded-full font-bold text-xs transition-all ${galleryTab === 'fotos' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>📷 Foto</button>
                  <button onClick={() => setGalleryTab('videos')} className={`flex-1 py-2 rounded-full font-bold text-xs transition-all ${galleryTab === 'videos' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'}`}>🎥 Video YT</button>
                </div>

                {galleryTab === 'fotos' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Título de la Foto</label>
                      <input ref={photoTitleRef} type="text" disabled={isLoading} placeholder="Ej: Sesión de Kinesiología" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-cyan-500 outline-none disabled:opacity-50" />
                    </div>
                    <div onClick={() => !isLoading && fileInputRef.current?.click()} className={`bg-black/30 border border-dashed ${isLoading ? 'border-gray-800 opacity-50' : 'border-gray-700 hover:border-cyan-500 cursor-pointer'} rounded-xl p-6 text-center transition-colors`}>
                       <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                       <div className="text-3xl mb-2">📸</div>
                       <p className="text-xs font-bold text-white mb-1">Seleccionar imagen</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Título del Video</label>
                      <input ref={videoTitleRef} type="text" disabled={isLoading} placeholder="Ej: Front Lever Tutorial" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-violet-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Enlace YouTube</label>
                      <input ref={videoUrlRef} type="url" disabled={isLoading} placeholder="https://youtube.com/watch?v=..." className="w-full bg-background border border-gray-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-violet-500 outline-none" />
                    </div>
                    <button onClick={handleVideoSubmit} disabled={isLoading} className="w-full bg-violet-600 font-bold py-3 rounded-xl hover:bg-violet-500 transition disabled:opacity-50">Publicar Video</button>
                  </div>
                )}
              </>
            )}



          </div>
        </div>

        {/* Listado Principal */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[400px]">
            
            {/* Listado Galería */}
            {mainTab === 'galeria' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Elementos en la Galería</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mediaItems.map(item => (
                    <div key={item.id} className="bg-background border border-gray-800 rounded-2xl overflow-hidden p-3 flex flex-col justify-between">
                      <div>
                        {item.type === 'photo' ? (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                            <img src={item.url} alt="Foto" className="object-cover w-full h-full" />
                            <span className="absolute top-2 left-2 bg-cyan-500/90 text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">Foto</span>
                          </div>
                        ) : (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                            {(() => {
                              const ytId = getYouTubeId(item.url);
                              return ytId ? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} /> : null;
                            })()}
                            <span className="absolute top-2 left-2 bg-violet-500/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full z-10">Video</span>
                          </div>
                        )}
                        <h3 className="font-bold text-sm mb-1">{item.title || 'Sin Título'}</h3>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <button onClick={() => handleDeleteMedia(item.id)} className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-lg">🗑️ Eliminar</button>
                      </div>
                    </div>
                  ))}
                  {mediaItems.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">Galería vacía</p>}
                </div>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  );
}
