'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Clock, CheckCircle, MessageSquare, Flame, Trash2, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient();

type LeadAdmision = {
  id: string;
  nombre_apoderado: string;
  email_apoderado: string;
  telefono_apoderado: string;
  nombre_nino: string;
  edad_nino: string;
  curso_postula: string;
  estado: 'nuevo' | 'entrevista' | 'evaluacion' | 'matriculado' | 'rechazado';
  origen: string;
  created_at: string;
};

const columns = [
  { id: 'nuevo', title: 'Nuevos Interesados', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'entrevista', title: 'Entrevista Agendada', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'evaluacion', title: 'En Evaluación', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'matriculado', title: 'Matriculados', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

function LeadCard({ lead, onMove, onDelete }: { lead: LeadAdmision; onMove: (id: string, estado: string) => void; onDelete: (id: string) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const timeAgo = mounted ? getTimeAgo(lead.created_at) : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white p-4 rounded-xl border border-[var(--color-waldorf-sage)]/20 mb-3 shadow-sm hover:shadow-md transition-all text-left"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-[var(--color-waldorf-moss)] font-bold text-sm flex items-center gap-1">
            <User className="w-3 h-3" />
            {lead.nombre_apoderado || 'Sin nombre'}
          </h4>
          <p className="text-xs text-[var(--color-waldorf-text-light)] truncate max-w-[150px]">{lead.email_apoderado}</p>
        </div>
      </div>

      <div className="mb-3 bg-[var(--color-waldorf-cream)] p-2 rounded-lg border border-[var(--color-waldorf-sage)]/10">
        <p className="text-xs text-[var(--color-waldorf-text)] font-semibold">Postulante: {lead.nombre_nino || 'No indicado'}</p>
        <p className="text-[10px] text-[var(--color-waldorf-text-light)] mt-0.5">Edad: {lead.edad_nino || 'N/A'} • Curso: {lead.curso_postula || 'N/A'}</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-[var(--color-waldorf-terracotta)] font-medium">{timeAgo} · {lead.origen || 'Web'}</span>
        <div className="flex gap-1 flex-wrap justify-end">
          {lead.estado === 'nuevo' && (
            <button onClick={() => onMove(lead.id, 'entrevista')} className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium">
              Agendar
            </button>
          )}
          {lead.estado === 'entrevista' && (
            <button onClick={() => onMove(lead.id, 'evaluacion')} className="text-[10px] px-2 py-1 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors font-medium">
              A Evaluar
            </button>
          )}
          {lead.estado === 'evaluacion' && (
            <button onClick={() => onMove(lead.id, 'matriculado')} className="text-[10px] px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors font-medium">
              Matricular
            </button>
          )}
          <button onClick={() => onDelete(lead.id)} className="text-[10px] px-1.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays}d`;
}

export default function AdmisionesPage() {
  const [leads, setLeads] = useState<LeadAdmision[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads_admision')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data as LeadAdmision[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('admisiones-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_admision' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMove = async (id: string, newEstado: string) => {
    const { error } = await supabase.from('leads_admision').update({ estado: newEstado }).eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este prospecto?')) return;
    const { error } = await supabase.from('leads_admision').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchLeads();
  };

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-[var(--color-waldorf-sage)]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-[var(--color-waldorf-moss)]">
            CRM Admisiones 2026
          </h1>
          <p className="text-[var(--color-waldorf-text-light)] mt-1 font-medium">Gestión de familias interesadas y proceso de postulación.</p>
        </div>
      </div>

      {/* Columnas del Kanban */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {columns.map((col) => {
          const Icon = col.icon;
          const colLeads = leads.filter(l => l.estado === col.id);

          return (
            <div key={col.id} className="min-w-[320px] max-w-[320px] bg-[var(--color-waldorf-paper)] rounded-2xl border border-[var(--color-waldorf-sage)]/20 p-4 min-h-[500px] snap-start shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-waldorf-sage)]/20">
                <div className={`p-1.5 rounded-lg ${col.bg}`}>
                  <Icon className={`w-4 h-4 ${col.color}`} />
                </div>
                <h2 className="text-sm font-bold text-[var(--color-waldorf-moss)]">{col.title}</h2>
                <span className="ml-auto text-xs font-bold text-white bg-[var(--color-waldorf-terracotta)] px-2.5 py-0.5 rounded-full shadow-sm">{colLeads.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence>
                  {colLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onMove={handleMove} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>

                {colLeads.length === 0 && !loading && (
                  <p className="text-sm text-[var(--color-waldorf-text-light)] text-center py-8 font-medium border-2 border-dashed border-[var(--color-waldorf-sage)]/20 rounded-xl mt-4">Soltamos y confiamos. Llegarán nuevas familias. 🌱</p>
                )}

                {loading && (
                  <div className="flex justify-center py-8">
                    <span className="w-6 h-6 border-2 border-[var(--color-waldorf-terracotta)]/30 border-t-[var(--color-waldorf-terracotta)] rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
