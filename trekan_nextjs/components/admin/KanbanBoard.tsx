'use client';

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[70vh]">
      
      {/* Columna 1 */}
      <div className="bg-[#0D0D14] p-5 rounded-3xl border border-hairline-soft flex flex-col shadow-2xl">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div> Nuevas Cotizaciones
          </h2>
          <span className="text-xs bg-foreground/5 px-2 py-1 rounded-full text-gray-400 font-bold">1</span>
        </div>
        
        {/* Card Component */}
        <div className="bg-[#151520] border border-hairline-soft hover:border-cyan-500/50 p-5 rounded-2xl cursor-grab transition-all hover:-translate-y-1 shadow-lg group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-cyan-400 font-bold text-sm bg-cyan-500/10 px-2 py-1 rounded">Curación</span>
            <span className="text-xs text-gray-500 font-medium">Hace 10 min</span>
          </div>
          <p className="text-white font-bold text-lg mb-1">Paciente Alerce</p>
          <p className="text-gray-400 text-sm mb-4">Requiere visita domiciliaria.</p>
          <div className="pt-4 border-t border-hairline-soft flex justify-between items-center text-sm">
            <span className="text-gray-500 font-semibold">Total</span>
            <span className="text-white font-black">$23.000</span>
          </div>
        </div>
      </div>

      {/* Columna 2 */}
      <div className="bg-[#0D0D14] p-5 rounded-3xl border border-hairline-soft flex flex-col shadow-2xl opacity-70">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div> Pago Confirmado
          </h2>
        </div>
        <div className="flex-1 border-2 border-dashed border-hairline-soft rounded-2xl flex items-center justify-center text-gray-600 text-sm font-semibold">
          Arrastra fichas aquí
        </div>
      </div>

      {/* Columna 3 */}
      <div className="bg-[#0D0D14] p-5 rounded-3xl border border-hairline-soft flex flex-col shadow-2xl opacity-70">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-bold text-green-400 uppercase tracking-widest text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div> Atendidos
          </h2>
        </div>
      </div>

    </div>
  );
}
