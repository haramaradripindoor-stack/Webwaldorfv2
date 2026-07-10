'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Search, ExternalLink, Heart, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient();

type Prospecto = {
  id: string;
  ig_username: string;
  bio: string;
  followers: number;
  calificacion_ia: 'HOT' | 'WARM' | 'COLD';
  estado_cm: 'Pendiente' | 'Interacción Inicial' | 'Comentado' | 'Descartado' | 'Convertido';
  created_at: string;
};

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProspectos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prospectos_outbound')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setProspectos(data as Prospecto[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProspectos();
  }, []);

  const updateEstado = async (id: string, nuevoEstado: Prospecto['estado_cm']) => {
    const { error } = await supabase.from('prospectos_outbound').update({ estado_cm: nuevoEstado }).eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchProspectos();
  };

  const filtered = prospectos.filter(p => p.ig_username.toLowerCase().includes(searchTerm.toLowerCase()) || (p.bio && p.bio.toLowerCase().includes(searchTerm.toLowerCase())));

  const StatsCard = ({ title, count, color }: { title: string, count: number, color: string }) => (
    <div className="bg-white p-4 rounded-xl border border-[var(--color-waldorf-sage)]/20 shadow-sm flex flex-col items-center justify-center">
      <p className="text-sm font-bold text-[var(--color-waldorf-moss)] uppercase tracking-wider">{title}</p>
      <p className={`text-3xl font-black mt-2 ${color}`}>{count}</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-waldorf-sage)]/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-[var(--color-waldorf-moss)] flex items-center gap-2">
            Growth Engine: Prospectos
          </h1>
          <p className="text-[var(--color-waldorf-text-light)] mt-1 font-medium">
            Perfiles extraídos por la Aspiradora de IA. Interactúa con ellos para convertirlos en Admisiones.
          </p>
        </div>
        
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por usuario o bio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[var(--color-waldorf-sage)]/30 rounded-xl focus:outline-none focus:border-[var(--color-waldorf-moss)] bg-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Extraídos Totales" count={prospectos.length} color="text-gray-700" />
        <StatsCard title="Pendientes" count={prospectos.filter(p => p.estado_cm === 'Pendiente').length} color="text-amber-500" />
        <StatsCard title="En Nutrición" count={prospectos.filter(p => p.estado_cm === 'Interacción Inicial' || p.estado_cm === 'Comentado').length} color="text-blue-500" />
        <StatsCard title="Convertidos a Leads" count={prospectos.filter(p => p.estado_cm === 'Convertido').length} color="text-emerald-500" />
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-waldorf-sage)]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-waldorf-paper)] border-b border-[var(--color-waldorf-sage)]/20">
              <tr>
                <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-xs uppercase tracking-wider">Usuario IG</th>
                <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-xs uppercase tracking-wider w-1/3">Bio (Contexto)</th>
                <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-xs uppercase tracking-wider">Calificación IA</th>
                <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-xs uppercase tracking-wider">Estado Operativo</th>
                <th className="p-4 font-bold text-[var(--color-waldorf-moss)] text-xs uppercase tracking-wider text-right">Acciones CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-waldorf-sage)]/10">
              {loading && prospectos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-waldorf-moss)] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cargando prospectos...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                    No se encontraron perfiles. Ejecuta el script de Aspiradora.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((p) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <a href={`https://instagram.com/${p.ig_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-bold text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                          @{p.ig_username}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-gray-400 mt-1">{p.followers || 0} seguidores</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-[var(--color-waldorf-text)] line-clamp-3 leading-relaxed">
                          {p.bio || <span className="text-gray-400 italic">Sin biografía</span>}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          p.calificacion_ia === 'HOT' ? 'bg-red-100 text-red-600 border border-red-200' :
                          p.calificacion_ia === 'WARM' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                          'bg-blue-100 text-blue-600 border border-blue-200'
                        }`}>
                          {p.calificacion_ia}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={p.estado_cm} 
                          onChange={(e) => updateEstado(p.id, e.target.value as any)}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 focus:border-[var(--color-waldorf-moss)] outline-none"
                        >
                          <option value="Pendiente">⏳ Pendiente</option>
                          <option value="Interacción Inicial">👍 Interacción Inicial</option>
                          <option value="Comentado">💬 Comentado</option>
                          <option value="Convertido">✅ Convertido a Lead</option>
                          <option value="Descartado">❌ Descartado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <a href={`https://instagram.com/${p.ig_username}`} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-md transition-colors" title="Dar Like">
                            <Heart className="w-4 h-4" />
                          </a>
                          <a href={`https://instagram.com/${p.ig_username}`} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-500 rounded-md transition-colors" title="Comentar">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button onClick={() => updateEstado(p.id, 'Convertido')} className="p-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-500 hover:text-emerald-500 rounded-md transition-colors ml-2" title="Marcar como Convertido">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
