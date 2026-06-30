'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Activity, FileText, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PacientesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ full_name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback para diseño si aún no crean la tabla
      setPatients([
        { id: 1, full_name: 'María Gatica', email: 'maria@ejemplo.cl', phone: '+56912345678', last_service: 'Instalación Vía Venosa', status: 'Activo' },
        { id: 2, full_name: 'Juan Pérez', email: 'juan@ejemplo.cl', phone: '+56987654321', last_service: 'Plan Calistenia 12 ses.', status: 'En tratamiento' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Inserción segura a través del servidor para crear auth.users y profile
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: newPatient.full_name,
          email: newPatient.email,
          phone: newPatient.phone,
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error desconocido al crear paciente');
      }
      
      setIsModalOpen(false);
      setNewPatient({ full_name: '', email: '', phone: '' });
      fetchPatients();
    } catch (error) {
      console.error("Error al guardar paciente:", error);
      alert("Hubo un error al guardar el paciente. Revisa la consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Pacientes y Fichas Clínicas</h1>
          <p className="text-gray-400">Directorio maestro de atenciones médicas y planes de entrenamiento.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
        >
          <Plus size={20} />
          Nuevo Paciente
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-hairline-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold">Total Pacientes</p>
              <h3 className="text-2xl font-bold text-white">{patients.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-hairline-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold">Planes Activos</p>
              <h3 className="text-2xl font-bold text-white">{patients.filter(p => p.status === 'En tratamiento' || p.status === 'Activo').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-hairline-soft">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold">Fichas Clínicas Abiertas</p>
              <h3 className="text-2xl font-bold text-white">{patients.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-surface border border-hairline-soft rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-hairline-soft flex justify-between items-center bg-[#0a0a0a]">
          <h2 className="text-lg font-bold text-white">Directorio</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o rut..." 
              className="pl-10 pr-4 py-2 bg-background/50 border border-hairline rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Paciente</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Último Servicio</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando directorio...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay pacientes registrados aún.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-hairline">
                          <span className="text-cyan-400 font-bold">
                            {patient.full_name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{patient.full_name || 'Sin Nombre'}</p>
                          <p className="text-gray-500 text-xs">ID: {patient.id?.toString().slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm">{patient.email || '-'}</p>
                      <p className="text-gray-500 text-xs">{patient.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{patient.last_service || 'Primera Consulta'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                        {patient.status || 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-cyan-500 hover:text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Abrir Ficha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-hairline rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Agregar Paciente</h2>
            <form onSubmit={handleSavePatient} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={newPatient.full_name}
                  onChange={e => setNewPatient({...newPatient, full_name: e.target.value})}
                  className="w-full bg-background/50 border border-hairline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Correo Electrónico (Opcional)</label>
                <input 
                  type="email" 
                  value={newPatient.email}
                  onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                  className="w-full bg-background/50 border border-hairline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Teléfono / WhatsApp (Opcional)</label>
                <input 
                  type="text" 
                  value={newPatient.phone}
                  onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                  className="w-full bg-background/50 border border-hairline rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-hairline text-white hover:bg-foreground/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Paciente'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
