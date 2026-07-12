'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Image as ImageIcon, Video, Type, CheckCircle, LayoutTemplate } from 'lucide-react';

export default function PortadaEditor() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Content state
  const [content, setContent] = useState<any>({
    hero_section: { title: 'La Vida en Trekan', subtitle: 'Educación con sentido', media_url: '/assets/testimonial.mp4', media_type: 'video' },
    text_reveal: 'Educar no es llenar un cubo, es encender un fuego. En Trekan, respetamos el ritmo natural de cada niño, cultivando la cabeza, el corazón y las manos en perfecta armonía.',
    masonry_gallery: [
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20264.jpg', alt: 'Exploración en la naturaleza', span: 'col-span-2 row-span-2' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales5.jpg', alt: 'Conexión vivencial', span: 'col-span-1 row-span-1' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta de la luz202610.jpg', alt: 'Ritmos y tradiciones', span: 'col-span-1 row-span-2' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20268.jpg', alt: 'Comunidad en movimiento', span: 'col-span-1 row-span-1' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales6.jpg', alt: 'Aprendizaje en el entorno', span: 'col-span-2 row-span-1' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20269.jpg', alt: 'Libertad y asombro', span: 'col-span-1 row-span-1' },
      { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta de la luz20268.jpg', alt: 'Luz y calidez', span: 'col-span-1 row-span-1' }
    ]
  });

  const [activeTab, setActiveTab] = useState<'hero' | 'text' | 'gallery'>('hero');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setContent(data);
        }
      } catch (err: any) {
        console.error('Error fetching homepage content:', err);
        // Si falla, usamos el contenido por defecto
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          id: 1,
          hero_section: content.hero_section,
          text_reveal: content.text_reveal,
          masonry_gallery: content.masonry_gallery,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      showMessage('success', 'Cambios guardados exitosamente. Visita la página pública para verlos.');
    } catch (err: any) {
      console.error(err);
      showMessage('error', 'Error al guardar. Asegúrate de haber ejecutado el script SQL en Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadMedia = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `portada/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trekan_media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('trekan_media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleHeroMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSaving(true);
      const url = await uploadMedia(file);
      setContent({
        ...content,
        hero_section: { ...content.hero_section, media_url: url, media_type: file.type.includes('video') ? 'video' : 'image' }
      });
      showMessage('success', 'Medio subido. No olvides dar clic en Guardar.');
    } catch (err) {
      showMessage('error', 'Error al subir el archivo.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateHero = (field: string, value: string) => {
    setContent({ ...content, hero_section: { ...content.hero_section, [field]: value } });
  };

  const updateGalleryImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSaving(true);
      const url = await uploadMedia(file);
      const newGallery = [...content.masonry_gallery];
      newGallery[index].url = url;
      setContent({ ...content, masonry_gallery: newGallery });
      showMessage('success', 'Imagen actualizada. No olvides Guardar.');
    } catch (err) {
      showMessage('error', 'Error al subir imagen.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateGalleryText = (index: number, field: string, value: string) => {
    const newGallery = [...content.masonry_gallery];
    newGallery[index][field] = value;
    setContent({ ...content, masonry_gallery: newGallery });
  };

  if (isLoading) return <div className="text-white">Cargando editor...</div>;

  return (
    <div className="bg-surface border border-gray-800 rounded-3xl p-8 shadow-xl text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-cyan-400" />
            Editor de Portada
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Modifica los textos, imágenes y videos de la página principal.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin text-xl">↻</span> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 p-4 rounded-xl font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl border border-gray-800 w-max">
        <button onClick={() => setActiveTab('hero')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'hero' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Video Principal (Hero)</button>
        <button onClick={() => setActiveTab('text')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'text' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Textos & Frases</button>
        <button onClick={() => setActiveTab('gallery')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'gallery' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Galería de Fotos</button>
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título Principal</label>
            <input 
              type="text" 
              value={content.hero_section.title} 
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subtítulo</label>
            <input 
              type="text" 
              value={content.hero_section.subtitle} 
              onChange={(e) => updateHero('subtitle', e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Video o Imagen de Fondo (Archivo o YouTube)</label>
            <div className="flex gap-4 items-start">
              <div className="shrink-0">
                {(content.hero_section.media_url?.includes('youtube.com') || content.hero_section.media_url?.includes('youtu.be')) ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${content.hero_section.media_url.split('v=')[1]?.split('&')[0] || content.hero_section.media_url.split('youtu.be/')[1]}`} 
                    className="w-48 h-32 object-cover rounded-xl border border-gray-700" 
                    allowFullScreen 
                  />
                ) : content.hero_section.media_type === 'video' ? (
                  <video src={content.hero_section.media_url} className="w-48 h-32 object-cover rounded-xl border border-gray-700" autoPlay muted loop />
                ) : (
                  <img src={content.hero_section.media_url} className="w-48 h-32 object-cover rounded-xl border border-gray-700" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  placeholder="URL de YouTube (opcional)" 
                  value={(content.hero_section.media_url?.includes('youtube.com') || content.hero_section.media_url?.includes('youtu.be')) ? content.hero_section.media_url : ''}
                  onChange={(e) => updateHero('media_url', e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-2 text-white focus:border-cyan-500 outline-none text-sm"
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">o sube archivo:</span>
                  <input type="file" accept="video/*,image/*" onChange={handleHeroMediaChange} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Section */}
      {activeTab === 'text' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Frase Destacada (Text Reveal)</label>
            <textarea 
              value={content.text_reveal} 
              onChange={(e) => setContent({ ...content, text_reveal: e.target.value })}
              className="w-full h-40 bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          <p className="text-gray-400">Las 7 imágenes que conforman la grilla asimétrica (Masonry). Puedes cambiar la foto y el texto que aparece al pasar el cursor.</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {content.masonry_gallery.map((img: any, i: number) => (
              <div key={i} className="bg-black/50 border border-gray-700 rounded-2xl p-4">
                <div className="relative aspect-video mb-4 rounded-xl overflow-hidden group">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <input type="file" accept="image/*" onChange={(e) => updateGalleryImage(i, e)} className="hidden" id={`gal-${i}`} />
                    <label htmlFor={`gal-${i}`} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm cursor-pointer hover:scale-105 transition-transform">Cambiar Foto</label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Texto (Alt)</label>
                  <input 
                    type="text" 
                    value={img.alt} 
                    onChange={(e) => updateGalleryText(i, 'alt', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-cyan-500 outline-none text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
