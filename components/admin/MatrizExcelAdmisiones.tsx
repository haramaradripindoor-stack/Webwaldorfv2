'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  FileSpreadsheet, 
  Search, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles,
  Users,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export type LeadAdmision = {
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

interface MatrizExcelAdmisionesProps {
  leads: LeadAdmision[];
  onLeadsChange: () => void;
  columnsConfig: { id: string; title: string; color: string; bg: string }[];
}

const officialCourses2027 = [
  'Kinder (2027)',
  '1ro Básico (2027)',
  '2do Básico (2027)',
  '3ro Básico (2027)',
  '4to Básico (2027)',
  '5to Básico (2027)',
  '6to Básico (2027)',
  '7mo Básico (2027)',
  '8vo Básico (2027)',
  'Medio Menor-Medio Mayor-Transición',
  'Ed. Media / Fuera de Rango',
  'Consultas / Por coordinar',
];

const archetypes = [
  { id: 'no_evaluado', label: '⚪ No Evaluado', color: 'bg-gray-100 text-gray-700' },
  { id: 'refugiado_sistema', label: '🌲 Refugiado del Sistema (Alivio)', color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { id: 'purista_antroposofico', label: '🕯️ Afinidad Antroposófica (Comunidad)', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { id: 'interes_estetico', label: '🎨 Afinidad Visual / Estética (Expectativa)', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
];

// Metas de quórum por curso para 2027
const quorumTargets: Record<string, number> = {
  'Kinder (2027)': 5,
  '1ro Básico (2027)': 5,
  '2do Básico (2027)': 6,
  '3ro Básico (2027)': 5,
  '4to Básico (2027)': 5,
  '5to Básico (2027)': 5,
  '6to Básico (2027)': 5,
  '7mo Básico (2027)': 5,
  '8vo Básico (2027)': 5,
};

const ARANCEL_REFERENCIAL = 310000; // Arancel mensual estimado

export default function MatrizExcelAdmisiones({
  leads,
  onLeadsChange,
  columnsConfig
}: MatrizExcelAdmisionesProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Estados de edición y selección
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof LeadAdmision } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Normalizador de curso para la matriz
  const normalizeCourse = (raw: string): string => {
    if (!raw) return 'Consultas / Por coordinar';
    const c = raw.toLowerCase();
    if (c.includes('kinde')) return 'Kinder (2027)';
    if (c.includes('1ro') || c.includes('1ero') || c.includes('primero') || c.includes('1 b')) return '1ro Básico (2027)';
    if (c.includes('2do') || c.includes('segundo') || c.includes('2 b') || c.match(/2[^a-z]*b/)) return '2do Básico (2027)';
    if (c.includes('3ro') || c.includes('tercero') || c.includes('3 b') || c.match(/3[^a-z]*b/)) return '3ro Básico (2027)';
    if (c.includes('4to') || c.includes('cuarto') || c.includes('4 b') || c.match(/4[^a-z]*b/)) return '4to Básico (2027)';
    if (c.includes('5to') || c.includes('quinto') || c.includes('5 b') || c.match(/5[^a-z]*b/)) return '5to Básico (2027)';
    if (c.includes('6to') || c.includes('sexto') || c.includes('6 b') || c.match(/6[^a-z]*b/)) return '6to Básico (2027)';
    if (c.includes('7mo') || c.includes('septimo') || c.includes('séptimo') || c.match(/7[^a-z]*b/)) return '7mo Básico (2027)';
    if (c.includes('8vo') || c.includes('octavo') || c.match(/8[^a-z]*b/)) return '8vo Básico (2027)';
    if (c.includes('medio menor') || c.includes('transición') || c.includes('transicion')) return 'Medio Menor-Medio Mayor-Transición';
    if (c.includes('medio') || c.includes('14 años') || c.includes('13 años')) return 'Ed. Media / Fuera de Rango';
    if (raw.includes(' | ')) return raw.split(' | ')[0].trim();
    return raw.trim();
  };

  // Leads filtrados
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtro por Estado
      if (selectedStatus !== 'all' && lead.estado !== selectedStatus) return false;

      // Filtro por Curso (soporta cursos múltiples / hermanos)
      if (selectedCourse !== 'all') {
        const norm = normalizeCourse(lead.curso_postula);
        const courseKeyword = selectedCourse.replace(' (2027)', '').toLowerCase();
        const matchesMulti = lead.curso_postula && lead.curso_postula.toLowerCase().includes(courseKeyword);
        if (norm !== selectedCourse && !matchesMulti) return false;
      }

      // Filtro por Búsqueda libre
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const apoderado = (lead.nombre_apoderado || '').toLowerCase();
        const nino = (lead.nombre_nino || '').toLowerCase();
        const email = (lead.email_apoderado || '').toLowerCase();
        const phone = (lead.telefono_apoderado || '').toLowerCase();
        const curso = (lead.curso_postula || '').toLowerCase();
        const notas = (lead.notas || '').toLowerCase();
        return apoderado.includes(q) || nino.includes(q) || email.includes(q) || phone.includes(q) || curso.includes(q) || notas.includes(q);
      }

      return true;
    });
  }, [leads, selectedStatus, selectedCourse, searchQuery]);

  // Cálculos para Dashboard de Toma de Decisiones
  const activeLeads = useMemo(() => {
    return leads.filter(l => l.estado !== 'no_corresponde' && l.estado !== 'no_continua');
  }, [leads]);

  // Demanda por curso (contabiliza hermanos postulados a múltiples cursos)
  const courseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeLeads.forEach(lead => {
      if (lead.curso_postula && lead.curso_postula.includes(',')) {
        // Apoderado con múltiples cursos (Hermanos)
        lead.curso_postula.split(',').forEach(part => {
          const c = normalizeCourse(part.trim());
          counts[c] = (counts[c] || 0) + 1;
        });
      } else {
        const c = normalizeCourse(lead.curso_postula);
        counts[c] = (counts[c] || 0) + 1;
      }
    });
    return counts;
  }, [activeLeads]);

  // Alumnos en etapas de alta conversión
  const matriculadosCount = useMemo(() => leads.filter(l => l.estado === 'matriculado').length, [leads]);
  const enEvaluacionCount = useMemo(() => leads.filter(l => l.estado === 'evaluacion').length, [leads]);
  const enEntrevistaCount = useMemo(() => leads.filter(l => l.estado === 'entrevista').length, [leads]);
  const refugiadosCount = useMemo(() => activeLeads.filter(l => l.arquetipo === 'refugiado_sistema').length, [activeLeads]);
  const requiereArancelCount = useMemo(() => activeLeads.filter(l => !!l.requiere_evaluacion_arancel).length, [activeLeads]);

  // Proyección financiera mensual estimada
  // Ponderación: Matriculados 100%, Práctica Viva 70%, Encuentro Bienvenida 40%
  const ingresoMensualProyectado = useMemo(() => {
    const ponderado = (matriculadosCount * 1.0) + (enEvaluacionCount * 0.7) + (enEntrevistaCount * 0.4);
    return Math.round(ponderado * ARANCEL_REFERENCIAL);
  }, [matriculadosCount, enEvaluacionCount, enEntrevistaCount]);

  // Guardar celda editada en Supabase
  const saveCellEdit = async (leadId: string, field: keyof LeadAdmision, value: any) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads_admision')
        .update({ [field]: value })
        .eq('id', leadId);

      if (error) throw error;
      setSaveFeedback('Guardado');
      setTimeout(() => setSaveFeedback(null), 1800);
      onLeadsChange();
    } catch (err) {
      console.error('Error guardando celda:', err);
      alert('No se pudo guardar el cambio en Supabase.');
    } finally {
      setIsSaving(false);
      setEditingCell(null);
    }
  };

  // Crear nueva fila vacía
  const handleCreateNewRow = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('leads_admision')
        .insert([{
          nombre_apoderado: 'Nuevo Apoderado',
          email_apoderado: 'pendiente@correo.cl',
          telefono_apoderado: '+569',
          nombre_nino: 'Por ingresar',
          edad_nino: '4',
          curso_postula: 'Kinder (2027)',
          estado: 'nuevo',
          origen: 'Matriz Excel Admin',
          requiere_evaluacion_arancel: false,
          arquetipo: 'no_evaluado'
        }])
        .select()
        .single();

      if (error) throw error;
      onLeadsChange();
      setSaveFeedback('Fila creada');
      setTimeout(() => setSaveFeedback(null), 2000);
      // Iniciar edición en la nueva fila
      if (data) {
        setEditingCell({ id: data.id, field: 'nombre_apoderado' });
        setEditValue('Nuevo Apoderado');
      }
    } catch (err) {
      console.error('Error creando fila:', err);
      alert('Error al insertar fila en Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar filas seleccionadas
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`¿Eliminar definitivamente ${selectedIds.length} registro(s) de admisiones?`)) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads_admision')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;
      setSelectedIds([]);
      onLeadsChange();
      setSaveFeedback(`${selectedIds.length} eliminados`);
      setTimeout(() => setSaveFeedback(null), 2000);
    } catch (err) {
      console.error('Error eliminando registros:', err);
      alert('Error al eliminar registros.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cambio de estado masivo
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedIds.length === 0 || !newStatus) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads_admision')
        .update({ estado: newStatus })
        .in('id', selectedIds);

      if (error) throw error;
      setSelectedIds([]);
      onLeadsChange();
      setSaveFeedback('Estado actualizado');
      setTimeout(() => setSaveFeedback(null), 2000);
    } catch (err) {
      console.error('Error actualizando estados:', err);
      alert('Error al actualizar estados en lote.');
    } finally {
      setIsSaving(false);
    }
  };

  // Soporte de pegado nativo masivo (Ctrl+V / Cmd+V)
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData.getData('text');
    if (!clipboardData || !clipboardData.includes('\t')) {
      // Si no es un texto tabulado de hoja de cálculo, dejamos que el navegador actúe normal
      return;
    }

    e.preventDefault();
    const rows = clipboardData.split(/\r?\n/).filter(r => r.trim().length > 0);
    if (rows.length === 0) return;

    setIsSaving(true);
    let insertedCount = 0;
    let updatedCount = 0;

    try {
      for (const row of rows) {
        const cols = row.split('\t').map(c => c.trim());
        if (cols.length < 2) continue;

        // Intentar mapear columnas según formato estándar
        // [0: Fecha], [1: Apoderado], [2: Niño], [3: Edad], [4: Curso], [5: Teléfono], [6: Correo]
        let apoderado = '';
        let nino = '';
        let edad = '';
        let curso = 'Kinder (2027)';
        let telefono = '';
        let correo = '';

        if (cols.length >= 7) {
          apoderado = cols[1];
          nino = cols[2];
          edad = cols[3];
          curso = cols[4] || 'Kinder (2027)';
          telefono = cols[5];
          correo = cols[6];
        } else {
          // Heurística si pegan menos columnas
          cols.forEach(c => {
            if (c.includes('@')) correo = c;
            else if (c.match(/(\+56|9\d{8}|\d{7,8})/)) telefono = c;
            else if (c.match(/^\d{1,2}$/)) edad = c;
            else if (!apoderado) apoderado = c;
            else if (!nino) nino = c;
          });
        }

        if (!apoderado && !correo && !telefono) continue;

        // Revisar si ya existe por teléfono o correo para no duplicar
        const cleanPhone = telefono.replace(/\D/g, '').slice(-8);
        const cleanEmail = correo.toLowerCase();

        const existing = leads.find(l => {
          const lPhone = (l.telefono_apoderado || '').replace(/\D/g, '').slice(-8);
          const lEmail = (l.email_apoderado || '').toLowerCase();
          return (cleanPhone && lPhone && cleanPhone === lPhone) || (cleanEmail && lEmail && cleanEmail === lEmail && cleanEmail !== 'pendiente');
        });

        if (existing) {
          await supabase
            .from('leads_admision')
            .update({
              nombre_apoderado: apoderado || existing.nombre_apoderado,
              nombre_nino: nino || existing.nombre_nino,
              edad_nino: edad || existing.edad_nino,
              curso_postula: curso || existing.curso_postula,
              telefono_apoderado: telefono || existing.telefono_apoderado,
              email_apoderado: correo || existing.email_apoderado,
            })
            .eq('id', existing.id);
          updatedCount++;
        } else {
          await supabase
            .from('leads_admision')
            .insert([{
              nombre_apoderado: apoderado || 'Sin nombre',
              nombre_nino: nino || 'No especificado',
              edad_nino: edad || 'Pendiente',
              curso_postula: curso || 'Kinder (2027)',
              telefono_apoderado: telefono || '+569',
              email_apoderado: correo || 'Pendiente',
              estado: 'nuevo',
              origen: 'Pegado Masivo Ctrl+V',
              requiere_evaluacion_arancel: false,
              arquetipo: 'no_evaluado'
            }]);
          insertedCount++;
        }
      }

      setSaveFeedback(`Pegado exitoso: ${insertedCount} nuevos, ${updatedCount} actualizados`);
      setTimeout(() => setSaveFeedback(null), 3000);
      onLeadsChange();
    } catch (err) {
      console.error('Error al procesar pegado:', err);
      alert('Ocurrió un error al procesar las celdas pegadas.');
    } finally {
      setIsSaving(false);
    }
  };

  // Importar archivo .xlsx
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

      if (jsonRows.length <= 1) {
        alert('El archivo no contiene filas de datos.');
        setIsSaving(false);
        return;
      }

      // La primera fila son encabezados
      const headers = (jsonRows[0] as string[]).map(h => (h || '').toString().toLowerCase().trim());
      const dataRows = jsonRows.slice(1);

      let inserted = 0;
      let updated = 0;

      for (const row of dataRows) {
        if (!row || row.length === 0) continue;
        
        let apoderado = '';
        let nino = '';
        let edad = '';
        let curso = 'Kinder (2027)';
        let telefono = '';
        let correo = '';

        headers.forEach((h, idx) => {
          const val = row[idx] ? row[idx].toString().trim() : '';
          if (h.includes('apoderado') || h.includes('padre') || h.includes('madre')) apoderado = val;
          else if (h.includes('niño') || h.includes('postulante') || h.includes('hijo')) nino = val;
          else if (h.includes('edad')) edad = val;
          else if (h.includes('curso')) curso = val;
          else if (h.includes('teléfono') || h.includes('telefono') || h.includes('celular') || h.includes('whatsapp')) telefono = val;
          else if (h.includes('correo') || h.includes('email') || h.includes('mail')) correo = val;
        });

        // Fallback posicional si no coincidieron los headers
        if (!apoderado && row[1]) apoderado = row[1];
        if (!nino && row[2]) nino = row[2];
        if (!edad && row[3]) edad = row[3];
        if (!curso && row[4]) curso = row[4];
        if (!telefono && row[5]) telefono = row[5];
        if (!correo && row[6]) correo = row[6];

        if (!apoderado && !correo && !telefono) continue;

        const cleanPhone = telefono ? telefono.replace(/\D/g, '').slice(-8) : '';
        const cleanEmail = correo ? correo.toLowerCase() : '';

        const existing = leads.find(l => {
          const lPhone = (l.telefono_apoderado || '').replace(/\D/g, '').slice(-8);
          const lEmail = (l.email_apoderado || '').toLowerCase();
          return (cleanPhone && lPhone && cleanPhone === lPhone) || (cleanEmail && lEmail && cleanEmail === lEmail && cleanEmail !== 'pendiente');
        });

        if (existing) {
          await supabase
            .from('leads_admision')
            .update({
              nombre_apoderado: apoderado || existing.nombre_apoderado,
              nombre_nino: nino || existing.nombre_nino,
              edad_nino: edad || existing.edad_nino,
              curso_postula: curso || existing.curso_postula,
              telefono_apoderado: telefono || existing.telefono_apoderado,
              email_apoderado: correo || existing.email_apoderado,
            })
            .eq('id', existing.id);
          updated++;
        } else {
          await supabase
            .from('leads_admision')
            .insert([{
              nombre_apoderado: apoderado || 'Sin nombre',
              nombre_nino: nino || 'No especificado',
              edad_nino: edad || 'Pendiente',
              curso_postula: curso || 'Kinder (2027)',
              telefono_apoderado: telefono || '+569',
              email_apoderado: correo || 'Pendiente',
              estado: 'nuevo',
              origen: `Importado .xlsx (${file.name})`,
              requiere_evaluacion_arancel: false,
              arquetipo: 'no_evaluado'
            }]);
          inserted++;
        }
      }

      setSaveFeedback(`Importación lista: ${inserted} agregados, ${updated} actualizados`);
      setTimeout(() => setSaveFeedback(null), 3000);
      onLeadsChange();
    } catch (err) {
      console.error('Error leyendo Excel:', err);
      alert('Error al procesar el archivo Excel. Asegúrate de que sea un archivo .xlsx válido.');
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Descargar .xlsx en formato oficial (7 columnas ordenadas)
  const handleDownloadOfficialExcel = () => {
    if (filteredLeads.length === 0) {
      alert('No hay filas para descargar.');
      return;
    }

    const dataRows = filteredLeads.map(lead => {
      const d = new Date(lead.created_at);
      const fecha = !isNaN(d.getTime()) 
        ? d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';
      
      const apoderado = lead.nombre_apoderado ? lead.nombre_apoderado.trim() : '';
      const nino = lead.nombre_nino && lead.nombre_nino !== 'No especificado' ? lead.nombre_nino.trim() : (lead.nombre_nino || '');
      const edad = lead.edad_nino ? lead.edad_nino.trim() : '';
      const curso = normalizeCourse(lead.curso_postula);
      const telefono = (lead.telefono_apoderado && lead.telefono_apoderado !== 'Vía WhatsApp (Pendiente)') ? lead.telefono_apoderado.trim() : '';
      const correo = (lead.email_apoderado && lead.email_apoderado !== 'Pendiente') ? lead.email_apoderado.trim() : '';

      return {
        'Fecha formulario': fecha,
        'Apoderado': apoderado,
        'Nombre niño/a': nino,
        'Edad': edad,
        'Curso postulado': curso,
        'Teléfono': telefono,
        'Correo': correo
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    worksheet['!cols'] = [
      { wch: 18 }, // Fecha formulario
      { wch: 32 }, // Apoderado
      { wch: 28 }, // Nombre niño/a
      { wch: 12 }, // Edad
      { wch: 28 }, // Curso postulado
      { wch: 18 }, // Teléfono
      { wch: 35 }, // Correo
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admisiones 2027');
    XLSX.writeFile(workbook, `Trekan_Matriz_Admisiones_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Descargar plantilla .xlsx de ejemplo
  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        'Fecha formulario': '26-10-2026',
        'Apoderado': 'María Ignacia Silva',
        'Nombre niño/a': 'Lucas Silva',
        'Edad': '5',
        'Curso postulado': 'Kinder (2027)',
        'Teléfono': '+56912345678',
        'Correo': 'maria.silva@ejemplo.cl'
      },
      {
        'Fecha formulario': '26-10-2026',
        'Apoderado': 'Felipe González',
        'Nombre niño/a': 'Julieta González',
        'Edad': '7',
        'Curso postulado': '2do Básico (2027)',
        'Teléfono': '+56987654321',
        'Correo': 'felipe.gonzalez@ejemplo.cl'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    worksheet['!cols'] = [
      { wch: 18 }, { wch: 32 }, { wch: 28 }, { wch: 12 }, { wch: 28 }, { wch: 18 }, { wch: 35 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
    XLSX.writeFile(workbook, 'Plantilla_Admisiones_Trekan.xlsx');
  };

  return (
    <div 
      ref={tableContainerRef}
      onPaste={handlePaste}
      tabIndex={0}
      className="w-full flex flex-col gap-6 outline-none focus:ring-1 focus:ring-[var(--color-waldorf-mustard)]/30 rounded-3xl"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {/* DASHBOARD DE TOMA DE DECISIONES EN VIVO */}
      <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F3EFEA] border border-[var(--color-waldorf-sage)]/30 rounded-3xl p-6 shadow-sm">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--color-waldorf-sage)]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-waldorf-moss)]/10 text-[var(--color-waldorf-moss)] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-[var(--color-waldorf-mustard)]" />
              Inteligencia de Matrícula · Admisión 2027
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)]">
              Estado de Quórum y Proyección de Sostenibilidad
            </h2>
            <p className="text-xs text-[var(--color-waldorf-text-light)] mt-0.5">
              Datos consolidados en tiempo real. La viabilidad de las salas multigrado depende de alcanzar quórum por curso.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* KPI 1: Ingreso Proyectado */}
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">Proyección Mensual 2027</p>
                <p className="text-lg font-extrabold text-[var(--color-waldorf-moss)] font-mono">
                  ${ingresoMensualProyectado.toLocaleString('es-CL')}
                </p>
              </div>
            </div>

            {/* KPI 2: Total Activos */}
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-waldorf-moss)]/10 text-[var(--color-waldorf-moss)] flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">Familias en Proceso</p>
                <p className="text-lg font-extrabold text-[var(--color-waldorf-moss)] font-mono">
                  {activeLeads.length} <span className="text-xs font-medium text-gray-400">/ 75 total</span>
                </p>
              </div>
            </div>

            {/* KPI 3: Refugiados del Sistema */}
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">Refugiados Sistema</p>
                <p className="text-lg font-extrabold text-blue-900 font-mono">
                  {refugiadosCount} <span className="text-xs font-medium text-gray-400">familias</span>
                </p>
              </div>
            </div>

            {/* KPI 4: Requiere Arancel Fraterno */}
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <HeartHandshake size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">Eval. Arancel / Beca</p>
                <p className="text-lg font-extrabold text-amber-900 font-mono">
                  {requiereArancelCount} <span className="text-xs font-medium text-gray-400">solicitudes</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoreo Visual de Quórum por Curso (Decision Grid) */}
        <div className="mt-5">
          <p className="text-xs font-bold text-[var(--color-waldorf-moss)] uppercase tracking-wider mb-3">
            Avance de Quórum por Nivel (Clic en un curso para filtrar la matriz):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(quorumTargets).map(([curso, target]) => {
              const current = courseCounts[curso] || 0;
              const percentage = Math.min(100, Math.round((current / target) * 100));
              const isFull = current >= target;
              const isSelected = selectedCourse === curso;

              return (
                <button
                  key={curso}
                  onClick={() => setSelectedCourse(isSelected ? 'all' : curso)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-[var(--color-waldorf-moss)] text-white border-transparent shadow-md scale-102' 
                      : 'bg-white hover:bg-[#FAF8F5] border-[var(--color-waldorf-sage)]/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-serif font-bold truncate max-w-[110px] ${isSelected ? 'text-white' : 'text-[var(--color-waldorf-moss)]'}`}>
                      {curso.replace(' (2027)', '')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isFull 
                        ? (isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800')
                        : (isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800')
                    }`}>
                      {current} / {target}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull 
                          ? 'bg-emerald-500' 
                          : percentage >= 50 ? 'bg-[var(--color-waldorf-mustard)]' : 'bg-orange-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className={`text-[10px] mt-1.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {isFull ? '✅ Quórum alcanzado' : `Faltan ${target - current} para quórum`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* BARRA DE HERRAMIENTAS Y ACCIONES DE LA MATRIZ */}
      <div className="bg-white border border-[var(--color-waldorf-sage)]/20 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* Lado izquierdo: Búsqueda y Filtros de Estado */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar en celdas (apoderado, correo, notas...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/20 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-800 outline-none focus:border-[var(--color-waldorf-mustard)] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtro por Etapa CRM */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#FAF8F5] border border-[var(--color-waldorf-sage)]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-waldorf-moss)] outline-none cursor-pointer"
          >
            <option value="all">Todas las etapas ({leads.length})</option>
            {columnsConfig.map(col => (
              <option key={col.id} value={col.id}>{col.title} ({leads.filter(l => l.estado === col.id).length})</option>
            ))}
          </select>

          {selectedCourse !== 'all' && (
            <button
              onClick={() => setSelectedCourse('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-waldorf-mustard)]/20 text-[#1a2e25] text-xs font-bold hover:bg-[var(--color-waldorf-mustard)]/30 transition-colors"
            >
              Curso: {selectedCourse.replace(' (2027)', '')} <X size={12} />
            </button>
          )}

          {selectedIds.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-900">
              <span>{selectedIds.length} seleccionadas</span>
              
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkStatusChange(e.target.value);
                  e.target.value = '';
                }}
                className="bg-white border border-blue-300 rounded-lg px-2 py-1 text-xs text-blue-900 outline-none cursor-pointer font-medium"
              >
                <option value="">Mover a...</option>
                {columnsConfig.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>

              <button
                onClick={handleDeleteSelected}
                className="text-red-600 hover:text-red-800 p-1 transition-colors"
                title="Eliminar seleccionadas"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Lado derecho: Botones de Operación de Excel */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          
          {saveFeedback && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5">
              <Check size={14} /> {saveFeedback}
            </span>
          )}

          <button
            onClick={handleCreateNewRow}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[var(--color-waldorf-moss)] hover:bg-[#1f372e] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus size={15} /> Nueva Fila
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="Importar archivo Excel (.xlsx)"
          >
            <Upload size={15} /> Cargar .xlsx
          </button>

          <button
            onClick={handleDownloadOfficialExcel}
            className="flex items-center gap-1.5 bg-[var(--color-waldorf-mustard)] hover:bg-[#c68f43] text-[#1a2e25] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            title="Descargar datos en Excel con formato oficial"
          >
            <Download size={15} /> Bajar .xlsx
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1 bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[var(--color-waldorf-sage)]/20 text-gray-600 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors"
            title="Descargar Plantilla Vacía (.xlsx)"
          >
            <FileSpreadsheet size={14} /> Plantilla
          </button>

          <button
            onClick={onLeadsChange}
            className="p-2 rounded-xl border border-[var(--color-waldorf-sage)]/20 text-gray-500 hover:text-[var(--color-waldorf-moss)] hover:bg-gray-50 transition-colors"
            title="Recargar datos de Supabase"
          >
            <RefreshCw size={15} className={isSaving ? 'animate-spin' : ''} />
          </button>

        </div>

      </div>

      {/* GRILLA INTERACTIVA SHEETJS (MATRIZ EXCEL) */}
      <div className="bg-white border border-[var(--color-waldorf-sage)]/25 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs">
            
            {/* Header Tipo Excel con nomenclatura de columnas [A], [B], [C] */}
            <thead className="sticky top-0 z-20 bg-[var(--color-waldorf-moss)] text-white font-serif select-none shadow-sm">
              <tr>
                <th className="w-10 p-3 text-center border-r border-white/10">
                  <input 
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredLeads.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredLeads.map(l => l.id));
                      else setSelectedIds([]);
                    }}
                    className="w-3.5 h-3.5 accent-[var(--color-waldorf-mustard)] cursor-pointer rounded"
                  />
                </th>
                <th className="p-3 font-mono font-medium text-[11px] text-[var(--color-waldorf-mustard)] border-r border-white/10 min-w-[110px]">
                  [A] FECHA
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[180px]">
                  [B] APODERADO *
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[200px]">
                  [C] CORREO *
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[130px]">
                  [D] TELÉFONO *
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[170px]">
                  [E] NIÑO / NIÑA
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[70px] text-center">
                  [F] EDAD
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[180px]">
                  [G] CURSO POSTULADO
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[190px]">
                  [H] ETAPA CRM
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[120px] text-center">
                  [I] ARANCEL
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide border-r border-white/10 min-w-[210px]">
                  [J] ARQUETIPO FAMILIA
                </th>
                <th className="p-3 font-serif font-bold text-xs tracking-wide min-w-[240px]">
                  [K] NOTAS / HISTORIAL
                </th>
              </tr>
            </thead>

            {/* Filas de Datos */}
            <tbody className="divide-y divide-[var(--color-waldorf-sage)]/10 font-sans">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-gray-400 bg-[#FAF8F5]">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-sm font-bold text-gray-600">No hay filas que coincidan con los filtros</p>
                    <p className="text-xs text-gray-400 mt-1">Puedes pegar celdas copiadas con Ctrl+V o presionar "+ Nueva Fila".</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, idx) => {
                  const isSelected = selectedIds.includes(lead.id);
                  const d = new Date(lead.created_at);
                  const fechaStr = !isNaN(d.getTime()) ? d.toLocaleDateString('es-CL') : '';
                  const statusConfig = columnsConfig.find(c => c.id === lead.estado);
                  const currentArchetype = archetypes.find(a => a.id === lead.arquetipo) || archetypes[0];

                  return (
                    <tr 
                      key={lead.id}
                      className={`transition-colors hover:bg-[#FAF8F5] ${isSelected ? 'bg-blue-50/70' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]')}`}
                    >
                      {/* Checkbox de Fila */}
                      <td className="p-2.5 text-center border-r border-gray-100">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(prev => [...prev, lead.id]);
                            else setSelectedIds(prev => prev.filter(i => i !== lead.id));
                          }}
                          className="w-3.5 h-3.5 accent-[var(--color-waldorf-moss)] cursor-pointer rounded"
                        />
                      </td>

                      {/* [A] FECHA */}
                      <td className="p-2.5 font-mono text-gray-500 text-[11px] border-r border-gray-100 whitespace-nowrap">
                        {fechaStr}
                      </td>

                      {/* [B] APODERADO (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'nombre_apoderado' });
                          setEditValue(lead.nombre_apoderado || '');
                        }}
                        className="p-2.5 font-medium text-gray-900 border-r border-gray-100 cursor-text"
                        title="Doble clic para editar"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'nombre_apoderado' ? (
                          <input 
                            type="text"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'nombre_apoderado', editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'nombre_apoderado', editValue);
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-full bg-white border border-[var(--color-waldorf-mustard)] rounded px-2 py-1 text-xs outline-none shadow-xs font-semibold"
                          />
                        ) : (
                          <span className="truncate block font-semibold text-[var(--color-waldorf-moss)]">
                            {lead.nombre_apoderado || <em className="text-gray-400">Sin apoderado</em>}
                          </span>
                        )}
                      </td>

                      {/* [C] CORREO (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'email_apoderado' });
                          setEditValue(lead.email_apoderado === 'Pendiente' ? '' : (lead.email_apoderado || ''));
                        }}
                        className="p-2.5 text-gray-700 border-r border-gray-100 cursor-text font-mono text-[11px]"
                        title="Doble clic para editar"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'email_apoderado' ? (
                          <input 
                            type="email"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'email_apoderado', editValue || 'Pendiente')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'email_apoderado', editValue || 'Pendiente');
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-full bg-white border border-[var(--color-waldorf-mustard)] rounded px-2 py-1 text-xs outline-none shadow-xs"
                          />
                        ) : (
                          <span className={`truncate block ${lead.email_apoderado === 'Pendiente' ? 'text-orange-500 italic' : 'text-gray-700'}`}>
                            {lead.email_apoderado || <em className="text-gray-400">Pendiente</em>}
                          </span>
                        )}
                      </td>

                      {/* [D] TELÉFONO (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'telefono_apoderado' });
                          setEditValue(lead.telefono_apoderado || '');
                        }}
                        className="p-2.5 font-mono text-gray-700 border-r border-gray-100 cursor-text whitespace-nowrap"
                        title="Doble clic para editar"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'telefono_apoderado' ? (
                          <input 
                            type="text"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'telefono_apoderado', editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'telefono_apoderado', editValue);
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-full bg-white border border-[var(--color-waldorf-mustard)] rounded px-2 py-1 text-xs outline-none shadow-xs font-mono"
                          />
                        ) : (
                          <span className="truncate block">
                            {lead.telefono_apoderado || <em className="text-gray-400">Sin teléfono</em>}
                          </span>
                        )}
                      </td>

                      {/* [E] NIÑO / NIÑA (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'nombre_nino' });
                          setEditValue(lead.nombre_nino || '');
                        }}
                        className="p-2.5 text-gray-800 border-r border-gray-100 cursor-text"
                        title="Doble clic para editar"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'nombre_nino' ? (
                          <input 
                            type="text"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'nombre_nino', editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'nombre_nino', editValue);
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-full bg-white border border-[var(--color-waldorf-mustard)] rounded px-2 py-1 text-xs outline-none shadow-xs"
                          />
                        ) : (
                          <span className="truncate block font-medium">
                            {lead.nombre_nino || <em className="text-gray-400">No indicado</em>}
                          </span>
                        )}
                      </td>

                      {/* [F] EDAD (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'edad_nino' });
                          setEditValue(lead.edad_nino || '');
                        }}
                        className="p-2.5 text-center font-bold text-gray-700 border-r border-gray-100 cursor-text"
                        title="Doble clic para editar"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'edad_nino' ? (
                          <input 
                            type="text"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'edad_nino', editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'edad_nino', editValue);
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-12 mx-auto bg-white border border-[var(--color-waldorf-mustard)] rounded px-1 py-1 text-xs text-center outline-none shadow-xs font-bold"
                          />
                        ) : (
                          <span>{lead.edad_nino || '-'}</span>
                        )}
                      </td>

                      {/* [G] CURSO POSTULADO (Dropdown con cursos oficiales y soporte hermanos) */}
                      <td className="p-2.5 border-r border-gray-100">
                        <select
                          value={officialCourses2027.includes(lead.curso_postula) ? lead.curso_postula : (lead.curso_postula && lead.curso_postula.includes(',') ? lead.curso_postula : normalizeCourse(lead.curso_postula))}
                          onChange={(e) => saveCellEdit(lead.id, 'curso_postula', e.target.value)}
                          className="w-full bg-transparent border-0 font-medium text-gray-800 text-xs py-1 px-1.5 rounded hover:bg-gray-100/80 outline-none cursor-pointer focus:bg-white focus:ring-1 focus:ring-[var(--color-waldorf-mustard)]"
                        >
                          {!officialCourses2027.includes(lead.curso_postula) && lead.curso_postula && (
                            <option value={lead.curso_postula}>
                              {lead.curso_postula.includes(',') ? `👫 ${lead.curso_postula}` : lead.curso_postula}
                            </option>
                          )}
                          {officialCourses2027.map(curso => (
                            <option key={curso} value={curso}>{curso}</option>
                          ))}
                        </select>
                      </td>

                      {/* [H] ETAPA CRM (Selector con badges) */}
                      <td className="p-2.5 border-r border-gray-100">
                        <select
                          value={lead.estado}
                          onChange={(e) => saveCellEdit(lead.id, 'estado', e.target.value)}
                          className={`w-full py-1 px-2 rounded-lg text-xs font-bold border-0 cursor-pointer outline-none transition-colors ${
                            lead.estado === 'matriculado' ? 'bg-emerald-100 text-emerald-800' :
                            lead.estado === 'evaluacion' ? 'bg-purple-100 text-purple-800' :
                            lead.estado === 'entrevista' ? 'bg-blue-100 text-blue-800' :
                            lead.estado === 'nuevo' ? 'bg-amber-100 text-amber-800' :
                            lead.estado === 'no_corresponde' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {columnsConfig.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </td>

                      {/* [I] ARANCEL FRATERNO (Checkbox) */}
                      <td className="p-2.5 text-center border-r border-gray-100">
                        <input 
                          type="checkbox"
                          checked={!!lead.requiere_evaluacion_arancel}
                          onChange={(e) => saveCellEdit(lead.id, 'requiere_evaluacion_arancel', e.target.checked)}
                          className="w-4 h-4 accent-amber-600 cursor-pointer rounded"
                          title="¿Solicita evaluación de arancel diferenciado?"
                        />
                      </td>

                      {/* [J] ARQUETIPO (Dropdown) */}
                      <td className="p-2.5 border-r border-gray-100">
                        <select
                          value={lead.arquetipo || 'no_evaluado'}
                          onChange={(e) => saveCellEdit(lead.id, 'arquetipo', e.target.value)}
                          className={`w-full py-1 px-2 rounded-lg text-[11px] font-bold border-0 cursor-pointer outline-none ${currentArchetype.color}`}
                        >
                          {archetypes.map(arc => (
                            <option key={arc.id} value={arc.id}>{arc.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* [K] NOTAS / HISTORIAL (Editable Inline) */}
                      <td 
                        onDoubleClick={() => {
                          setEditingCell({ id: lead.id, field: 'notas' });
                          setEditValue(lead.notas || '');
                        }}
                        className="p-2.5 text-gray-600 text-xs cursor-text"
                        title="Doble clic para editar notas"
                      >
                        {editingCell?.id === lead.id && editingCell?.field === 'notas' ? (
                          <input 
                            type="text"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(lead.id, 'notas', editValue)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveCellEdit(lead.id, 'notas', editValue);
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            className="w-full bg-white border border-[var(--color-waldorf-mustard)] rounded px-2 py-1 text-xs outline-none shadow-xs"
                          />
                        ) : (
                          <span className="truncate block max-w-[260px] text-gray-500">
                            {lead.notas || <em className="text-gray-300">Sin notas</em>}
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Footer con Tips y Estado */}
        <div className="bg-[#FAF8F5] border-t border-[var(--color-waldorf-sage)]/20 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-waldorf-moss)] font-bold font-mono">
              {filteredLeads.length} filas visibles
            </span>
            <span>·</span>
            <span>💡 Doble clic: Editar celda · Enter: Guardar · Ctrl+V: Pegar celdas directo de Excel o Google Sheets</span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-800 font-semibold">Sincronizado en tiempo real con Supabase CRM</span>
          </div>
        </div>

      </div>

    </div>
  );
}
