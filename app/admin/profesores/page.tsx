'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Mail, MessageSquare, Loader2, Edit3, Save, X } from 'lucide-react';

const supabase = createClient();

const COLUMNS = [
  { id: 'nuevo', title: 'CV Recibido', color: 'bg-blue-100 text-blue-800' },
  { id: 'en_proceso', title: 'En Entrevista', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'finalista', title: 'Prueba Práctica', color: 'bg-purple-100 text-purple-800' },
  { id: 'contratado', title: 'Contratado', color: 'bg-green-100 text-green-800' },
  { id: 'descartado', title: 'Descartado', color: 'bg-gray-100 text-gray-800' }
];

// Componente Sortable Card
function TeacherCard({ teacher, onEditNotes }: { teacher: any, onEditNotes: (t: any) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: teacher.id,
    data: { type: 'Teacher', teacher }
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl mb-3 opacity-50" />;
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm text-[#2C3329] truncate pr-6">{teacher.name}</h4>
      </div>
      
      <p className="text-xs text-gray-500 mb-2 truncate flex items-center gap-1">
        <Mail className="w-3 h-3" /> {teacher.email}
      </p>
      
      <div className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded inline-block mb-3 font-medium">
        {teacher.area === 'maestro_clase' ? 'Maestro de Clase' : 
         teacher.area === 'maestro_jardin' ? 'Maestro de Jardín' : 
         teacher.area === 'maestro_especialidad' ? 'Maestro Especialidad' : 
         teacher.area === 'administracion' ? 'Administración' : teacher.area}
      </div>

      {teacher.notes && (
        <div className="mb-3 p-2 bg-yellow-50/50 rounded border border-yellow-100 text-xs text-yellow-800 italic line-clamp-2">
          {teacher.notes}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        {teacher.cv_url ? (
          <a href={teacher.cv_url} target="_blank" rel="noreferrer" onPointerDown={(e) => e.stopPropagation()} className="text-[11px] font-medium text-blue-600 hover:underline flex items-center gap-1">
            <FileText className="w-3 h-3" /> Ver CV
          </a>
        ) : (
          <span className="text-[11px] text-gray-400">Sin CV</span>
        )}
        
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEditNotes(teacher)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Editar Notas"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ProfesoresCRM() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Modal State
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [notesTemp, setNotesTemp] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    const { data, error } = await supabase
      .from('teacher_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTeachers(data);
    setLoading(false);
  }

  // Configuración Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeIdVal = active.id;
    const overIdVal = over.id;

    // Si soltó sobre un contenedor (columna)
    const isOverColumn = COLUMNS.some(col => col.id === overIdVal);
    if (isOverColumn) {
      const newStatus = overIdVal;
      setTeachers(prev => prev.map(t => t.id === activeIdVal ? { ...t, status: newStatus } : t));
      await supabase.from('teacher_applications').update({ status: newStatus }).eq('id', activeIdVal);
      return;
    }

    // Si soltó sobre otra tarjeta
    const overTeacher = teachers.find(t => t.id === overIdVal);
    if (overTeacher) {
      const newStatus = overTeacher.status;
      setTeachers(prev => prev.map(t => t.id === activeIdVal ? { ...t, status: newStatus } : t));
      await supabase.from('teacher_applications').update({ status: newStatus }).eq('id', activeIdVal);
    }
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  // Guardar Notas
  async function handleSaveNotes() {
    if (!selectedTeacher) return;
    const updated = teachers.map(t => t.id === selectedTeacher.id ? { ...t, notes: notesTemp } : t);
    setTeachers(updated);
    setSelectedTeacher(null);
    await supabase.from('teacher_applications').update({ notes: notesTemp }).eq('id', selectedTeacher.id);
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#2C3329] mb-2">Reclutamiento de Profesores</h1>
        <p className="text-gray-500">Gestiona las postulaciones del equipo docente.</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 pb-8 h-full min-w-max">
            {COLUMNS.map(col => {
              const colTeachers = teachers.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="w-80 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 h-[calc(100vh-200px)]">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className={`font-semibold text-sm px-3 py-1 rounded-full ${col.color}`}>
                      {col.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full shadow-sm">{colTeachers.length}</span>
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto">
                    <SortableContext id={col.id} items={colTeachers.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      {colTeachers.map(teacher => (
                        <TeacherCard key={teacher.id} teacher={teacher} onEditNotes={(t) => { setSelectedTeacher(t); setNotesTemp(t.notes || ''); }} />
                      ))}
                      {colTeachers.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
                          Arrastra candidatos aquí
                        </div>
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
          
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 rotate-3 scale-105 transition-transform cursor-grabbing">
                <TeacherCard teacher={teachers.find(t => t.id === activeId)} onEditNotes={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal de Notas */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="font-serif text-xl text-[#2C3329]">Notas del Postulante</h3>
              <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 hover:text-gray-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Motivación original:</strong><br/>
                <p className="mt-1 italic">{selectedTeacher.motivation || 'Sin carta de motivación.'}</p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Internas</label>
              <textarea 
                rows={5} 
                value={notesTemp}
                onChange={e => setNotesTemp(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#4A5D23]/20 focus:border-[#4A5D23] outline-none"
                placeholder="Ej. Entrevista telefónica realizada. Muy buen perfil..."
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setSelectedTeacher(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
              <button onClick={handleSaveNotes} className="px-4 py-2 text-sm font-medium text-white bg-[#4A5D23] hover:bg-[#3A491C] rounded-lg flex items-center gap-2">
                <Save className="w-4 h-4" /> Guardar Notas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
