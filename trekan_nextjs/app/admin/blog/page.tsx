'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  X,
  Search,
  Eye,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      showToast('Error cargando posts', 'error');
    } else if (data) {
      setPosts(data as BlogPost[]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!currentPost?.title || !currentPost?.slug || !currentPost?.content) {
      showToast('Título, slug y contenido son requeridos', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      ...currentPost,
      updated_at: new Date().toISOString(),
    };

    if (payload.id) {
      // Update
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', payload.id);
      if (error) showToast(error.message, 'error');
      else {
        showToast('Post actualizado');
        setIsEditing(false);
        fetchPosts();
      }
    } else {
      // Insert
      const { error } = await supabase.from('blog_posts').insert([payload]);
      if (error) showToast(error.message, 'error');
      else {
        showToast('Post creado exitosamente');
        setIsEditing(false);
        fetchPosts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) showToast('Error al eliminar', 'error');
    else {
      showToast('Artículo eliminado');
      fetchPosts();
    }
  };

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
    } else {
      setCurrentPost({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: 'Benjamín León',
        status: 'draft',
        image_url: ''
      });
    }
    setIsEditing(true);
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A10] text-gray-200 p-4 md:p-8 font-sans pb-32">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-[#00d4a4]/10 text-[#00d4a4] border border-[#00d4a4]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}
          >
            {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-white flex items-center gap-3 tracking-tight">
              <FileText className="text-[#00d4a4]" />
              Blog Headless
            </h1>
            <p className="text-gray-400 text-sm mt-1">Gestor de contenidos Awwwards-Level (ISR render)</p>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 bg-[#00d4a4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00b38a] transition-all shadow-[0_0_15px_rgba(0,212,164,0.3)] hover:shadow-[0_0_25px_rgba(0,212,164,0.5)]"
            >
              <Plus size={18} /> Nuevo Artículo
            </button>
          )}
        </header>

        {/* Editor View */}
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111116] border border-white/5 rounded-2xl p-6 md:p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">{currentPost?.id ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Título</label>
                  <input
                    type="text"
                    value={currentPost?.title || ''}
                    onChange={(e) => {
                      // Auto-generate slug if it's a new post and slug is empty
                      const newTitle = e.target.value;
                      const newSlug = !currentPost?.id && (!currentPost?.slug || currentPost.slug === currentPost.title?.toLowerCase().replace(/\s+/g, '-')) 
                        ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
                        : currentPost?.slug;
                      
                      setCurrentPost({ ...currentPost, title: newTitle, slug: newSlug });
                    }}
                    className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d4a4] transition-colors"
                    placeholder="Ej: Los beneficios de la Calistenia..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Contenido (HTML / Rich Text)</label>
                  <textarea
                    value={currentPost?.content || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    rows={15}
                    className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d4a4] transition-colors font-mono text-sm"
                    placeholder="<h1>Título</h1><p>Contenido del artículo...</p>"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Resumen (Excerpt)</label>
                  <textarea
                    value={currentPost?.excerpt || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    rows={3}
                    className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d4a4] transition-colors"
                    placeholder="Breve descripción para SEO y listas..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#0A0A10] p-5 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-medium text-white mb-4">Metadatos</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={currentPost?.slug || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00d4a4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Autor</label>
                    <input
                      type="text"
                      value={currentPost?.author || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00d4a4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Estado</label>
                    <select
                      value={currentPost?.status || 'draft'}
                      onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value as any })}
                      className="w-full bg-[#111116] border border-white/10 rounded px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00d4a4]"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">URL Imagen Portada</label>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-gray-500" />
                      <input
                        type="text"
                        value={currentPost?.image_url || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, image_url: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00d4a4]"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {currentPost?.image_url && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video">
                      <img src={currentPost.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {saving ? 'Guardando...' : 'Guardar Artículo'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* List View */
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Buscar por título o slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111116] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#00d4a4] transition-colors"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#00d4a4]" size={32} />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-[#111116] border border-white/5 rounded-2xl p-12 text-center">
                <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No se encontraron artículos.</p>
              </div>
            ) : (
              <div className="bg-[#111116] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-normal">Artículo</th>
                      <th className="px-6 py-4 font-normal">Estado</th>
                      <th className="px-6 py-4 font-normal">Fecha</th>
                      <th className="px-6 py-4 font-normal text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white text-base">{post.title}</p>
                          <p className="text-gray-500 font-mono text-xs mt-1">/{post.slug}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            post.status === 'published' ? 'bg-[#00d4a4]/10 text-[#00d4a4]' :
                            post.status === 'draft' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {post.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(post.created_at).toLocaleDateString('es-CL')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a 
                              href={`/blog/${post.slug}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-2 text-gray-500 hover:text-white transition-colors"
                              title="Ver artículo"
                            >
                              <Eye size={18} />
                            </a>
                            <button 
                              onClick={() => openEditor(post)}
                              className="p-2 text-gray-500 hover:text-[#00d4a4] transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(post.id)}
                              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
