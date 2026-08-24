'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import * as XLSX from 'xlsx';
import { Clock, CheckCircle, MessageSquare, Flame, Trash2, Calendar, User, GripVertical, Download, XCircle, Archive, Edit3 } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const supabase = createClient();

type LeadAdmision = {
  id: string;
  nombre_apoderado: string;
  email_apoderado: string;
  telefono_apoderado: string;
  nombre_nino: string;
  edad_nino: string;
  curso_postula: string;
  estado: 'nuevo' | 'entrevista' | 'evaluacion' | 'matriculado' | 'no_corresponde' | 'no_continua';
  origen: string;
  notas?: string;
  created_at: string;
};

const columns = [
  { id: 'nuevo', title: 'Nuevos Interesados', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'entrevista', title: 'Entrevista Agendada', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'evaluacion', title: 'En Evaluación', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'matriculado', title: 'Matriculados', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'no_corresponde', title: 'Descarta (No Corresponde)', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'no_continua', title: 'Retargeting (No Continúa)', icon: Archive, color: 'text-slate-600', bg: 'bg-slate-100' },
];

function LeadCard({ lead, onDelete, onUpdateNote }: { lead: LeadAdmision; onDelete?: (id: string) => void; onUpdateNote?: (lead: LeadAdmision) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { type: 'Lead', lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const timeAgo = mounted ? getTimeAgo(lead.created_at) : '';

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-50 bg-white p-4 rounded-xl border-2 border-dashed border-[var(--color-waldorf-terracotta)] mb-3 min-h-[140px]" />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-xl border border-[var(--color-waldorf-sage)]/20 mb-3 shadow-sm hover:shadow-md transition-all text-left cursor-grab active:cursor-grabbing touch-none relative group"
    >
      <div className="absolute top-3 right-2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={16} />
      </div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-[var(--color-waldorf-moss)] font-bold text-xs flex items-center gap-1 pr-5">
            <User className="w-3 h-3 text-[var(--color-waldorf-terracotta)]" />
            <span className="truncate max-w-[130px]">{lead.nombre_apoderado || 'Sin nombre'}</span>
          </h4>
          <p className="text-[11px] text-[var(--color-waldorf-text-light)] truncate max-w-[150px] mt-0.5">{lead.email_apoderado}</p>
          {lead.telefono_apoderado && (
            <p className="text-[11px] text-[var(--color-waldorf-moss)] font-medium truncate max-w-[150px] flex items-center gap-1 mt-0.5">
              <span className="w-3 h-3 flex items-center justify-center">📱</span>
              {lead.telefono_apoderado}
            </p>
          )}
        </div>
      </div>

      <div className="mb-2 bg-[var(--color-waldorf-cream)] p-2 rounded-lg border border-[var(--color-waldorf-sage)]/10">
        <p className="text-[11px] text-[var(--color-waldorf-text)] font-semibold truncate">Niño/a: {lead.nombre_nino || 'No indicado'}</p>
        <p className="text-[10px] text-[var(--color-waldorf-text-light)] mt-0.5">Edad: {lead.edad_nino || 'N/A'} • {lead.curso_postula || 'N/A'}</p>
      </div>

      {lead.notas && (
        <div className="mb-2 p-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-[10px] text-yellow-800 italic leading-tight line-clamp-2">{lead.notas}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-[var(--color-waldorf-terracotta)] font-medium">{timeAgo}</span>
        <div className="flex gap-1 flex-wrap justify-end relative z-10">
          {onUpdateNote && (
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); onUpdateNote(lead); }} 
              className="text-[10px] p-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Agregar Observación"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} 
              className="text-[10px] p-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="Eliminar Postulación"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({ col, leads, onDelete, onUpdateNote, loading }: { col: any; leads: LeadAdmision[]; onDelete: (id: string) => void; onUpdateNote: (lead: LeadAdmision) => void; loading: boolean }) {
  const { setNodeRef } = useDroppable({
    id: col.id,
    data: { type: 'Column', col }
  });
  
  const Icon = col.icon;
  
  return (
    <div ref={setNodeRef} className="min-w-[240px] w-[240px] max-w-[240px] bg-[var(--color-waldorf-paper)] rounded-xl border border-[var(--color-waldorf-sage)]/20 p-3 min-h-[500px] snap-start shadow-sm flex flex-col shrink-0">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-waldorf-sage)]/20">
        <div className={`p-1.5 rounded-lg ${col.bg}`}>
          <Icon className={`w-4 h-4 ${col.color}`} />
        </div>
        <h2 className="text-xs font-bold text-[var(--color-waldorf-moss)] leading-tight flex-1">{col.title}</h2>
        <span className="text-[10px] font-bold text-white bg-[var(--color-waldorf-terracotta)] px-2 py-0.5 rounded-full shadow-sm">{leads.length}</span>
      </div>

      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[150px] pb-20 flex flex-col">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onDelete={onDelete} onUpdateNote={onUpdateNote} />
          ))}

          {leads.length === 0 && !loading && (
            <div className="text-sm text-[var(--color-waldorf-text-light)] text-center py-8 font-medium border-2 border-dashed border-[var(--color-waldorf-sage)]/20 rounded-xl mt-4 pointer-events-none">
              Arrastra familias aquí 🌱
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <span className="w-6 h-6 border-2 border-[var(--color-waldorf-terracotta)]/30 border-t-[var(--color-waldorf-terracotta)] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </SortableContext>
    </div>
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
  const [activeLead, setActiveLead] = useState<LeadAdmision | null>(null);
  
  // Filtros
  const [filtroCurso, setFiltroCurso] = useState<string>('');
  const [filtroAño, setFiltroAño] = useState<string>('');

  const cursosUnicos = Array.from(new Set(leads.map(l => l.curso_postula).filter(Boolean))).sort();
  const añosUnicos = Array.from(new Set(leads.map(l => {
    try { return new Date(l.created_at).getFullYear().toString(); } catch { return ''; }
  }).filter(Boolean))).sort((a, b) => b.localeCompare(a));

  const filteredLeads = leads.filter(l => {
    if (filtroCurso && l.curso_postula !== filtroCurso) return false;
    if (filtroAño && new Date(l.created_at).getFullYear().toString() !== filtroAño) return false;
    return true;
  });

  const exportToExcel = () => {
    if (filteredLeads.length === 0) {
      alert('No hay datos para exportar con estos filtros');
      return;
    }

    const dataRows = filteredLeads.map(lead => ({
      ID: lead.id,
      Fecha: new Date(lead.created_at).toLocaleString('es-CL'),
      Apoderado: lead.nombre_apoderado || '',
      Email: lead.email_apoderado || '',
      Teléfono: lead.telefono_apoderado || '',
      Postulante: lead.nombre_nino || '',
      Edad: lead.edad_nino || '',
      Curso: lead.curso_postula || '',
      Estado: lead.estado,
      Notas: lead.notas || '',
      Origen: lead.origen || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admisiones');
    
    // Generar archivo y forzar descarga
    XLSX.writeFile(workbook, `Trekan_Admisiones_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Permite hacer clics en botones sin iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este prospecto?')) return;
    const { error } = await supabase.from('leads_admision').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchLeads();
  };

  const handleUpdateNote = async (lead: LeadAdmision) => {
    const newNote = prompt('Observación / Motivo (Retargeting o Descarte):', lead.notas || '');
    if (newNote !== null) {
      // Optimistic UI
      setLeads(current => current.map(l => l.id === lead.id ? { ...l, notas: newNote } : l));
      
      const { error } = await supabase.from('leads_admision').update({ notas: newNote }).eq('id', lead.id);
      if (error) {
        alert('Error al guardar la nota, asegúrate de que exista la columna "notas" en Supabase. Error: ' + error.message);
        fetchLeads(); // Rollback
      }
    }
  };

  const onDragStart = (event: any) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const onDragEnd = async (event: any) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Detectar a qué estado se movió
    const isOverColumn = columns.map(c => c.id).includes(overId);
    let targetEstado = '';

    if (isOverColumn) {
      targetEstado = overId;
    } else {
      const overLead = leads.find(l => l.id === overId);
      if (overLead) targetEstado = overLead.estado;
    }

    const activeLead = leads.find(l => l.id === activeId);

    if (activeLead && targetEstado && activeLead.estado !== targetEstado) {
      // 1. Optimistic Update UI
      setLeads(currentLeads => 
        currentLeads.map(l => l.id === activeId ? { ...l, estado: targetEstado as any } : l)
      );
      
      // 2. Real DB Update
      const { error } = await supabase.from('leads_admision').update({ estado: targetEstado }).eq('id', activeId);
      
      if (error) {
        alert('Error moviendo prospecto: ' + error.message);
        fetchLeads(); // Rollback en caso de error
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-[var(--color-waldorf-sage)]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-[var(--color-waldorf-moss)]">
            CRM Admisiones 2026
          </h1>
          <p className="text-[var(--color-waldorf-text-light)] mt-1 font-medium">Gestión de familias interesadas y proceso de postulación.</p>
        </div>

        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-[#6a8d73] hover:bg-[#4a6b52] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Exportar a Excel
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl border border-[var(--color-waldorf-sage)]/20 shadow-sm">
        <div className="flex flex-col gap-1 w-64">
          <label className="text-xs font-bold text-[var(--color-waldorf-moss)]">Segmentar por Curso:</label>
          <select 
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[var(--color-waldorf-sage)] transition-colors"
          >
            <option value="">Todos los cursos</option>
            {cursosUnicos.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-64">
          <label className="text-xs font-bold text-[var(--color-waldorf-moss)]">Segmentar por Año / Etapa:</label>
          <select 
            value={filtroAño}
            onChange={(e) => setFiltroAño(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[var(--color-waldorf-sage)] transition-colors"
          >
            <option value="">Todos los años</option>
            {añosUnicos.map(a => (
              <option key={a} value={a}>Generación {a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board DND Context */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {columns.map((col) => {
            const colLeads = filteredLeads.filter(l => l.estado === col.id);
            return <Column key={col.id} col={col} leads={colLeads} onDelete={handleDelete} onUpdateNote={handleUpdateNote} loading={loading} />;
          })}
        </div>

        {/* Floating Overlay al arrastrar */}
        <DragOverlay>
          {activeLead ? (
            <LeadCard lead={activeLead} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
