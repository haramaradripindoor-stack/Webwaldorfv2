import re

with open('app/admin/admisiones/page.tsx', 'r') as f:
    content = f.read()

# 1. Update columns
content = content.replace("title: 'Entrevista Agendada'", "title: 'Tardes de Té (Mes 1)'")
content = content.replace("title: 'En Evaluación'", "title: 'Práctica Viva (Mes 2)'")

# 2. Update type
content = content.replace(
    "notas?: string;", 
    "notas?: string;\n  arquetipo?: string;"
)

# 3. Update LeadCard props
# We'll use regex to safely insert onUpdateArquetipo
leadcard_pattern = r"(function LeadCard\(\{.*?)(\}: \{)(.*?)(\}) \{"
def leadcard_repl(m):
    props = m.group(1) + ", onUpdateArquetipo"
    types = m.group(3) + " onUpdateArquetipo?: (id: string, arq: string) => void; "
    return f"{props}{m.group(2)}{types}{m.group(4)} {{"

content = re.sub(leadcard_pattern, leadcard_repl, content, count=1)

# Add the UI dropdown to LeadCard
arquetipo_ui = """
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
            lead.arquetipo === 'eco_chic_tendencia' ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          <option value="no_evaluado">👽 No Evaluado</option>
          <option value="refugiado_sistema">🌲 Refugiado del Sistema</option>
          <option value="purista_antroposofico">🕯️ Purista Antroposófico</option>
          <option value="eco_chic_tendencia">💅 Eco-Chic / Tendencia</option>
        </select>
      </div>
"""
# Insert it right before the "Niño/a:" box: `<div className="mb-2 bg-[var(--color-waldorf-cream)] p-2 rounded-lg`
content = content.replace(
    '<div className="mb-2 bg-[var(--color-waldorf-cream)] p-2 rounded-lg',
    arquetipo_ui + '\n      <div className="mb-2 bg-[var(--color-waldorf-cream)] p-2 rounded-lg'
)

# 4. Update Column props
column_pattern = r"(function Column\(\{.*?)(\}: \{)(.*?)(\}) \{"
def column_repl(m):
    props = m.group(1) + ", onUpdateArquetipo"
    types = m.group(3) + " onUpdateArquetipo: (id: string, arq: string) => void; "
    return f"{props}{m.group(2)}{types}{m.group(4)} {{"

content = re.sub(column_pattern, column_repl, content, count=1)

# Pass onUpdateArquetipo to LeadCard
content = content.replace(
    "onMove={onMove} isSelected={selectedLeadIds?.includes(lead.id)} onToggleSelect={onToggleSelect}",
    "onMove={onMove} isSelected={selectedLeadIds?.includes(lead.id)} onToggleSelect={onToggleSelect} onUpdateArquetipo={onUpdateArquetipo}"
)

# 5. Add handleUpdateArquetipo to AdmisionesPage
handle_update_arquetipo = """
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
"""

content = content.replace(
    "const handleUpdateCurso = async",
    handle_update_arquetipo + "\n  const handleUpdateCurso = async"
)

# Pass to Column
content = content.replace(
    "selectedLeadIds={selectedLeadIds} onToggleSelect={toggleSelection}",
    "selectedLeadIds={selectedLeadIds} onToggleSelect={toggleSelection} onUpdateArquetipo={handleUpdateArquetipo}"
)

with open('app/admin/admisiones/page.tsx', 'w') as f:
    f.write(content)

print("Patch applied successfully.")
