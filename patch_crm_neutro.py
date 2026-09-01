import re

with open('app/admin/admisiones/page.tsx', 'r') as f:
    content = f.read()

# Replace the dropdown UI to be more neutral
old_ui = """<option value="no_evaluado">👽 No Evaluado</option>
          <option value="refugiado_sistema">🌲 Refugiado del Sistema</option>
          <option value="purista_antroposofico">🕯️ Purista Antroposófico</option>
          <option value="eco_chic_tendencia">💅 Eco-Chic / Tendencia</option>"""

new_ui = """<option value="no_evaluado">⚪ No Evaluado</option>
          <option value="refugiado_sistema">🌲 Refugiado del Sistema (Foco: Alivio)</option>
          <option value="purista_antroposofico">🕯️ Afinidad Antroposófica (Foco: Comunidad)</option>
          <option value="interes_estetico">🎨 Afinidad Visual / Estética (Foco: Expectativas)</option>"""

content = content.replace(old_ui, new_ui)

# Also fix the background color check for the new value
content = content.replace("lead.arquetipo === 'eco_chic_tendencia'", "lead.arquetipo === 'interes_estetico'")

# Now add `requiere_evaluacion_arancel` boolean
# Add it to the type LeadAdmision
content = content.replace(
    "arquetipo?: string;", 
    "arquetipo?: string;\n  requiere_evaluacion_arancel?: boolean;"
)

# Add the UI checkbox to LeadCard just below the Arquetipo selector
checkbox_ui = """
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
"""
# insert it after the arquetipo div which ends with `</div>`
# I'll search for the end of the selector block.
selector_end = "</select>\n      </div>"
content = content.replace(selector_end, selector_end + "\n" + checkbox_ui)


# Add onUpdateArancel to LeadCard props
leadcard_pattern = r"(function LeadCard\(\{.*?)(\}: \{)(.*?)(\}) \{"
def leadcard_repl(m):
    props = m.group(1) + ", onUpdateArancel"
    types = m.group(3) + " onUpdateArancel?: (id: string, req: boolean) => void; "
    return f"{props}{m.group(2)}{types}{m.group(4)} {{"
content = re.sub(leadcard_pattern, leadcard_repl, content, count=1)

# Add onUpdateArancel to Column props
column_pattern = r"(function Column\(\{.*?)(\}: \{)(.*?)(\}) \{"
def column_repl(m):
    props = m.group(1) + ", onUpdateArancel"
    types = m.group(3) + " onUpdateArancel: (id: string, req: boolean) => void; "
    return f"{props}{m.group(2)}{types}{m.group(4)} {{"
content = re.sub(column_pattern, column_repl, content, count=1)

# Pass onUpdateArancel from Column to LeadCard
content = content.replace(
    "onUpdateArquetipo={onUpdateArquetipo}",
    "onUpdateArquetipo={onUpdateArquetipo} onUpdateArancel={onUpdateArancel}"
)

# Add handleUpdateArancel to AdmisionesPage
handle_update_arancel = """
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
"""
content = content.replace(
    "const handleUpdateCurso = async",
    handle_update_arancel + "\n  const handleUpdateCurso = async"
)

# Pass to Column
content = content.replace(
    "onUpdateArquetipo={handleUpdateArquetipo}",
    "onUpdateArquetipo={handleUpdateArquetipo} onUpdateArancel={handleUpdateArancel}"
)

with open('app/admin/admisiones/page.tsx', 'w') as f:
    f.write(content)

print("Patch applied successfully for neutral vocabulary and arancel.")
