'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, MapPin, Plus, Trash2, Save, X, Edit2, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ServiceItem = { id: string; name: string; price: number; category: string; };
type LocationItem = { id: string; name: string; price_surcharge: number; };

export default function ServiciosPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingService, setSavingService] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savingCalistenia, setSavingCalistenia] = useState(false);

  // Calistenia Prices
  const [priceEval, setPriceEval] = useState('10000');
  const [priceOnline8, setPriceOnline8] = useState('45000');
  const [priceOnline12, setPriceOnline12] = useState('55000');
  const [pricePresencial8, setPricePresencial8] = useState('110000');
  const [pricePresencial12, setPricePresencial12] = useState('130000');

  // Form states - Service
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Form states - Location
  const [editLocationId, setEditLocationId] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');
  const [locationPrice, setLocationPrice] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSrv, resLoc] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/locations')
      ]);
      const jsonSrv = await resSrv.json();
      const jsonLoc = await resLoc.json();

      if (jsonSrv.success) setServices(jsonSrv.data);
      if (jsonLoc.success) setLocations(jsonLoc.data);

      const { data: settingsData } = await supabase.from('settings').select('*');
      if (settingsData) {
        settingsData.forEach((item: { key: string; value: string }) => {
          if (item.key === 'price_eval') setPriceEval(item.value);
          else if (item.key === 'price_online_8') setPriceOnline8(item.value);
          else if (item.key === 'price_online_12') setPriceOnline12(item.value);
          else if (item.key === 'price_presencial_8') setPricePresencial8(item.value);
          else if (item.key === 'price_presencial_12') setPricePresencial12(item.value);
        });
      }
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── SERVICES HANDLERS ───
  const resetServiceForm = () => {
    setEditServiceId(null);
    setServiceName('');
    setServicePrice('');
    setServiceCategory('');
    setShowServiceForm(false);
  };

  const handleEditService = (s: ServiceItem) => {
    setEditServiceId(s.id);
    setServiceName(s.name);
    setServicePrice(s.price.toString());
    setServiceCategory(s.category);
    setShowServiceForm(true);
  };

  const handleSaveService = async () => {
    if (!serviceName || !servicePrice || !serviceCategory) return alert('Completa todos los campos');
    setSavingService(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editServiceId,
          name: serviceName,
          price: parseInt(servicePrice),
          category: serviceCategory
        })
      });
      const data = await res.json();
      if (data.success) {
        resetServiceForm();
        fetchData();
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este servicio?')) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSaveCalistenia = async () => {
    setSavingCalistenia(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'price_eval', value: priceEval },
            { key: 'price_online_8', value: priceOnline8 },
            { key: 'price_online_12', value: priceOnline12 },
            { key: 'price_presencial_8', value: pricePresencial8 },
            { key: 'price_presencial_12', value: pricePresencial12 },
          ]
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert('Precios de calistenia actualizados');
    } catch (err) {
      console.error('Error guardando calistenia:', err);
      alert('Error guardando precios');
    } finally {
      setSavingCalistenia(false);
    }
  };

  // ─── LOCATIONS HANDLERS ───
  const resetLocationForm = () => {
    setEditLocationId(null);
    setLocationName('');
    setLocationPrice('');
    setShowLocationForm(false);
  };

  const handleEditLocation = (l: LocationItem) => {
    setEditLocationId(l.id);
    setLocationName(l.name);
    setLocationPrice(l.price_surcharge.toString());
    setShowLocationForm(true);
  };

  const handleSaveLocation = async () => {
    if (!locationName || !locationPrice) return alert('Completa todos los campos');
    setSavingLocation(true);
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editLocationId,
          name: locationName,
          price_surcharge: parseInt(locationPrice)
        })
      });
      const data = await res.json();
      if (data.success) {
        resetLocationForm();
        fetchData();
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este sector?')) return;
    try {
      const res = await fetch(`/api/locations?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <header className="mb-10 border-b border-hairline pb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Tarifario Enfermería
        </h1>
        <p className="text-gray-400 mt-2">Administra los servicios clínicos y recargos por comuna del Cotizador Dinámico.</p>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          
          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN: SERVICIOS CLÍNICOS
          ════════════════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Servicios Clínicos</h2>
                  <p className="text-xs text-gray-500">Procedimientos y valores base.</p>
                </div>
              </div>
              {!showServiceForm && (
                <button 
                  onClick={() => setShowServiceForm(true)}
                  className="bg-cyan-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-400 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              )}
            </div>

            {/* Formulario de Servicio */}
            {showServiceForm && (
              <div className="bg-surface p-5 rounded-2xl border border-cyan-500/30 mb-6 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-cyan-400">{editServiceId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                  <button onClick={resetServiceForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nombre del Procedimiento</label>
                  <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="Ej. Instalación Sonda Vesical" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Categoría</label>
                    <input type="text" value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="Ej. Sondas" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Precio ($)</label>
                    <input type="number" value={servicePrice} onChange={e => setServicePrice(e.target.value)} className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="30000" />
                  </div>
                </div>
                <button onClick={handleSaveService} disabled={savingService} className="w-full bg-cyan-500 text-black font-bold py-2 rounded-lg hover:bg-cyan-400 text-sm flex justify-center items-center">
                  {savingService ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Guardar Servicio'}
                </button>
              </div>
            )}

            {/* Lista de Servicios */}
            <div className="bg-surface rounded-2xl border border-hairline-soft overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-medium">Procedimiento</th>
                      <th className="px-4 py-3 font-medium">Categoría</th>
                      <th className="px-4 py-3 font-medium">Valor</th>
                      <th className="px-4 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {services.map(srv => (
                      <tr key={srv.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-3 font-medium">{srv.name}</td>
                        <td className="px-4 py-3 text-gray-400">{srv.category}</td>
                        <td className="px-4 py-3 text-cyan-400 font-mono">${srv.price.toLocaleString('es-CL')}</td>
                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                          <button onClick={() => handleEditService(srv)} className="p-1.5 text-gray-400 hover:text-white hover:bg-foreground/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(srv.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay servicios registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              SECCIÓN: ZONAS Y TRASLADOS
          ════════════════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Zonas de Traslado</h2>
                  <p className="text-xs text-gray-500">Comunas, sectores y sus recargos.</p>
                </div>
              </div>
              {!showLocationForm && (
                <button 
                  onClick={() => setShowLocationForm(true)}
                  className="bg-purple-500 text-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-400 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Nuevo Sector
                </button>
              )}
            </div>

            {/* Formulario de Locación */}
            {showLocationForm && (
              <div className="bg-surface p-5 rounded-2xl border border-purple-500/30 mb-6 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-purple-400">{editLocationId ? 'Editar Sector' : 'Nuevo Sector'}</h3>
                  <button onClick={resetLocationForm} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Nombre del Sector / Comuna</label>
                    <input type="text" value={locationName} onChange={e => setLocationName(e.target.value)} className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" placeholder="Ej. Ensenada" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Recargo ($)</label>
                    <input type="number" value={locationPrice} onChange={e => setLocationPrice(e.target.value)} className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" placeholder="15000" />
                  </div>
                </div>
                <button onClick={handleSaveLocation} disabled={savingLocation} className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-400 text-sm flex justify-center items-center">
                  {savingLocation ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar Sector'}
                </button>
              </div>
            )}

            {/* Lista de Locaciones */}
            <div className="bg-surface rounded-2xl border border-hairline-soft overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-medium">Sector</th>
                      <th className="px-4 py-3 font-medium">Recargo</th>
                      <th className="px-4 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {locations.map(loc => (
                      <tr key={loc.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-3 font-medium">{loc.name}</td>
                        <td className="px-4 py-3 font-mono text-purple-400">
                          {loc.price_surcharge === 0 ? 'Sin recargo' : `+$${loc.price_surcharge.toLocaleString('es-CL')}`}
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                          <button onClick={() => handleEditLocation(loc)} className="p-1.5 text-gray-400 hover:text-white hover:bg-foreground/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {locations.length === 0 && (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No hay sectores registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN: PRECIOS CALISTENIA
      ════════════════════════════════════════════════════════════════ */}
      {!loading && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Precios Calistenia</h2>
                <p className="text-xs text-gray-500">Valores para los planes de entrenamiento (solo números).</p>
              </div>
            </div>
            <button 
              onClick={handleSaveCalistenia} 
              disabled={savingCalistenia}
              className="bg-orange-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-400 flex items-center gap-2"
            >
              {savingCalistenia ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar Precios
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-hairline-soft p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Evaluación Inicial</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={priceEval}
                  onChange={(e) => setPriceEval(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Online (8 Sesiones)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={priceOnline8}
                  onChange={(e) => setPriceOnline8(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Online (12 Sesiones)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={priceOnline12}
                  onChange={(e) => setPriceOnline12(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Presencial (8 Sesiones)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={pricePresencial8}
                  onChange={(e) => setPricePresencial8(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Presencial (12 Sesiones)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={pricePresencial12}
                  onChange={(e) => setPricePresencial12(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
