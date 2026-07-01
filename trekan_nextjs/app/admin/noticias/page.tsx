'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2, FileUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

export default function NoticiasAdmin() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generar un slug simple
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const { error } = await supabase.from('noticias').insert([
      {
        slug,
        title,
        excerpt,
        content,
        image_url: imageUrl || '/images/galeria3.webp',
        published_at: new Date().toISOString()
      }
    ]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setShowForm(false);
      setTitle('');
      setExcerpt('');
      setContent('');
      setImageUrl('');
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
          image_url: row.imagen || row.image_url || '/images/galeria3.webp',
          published_at: row.fecha || row.published_at || new Date().toISOString()
        })).filter(n => n.title); // Asegurar que tenga título

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
        <h2 className="text-2xl font-bold font-serif text-gray-800">Gestión de Noticias</h2>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
            <FileUp className="w-4 h-4" /> Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={loading} />
          </label>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--color-waldorf-moss)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition"
          >
            {showForm ? 'Cancelar' : <><Plus className="w-4 h-4" /> Nueva Noticia</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold mb-4">Crear Nueva Noticia</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 border hover:bg-gray-200">
                  <ImageIcon className="w-4 h-4" /> Subir Foto
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {uploading && <span className="text-sm text-gray-500">Subiendo...</span>}
                {imageUrl && <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resumen Corto</label>
              <textarea required value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full border rounded-lg p-2" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (Admite Markdown)</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded-lg p-2 font-mono text-sm" rows={8}></textarea>
            </div>
            <button type="submit" disabled={loading} className="bg-[var(--color-waldorf-terracota)] text-white px-6 py-2 rounded-lg font-medium">
              Guardar Noticia
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">Fecha</th>
              <th className="p-4 font-medium text-gray-600">Título</th>
              <th className="p-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((n) => (
              <tr key={n.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">
                  {new Date(n.published_at).toLocaleDateString('es-CL')}
                </td>
                <td className="p-4 font-medium text-gray-800">{n.title}</td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setTitle(n.title);
                      setExcerpt(n.excerpt || '');
                      setContent(n.content || '');
                      setImageUrl(n.image_url || '');
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
                    title="Editar (Se abrirá en el formulario arriba)"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Eliminar">
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
