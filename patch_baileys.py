with open('app/admin/admisiones/page.tsx', 'r') as f:
    content = f.read()

# 1. Add the handleSendMassive function
massive_function = """
  const handleSendMassiveWhatsApp = async () => {
    const leadsToContact = filteredLeads.filter(l => l.estado === 'nuevo');
    if (leadsToContact.length === 0) {
        alert("No hay prospectos en 'Nuevos Interesados' con los filtros actuales.");
        return;
    }
    
    if (!confirm(`¿Estás segura de que quieres enviar el saludo inicial por WhatsApp a ${leadsToContact.length} prospectos?`)) return;
    
    setLoading(true);
    let successCount = 0;
    
    for (const lead of leadsToContact) {
        if (!lead.telefono_apoderado) continue;
        
        const firstName = (lead.nombre_apoderado || '').split(' ')[0] || 'Familia';
        const msg = `Hola ${firstName}, soy Ivonne del Colegio Waldorf Trekan. Te enviamos información hace poco, pero quería saludarte personalmente por acá. Si sienten que es el momento de conocernos, nos encantaría recibirles en nuestro próximo Encuentro de Bienvenida.`;
        
        try {
            const res = await fetch('http://localhost:3001/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: lead.telefono_apoderado, message: msg })
            });
            
            if (res.ok) {
                // Mover automáticamente al siguiente estado (Encuentro de Bienvenida)
                await supabase.from('leads_admision').update({ estado: 'entrevista' }).eq('id', lead.id);
                successCount++;
            }
        } catch (e) {
            console.error('Error enviando a', lead.telefono_apoderado, e);
        }
        
        // Pausa anti-spam (500ms)
        await new Promise(r => setTimeout(r, 500));
    }
    
    alert(`¡Proceso completado! Se enviaron ${successCount} saludos exitosos y se movieron al Encuentro de Bienvenida.`);
    fetchLeads();
  };

  const deleteSelected = async () => {
"""

if 'handleSendMassiveWhatsApp' not in content:
    content = content.replace("const deleteSelected = async () => {", massive_function)


# 2. Add the UI button next to the viewMode toggles
button_ui = """
          <label className="text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-2">Acciones</label>
          <div className="flex gap-2">
            <button 
              onClick={handleSendMassiveWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-sm"
              title="Abre el servidor Baileys antes de usar"
            >
              <MessageSquare className="w-4 h-4" /> Enviar Saludo Masivo
            </button>
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
"""

if 'handleSendMassiveWhatsApp}' not in content:
    content = content.replace(
        '<label className="text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-2">Vista</label>\n          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">',
        button_ui
    )


with open('app/admin/admisiones/page.tsx', 'w') as f:
    f.write(content)

print("CRM Patched with Baileys Button")
