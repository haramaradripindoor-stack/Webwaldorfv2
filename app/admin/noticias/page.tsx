'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2, FileUp, Sparkles, Mail, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

export default function NoticiasAdmin() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendingNewsletterId, setSendingNewsletterId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('published_at', { ascending: false });
      
    if (data) setNoticias(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('trekan_media')
      .upload(fileName, file);

    if (uploadError) {
      alert('Error al subir imagen: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('trekan_media')
      .getPublicUrl(fileName);
      
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const generateWithAI = async () => {
    if (!title) {
      alert('Por favor, escribe un título o tema base antes de usar la IA.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: title })
      });
      
      if (!response.ok) throw new Error('Error en la API');
      
      const data = await response.json();
      
      if (data.title) setTitle(data.title);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.content) setContent(data.content);
      if (data.keywords) setKeywords(data.keywords);
      
    } catch (error) {
      console.error(error);
      alert('Error generando contenido con IA. Revisa los logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    let error;

    if (editId) {
      // Modo Edición
      const { error: updateError } = await supabase.from('noticias').update({
        title,
        excerpt,
        content,
        meta_keywords: keywords,
        image_url: imageUrl || '/imagenes-web/galeria3.webp',
      }).eq('id', editId);
      error = updateError;
    } else {
      // Modo Creación
      const { error: insertError } = await supabase.from('noticias').insert([
        {
          slug,
          title,
          excerpt,
          content,
          meta_keywords: keywords,
          image_url: imageUrl || '/imagenes-web/galeria3.webp',
          published_at: new Date().toISOString()
        }
      ]);
      error = insertError;
    }

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setShowForm(false);
      setEditId(null);
      setTitle('');
      setExcerpt('');
      setContent('');
      setImageUrl('');
      setKeywords('');
      fetchNoticias();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    
    const { error } = await supabase.from('noticias').delete().eq('id', id);
    if (!error) {
      fetchNoticias();
    }
  };

  const handleSendNewsletter = async (noticia: any) => {
    if (!confirm(`¿Estás seguro de enviar la noticia "${noticia.title}" por correo a todos tus leads?`)) return;
    
    setSendingNewsletterId(noticia.id);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticia.title,
          excerpt: noticia.excerpt,
          slug: noticia.slug,
          image_url: noticia.image_url
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el envío');
      
      alert(`¡Campaña enviada con éxito a ${data.count} destinatarios!`);
    } catch (error: any) {
      console.error(error);
      alert('Error enviando newsletter: ' + error.message);
    } finally {
      setSendingNewsletterId(null);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        
        const newNoticias = rows.map(row => ({
          title: row.titulo || row.title,
          slug: (row.titulo || row.title || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + uuidv4().slice(0,6),
          excerpt: row.resumen || row.excerpt || '',
          content: row.contenido || row.content || '',
          image_url: row.imagen || row.image_url || '/imagenes-web/galeria3.webp',
          published_at: row.fecha || row.published_at || new Date().toISOString()
        })).filter(n => n.title); 

        if (newNoticias.length > 0) {
          const { error } = await supabase.from('noticias').insert(newNoticias);
          if (error) alert('Error importando CSV: ' + error.message);
          else alert(`¡Se importaron ${newNoticias.length} noticias exitosamente!`);
          fetchNoticias();
        } else {
          setLoading(false);
          alert('El archivo CSV está vacío o no tiene la columna "titulo".');
        }
      },
      error: (error) => {
        alert('Error al leer el CSV: ' + error.message);
        setLoading(false);
      }
    });
  };

  if (loading && noticias.length === 0) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-waldorf-moss)]" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)]">Gestión de Noticias & SEO</h2>
          <p className="text-[var(--color-waldorf-text-light)] text-sm">Genera contenido posicionado automáticamente</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-white text-gray-700 border border-[var(--color-waldorf-sage)]/30 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
            <FileUp className="w-4 h-4" /> Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={loading} />
          </label>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditId(null); // Limpiar ID si cancela
              setTitle('');
              setExcerpt('');
              setContent('');
              setImageUrl('');
              setKeywords('');
            }}
            className="bg-[var(--color-waldorf-moss)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition shadow-md shadow-green-900/10"
          >
            {showForm ? 'Cancelar' : <><Plus className="w-4 h-4" /> Nueva Noticia</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-waldorf-cream)] rounded-bl-full -z-10 opacity-50" />
          
          <div className="flex items-center justify-between mb-6 border-b border-[var(--color-waldorf-sage)]/20 pb-4">
            <h3 className="text-lg font-bold text-[var(--color-waldorf-moss)]">Redactor SEO</h3>
            <button 
              type="button"
              onClick={generateWithAI}
              disabled={isGenerating || !title}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Escribiendo...' : 'Redactar con IA'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-1">Título (o Tema para la IA)</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Importancia de la lana en el invierno Waldorf..." className="w-full border border-[var(--color-waldorf-sage)]/30 rounded-xl p-3 focus:border-[var(--color-waldorf-moss)] outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-1">Resumen (Meta Description SEO)</label>
                <textarea required value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full border border-[var(--color-waldorf-sage)]/30 rounded-xl p-3 focus:border-[var(--color-waldorf-moss)] outline-none" rows={3}></textarea>
                <p className="text-[10px] text-gray-400 mt-1">Este texto aparecerá en Google cuando busquen el colegio.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-1">Palabras Clave (SEO Keywords)</label>
                <textarea value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="colegio waldorf, pedagogía, puerto varas..." className="w-full border border-[var(--color-waldorf-sage)]/30 rounded-xl p-3 focus:border-[var(--color-waldorf-moss)] outline-none" rows={3}></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-1">Contenido (Admite Markdown)</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border border-[var(--color-waldorf-sage)]/30 rounded-xl p-3 font-mono text-sm focus:border-[var(--color-waldorf-moss)] outline-none" rows={12}></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-waldorf-text)] mb-1">Imagen o Video Principal (Archivo o YouTube)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[var(--color-waldorf-paper)] p-4 rounded-xl border border-[var(--color-waldorf-sage)]/20">
                <input 
                  type="text" 
                  placeholder="URL de YouTube (opcional)" 
                  value={imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be') ? imageUrl : ''}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full sm:w-1/2 border border-[var(--color-waldorf-sage)]/30 rounded-lg p-2 text-sm focus:border-[var(--color-waldorf-moss)] outline-none"
                />
                <span className="text-gray-400 text-sm font-medium">o</span>
                <label className="cursor-pointer bg-white text-[var(--color-waldorf-moss)] px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-50 shadow-sm font-medium text-sm shrink-0">
                  <ImageIcon className="w-4 h-4" /> Subir Archivo
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {uploading && <span className="text-sm text-[var(--color-waldorf-terracotta)] animate-pulse font-medium flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Subiendo a Supabase...</span>}
                {imageUrl && (
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" title="Clic para ver tamaño completo" className="block hover:opacity-80 transition-opacity">
                    {(imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be')) ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${imageUrl.split('v=')[1]?.split('&')[0] || imageUrl.split('youtu.be/')[1]}`} 
                        className="h-24 w-32 object-cover rounded shadow-sm border border-[var(--color-waldorf-sage)]/50" 
                        allowFullScreen 
                      />
                    ) : imageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video src={imageUrl} className="h-24 w-32 object-cover rounded shadow-sm border border-[var(--color-waldorf-sage)]/50" autoPlay muted loop />
                    ) : (
                      <img src={imageUrl} alt="Preview" className="h-24 w-32 object-cover rounded shadow-sm border border-[var(--color-waldorf-sage)]/50" />
                    )}
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="bg-[var(--color-waldorf-terracotta)] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#b04a32]/30 hover:bg-[#b04a32] transition-colors">
                {editId ? 'Guardar Cambios' : 'Publicar Noticia'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-waldorf-sage)]/20 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-waldorf-paper)] border-b border-[var(--color-waldorf-sage)]/20">
            <tr>
              <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-sm uppercase tracking-wider">Fecha</th>
              <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-sm uppercase tracking-wider">Título</th>
              <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-sm uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((n) => (
              <tr key={n.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-500 font-medium">
                  {new Date(n.published_at).toLocaleDateString('es-CL')}
                </td>
                <td className="p-4 font-medium text-gray-800">{n.title}</td>
                <td className="p-4 flex gap-2">
                  <a 
                    href={`/noticias/${n.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                    title="Ver noticia"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => {
                      setEditId(n.id);
                      setTitle(n.title);
                      setExcerpt(n.excerpt || '');
                      setContent(n.content || '');
                      setImageUrl(n.image_url || '');
                      setKeywords(n.meta_keywords || '');
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Editar noticia"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSendNewsletter(n)} 
                    disabled={sendingNewsletterId === n.id}
                    className="text-amber-500 hover:bg-amber-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                    title="Enviar a Apoderados (Newsletter)"
                  >
                    {sendingNewsletterId === n.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar noticia">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {noticias.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No hay noticias todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
