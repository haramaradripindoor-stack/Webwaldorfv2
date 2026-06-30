'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Clock, Users, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Tipos para las transacciones
type Transaction = {
  id: string;
  fecha: string;
  paciente: string;
  servicio: string;
  monto: string;
  estado: 'Pagado' | 'Pendiente';
};

// Datos de ejemplo (reemplazar con fetch a Supabase)
const mockTransactions: Transaction[] = [
  { id: '1', fecha: '2026-06-10', paciente: 'Juan Pérez', servicio: 'Calistenia Pro', monto: '$23.000', estado: 'Pagado' },
  { id: '2', fecha: '2026-06-09', paciente: 'María Gómez', servicio: 'Inyección Domicilio', monto: '$15.000', estado: 'Pendiente' },
  { id: '3', fecha: '2026-06-08', paciente: 'Carlos Ruiz', servicio: 'Consulta General', monto: '$12.000', estado: 'Pagado' },
  { id: '4', fecha: '2026-06-07', paciente: 'Ana Torres', servicio: 'Calistenia Pro', monto: '$23.000', estado: 'Pagado' },
  { id: '5', fecha: '2026-06-06', paciente: 'Pedro Silva', servicio: 'Enfermería a Domicilio', monto: '$45.000', estado: 'Pendiente' },
];

const metrics = [
  {
    label: 'Ingresos del Mes',
    value: '$345.000',
    icon: DollarSign,
    color: 'cyan',
    change: '+12.5%',
    trend: 'up' as const,
  },
  {
    label: 'Pagos Pendientes',
    value: '3',
    icon: Clock,
    color: 'yellow',
    change: '-2 esta semana',
    trend: 'down' as const,
  },
  {
    label: 'Pacientes Activos',
    value: '12',
    icon: Users,
    color: 'violet',
    change: '+3 nuevos',
    trend: 'up' as const,
  },
];

export default function FinanzasPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metricsData, setMetricsData] = useState({ ingresos: '$0', pendientes: '0', pacientes: '0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (txData) {
        const formatted: Transaction[] = txData.map((t: any) => ({
          id: t.id,
          fecha: new Date(t.created_at).toLocaleDateString(),
          paciente: t.profiles?.full_name || 'Desconocido',
          servicio: 'Servicio Web',
          monto: `$${t.amount.toLocaleString()}`,
          estado: t.status === 'pagado' ? 'Pagado' : 'Pendiente'
        }));
        setTransactions(formatted);

        // Calculate simple metrics based on fetched data
        const ingresos = txData.filter(t => t.status === 'pagado').reduce((acc, curr) => acc + curr.amount, 0);
        const pendientes = txData.filter(t => t.status === 'pendiente').length;
        const unicos = new Set(txData.map((t: any) => t.profiles?.full_name)).size;
        
        setMetricsData({
          ingresos: `$${ingresos.toLocaleString()}`,
          pendientes: pendientes.toString(),
          pacientes: unicos.toString()
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <header className="mb-10 border-b border-hairline pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Flujo de Caja
            </h1>
            <p className="text-gray-400 mt-2">Control financiero en tiempo real de tu clínica.</p>
          </div>
          <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Junio 2026</span>
          </div>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const colorMap = {
            cyan: {
              iconBg: 'bg-cyan-500/10',
              iconText: 'text-cyan-400',
              border: 'border-cyan-500/20',
              glow: 'shadow-[0_0_30px_rgba(6,182,212,0.08)]',
            },
            yellow: {
              iconBg: 'bg-yellow-500/10',
              iconText: 'text-yellow-400',
              border: 'border-yellow-500/20',
              glow: 'shadow-[0_0_30px_rgba(234,179,8,0.08)]',
            },
            violet: {
              iconBg: 'bg-violet-500/10',
              iconText: 'text-violet-400',
              border: 'border-violet-500/20',
              glow: 'shadow-[0_0_30px_rgba(139,92,246,0.08)]',
            },
          };
          const colors = colorMap[metric.color as keyof typeof colorMap];

          return (
            <div
              key={metric.label}
              className={`relative bg-surface rounded-2xl p-6 border ${colors.border} ${colors.glow} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-opacity-50 group`}
            >
              {/* Gradient border glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    {metric.label}
                  </p>
                  <p className="text-4xl font-black text-white tracking-tight">
                    {loading ? '...' : metric.label === 'Ingresos del Mes' ? metricsData.ingresos : metric.label === 'Pagos Pendientes' ? metricsData.pendientes : metricsData.pacientes}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="text-xs text-emerald-400 font-semibold">{metric.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.iconText}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Table */}
      <div className="bg-surface rounded-2xl border border-hairline-soft overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="px-6 py-5 border-b border-hairline-soft flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Transacciones Recientes</h2>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
            Últimos 30 días
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline-soft">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Paciente
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Servicio
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Monto
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-hairline-soft hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{tx.fecha}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-semibold group-hover:text-cyan-400 transition-colors">
                      {tx.paciente}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{tx.servicio}</td>
                  <td className="px-6 py-4 text-sm text-white font-bold font-mono">{tx.monto}</td>
                  <td className="px-6 py-4">
                    {tx.estado === 'Pagado' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-hairline-soft flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Mostrando <span className="text-white font-semibold">{transactions.length}</span> transacciones
          </p>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Ver todas →
          </button>
        </div>
      </div>
    </div>
  );
}
