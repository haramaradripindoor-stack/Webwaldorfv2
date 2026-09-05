'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import * as XLSX from 'xlsx';
import { Clock, CheckCircle, MessageSquare, Flame, Trash2, Calendar, User, GripVertical, Download, XCircle, Archive, Edit3 , Search, Table, Columns} from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  rectIntersection,
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
  arquetipo?: string;
  requiere_evaluacion_arancel?: boolean;
  created_at: string;
};

const columns = [
  { id: 'nuevo', title: 'Nuevos Interesados', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'entrevista', title: 'Encuentro de Bienvenida (Mes 1)', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'evaluacion', title: 'Práctica Viva (Mes 2)', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'matriculado', title: 'Matriculados', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'no_corresponde', title: 'Descarta (No Corresponde)', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'no_continua', title: 'Retargeting (No Continúa)', icon: Archive, color: 'text-slate-600', bg: 'bg-slate-100' },
];

function LeadCard({ lead, onDelete, onUpdateNote, onUpdateCurso, onMove, isSelected, onToggleSelect }: { lead: LeadAdmision; onDelete?: (id: string) => void; onUpdateNote?: (lead: LeadAdmision) => void; onUpdateCurso?: (lead: LeadAdmision) => void; onMove?: (id: string, status: string) => void; isSelected?: boolean; onToggleSelect?: (id: string, e: any) => void; }) {
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
      className={`p-3 rounded-xl border mb-3 shadow-sm hover:shadow-md transition-all text-left cursor-grab active:cursor-grabbing touch-none relative group flex flex-col ${isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-[var(--color-waldorf-sage)]/20'}`}
    >
      {onToggleSelect && (
        <div 
          className="absolute top-2 right-8 z-10 cursor-pointer p-1" 
          onPointerDown={(e) => { e.stopPropagation(); onToggleSelect(lead.id, e); }}
        >
          <input 
            type="checkbox" 
            checked={isSelected} 
            readOnly
            className="w-4 h-4 cursor-pointer accent-[var(--color-waldorf-moss)] pointer-events-none"
          />
        </div>
      )}
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

      
      {/* Selector de Arquetipo */}
      <div className="mb-2">
        <select
          value={lead.arquetipo || 'no_evaluado'}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            if (onUpdateArquetipo) onUpdateArquetipo(lead.id, e.target.value);
          }}
          className={`w-full text-[10px] p-1 rounded border outline-none font-bold cursor-pointer appearance-none ${
            lead.arquetipo === 'refugiado_sistema' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            lead.arquetipo === 'purista_antroposofico' ? 'bg-green-50 text-green-700 border-green-200' :
            lead.arquetipo === 'interes_estetico' ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          <option value="no_evaluado">⚪ No Evaluado</option>
          <option value="refugiado_sistema">🌲 Refugiado del Sistema (Foco: Alivio)</option>
          <option value="purista_antroposofico">🕯️ Afinidad Antroposófica (Foco: Comunidad)</option>
          <option value="interes_estetico">🎨 Afinidad Visual / Estética (Foco: Expectativas)</option>
        </select>
      </div>

      {/* Checkbox Arancelario Neutral */}
      <div className="mb-2 flex items-center gap-2">
        <input
          type="checkbox"
          id={`arancel-${lead.id}`}
          checked={!!lead.requiere_evaluacion_arancel}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={async (e) => {
            e.stopPropagation();
            if (onUpdateArancel) onUpdateArancel(lead.id, e.target.checked);
          }}
          className="w-3 h-3 accent-[var(--color-waldorf-moss)] cursor-pointer"
        />
        <label htmlFor={`arancel-${lead.id}`} className="text-[10px] text-gray-500 font-medium cursor-pointer" onPointerDown={(e) => e.stopPropagation()}>
          Requiere evaluación de arancel
        </label>
      </div>


      <div className="mb-2 bg-[var(--color-waldorf-cream)] p-2 rounded-lg border border-[var(--color-waldorf-sage)]/10">
        <p className="text-[11px] text-[var(--color-waldorf-text)] font-semibold truncate">Niño/a: {lead.nombre_nino || 'No indicado'}</p>
        <div className="text-[10px] text-[var(--color-waldorf-text-light)] mt-0.5 flex flex-wrap items-center gap-1">
          <span>Edad: {lead.edad_nino || 'N/A'} •</span>
          <span 
            className="font-medium text-[var(--color-waldorf-moss)] bg-white px-1.5 py-0.5 rounded border border-[var(--color-waldorf-sage)]/20 cursor-pointer hover:bg-gray-50 flex items-center gap-1 max-w-[140px] truncate"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if(onUpdateCurso) onUpdateCurso(lead); }}
            title="Editar Curso"
          >
            <span className="truncate">{lead.curso_postula || 'N/A'}</span> <Edit3 className="w-2.5 h-2.5 opacity-50 shrink-0" />
          </span>
        </div>
      </div>

      {lead.notas && (
        <div className="mb-2 p-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-[10px] text-yellow-800 italic leading-tight line-clamp-2">{lead.notas}</p>
        </div>
      )}

      {lead.origen && (
        <div className="mb-2">
          <span className="inline-flex items-center text-[9px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
            {lead.origen}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-[var(--color-waldorf-sage)]/10">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-[var(--color-waldorf-terracotta)] font-medium" title={lead.created_at}>
            📅 {mounted ? new Date(lead.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }) : ''}
          </span>
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

        {onMove && (
          <div className="relative z-10 mt-1">
            <select
              value=""
              onPointerDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                if (e.target.value) onMove(lead.id, e.target.value);
              }}
              className="w-full text-[10px] p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer font-medium"
            >
              <option value="" disabled>Mover a columna...</option>
              {columns.filter(c => c.id !== lead.estado).map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function Column({ col, leads, onDelete, onUpdateNote, onUpdateCurso, onMove, loading, selectedLeadIds, onToggleSelect }: { col: any; leads: LeadAdmision[]; onDelete: (id: string) => void; onUpdateNote: (lead: LeadAdmision) => void; onUpdateCurso: (lead: LeadAdmision) => void; onMove: (id: string, status: string) => void; loading: boolean; selectedLeadIds?: string[]; onToggleSelect?: (id: string, e: any) => void; }) {
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
            <LeadCard key={lead.id} lead={lead} onDelete={onDelete} onUpdateNote={onUpdateNote} onUpdateCurso={onUpdateCurso} onMove={onMove} isSelected={selectedLeadIds?.includes(lead.id)} onToggleSelect={onToggleSelect} onUpdateArquetipo={onUpdateArquetipo} onUpdateArancel={onUpdateArancel} />
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
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  
  const [filtroCurso, setFiltroCurso] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban'|'table'>('kanban');
  const cursosUnicos = Array.from(new Set(leads.map(l => {
    if (!l.curso_postula) return 'Sin Especificar';
    if (l.curso_postula.length > 35) return 'Requiere Revisión (Texto Largo)';
    const c = l.curso_postula.toLowerCase();
    if (c.includes('kinde')) return 'Kinder (2027)';
    if (c.includes('1ro') || c.includes('1ero') || c.includes('primero') || c.includes('1 b') || c.includes('1 medio')) return '1ro Básico (2027)';
    if (c.includes('2do') || c.includes('segundo') || c.includes('2 b') || c.match(/2[^a-z]*b/)) return '2do Básico (2027)';
    if (c.includes('3ro') || c.includes('tercero') || c.includes('3 b') || c.match(/3[^a-z]*b/)) return '3ro Básico (2027)';
    if (c.includes('4to') || c.includes('cuarto') || c.includes('4 b') || c.match(/4[^a-z]*b/)) return '4to Básico (2027)';
    if (c.includes('5to') || c.includes('quinto') || c.includes('5 b') || c.match(/5[^a-z]*b/)) return '5to Básico (2027)';
    if (c.includes('6to') || c.includes('sexto') || c.includes('6 b') || c.match(/6[^a-z]*b/)) return '6to Básico (2027)';
    if (c.includes('7mo') || c.includes('septimo') || c.includes('séptimo') || c.match(/7[^a-z]*b/)) return '7mo Básico (2027)';
    if (c.includes('8vo') || c.includes('octavo') || c.match(/8[^a-z]*b/)) return '8vo Básico (2027)';
    if (c.includes('medio') || c.includes('14 años') || c.includes('13 años')) return 'Ed. Media / Fuera de Rango';
    return l.curso_postula.split(' | ')[0].trim(); // Fallback to clean raw
  }).filter(Boolean))).sort();

  const [filtroOrigen, setFiltroOrigen] = useState<string>('');
  const origenesUnicos = Array.from(new Set(leads.map(l => l.origen || 'Sin Origen').filter(Boolean))).sort();

  const filteredLeads = leads.filter(l => {
    const cleanCurso = (curso: string) => {
      if (!curso) return 'Sin Especificar';
      if (curso.length > 35) return 'Requiere Revisión (Texto Largo)';
      const c = curso.toLowerCase();
      if (c.includes('kinde')) return 'Kinder (2027)';
      if (c.includes('1ro') || c.includes('1ero') || c.includes('primero') || c.includes('1 b') || c.includes('1 medio')) return '1ro Básico (2027)';
      if (c.includes('2do') || c.includes('segundo') || c.includes('2 b') || c.match(/2[^a-z]*b/)) return '2do Básico (2027)';
      if (c.includes('3ro') || c.includes('tercero') || c.includes('3 b') || c.match(/3[^a-z]*b/)) return '3ro Básico (2027)';
      if (c.includes('4to') || c.includes('cuarto') || c.includes('4 b') || c.match(/4[^a-z]*b/)) return '4to Básico (2027)';
      if (c.includes('5to') || c.includes('quinto') || c.includes('5 b') || c.match(/5[^a-z]*b/)) return '5to Básico (2027)';
      if (c.includes('6to') || c.includes('sexto') || c.includes('6 b') || c.match(/6[^a-z]*b/)) return '6to Básico (2027)';
      if (c.includes('7mo') || c.includes('septimo') || c.includes('séptimo') || c.match(/7[^a-z]*b/)) return '7mo Básico (2027)';
      if (c.includes('8vo') || c.includes('octavo') || c.match(/8[^a-z]*b/)) return '8vo Básico (2027)';
      if (c.includes('medio') || c.includes('14 años') || c.includes('13 años')) return 'Ed. Media / Fuera de Rango';
      return curso.split(' | ')[0].trim();
    };
    
    if (filtroCurso && cleanCurso(l.curso_postula) !== filtroCurso) return false;
    
    const leadOrigen = l.origen || 'Sin Origen';
        if (filtroOrigen && leadOrigen !== filtroOrigen) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nApoderado = (l.apoderado_nombre || '').toLowerCase();
      const nNino = (l.nino_nombre || '').toLowerCase();
      if (!nApoderado.includes(q) && !nNino.includes(q)) return false;
    }

    return true;
  });

  // Cálculo de Demanda Activa (Omitiendo descartados)
  const activeLeads = leads.filter(l => l.estado !== 'no_corresponde' && l.estado !== 'no_continua');
  
  const normalizeCourse = (cursoRaw: string) => {
    if (!cursoRaw) return 'Sin Especificar';
    if (cursoRaw.length > 35) return 'Requiere Revisión (Texto Largo)';
    
    const c = cursoRaw.toLowerCase();
    
    if (c.includes('kinde')) return 'Kinder (2027)';
    if (c.includes('1ro') || c.includes('1ero') || c.includes('primero') || c.includes('1 b')) return '1ro Básico (2027)';
    if (c.includes('2do') || c.includes('segundo') || c.includes('2 b') || c.match(/2[^a-z]*b/)) return '2do Básico (2027)';
    if (c.includes('3ro') || c.includes('tercero') || c.includes('3 b') || c.match(/3[^a-z]*b/)) return '3ro Básico (2027)';
    if (c.includes('4to') || c.includes('cuarto') || c.includes('4 b') || c.match(/4[^a-z]*b/)) return '4to Básico (2027)';
    if (c.includes('5to') || c.includes('quinto') || c.includes('5 b') || c.match(/5[^a-z]*b/)) return '5to Básico (2027)';
    if (c.includes('6to') || c.includes('sexto') || c.includes('6 b') || c.match(/6[^a-z]*b/)) return '6to Básico (2027)';
    if (c.includes('7mo') || c.includes('septimo') || c.includes('séptimo') || c.match(/7[^a-z]*b/)) return '7mo Básico (2027)';
    if (c.includes('8vo') || c.includes('octavo') || c.match(/8[^a-z]*b/)) return '8vo Básico (2027)';
    if (c.includes('medio') || c.includes('14 años') || c.includes('13 años')) return 'Ed. Media / Fuera de Rango';
    
    return 'Otros / Requiere Revisión';
  };

  const demandByCourse = activeLeads.reduce((acc, lead) => {
    const cursoNorm = normalizeCourse(lead.curso_postula || '');
    acc[cursoNorm] = (acc[cursoNorm] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // Ordenar por cantidad (mayor demanda primero)
  const demandEntries = Object.entries(demandByCourse).sort((a, b) => b[1] - a[1]);

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
    
    XLSX.writeFile(workbook, `Trekan_Admisiones_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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
      setLeads(current => current.map(l => l.id === lead.id ? { ...l, notas: newNote } : l));
      const { error } = await supabase.from('leads_admision').update({ notas: newNote }).eq('id', lead.id);
      if (error) {
        alert('Error al guardar la nota. Error: ' + error.message);
        fetchLeads();
      }
    }
  };

  
  const handleUpdateArquetipo = async (id: string, nuevoArquetipo: string) => {
    try {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, arquetipo: nuevoArquetipo } : l));
      const { error } = await supabase.from('leads_admision').update({ arquetipo: nuevoArquetipo }).eq('id', id);
      if (error) {
        console.error('Error al actualizar arquetipo:', error);
        alert('Error al actualizar el arquetipo en la base de datos.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleUpdateArancel = async (id: string, req: boolean) => {
    try {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, requiere_evaluacion_arancel: req } : l));
      const { error } = await supabase.from('leads_admision').update({ requiere_evaluacion_arancel: req }).eq('id', id);
      if (error) {
        console.error('Error al actualizar arancel:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCurso = async (lead: LeadAdmision) => {
    const newCurso = prompt('Actualizar Curso de Postulación (Ej: 3ro Básico (2027)):', lead.curso_postula || '');
    if (newCurso !== null && newCurso.trim() !== '') {
      setLeads(current => current.map(l => l.id === lead.id ? { ...l, curso_postula: newCurso.trim() } : l));
      const { error } = await supabase.from('leads_admision').update({ curso_postula: newCurso.trim() }).eq('id', lead.id);
      if (error) {
        alert('Error al guardar el curso. Error: ' + error.message);
        fetchLeads();
      }
    }
  };

  const handleManualMove = async (id: string, targetEstado: string) => {
    setLeads(currentLeads => 
      currentLeads.map(l => l.id === id ? { ...l, estado: targetEstado as any } : l)
    );
    const { error } = await supabase.from('leads_admision').update({ estado: targetEstado }).eq('id', id);
    if (error) {
      alert('Error moviendo prospecto: ' + error.message);
      fetchLeads();
    }
  };

  const handleBulkMove = async (ids: string[], targetEstado: string) => {
    setLeads(currentLeads => 
      currentLeads.map(l => ids.includes(l.id) ? { ...l, estado: targetEstado as any } : l)
    );
    const { error } = await supabase.from('leads_admision').update({ estado: targetEstado }).in('id', ids);
    if (error) {
      alert('Error moviendo prospectos en masa: ' + error.message);
      fetchLeads();
    }
    setSelectedLeadIds([]);
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
      // If dragging an item that is part of the multiple selection
      if (selectedLeadIds.includes(activeId) && selectedLeadIds.length > 1) {
        handleBulkMove(selectedLeadIds, targetEstado);
      } else {
        handleManualMove(activeId, targetEstado);
        setSelectedLeadIds([]); // Clear selection if dragged a single unrelated item
      }
    }
  };

  const toggleSelection = (id: string, e: any) => {
    if (e.shiftKey && selectedLeadIds.length > 0) {
      // Shift-click logic (basic implementation)
      const lastSelected = selectedLeadIds[selectedLeadIds.length - 1];
      const startIndex = filteredLeads.findIndex(l => l.id === lastSelected);
      const endIndex = filteredLeads.findIndex(l => l.id === id);
      if (startIndex !== -1 && endIndex !== -1) {
        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);
        const rangeIds = filteredLeads.slice(min, max + 1).map(l => l.id);
        const newSelection = new Set([...selectedLeadIds, ...rangeIds]);
        setSelectedLeadIds(Array.from(newSelection));
        return;
      }
    }
    
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedLeadIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-[var(--color-waldorf-sage)]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-[var(--color-waldorf-moss)]">
            CRM Admisiones 2027
          </h1>
          <p className="text-[var(--color-waldorf-text-light)] mt-1 font-medium">Proceso de Admisión Escolar 2027 · Gestión de familias interesadas.</p>
        </div>

        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-[#6a8d73] hover:bg-[#4a6b52] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Exportar a Excel
        </button>
      </div>

      {/* Resumen Ejecutivo de Demanda — Dashboard */}
      <div className="mb-6 bg-white border border-[var(--color-waldorf-sage)]/20 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--color-waldorf-sage)]/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-waldorf-moss)]">📊 Demanda Activa 2027</h3>
            <p className="text-[11px] text-[var(--color-waldorf-text-light)] mt-0.5">Familias interesadas por curso · Excluye descartados y fuera de rango</p>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-2xl font-extrabold text-[var(--color-waldorf-moss)]">{activeLeads.length}</p>
              <p className="text-[10px] text-[var(--color-waldorf-text-light)] font-medium">Total activos</p>
            </div>
            <div className="border-l border-[var(--color-waldorf-sage)]/20 pl-4">
              <p className="text-2xl font-extrabold text-[#6a8d73]">
                {demandEntries.filter(([c]) => !c.startsWith('Histórico') && !c.startsWith('Requiere') && !c.startsWith('Otros') && !c.startsWith('Ed.') && c !== 'Consultas' && c !== 'Sin Especificar').reduce((s, [,n]) => s + n, 0)}
              </p>
              <p className="text-[10px] text-[var(--color-waldorf-text-light)] font-medium">Proyectados 2027</p>
            </div>
          </div>
        </div>

        {/* Grid de cursos 2027 */}
        <div className="p-5">
          <p className="text-[10px] font-bold text-[var(--color-waldorf-moss)] uppercase tracking-widest mb-3">Cursos 2027</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {demandEntries
              .filter(([c]) => !c.startsWith('Histórico') && !c.startsWith('Requiere') && !c.startsWith('Otros') && !c.startsWith('Ed.') && c !== 'Consultas' && c !== 'Sin Especificar')
              .map(([curso, count]) => {
                const maxCount = Math.max(...demandEntries.map(([,n]) => n), 1);
                const pct = Math.round((count / maxCount) * 100);
                const isMultigrado = curso.includes('1ro') || curso.includes('2do') || curso.includes('3ro');
                return (
                  <div key={curso} className={`p-3 rounded-xl border-2 ${isMultigrado ? 'border-[#6a8d73] bg-[#6a8d73]/5' : 'border-[var(--color-waldorf-sage)]/20 bg-[var(--color-waldorf-cream)]'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[11px] font-bold text-[var(--color-waldorf-moss)] leading-tight">{curso}</p>
                      {isMultigrado && <span className="text-[9px] font-bold text-white bg-[#6a8d73] px-1.5 py-0.5 rounded-full ml-1 shrink-0">Multigrado</span>}
                    </div>
                    <p className="text-3xl font-extrabold text-[var(--color-waldorf-moss)]">{count}</p>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6a8d73] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[9px] text-[var(--color-waldorf-text-light)] mt-1">{count >= 5 ? '✅ Quórum mínimo' : `⏳ Faltan ${5 - count} para quórum`}</p>
                  </div>
                );
              })}
          </div>

          {/* Registros históricos / por revisar — colapsados */}
          {demandEntries.some(([c]) => c.startsWith('Histórico') || c.startsWith('Requiere') || c.startsWith('Otros') || c.startsWith('Ed.') || c === 'Consultas') && (
            <details className="border border-orange-200 bg-orange-50 rounded-xl p-3">
              <summary className="text-[11px] font-bold text-orange-700 cursor-pointer select-none">
                ⚠️ Registros que requieren revisión manual — haz clic para ver
              </summary>
              <div className="flex flex-wrap gap-2 mt-3">
                {demandEntries
                  .filter(([c]) => c.startsWith('Histórico') || c.startsWith('Requiere') || c.startsWith('Otros') || c.startsWith('Ed.') || c === 'Consultas')
                  .map(([curso, count]) => (
                    <div key={curso} className="flex items-center gap-2 bg-white border border-orange-200 px-2.5 py-1.5 rounded-lg">
                      <span className="text-[11px] font-medium text-gray-600">{curso}</span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
              </div>
              <p className="text-[10px] text-orange-600 mt-2 italic">Usa el lápiz ✏️ en cada tarjeta para corregir el curso y moverlos al conteo oficial.</p>
            </details>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl border border-[var(--color-waldorf-sage)]/20 shadow-sm flex-wrap">

        {/* Buscador Rápido */}
        <div className="flex flex-col gap-1 w-full md:w-64">
          <label className="text-xs font-bold text-[var(--color-waldorf-moss)] flex items-center gap-2">
            <Search className="w-3 h-3" /> Buscar
          </label>
          <input 
            type="text"
            placeholder="Nombre de alumno o apoderado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[var(--color-waldorf-sage)] transition-colors"
          />
        </div>
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
          <label className="text-xs font-bold text-[var(--color-waldorf-moss)]">Segmentar por Origen:</label>
          <select 
            value={filtroOrigen}
            onChange={(e) => setFiltroOrigen(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[var(--color-waldorf-sage)] transition-colors"
          >
            <option value="">Todos los orígenes</option>
            {origenesUnicos.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedLeadIds.length > 0 && (
        <div className="mb-6 bg-[var(--color-waldorf-moss)] text-white p-4 rounded-xl flex items-center justify-between shadow-lg sticky top-4 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full font-bold text-sm">
              {selectedLeadIds.length} seleccionados
            </span>
            <span className="text-sm font-medium">¿Mover familias seleccionadas?</span>
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm outline-none"
              onChange={(e) => {
                if(e.target.value) {
                  handleBulkMove(selectedLeadIds, e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="" className="text-black">Seleccionar destino...</option>
              {columns.map(c => (
                <option key={c.id} value={c.id} className="text-black">{c.title}</option>
              ))}
            </select>
            <button 
              onClick={() => setSelectedLeadIds([])}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board DND Context */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        
      {viewMode === 'kanban' ? (
        <>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {columns.map((col) => {
              const colLeads = filteredLeads.filter(l => l.estado === col.id);
              return <Column key={col.id} col={col} leads={colLeads} onDelete={handleDelete} onUpdateNote={handleUpdateNote} onUpdateCurso={handleUpdateCurso} onMove={handleManualMove} loading={loading} selectedLeadIds={selectedLeadIds} onToggleSelect={toggleSelection} onUpdateArquetipo={handleUpdateArquetipo} onUpdateArancel={handleUpdateArancel} />;
            })}
          </div>

          {/* Floating Overlay al arrastrar */}
          <DragOverlay>
            {activeLead ? (
              <LeadCard lead={activeLead} />
            ) : null}
          </DragOverlay>
        </>
      ) : (
        <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">Vista de tabla (Lista) en construcción...</div>
      )}
      </DndContext>
    </div>
  );
}
