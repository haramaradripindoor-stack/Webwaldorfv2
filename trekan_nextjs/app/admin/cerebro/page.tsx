'use client';

import { useState, useEffect } from 'react';
import { Brain, Plus, Trash2, Loader2 } from 'lucide-react';

interface KnowledgeChunk {
  id: string;
  content: string;
  created_at: string;
}

export default function CerebroPage() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchChunks();
  }, []);

  const fetchChunks = async () => {
    try {
      const res = await fetch('/api/admin/rag');
      if (res.ok) {
        const data = await res.json();
        setChunks(data);
      }
    } catch (error) {
      console.error('Error fetching chunks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (res.ok) {
        const newChunk = await res.json();
        setChunks([newChunk, ...chunks]);
        setNewContent('');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error('Error saving chunk:', error);
      alert('Error al guardar el conocimiento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este conocimiento? El bot lo olvidará.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/rag?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setChunks(chunks.filter((c) => c.id !== id));
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting chunk:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-gray-900 flex items-center gap-3">
          <Brain className="w-8 h-8 text-[var(--color-waldorf-terracota)]" />
          Cerebro IA (RAG)
        </h1>
        <p className="mt-2 text-gray-600">
          Enseña nuevos conocimientos al Asistente Virtual de Trekan. Escribe la información de forma clara y directa.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Añadir Nuevo Conocimiento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-waldorf-moss)] focus:border-transparent outline-none transition-all resize-none text-gray-700 bg-gray-50"
            rows={4}
            placeholder="Ejemplo: 'El proceso de postulación a becas 2026 comienza en el mes de Septiembre y requiere certificado de notas...'"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            disabled={submitting}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newContent.trim()}
              className="px-6 py-3 bg-[var(--color-waldorf-moss)] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {submitting ? 'Vectorizando y Guardando...' : 'Enseñar al Bot'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-between">
          <span>Memoria Actual</span>
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {chunks.length} fragmentos
          </span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-waldorf-terracota)]" />
          </div>
        ) : chunks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            El bot no tiene conocimientos adicionales todavía.
          </div>
        ) : (
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div 
                key={chunk.id} 
                className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed text-sm">{chunk.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(chunk.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(chunk.id)}
                  disabled={deletingId === chunk.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Eliminar este conocimiento"
                >
                  {deletingId === chunk.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
