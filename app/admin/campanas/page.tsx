'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Send, Users, History, CheckCircle2, ChevronRight, FileJson, Download, Upload, Plus, Trash2, Edit2, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { emailTemplates } from '@/lib/emailTemplates';

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

type Contact = { email: string; nombre: string; fuente: string; fecha: string; tags?: string[]; };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // Contact CRUD state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalMode, setContactModalMode] = useState<'create' | 'edit'>('create');
  const [editingContact, setEditingContact] = useState<{ email: string; nombre: string; oldEmail?: string }>({ email: '', nombre: '' });
  const [crudLoading, setCrudLoading] = useState(false);

  // Tagging State
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [taggingLoading, setTaggingLoading] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState(''); 
  const [selectedFuenteFilter, setSelectedFuenteFilter] = useState('');
  const [selectedCampaignTag, setSelectedCampaignTag] = useState('');

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags || []))).sort();
  const allFuentes = Array.from(new Set(contacts.map(c => c.fuente || 'Desconocida').filter(Boolean))).sort();

  const filteredContacts = contacts.filter(c => {
    if (selectedTagFilter && !c.tags?.includes(selectedTagFilter)) return false;
    if (selectedFuenteFilter && (c.fuente || 'Desconocida') !== selectedFuenteFilter) return false;
    return true;
  });

  // Plantillas eliminadas, ahora usamos el editor visual de Unlayer

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const deleteContacts = async (emails: string[]) => {
    if (!confirm(`¿Seguro que deseas eliminar permanentemente ${emails.length === 1 ? 'este contacto' : 'estos contactos'} de la base de datos?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/campaigns/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', `${emails.length} contactos eliminados.`);
        setSelectedContacts(prev => prev.filter(e => !emails.includes(e)));
        fetchData();
      } else {
        showMessage('error', data.error || 'Error al eliminar');
      }
    } catch {
      showMessage('error', 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    if (!editingContact.email) return showMessage('error', 'El email es requerido');
    
    setCrudLoading(true);
    try {
      const method = contactModalMode === 'create' ? 'POST' : 'PUT';
      const body = contactModalMode === 'create' 
        ? { email: editingContact.email, nombre: editingContact.nombre }
        : { oldEmail: editingContact.oldEmail, newEmail: editingContact.email, newNombre: editingContact.nombre };

      const res = await fetch('/api/campaigns/contacts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.success) {
        showMessage('success', contactModalMode === 'create' ? 'Contacto creado' : 'Contacto actualizado');
        setIsContactModalOpen(false);
        fetchData();
      } else {
        showMessage('error', data.error || 'Error al guardar contacto');
      }
    } catch {
      showMessage('error', 'Error de red');
    } finally {
      setCrudLoading(false);
    }
  };

  const handleSaveTags = async () => {
    if (!tagInput.trim()) return showMessage('error', 'Escribe una etiqueta.');
    setTaggingLoading(true);
    try {
      const res = await fetch('/api/campaigns/contacts/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: selectedContacts, tags: [tagInput.trim()] })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', `Etiqueta añadida a ${selectedContacts.length} contactos.`);
        setIsTagModalOpen(false);
        setTagInput('');
        fetchData();
      } else {
        showMessage('error', data.error || 'Error al guardar etiquetas');
      }
    } catch {
      showMessage('error', 'Error de red');
    } finally {
      setTaggingLoading(false);
    }
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

    if (!editorInstance) {
      return showMessage('error', 'El editor visual no está listo aún.');
    }

    editorInstance.exportHtml(async (data: { html: string }) => {
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
    setEditorInstance(unlayer);
    const editor = unlayer as {
      registerCallback: (
        event: string,
        callback: (
          file: unknown,
          done: (data: { url?: string; error?: boolean }) => void
        ) => Promise<void>
      ) => void;
      loadDesign: (design: any) => void;
    };
    
    // Cargar la primera plantilla automáticamente para que no esté en blanco
    if (emailTemplates && emailTemplates.length > 0) {
      editor.loadDesign(emailTemplates[0].design);
    }
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
      setSelectedContacts(filteredContacts.map(c => c.email));
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
    <div className="w-full">
      {/* Header */}
      <header className="mb-10 border-b border-[var(--color-waldorf-sage)]/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-[var(--color-waldorf-moss)]">
            Campañas Email Masivo
          </h1>
          <p className="text-[var(--color-waldorf-text-light)] mt-2 font-medium">Envía comunicaciones, boletines y recordatorios a la comunidad escolar y prospectos.</p>
        </div>
        
        {/* Main Tabs */}
        <div className="flex bg-white border border-[var(--color-waldorf-sage)]/20 rounded-xl p-1 shadow-sm overflow-x-auto w-full md:w-auto">
          <button onClick={() => setActiveTab('compose')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'compose' ? 'bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] shadow-sm' : 'text-gray-500 hover:text-[var(--color-waldorf-moss)]'}`}>
            <Send className="w-4 h-4" /> Componer
          </button>
          <button onClick={() => setActiveTab('contacts')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] shadow-sm' : 'text-gray-500 hover:text-[var(--color-waldorf-moss)]'}`}>
            <Users className="w-4 h-4" /> Directorio ({contacts.length})
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] shadow-sm' : 'text-gray-500 hover:text-[var(--color-waldorf-moss)]'}`}>
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
              <div className="bg-white rounded-3xl p-6 border border-[var(--color-waldorf-sage)]/20 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center justify-between text-[var(--color-waldorf-moss)] w-full">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[var(--color-waldorf-terracotta)]" /> Creador Visual de Campañas
                  </div>
                  
                  {/* Selector de Plantillas Pre-armadas */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-waldorf-text-light)] font-bold uppercase tracking-widest hidden md:inline-block">Plantillas:</span>
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          const template = emailTemplates.find(t => t.id === e.target.value);
                          if (template) {
                            if (editorInstance) {
                              editorInstance.loadDesign(template.design);
                              showMessage('success', `Plantilla '${template.name}' cargada con éxito`);
                            } else if (emailEditorRef.current?.editor) {
                              emailEditorRef.current.editor.loadDesign(template.design);
                              showMessage('success', `Plantilla '${template.name}' cargada con éxito`);
                            } else {
                              showMessage('error', 'El editor aún no está listo. Espera unos segundos.');
                            }
                          }
                          e.target.value = ''; // Reset select
                        }}
                        defaultValue=""
                        className="appearance-none bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] text-sm font-bold rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-[var(--color-waldorf-moss)] cursor-pointer transition-colors hover:bg-gray-50 shadow-sm"
                      >
                        <option value="" disabled>Seleccionar Diseño...</option>
                        {emailTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-[var(--color-waldorf-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-2">Destinatarios ({selectedContacts.length})</label>
                    <div className="bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 rounded-xl p-3 flex justify-between items-center text-sm shadow-inner mb-3">
                      <span className="text-[var(--color-waldorf-moss)] font-medium">
                        {selectedContacts.length === contacts.length ? 'Todos los contactos de la base (60+)' : `${selectedContacts.length} destinatarios filtrados`}
                      </span>
                      <button onClick={() => setActiveTab('contacts')} className="text-[var(--color-waldorf-terracotta)] hover:opacity-80 font-bold text-xs flex items-center">
                        Editar Lista <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Tag filter for compose */}
                    <div className="relative">
                      <select 
                        value={selectedCampaignTag}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCampaignTag(val);
                          if (!val) {
                            setSelectedContacts(contacts.map(c => c.email));
                            setSelectAll(true);
                          } else if (val.startsWith('tag:')) {
                            const tag = val.replace('tag:', '');
                            const filtered = contacts.filter(c => c.tags?.includes(tag)).map(c => c.email);
                            setSelectedContacts(filtered);
                            setSelectAll(false);
                          } else if (val.startsWith('fuente:')) {
                            const fuente = val.replace('fuente:', '');
                            const filtered = contacts.filter(c => (c.fuente || 'Desconocida') === fuente).map(c => c.email);
                            setSelectedContacts(filtered);
                            setSelectAll(false);
                          }
                        }}
                        className="w-full bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--color-waldorf-moss)] cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="">Enviar a todos los contactos ({contacts.length})</option>
                        <optgroup label="Por Etiqueta">
                          {allTags.map(t => (
                            <option key={`tag:${t}`} value={`tag:${t}`}>Solo a etiqueta: {t}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Por Fuente (Origen)">
                          {allFuentes.map(f => (
                            <option key={`fuente:${f}`} value={`fuente:${f}`}>Solo a fuente: {f}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-2">Asunto del Correo</label>
                    <input 
                      type="text" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)} 
                      placeholder="Ej: ¡Aprovecha un 20% de descuento en tu evaluación!" 
                      className="w-full bg-[var(--color-waldorf-paper)] border border-[var(--color-waldorf-sage)]/20 rounded-xl p-3 text-sm focus:border-[var(--color-waldorf-moss)] outline-none transition-colors text-[var(--color-waldorf-text)] shadow-inner" 
                    />
                  </div>
                </div>

                <div className="mb-6 rounded-xl overflow-hidden border border-[var(--color-waldorf-sage)]/20 bg-white shadow-sm" style={{ minHeight: '600px' }}>
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
                  className="w-full bg-[var(--color-waldorf-terracotta)] text-white font-bold py-4 rounded-xl hover:bg-[var(--color-waldorf-moss)] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-lg shadow-md"
                >
                  {sending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? 'Enviando Campaña...' : `Enviar Diseño a ${selectedContacts.length} contactos`}
                </button>
              </div>
            </div>
          )}

          {/* CONTACTS DIRECTORY */}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-3xl border border-[var(--color-waldorf-sage)]/20 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-waldorf-sage)]/20 flex justify-between items-center bg-[var(--color-waldorf-paper)]">
                <h2 className="text-xl font-bold text-[var(--color-waldorf-moss)] flex items-center gap-2">
                  <Users className="w-5 h-5" /> Directorio Unificado
                </h2>
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <select 
                    value={selectedTagFilter}
                    onChange={(e) => setSelectedTagFilter(e.target.value)}
                    className="bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="">Todas las Etiquetas</option>
                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select 
                    value={selectedFuenteFilter}
                    onChange={(e) => setSelectedFuenteFilter(e.target.value)}
                    className="bg-white border border-[var(--color-waldorf-sage)]/30 text-[var(--color-waldorf-moss)] text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="">Todas las Fuentes</option>
                    {allFuentes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImportCSV} 
                  />
                  <button onClick={() => {
                    setContactModalMode('create');
                    setEditingContact({ email: '', nombre: '' });
                    setIsContactModalOpen(true);
                  }} className="flex items-center gap-2 text-xs font-bold bg-[var(--color-waldorf-moss)] text-white hover:bg-[#2b4c3b] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Nuevo Contacto
                  </button>
                  {selectedContacts.length > 0 && (
                    <>
                      <button onClick={() => setIsTagModalOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                        <Tag className="w-3.5 h-3.5" /> Etiquetar ({selectedContacts.length})
                      </button>
                      <button onClick={() => deleteContacts(selectedContacts)} className="flex items-center gap-2 text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar ({selectedContacts.length})
                      </button>
                    </>
                  )}
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-xs font-bold bg-white border border-[var(--color-waldorf-sage)]/30 hover:bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" /> Importar CSV
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 text-xs font-bold bg-white border border-[var(--color-waldorf-sage)]/30 hover:bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                  <div className="w-px h-6 bg-[var(--color-waldorf-sage)]/30 mx-1 hidden md:block"></div>
                  <span className="text-sm text-[var(--color-waldorf-text-light)] font-bold hidden md:inline">{selectedContacts.length} sel.</span>
                  <button onClick={toggleSelectAll} className="text-xs font-bold bg-white border border-[var(--color-waldorf-sage)]/30 hover:bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                    {selectAll ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-waldorf-paper)] text-xs uppercase text-[var(--color-waldorf-moss)] font-bold sticky top-0 z-10 border-b border-[var(--color-waldorf-sage)]/20">
                    <tr>
                      <th className="px-6 py-4 text-center">Sel.</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Nombre / Origen</th>
                      <th className="px-6 py-4">Etiquetas</th>
                      <th className="px-6 py-4">Fuente</th>
                      <th className="px-6 py-4">Fecha Captura</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-waldorf-sage)]/10">
                    {filteredContacts.map((c, i) => (
                      <tr key={i} onClick={() => toggleContact(c.email)} className={`group cursor-pointer transition-colors ${selectedContacts.includes(c.email) ? 'bg-[var(--color-waldorf-cream)]' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 text-center">
                          <div className={`w-5 h-5 rounded flex items-center justify-center mx-auto transition-colors border ${selectedContacts.includes(c.email) ? 'bg-[var(--color-waldorf-terracotta)] border-[var(--color-waldorf-terracotta)]' : 'border-gray-300 bg-white'}`}>
                            {selectedContacts.includes(c.email) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-[var(--color-waldorf-text-light)] text-xs">{c.email}</td>
                        <td className="px-6 py-4 font-bold text-[var(--color-waldorf-moss)]">{c.nombre || 'Desconocido'}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {c.tags && c.tags.length > 0 ? c.tags.map(t => (
                              <span key={t} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-moss)] border border-[var(--color-waldorf-sage)]/30">
                                {t}
                              </span>
                            )) : <span className="text-xs text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                            c.fuente === 'chatbot' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            c.fuente === 'checkout' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-violet-50 text-violet-600 border-violet-200'
                          }`}>
                            {c.fuente}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-waldorf-text-light)] font-mono text-xs">
                          {new Date(c.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => {
                            e.stopPropagation();
                            setContactModalMode('edit');
                            setEditingContact({ email: c.email, nombre: c.nombre, oldEmail: c.email });
                            setIsContactModalOpen(true);
                          }} className="p-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors text-gray-500" title="Editar">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            deleteContacts([c.email]);
                          }} className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors text-gray-500" title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--color-waldorf-text-light)] font-medium">No hay contactos registrados aún en la base de datos.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl border border-[var(--color-waldorf-sage)]/20 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[var(--color-waldorf-sage)]/20 bg-[var(--color-waldorf-paper)]">
                <h2 className="text-xl font-bold text-[var(--color-waldorf-moss)] flex items-center gap-2">
                  <History className="w-5 h-5" /> Historial de Envíos
                </h2>
              </div>
              
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-waldorf-paper)] text-xs uppercase text-[var(--color-waldorf-moss)] font-bold sticky top-0 z-10 border-b border-[var(--color-waldorf-sage)]/20">
                    <tr>
                      <th className="px-6 py-4">Asunto</th>
                      <th className="px-6 py-4">Fecha Envío</th>
                      <th className="px-6 py-4 text-center">Exitosos</th>
                      <th className="px-6 py-4 text-center">Fallidos</th>
                      <th className="px-6 py-4 text-center">Aperturas (Únicas / Totales)</th>
                      <th className="px-6 py-4 text-center">Tasa Apertura</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-waldorf-sage)]/10">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[var(--color-waldorf-moss)] max-w-xs truncate">{camp.subject}</td>
                        <td className="px-6 py-4 font-mono text-[var(--color-waldorf-text-light)] text-xs">
                          {new Date(camp.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded font-bold">{camp.sent_count}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-mono text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded font-bold">{camp.failed_count}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono">
                          <span className="text-[var(--color-waldorf-moss)] font-bold">{camp.unique_opens ?? 0}</span>
                          <span className="text-[var(--color-waldorf-text-light)]"> / </span>
                          <span className="text-[var(--color-waldorf-text-light)]">{camp.total_opens ?? 0}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-[var(--color-waldorf-terracotta)]">
                          {camp.sent_count > 0 
                            ? `${((camp.unique_opens ?? 0) / camp.sent_count * 100).toFixed(1)}%` 
                            : '0.0%'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full border ${
                            camp.status === 'sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            camp.status === 'sending' ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {camp.status === 'sent' ? 'Completado' : camp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {campaigns.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-[var(--color-waldorf-text-light)] font-medium">No se han enviado campañas aún.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODAL CRUD CONTACTO */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--color-waldorf-sage)]/30">
              <div className="bg-[var(--color-waldorf-paper)] p-5 border-b border-[var(--color-waldorf-sage)]/20 flex justify-between items-center">
                <h3 className="font-bold font-serif text-[var(--color-waldorf-moss)] text-lg">
                  {contactModalMode === 'create' ? 'Crear Nuevo Contacto' : 'Editar Contacto'}
                </h3>
                <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingContact.nombre}
                    onChange={e => setEditingContact({...editingContact, nombre: e.target.value})}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-waldorf-moss)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={editingContact.email}
                    onChange={e => setEditingContact({...editingContact, email: e.target.value})}
                    placeholder="Ej: correo@ejemplo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-waldorf-moss)] outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-[var(--color-waldorf-sage)]/10 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSaveContact} disabled={crudLoading} className="px-6 py-2 bg-[var(--color-waldorf-moss)] text-white text-sm font-bold rounded-lg hover:bg-[#2b4c3b] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                  {crudLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL ETIQUETAR */}
      <AnimatePresence>
        {isTagModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--color-waldorf-sage)]/30">
              <div className="bg-[var(--color-waldorf-paper)] p-5 border-b border-[var(--color-waldorf-sage)]/20 flex justify-between items-center">
                <h3 className="font-bold font-serif text-[var(--color-waldorf-moss)] text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5" /> Etiquetar Contactos
                </h3>
                <button onClick={() => setIsTagModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[var(--color-waldorf-text-light)]">Añadiendo etiqueta a <strong>{selectedContacts.length}</strong> contactos seleccionados.</p>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-1">Nombre de la Etiqueta</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Ej: Apoderados 2025"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-waldorf-moss)] outline-none transition-colors"
                  />
                </div>
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-waldorf-text-light)] uppercase tracking-widest mb-2">O selecciona una existente:</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(t => (
                        <button key={t} onClick={() => setTagInput(t)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${tagInput === t ? 'bg-[var(--color-waldorf-moss)] text-white border-[var(--color-waldorf-moss)]' : 'bg-white text-[var(--color-waldorf-text-light)] border-[var(--color-waldorf-sage)]/30 hover:bg-[var(--color-waldorf-cream)]'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-[var(--color-waldorf-sage)]/10 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsTagModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSaveTags} disabled={taggingLoading} className="px-6 py-2 bg-[var(--color-waldorf-moss)] text-white text-sm font-bold rounded-lg hover:bg-[#2b4c3b] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                  {taggingLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
