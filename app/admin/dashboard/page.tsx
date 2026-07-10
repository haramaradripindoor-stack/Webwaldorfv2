'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Mail, ShoppingCart, TrendingUp } from 'lucide-react';

const COLORS = ['#00d4a4', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalIntents: 0,
    emailsSent: 0,
    leadsByStatus: [] as any[],
    leadsByDate: [] as any[],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Total Leads
        const { count: leadsCount, data: leadsData } = await supabase
          .from('chat_leads')
          .select('created_at, clasificacion', { count: 'exact' });

        // 2. Total Intents
        const { count: intentsCount } = await supabase
          .from('checkout_intents')
          .select('*', { count: 'exact', head: true });

        // 3. Emails sent
        const { data: campaignsData } = await supabase
          .from('email_campaigns')
          .select('sent_count');
        const totalEmails = campaignsData?.reduce((acc, curr) => acc + (curr.sent_count || 0), 0) || 0;

        // Formatear datos para gráficos
        const statusCount: Record<string, number> = {};
        const dateCount: Record<string, number> = {};

        leadsData?.forEach(lead => {
          // Status
          const status = lead.clasificacion || 'Sin clasificar';
          statusCount[status] = (statusCount[status] || 0) + 1;

          // Date (agrupar por día)
          const date = new Date(lead.created_at).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' });
          dateCount[date] = (dateCount[date] || 0) + 1;
        });

        const formattedStatus = Object.keys(statusCount).map(key => ({
          name: key,
          value: statusCount[key]
        }));

        // Ordenar fechas cronológicamente
        const formattedDates = Object.keys(dateCount).map(key => ({
          fecha: key,
          leads: dateCount[key]
        }));

        setStats({
          totalLeads: leadsCount || 0,
          totalIntents: intentsCount || 0,
          emailsSent: totalEmails,
          leadsByStatus: formattedStatus,
          leadsByDate: formattedDates
        });

      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Métricas y Rendimiento
          </h1>
          <p className="text-gray-400 mt-1">Análisis de captación y conversión en tiempo real</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-gray-800 bg-[#0A0A10] shadow-xl relative overflow-hidden group">
          <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-blue-500/10 -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Users size={24} /></div>
          </div>
          <h3 className="text-gray-400 font-medium text-sm">Leads Totales</h3>
          <p className="text-4xl font-bold text-white">{loading ? '-' : stats.totalLeads}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-gray-800 bg-[#0A0A10] shadow-xl relative overflow-hidden group">
          <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-emerald-500/10 -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><ShoppingCart size={24} /></div>
          </div>
          <h3 className="text-gray-400 font-medium text-sm">Intenciones de Reserva</h3>
          <p className="text-4xl font-bold text-white">{loading ? '-' : stats.totalIntents}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-gray-800 bg-[#0A0A10] shadow-xl relative overflow-hidden group">
          <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-purple-500/10 -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400"><Mail size={24} /></div>
          </div>
          <h3 className="text-gray-400 font-medium text-sm">Correos Masivos Enviados</h3>
          <p className="text-4xl font-bold text-white">{loading ? '-' : stats.emailsSent}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart: Leads over time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-gray-800 bg-[#0A0A10] shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Adquisición de Leads (Por Día)</h2>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Cargando gráfico...</div>
            ) : stats.leadsByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.leadsByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#00d4a4' }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="#00d4a4" strokeWidth={3} dot={{ r: 4, fill: '#00d4a4' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No hay datos suficientes</div>
            )}
          </div>
        </motion.div>

        {/* Pie Chart: Leads by Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl border border-gray-800 bg-[#0A0A10] shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Distribución de Leads (Embudo)</h2>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Cargando gráfico...</div>
            ) : stats.leadsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.leadsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No hay datos suficientes</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stats.leadsByStatus.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-400">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
