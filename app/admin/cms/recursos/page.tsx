'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileJson, Upload, Link as LinkIcon, Trash2, Plus, Edit2, Download, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LeadMagnet = {
  id: string;
  slug: string;
  title: string;
  description: string;
  benefits: string[];
  pdf_url: string;
  created_at: string;
};

export default function RecursosAdminPage() {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState<string[]>(['', '', '', '']);
  const [file, setFile] = useState<File | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  useEffect(() => {
    fetchMagnets();
  }, []);

  const fetchMagnets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('lead_magnets').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setMagnets(data);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingId(null);
    setSlug('');
    setTitle('');
    setDescription('');
    setBenefits(['', '', '', '']);
    setFile(null);
    setCurrentPdfUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (magnet: LeadMagnet) => {
    setEditingId(magnet.id);
    setSlug(magnet.slug);
    setTitle(magnet.title);
    setDescription(magnet.description);
    // Fill up to 4 benefits, padding with empty strings if less
    const paddedBenefits = [...magnet.benefits];
    while(paddedBenefits.length < 4) paddedBenefits.push('');
    setBenefits(paddedBenefits.slice(0, 4));
    setFile(null);
    setCurrentPdfUrl(magnet.pdf_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, slugName: string) => {
    if (!confirm(`¿Eliminar permanentemente el recurso /recursos/${slugName}?`)) return;
    await supabase.from('lead_magnets').delete().eq('id', id);
    fetchMagnets();
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) return alert('Completa los campos obligatorios');
    if (!file && !currentPdfUrl) return alert('Debes subir un archivo PDF');

    setSaving(true);
    let finalPdfUrl = currentPdfUrl;

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('recursos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('recursos')
          .getPublicUrl(fileName);

        finalPdfUrl = publicUrl;
      }

      const cleanBenefits = benefits.filter(b => b.trim() !== '');

      const payload = {
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title,
        description,
        benefits: cleanBenefits,
        pdf_url: finalPdfUrl,
      };

      if (editingId) {
        await supabase.from('lead_magnets').update(payload).eq('id', editingId);
      } else {
        await supabase.from('lead_magnets').insert(payload);
      }

      setIsModalOpen(false);
      fetchMagnets();
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileJson className="text-emerald-400" size={32} />
            Recursos y Lead Magnets
          </h1>
          <p className="text-gray-400 mt-2">Crea páginas automáticas (Landing Pages) para entregar PDFs y capturar correos.</p>
        </div>
        <button onClick={openNewModal} className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={20} />
          Crear Nuevo Recurso
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-10">Cargando recursos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magnets.map(magnet => (
            <div key={magnet.id} className="bg-[#12121A] border border-hairline-soft p-6 rounded-2xl flex flex-col h-full hover:border-emerald-500/30 transition-colors group">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight">{magnet.title}</h3>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                    <FileJson size={20} />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{magnet.description}</p>
                
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 p-2 rounded-lg mb-6 truncate">
                  <LinkIcon size={14} />
                  /recursos/{magnet.slug}
                </div>
              </div>
              
              <div className="pt-4 border-t border-hairline-soft flex gap-2">
                <a href={`/recursos/${magnet.slug}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm">
                  <Eye size={16} /> Previsualizar
                </a>
                <button onClick={() => openEditModal(magnet)} className="flex-1 py-2 bg-foreground/5 hover:bg-foreground/10 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Edit2 size={16} /> Editar
                </button>
                <button onClick={() => handleDelete(magnet.id, magnet.slug)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {magnets.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 border border-dashed border-hairline rounded-2xl">
              No has creado ningún recurso aún. Haz clic en "Crear Nuevo Recurso" para empezar.
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-[#0A0A10] border border-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative my-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Upload className="text-emerald-400" />
                {editingId ? 'Editar Recurso' : 'Nuevo Recurso Automático'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Título del Recurso</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#12121A] border border-hairline rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none" required placeholder="Ej. Guía de Ayuno" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Slug (URL)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/recursos/</span>
                      <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#12121A] border border-hairline rounded-xl p-3 pl-[85px] text-white focus:border-emerald-500 focus:outline-none" required placeholder="guia-ayuno" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Descripción Corta</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#12121A] border border-hairline rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none resize-none h-24" required placeholder="Atrae al paciente explicando qué ganará al descargar esto." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">4 Beneficios Clave (Opcionales, aparecen con check verde)</label>
                  <div className="space-y-2">
                    {benefits.map((ben, i) => (
                      <input key={i} type="text" value={ben} onChange={e => handleBenefitChange(i, e.target.value)} className="w-full bg-[#12121A] border border-hairline rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none text-sm" placeholder={`Beneficio ${i+1}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Archivo PDF</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors bg-[#12121A]">
                    <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="pdf-upload" />
                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} className={file ? 'text-emerald-400' : 'text-gray-500'} />
                      <span className="text-sm font-medium text-gray-300">
                        {file ? file.name : currentPdfUrl ? 'Reemplazar PDF actual...' : 'Haz clic para subir el PDF'}
                      </span>
                    </label>
                  </div>
                  {currentPdfUrl && !file && (
                    <a href={currentPdfUrl} target="_blank" rel="noreferrer" className="text-emerald-400 text-xs mt-2 inline-flex items-center gap-1 hover:underline">
                      <Download size={12} /> Ver PDF actual guardado en Supabase
                    </a>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-hairline-soft">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-foreground/5 hover:bg-foreground/10 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" disabled={saving} className="flex-[2] bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 rounded-xl transition-opacity disabled:opacity-50">
                    {saving ? 'Guardando en Supabase...' : 'Guardar y Publicar Landing Page'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
