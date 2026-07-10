'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Send, Users, History, CheckCircle2, ChevronRight, FileJson, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { emailTemplates } from '@/lib/emailTemplates';

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

type Contact = { email: string; nombre: string; fuente: string; fecha: string; };
type Campaign = { 
  id: string; 
  subject: string; 
  sent_count: number; 
  failed_count: number; 
  status: string; 
  created_at: string; 
  sent_at: string;
  total_opens?: number;
  unique_opens?: number;
};

export default function CampanasPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'contacts' | 'history'>('compose');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Compose State
  const [subject, setSubject] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emailEditorRef = useRef<any>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [sending, setSending] = useState(false);

  // Plantillas eliminadas, ahora usamos el editor visual de Unlayer

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resContacts, resHistory] = await Promise.all([
        fetch('/api/campaigns/contacts'),
        fetch('/api/campaigns')
      ]);
      const jsonContacts = await resContacts.json();
      const jsonHistory = await resHistory.json();

      if (jsonContacts.success) {
        setContacts(jsonContacts.data);
        if (selectAll) setSelectedContacts(jsonContacts.data.map((c: Contact) => c.email));
      }
      if (jsonHistory.success) setCampaigns(jsonHistory.data);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendCampaign = async () => {
    if (!subject) return showMessage('error', 'El asunto del correo es obligatorio.');
    if (selectedContacts.length === 0) return showMessage('error', 'Selecciona al menos un destinatario.');

    if (!emailEditorRef.current?.editor) {
      return showMessage('error', 'El editor visual no está listo aún.');
    }

    emailEditorRef.current.editor.exportHtml(async (data: { html: string }) => {
      const { html } = data;
      
      if (!html || html.trim() === '') {
        return showMessage('error', 'El diseño del correo está vacío.');
      }

      if (!confirm(`¿Estás seguro de enviar esta campaña a ${selectedContacts.length} contactos?`)) return;

      setSending(true);
      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject,
            body_html: html,
            recipients: selectedContacts,
            template: 'unlayer'
          })
        });
        const responseData = await res.json();
        if (responseData.success) {
          showMessage('success', `Campaña enviada: ${responseData.sentCount} exitosos, ${responseData.failedCount} fallidos.`);
          setSubject('');
          fetchData();
          setActiveTab('history');
        } else {
          showMessage('error', responseData.error || 'Error al enviar la campaña.');
        }
      } catch {
        showMessage('error', 'Error de conexión.');
      } finally {
        setSending(false);
      }
    });
  };

  const onEditorReady = (unlayer: unknown) => {
    const editor = unlayer as {
      registerCallback: (
        event: string,
        callback: (
          file: unknown,
          done: (data: { url?: string; error?: boolean }) => void
        ) => Promise<void>
      ) => void;
    };
    editor.registerCallback('image', async (file, done) => {
      try {
        if (!file) {
          console.error('Upload failed: no file provided');
          showMessage('error', 'Error al subir la imagen: No se proporcionó ningún archivo.');
          done({ error: true });
          return;
        }

        let fileToUpload: File | null = null;
        if (file instanceof File) {
          fileToUpload = file;
        } else if (file && typeof file === 'object' && 'attachments' in file) {
          const fileObj = file as { attachments?: unknown[] };
          const attachments = fileObj.attachments;
          if (Array.isArray(attachments) && attachments[0] instanceof File) {
            fileToUpload = attachments[0];
          }
        }

        if (!fileToUpload) {
          console.error('Upload failed: file resolved to null');
          showMessage('error', 'Error al subir la imagen: Archivo inválido.');
          done({ error: true });
          return;
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('bucket', 'gallery');
        formData.append('filePath', `campaigns/${Date.now()}-${fileToUpload.name || 'image.png'}`);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = (await response.json()) as { success?: boolean; publicUrl?: string; error?: string };
        if (result.success && result.publicUrl) {
          done({ url: result.publicUrl });
        } else {
          console.error('Upload failed:', result.error);
          showMessage('error', 'Error al subir la imagen: ' + (result.error || 'Desconocido'));
          done({ error: true });
        }
      } catch (err: unknown) {
        console.error('Upload error:', err);
        const errMsg = err instanceof Error ? err.message : String(err);
        showMessage('error', 'Error al subir la imagen: ' + errMsg);
        done({ error: true });
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
      setSelectAll(false);
    } else {
      setSelectedContacts(contacts.map(c => c.email));
      setSelectAll(true);
    }
  };

  const toggleContact = (email: string) => {
    if (selectedContacts.includes(email)) {
      setSelectedContacts(prev => prev.filter(e => e !== email));
      setSelectAll(false);
    } else {
      const newSelection = [...selectedContacts, email];
      setSelectedContacts(newSelection);
      if (newSelection.length === contacts.length) setSelectAll(true);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    if (contacts.length === 0) return showMessage('error', 'No hay contactos para exportar.');
    const csvContent = "email,nombre,fuente,fecha\n" + contacts.map(c => 
      `${c.email},"${c.nombre || ''}",${c.fuente},${c.fecha}`
    ).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `directorio_contactos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/campaigns/contacts/import', {
        method: 'POST',
        body: formData,
      });
      
      const result = await res.json();
      if (result.success) {
        showMessage('success', `Se importaron ${result.inserted} contactos exitosamente.`);
        fetchData();
      } else {
        showMessage('error', result.error || 'Error al importar contactos.');
      }
    } catch (err) {
      showMessage('error', 'Error de conexión al importar CSV.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <header className="mb-10 border-b border-hairline pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Campañas Email Masivo
          </h1>
          <p className="text-gray-400 mt-2">Envía comunicaciones, promociones y recordatorios a tus pacientes y leads.</p>
        </div>
        
        {/* Main Tabs */}
        <div className="flex bg-surface border border-hairline rounded-xl p-1 shadow-lg overflow-x-auto w-full md:w-auto">
          <button onClick={() => setActiveTab('compose')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'compose' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white'}`}>
            <Send className="w-4 h-4" /> Componer
          </button>
          <button onClick={() => setActiveTab('contacts')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-white'}`}>
            <Users className="w-4 h-4" /> Directorio ({contacts.length})
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}>
            <History className="w-4 h-4" /> Historial
          </button>
        </div>
      </header>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mb-6 p-4 rounded-xl border font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS CONTENT */}
      {loading && activeTab !== 'compose' ? (
        <div className="flex justify-center p-12">
          <span className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="animate-fade-in">
          
          {/* COMPOSER */}
          {activeTab === 'compose' && (
            <div className="flex flex-col gap-8">
              <div className="bg-surface rounded-3xl p-6 border border-hairline-soft shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center justify-between text-white w-full">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" /> Creador Visual de Campañas
                  </div>
                  
                  {/* Selector de Plantillas Pre-armadas */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden md:inline-block">Plantillas:</span>
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          const template = emailTemplates.find(t => t.id === e.target.value);
                          if (template && emailEditorRef.current?.editor) {
                            emailEditorRef.current.editor.loadDesign(template.design);
                            showMessage('success', `Plantilla '${template.name}' cargada con éxito`);
                          }
                          e.target.value = ''; // Reset select
                        }}
                        defaultValue=""
                        className="appearance-none bg-[#1A1A24] border border-hairline text-cyan-400 text-sm font-bold rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors hover:bg-[#20202C]"
                      >
                        <option value="" disabled>Seleccionar Diseño...</option>
                        {emailTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destinatarios ({selectedContacts.length})</label>
                    <div className="bg-background border border-hairline rounded-xl p-3 flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        {selectAll ? 'Todos los contactos seleccionados' : `${selectedContacts.length} contactos seleccionados`}
                      </span>
                      <button onClick={() => setActiveTab('contacts')} className="text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center">
                        Editar Lista <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Asunto del Correo</label>
                    <input 
                      type="text" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)} 
                      placeholder="Ej: ¡Aprovecha un 20% de descuento en tu evaluación!" 
                      className="w-full bg-background border border-hairline rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-colors text-white" 
                    />
                  </div>
                </div>

                <div className="mb-6 rounded-xl overflow-hidden border border-hairline bg-white" style={{ minHeight: '600px' }}>
                  <EmailEditor 
                    ref={emailEditorRef} 
                    minHeight="600px"
                    onReady={onEditorReady}
                    options={{
                      projectId: 0,
                      locale: 'es-ES',
                    }}
                  />
                </div>

                <button 
                  onClick={handleSendCampaign} 
                  disabled={sending || selectedContacts.length === 0} 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center gap-2 text-lg shadow-lg"
                >
                  {sending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? 'Enviando Campaña...' : `Enviar Diseño a ${selectedContacts.length} contactos`}
                </button>
              </div>
            </div>
          )}

          {/* CONTACTS DIRECTORY */}
          {activeTab === 'contacts' && (
            <div className="bg-surface rounded-3xl border border-hairline-soft overflow-hidden shadow-xl">
              <div className="p-6 border-b border-hairline-soft flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Directorio Unificado
                </h2>
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImportCSV} 
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-xs font-bold bg-foreground/5 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Importar CSV
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 text-xs font-bold bg-foreground/5 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                  <div className="w-px h-6 bg-foreground/10 mx-1 hidden md:block"></div>
                  <span className="text-sm text-gray-400 font-bold hidden md:inline">{selectedContacts.length} sel.</span>
                  <button onClick={toggleSelectAll} className="text-xs font-bold bg-foreground/5 hover:bg-foreground/10 px-3 py-1.5 rounded-lg transition-colors">
                    {selectAll ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-gray-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 font-medium w-16 text-center">Sel.</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Nombre / Origen</th>
                      <th className="px-6 py-4 font-medium">Fuente</th>
                      <th className="px-6 py-4 font-medium">Fecha Captura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {contacts.map((c, i) => (
                      <tr key={i} onClick={() => toggleContact(c.email)} className={`cursor-pointer transition-colors ${selectedContacts.includes(c.email) ? 'bg-purple-500/5' : 'hover:bg-foreground/5'}`}>
                        <td className="px-6 py-4 text-center">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center mx-auto transition-colors ${selectedContacts.includes(c.email) ? 'bg-purple-500 border-purple-500' : 'border-gray-600 bg-background'}`}>
                            {selectedContacts.includes(c.email) && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-300">{c.email}</td>
                        <td className="px-6 py-4 font-semibold">{c.nombre}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                            c.fuente === 'chatbot' ? 'bg-emerald-500/10 text-emerald-400' :
                            c.fuente === 'checkout' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-violet-500/10 text-violet-400'
                          }`}>
                            {c.fuente}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {new Date(c.fecha).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No hay contactos registrados aún en la base de datos.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-surface rounded-3xl border border-hairline-soft overflow-hidden shadow-xl">
              <div className="p-6 border-b border-hairline-soft">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  <History className="w-5 h-5" /> Historial de Envíos
                </h2>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-gray-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 font-medium">Asunto</th>
                      <th className="px-6 py-4 font-medium">Fecha Envío</th>
                      <th className="px-6 py-4 font-medium text-center">Exitosos</th>
                      <th className="px-6 py-4 font-medium text-center">Fallidos</th>
                      <th className="px-6 py-4 font-medium text-center">Aperturas (Únicas / Totales)</th>
                      <th className="px-6 py-4 font-medium text-center">Tasa Apertura</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-300 max-w-xs truncate">{camp.subject}</td>
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                          {new Date(camp.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-bold">{camp.sent_count}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded font-bold">{camp.failed_count}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono">
                          <span className="text-cyan-400 font-bold">{camp.unique_opens ?? 0}</span>
                          <span className="text-gray-500"> / </span>
                          <span className="text-gray-400">{camp.total_opens ?? 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                          {camp.sent_count > 0 
                            ? `${((camp.unique_opens ?? 0) / camp.sent_count * 100).toFixed(1)}%` 
                            : '0.0%'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                            camp.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' :
                            camp.status === 'sending' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {camp.status === 'sent' ? 'Completado' : camp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {campaigns.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">No se han enviado campañas aún.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
