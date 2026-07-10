'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function ActividadesAdmin() {
  const [actividades, setActividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [anio, setAnio] = useState('');
  const [mes, setMes] = useState('');
  const [dia, setDia] = useState('');
  const [tipo, setTipo] = useState('');
  const [lugar, setLugar] = useState('');
  const [hora, setHora] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('actividades')
      .select('*')
      .order('published_at', { ascending: false });
      
    if (data) setActividades(data);
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
    
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const { error } = await supabase.from('actividades').insert([
      {
        slug,
        title,
        excerpt,
        content,
        image_url: imageUrl || '/images/galeria3.webp',
        anio: anio || '2026',
        mes,
        dia,
        tipo,
        lugar,
        hora,
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
      setAnio(''); setMes(''); setDia(''); setTipo(''); setLugar(''); setHora('');
      fetchActividades();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    
    const { error } = await supabase.from('actividades').delete().eq('id', id);
    if (!error) {
      fetchActividades();
    }
  };

  if (loading && actividades.length === 0) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-waldorf-terracotta)]" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-gray-800">Gestión de Actividades</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[var(--color-waldorf-terracotta)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
        >
          {showForm ? 'Cancelar' : <><Plus className="w-4 h-4" /> Nueva Actividad</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold mb-4">Crear Nueva Actividad</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año (ej. 2026)</label>
                <input type="text" value={anio} onChange={e => setAnio(e.target.value)} placeholder="2026" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes (ej. MAYO)</label>
                <input type="text" value={mes} onChange={e => setMes(e.target.value)} className="w-full border rounded-lg p-2 uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Día (ej. 24)</label>
                <input type="text" value={dia} onChange={e => setDia(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo (ej. CELEBRACIÓN)</label>
                <input type="text" value={tipo} onChange={e => setTipo(e.target.value)} className="w-full border rounded-lg p-2 uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                <input type="text" value={lugar} onChange={e => setLugar(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input type="text" value={hora} onChange={e => setHora(e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded-lg p-2 font-mono text-sm" rows={4}></textarea>
            </div>
            <button type="submit" disabled={loading} className="bg-[var(--color-waldorf-terracotta)] text-white px-6 py-2 rounded-lg font-medium">
              Guardar Actividad
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
            {actividades.map((a) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">
                  {a.dia} {a.mes} {a.anio}
                </td>
                <td className="p-4 font-medium text-gray-800">{a.title}</td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setTitle(a.title);
                      setExcerpt(a.excerpt || '');
                      setContent(a.content || '');
                      setImageUrl(a.image_url || '');
                      setAnio(a.anio || '');
                      setMes(a.mes || '');
                      setDia(a.dia || '');
                      setTipo(a.tipo || '');
                      setLugar(a.lugar || '');
                      setHora(a.hora || '');
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
                    title="Editar (Se abrirá en el formulario arriba)"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {actividades.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No hay actividades todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
