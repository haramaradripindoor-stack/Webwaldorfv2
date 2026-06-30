'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, CheckCircle, MessageSquare, Flame, Thermometer, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Lead = {
  id: string;
  nombre: string;
  servicio: string;
  clasificacion: 'HOT' | 'WARM' | 'COLD';
  estado: 'nuevo' | 'contactado' | 'pagado' | 'perdido';
  canal: 'web' | 'whatsapp';
  ultimo_mensaje: string;
  requiere_humano: boolean;
  created_at: string;
};

const columns = [
  { id: 'nuevo', title: 'Ingreso de IA', icon: Clock, color: 'cyan' },
  { id: 'contactado', title: 'En Conversación', icon: MessageSquare, color: 'yellow' },
  { id: 'pagado', title: 'Pagos Verificados', icon: CheckCircle, color: 'emerald' },
];

function LeadCard({ lead, onMove, onDelete }: { lead: Lead; onMove: (id: string, estado: string) => void; onDelete: (id: string) => void }) {
  const classColors = {
    HOT: { bg: 'bg-red-500/20', text: 'text-red-400', icon: Flame },
    WARM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Thermometer },
    COLD: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
  };

  const style = classColors[lead.clasificacion] || classColors.COLD;
  const ClassIcon = style.icon;
  const timeAgo = getTimeAgo(lead.created_at);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-surface p-4 rounded-xl border border-hairline mb-3 shadow-lg hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-white font-bold text-sm">{lead.nombre}</h4>
          <p className="text-xs text-gray-400">{lead.servicio === 'none' ? 'Sin especificar' : lead.servicio}</p>
        </div>
        <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold ${style.bg} ${style.text}`}>
          <ClassIcon className="w-3 h-3" />
          {lead.clasificacion}
        </span>
      </div>

      {lead.ultimo_mensaje && (
        <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">&quot;{lead.ultimo_mensaje}&quot;</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-600">{timeAgo} · {lead.canal}</span>
        <div className="flex gap-1">
          {lead.estado === 'nuevo' && (
            <button
              onClick={() => onMove(lead.id, 'contactado')}
              className="text-[10px] px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors cursor-pointer"
            >
              Contactado
            </button>
          )}
          {lead.estado === 'contactado' && (
            <button
              onClick={() => onMove(lead.id, 'pagado')}
              className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              Pagó ✓
            </button>
          )}
          <button
            onClick={() => onDelete(lead.id)}
            className="text-[10px] px-1.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
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

export default function KanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('chat_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    // Real-time: escuchar inserciones nuevas
    const channel = supabase
      .channel('kanban-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMove = async (id: string, newEstado: string) => {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado: newEstado })
    });
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mb-8 border-b border-hairline pb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          CRM Kanban
        </h1>
        <p className="text-gray-400 mt-1">Leads clasificados automáticamente por la Inteligencia Artificial.</p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {columns.map((col) => {
          const Icon = col.icon;
          const count = leads.filter(l => l.estado === col.id).length;
          return (
            <div key={col.id} className="bg-surface rounded-xl border border-hairline-soft p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${col.color}-500/10 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${col.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{count}</p>
                <p className="text-xs text-gray-500">{col.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Columnas del Kanban */}
      <div className="grid grid-cols-3 gap-6">
        {columns.map((col) => {
          const Icon = col.icon;
          const colLeads = leads.filter(l => l.estado === col.id);

          return (
            <div key={col.id} className="bg-[#0C0C14] rounded-2xl border border-hairline-soft p-4 min-h-[400px]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline-soft">
                <Icon className={`w-4 h-4 text-${col.color}-400`} />
                <h2 className="text-sm font-bold text-white">{col.title}</h2>
                <span className="ml-auto text-xs text-gray-600 bg-foreground/5 px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>

              <AnimatePresence>
                {colLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onMove={handleMove} onDelete={handleDelete} />
                ))}
              </AnimatePresence>

              {colLeads.length === 0 && !loading && (
                <p className="text-xs text-gray-600 text-center py-8">Sin leads en esta columna</p>
              )}

              {loading && (
                <div className="flex justify-center py-8">
                  <span className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
