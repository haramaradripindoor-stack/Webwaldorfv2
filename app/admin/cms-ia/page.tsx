'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Database,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Loader2,
  Phone,
  Code,
  ArrowRight,
} from 'lucide-react';

// Types matching database schemas
type BotSetting = {
  id: string;
  bot_name: string;
  phone_number_id: string;
  master_prompt: string;
  model: 'llama-3.3-70b-versatile' | 'meta-llama/llama-3-70b-instruct' | string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type KnowledgeChunk = {
  id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
};

type QuickReply = {
  id: string;
  title: string;
  shortcut: string;
  message: string;
  created_at?: string;
  updated_at?: string;
};

type Toast = {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
};

export default function PremiumCmsIaPage() {
  const [activeTab, setActiveTab] = useState<'agente' | 'rag' | 'faqs' | 'plantillas'>('agente');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);

  // --- TOAST HELPER ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // ==========================================
  // STATE & EFFECTS: TAB 1 (AGENTE)
  // ==========================================
  const [bots, setBots] = useState<BotSetting[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [botForm, setBotForm] = useState<{
    bot_name: string;
    phone_number_id: string;
    master_prompt: string;
    model: string;
    temperature: number;
    top_p: number;
    max_tokens: number;
    is_active: boolean;
  }>({
    bot_name: '',
    phone_number_id: '',
    master_prompt: '',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1000,
    is_active: true,
  });
  const [savingBot, setSavingBot] = useState(false);

  const loadBots = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_settings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setBots(data);
        // Default select the first one if none selected or selected id is invalid
        if (!selectedBotId || !data.some((b) => b.id === selectedBotId)) {
          selectBot(data[0]);
        }
      } else {
        setBots([]);
        setSelectedBotId(null);
      }
    } catch (err: any) {
      addToast('Error al cargar bots: ' + err.message, 'error');
    }
  };

  const selectBot = (bot: BotSetting) => {
    setSelectedBotId(bot.id);
    setBotForm({
      bot_name: bot.bot_name || '',
      phone_number_id: bot.phone_number_id || '',
      master_prompt: bot.master_prompt || '',
      model: bot.model || 'llama-3.3-70b-versatile',
      temperature: bot.temperature ?? 0.7,
      top_p: bot.top_p ?? 0.9,
      max_tokens: bot.max_tokens ?? 1000,
      is_active: bot.is_active ?? true,
    });
  };

  const handleCreateNewBotState = () => {
    setSelectedBotId('new');
    setBotForm({
      bot_name: 'Nuevo Bot Asistente',
      phone_number_id: '',
      master_prompt: 'Eres un asistente virtual premium para la Clínica GAP...',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
      is_active: true,
    });
  };

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botForm.bot_name.trim() || !botForm.master_prompt.trim()) {
      addToast('El nombre del bot y las instrucciones son obligatorios', 'error');
      return;
    }

    setSavingBot(true);
    try {
      if (selectedBotId === 'new') {
        const { data, error } = await supabase
          .from('bot_settings')
          .insert([botForm])
          .select()
          .single();

        if (error) throw error;
        addToast('¡Bot creado exitosamente!');
        setSelectedBotId(data.id);
      } else {
        const { error } = await supabase
          .from('bot_settings')
          .update(botForm)
          .eq('id', selectedBotId);

        if (error) throw error;
        addToast('¡Cerebro del Bot guardado correctamente!');
      }
      await loadBots();
    } catch (err: any) {
      console.error(err);
      addToast('Error al guardar bot: ' + err.message, 'error');
    } finally {
      setSavingBot(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!selectedBotId || selectedBotId === 'new') return;
    if (!confirm(`¿Estás seguro de que deseas eliminar el bot "${botForm.bot_name}"?`)) return;

    try {
      const { error } = await supabase.from('bot_settings').delete().eq('id', selectedBotId);
      if (error) throw error;

      addToast('Bot eliminado con éxito');
      setSelectedBotId(null);
      await loadBots();
    } catch (err: any) {
      addToast('Error al eliminar bot: ' + err.message, 'error');
    }
  };

  // ==========================================
  // STATE & EFFECTS: TAB 2 (RAG)
  // ==========================================
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [searchChunk, setSearchChunk] = useState('');
  const [editingChunkId, setEditingChunkId] = useState<string | null>(null);
  const [chunkContent, setChunkContent] = useState('');
  const [isSavingChunk, setIsSavingChunk] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  const loadChunks = async () => {
    try {
      const res = await fetch('/api/rag/chunk');
      const json = await res.json();
      if (res.ok && json.success) {
        setChunks(json.data || []);
      } else {
        throw new Error(json.error || 'Fallo al recuperar los chunks');
      }
    } catch (err: any) {
      addToast('Error RAG: ' + err.message, 'error');
    }
  };

  const handleSaveChunk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chunkContent.trim()) return;

    setIsSavingChunk(true);
    try {
      const res = await fetch('/api/rag/chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingChunkId || undefined,
          content: chunkContent,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al guardar chunk');

      addToast(editingChunkId ? 'Fragmento actualizado' : 'Nuevo fragmento RAG agregado');
      setChunkContent('');
      setEditingChunkId(null);
      await loadChunks();
    } catch (err: any) {
      addToast('Error al guardar: ' + err.message, 'error');
    } finally {
      setIsSavingChunk(false);
    }
  };

  const handleDeleteChunk = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este fragmento de conocimiento?')) return;
    try {
      const res = await fetch(`/api/rag/chunk?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error al eliminar');

      addToast('Fragmento de conocimiento eliminado');
      await loadChunks();
    } catch (err: any) {
      addToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    addToast('Iniciando reindexación de embeddings con Cohere...', 'info');

    try {
      const res = await fetch('/api/rag/reindex', {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error en el servidor al reindexar');
      }
      addToast(`Sincronización completada. Cohere embed-multilingual-v3.0 reindexó exitosamente ${json.count} fragmentos.`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Error al reindexar: ' + err.message, 'error');
    } finally {
      setIsReindexing(false);
    }
  };

  // ==========================================
  // STATE & EFFECTS: TAB 3 (FAQS)
  // ==========================================
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState({ question: '', answer: '' });
  const [savingFaq, setSavingFaq] = useState(false);

  const loadFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (err: any) {
      addToast('Error FAQs: ' + err.message, 'error');
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    setSavingFaq(true);
    try {
      const { error } = await supabase.from('faqs').insert([faqForm]);
      if (error) throw error;

      addToast('Pregunta Frecuente agregada');
      setFaqForm({ question: '', answer: '' });
      await loadFaqs();
    } catch (err: any) {
      addToast('Error al guardar FAQ: ' + err.message, 'error');
    } finally {
      setSavingFaq(false);
    }
  };

  const handleStartEditFaq = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setEditFaqForm({ question: faq.question, answer: faq.answer });
  };

  const handleSaveEditFaq = async (id: string) => {
    if (!editFaqForm.question.trim() || !editFaqForm.answer.trim()) return;
    try {
      const { error } = await supabase
        .from('faqs')
        .update(editFaqForm)
        .eq('id', id);

      if (error) throw error;
      addToast('FAQ actualizada');
      setEditingFaqId(null);
      await loadFaqs();
    } catch (err: any) {
      addToast('Error al actualizar FAQ: ' + err.message, 'error');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta pregunta frecuente?')) return;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;

      addToast('Pregunta frecuente eliminada');
      await loadFaqs();
    } catch (err: any) {
      addToast('Error al eliminar FAQ: ' + err.message, 'error');
    }
  };

  // ==========================================
  // STATE & EFFECTS: TAB 4 (PLANTILLAS / QUICK REPLIES)
  // ==========================================
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [qrForm, setQrForm] = useState({ title: '', shortcut: '', message: '' });
  const [editingQrId, setEditingQrId] = useState<string | null>(null);
  const [editQrForm, setEditQrForm] = useState({ title: '', shortcut: '', message: '' });
  const [savingQr, setSavingQr] = useState(false);

  const loadQuickReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_replies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuickReplies(data || []);
    } catch (err: any) {
      addToast('Error Plantillas: ' + err.message, 'error');
    }
  };

  const handleAddQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrForm.title.trim() || !qrForm.shortcut.trim() || !qrForm.message.trim()) return;

    let shortcut = qrForm.shortcut.trim();
    if (!shortcut.startsWith('/')) {
      shortcut = '/' + shortcut;
    }

    setSavingQr(true);
    try {
      const { error } = await supabase.from('quick_replies').insert([{ ...qrForm, shortcut }]);
      if (error) throw error;

      addToast('Plantilla (Quick Reply) creada');
      setQrForm({ title: '', shortcut: '', message: '' });
      await loadQuickReplies();
    } catch (err: any) {
      addToast('Error al guardar plantilla: ' + err.message, 'error');
    } finally {
      setSavingQr(false);
    }
  };

  const handleStartEditQr = (qr: QuickReply) => {
    setEditingQrId(qr.id);
    setEditQrForm({ title: qr.title, shortcut: qr.shortcut, message: qr.message });
  };

  const handleSaveEditQr = async (id: string) => {
    if (!editQrForm.title.trim() || !editQrForm.shortcut.trim() || !editQrForm.message.trim()) return;

    let shortcut = editQrForm.shortcut.trim();
    if (!shortcut.startsWith('/')) {
      shortcut = '/' + shortcut;
    }

    try {
      const { error } = await supabase
        .from('quick_replies')
        .update({ ...editQrForm, shortcut })
        .eq('id', id);

      if (error) throw error;
      addToast('Plantilla actualizada');
      setEditingQrId(null);
      await loadQuickReplies();
    } catch (err: any) {
      addToast('Error al actualizar plantilla: ' + err.message, 'error');
    }
  };

  const handleDeleteQr = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta plantilla de respuesta rápida?')) return;
    try {
      const { error } = await supabase.from('quick_replies').delete().eq('id', id);
      if (error) throw error;

      addToast('Plantilla de respuesta rápida eliminada');
      await loadQuickReplies();
    } catch (err: any) {
      addToast('Error al eliminar plantilla: ' + err.message, 'error');
    }
  };

  // ==========================================
  // MAIN INITIAL LOAD
  // ==========================================
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([loadBots(), loadChunks(), loadFaqs(), loadQuickReplies()]);
      setLoading(false);
    };
    initData();
  }, []);

  // Filtered RAG Chunks
  const filteredChunks = chunks.filter((chunk) =>
    chunk.content.toLowerCase().includes(searchChunk.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans antialiased relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00d4a4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Toasts container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl border flex items-start gap-3 pointer-events-auto shadow-2xl ${
                toast.type === 'success'
                  ? 'bg-[#111814] border-[#00d4a4]/20 text-[#00d4a4]'
                  : toast.type === 'error'
                  ? 'bg-[#1c1112] border-red-500/20 text-red-400'
                  : 'bg-[#11151c] border-blue-500/20 text-blue-400'
              }`}
            >
              <div className="mt-0.5">
                {toast.type === 'success' && <Check className="w-5 h-5" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                {toast.type === 'info' && <Sparkles className="w-5 h-5 animate-pulse" />}
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-hairline-soft pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#00d4a4]/10 text-[#00d4a4] rounded-full border border-[#00d4a4]/20 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Core Engine
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#00d4a4] tracking-tight">
              CMS de Inteligencia Artificial
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              Configura el cerebro LLM del bot de WhatsApp e Instagram, gestiona la base de conocimiento vectorial (RAG), responde FAQs predefinidas y define atajos de respuesta rápida.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#00d4a4] animate-ping" />
            <span className="text-xs font-mono text-gray-500 bg-foreground/5 border border-hairline px-3 py-1.5 rounded-lg">
              v3.2 Chilean Market
            </span>
          </div>
        </div>

        {/* Tab switch navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface/80 backdrop-blur-md border border-hairline-soft rounded-2xl mb-8 max-w-fit shadow-xl">
          {[
            { id: 'agente', label: 'Agente Asistente', icon: Bot },
            { id: 'rag', label: 'Base RAG (Vectores)', icon: Database },
            { id: 'faqs', label: 'Respuestas FAQs', icon: HelpCircle },
            { id: 'plantillas', label: 'Plantillas Rápidas', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive ? 'text-[#00d4a4]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-[#00d4a4]/10 to-emerald-500/5 border border-[#00d4a4]/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 relative z-10 ${isActive ? 'text-[#00d4a4]' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Page loading spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 border border-hairline-soft bg-surface/40 rounded-3xl backdrop-blur-lg">
            <Loader2 className="w-10 h-10 text-[#00d4a4] animate-spin mb-4" />
            <p className="text-gray-400 text-sm animate-pulse font-medium">Sincronizando con base de datos Supabase...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* ==========================================
                  TAB CONTENT: AGENTE IA
                  ========================================== */}
              {activeTab === 'agente' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left panel: Bots list selector */}
                  <div className="lg:col-span-1 bg-surface border border-hairline-soft rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-hairline-soft pb-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Asistentes</h3>
                      <button
                        onClick={handleCreateNewBotState}
                        className="p-1.5 bg-[#00d4a4]/10 border border-[#00d4a4]/20 text-[#00d4a4] hover:bg-[#00d4a4]/20 transition-all rounded-lg"
                        title="Crear Nuevo Bot"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                      {bots.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-6">No hay bots configurados.</p>
                      ) : (
                        bots.map((bot) => (
                          <button
                            key={bot.id}
                            onClick={() => selectBot(bot)}
                            className={`p-4 rounded-2xl border text-left transition-all ${
                              selectedBotId === bot.id
                                ? 'bg-[#00d4a4]/5 border-[#00d4a4]/30 text-white shadow-[0_0_15px_rgba(0,212,164,0.05)]'
                                : 'bg-[#0A0A0E] border-hairline-soft text-gray-400 hover:text-white hover:border-hairline'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-sm block truncate max-w-[120px]">
                                {bot.bot_name}
                              </span>
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  bot.is_active ? 'bg-[#00d4a4]' : 'bg-red-500'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              {bot.phone_number_id || 'Sin Número ID'}
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                    {selectedBotId === 'new' && (
                      <div className="p-4 rounded-2xl bg-[#00d4a4]/5 border border-dashed border-[#00d4a4]/30 text-[#00d4a4] text-xs font-semibold flex items-center gap-2 justify-center">
                        <Plus className="w-4 h-4" /> Creando Nuevo Bot
                      </div>
                    )}
                  </div>

                  {/* Right panel: Active Bot configuration */}
                  <div className="lg:col-span-3">
                    {selectedBotId ? (
                      <form
                        onSubmit={handleSaveBot}
                        className="bg-surface border border-hairline-soft rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                      >
                        {/* Status notification banner */}
                        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex gap-4 items-start">
                          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="text-xs md:text-sm text-yellow-200">
                            <strong className="block mb-1 font-bold">Zona Crítica de Instrucciones</strong>
                            El Master Prompt define la personalidad y límites éticos de tu IA. Escribe reglas precisas, números de contacto autorizados y políticas de servicio.
                          </div>
                        </div>

                        {/* Top settings row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2.5">
                              Nombre del Bot Asistente
                            </label>
                            <input
                              type="text"
                              value={botForm.bot_name}
                              onChange={(e) => setBotForm({ ...botForm, bot_name: e.target.value })}
                              placeholder="Ej. Clínica GAP Assistant"
                              className="w-full bg-[#0A0A0E] text-foreground px-4 py-3.5 rounded-xl border border-hairline-soft focus:border-[#00d4a4] focus:ring-1 focus:ring-[#00d4a4]/30 outline-none transition-all text-sm font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2.5">
                              Meta Phone Number ID
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={botForm.phone_number_id}
                                onChange={(e) =>
                                  setBotForm({ ...botForm, phone_number_id: e.target.value })
                                }
                                placeholder="Ej. 1092837482910"
                                className="w-full bg-[#0A0A0E] text-white pl-11 pr-4 py-3.5 rounded-xl border border-hairline-soft focus:border-[#00d4a4] focus:ring-1 focus:ring-[#00d4a4]/30 outline-none transition-all text-sm font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2.5">
                              Modelo de Lenguaje (LLM)
                            </label>
                            <select
                              value={botForm.model}
                              onChange={(e) => setBotForm({ ...botForm, model: e.target.value })}
                              className="w-full bg-[#0A0A0E] text-foreground px-4 py-3.5 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-sm font-medium"
                            >
                              <optgroup label="Modelos Gratuitos (Groq / OpenRouter)">
                                <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Velocidad y Lógica - Groq)</option>
                                <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B (Alta Precisión - OpenRouter)</option>
                              </optgroup>
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2.5">
                              Estado Global del Bot
                            </label>
                            <div className="flex items-center justify-between bg-[#0A0A0E] border border-hairline-soft px-5 py-3 rounded-xl">
                              <span className="text-sm font-medium text-gray-300">
                                {botForm.is_active ? 'Bot Activado' : 'Bot Apagado / Kill-switch'}
                              </span>
                              {/* Custom Switch Toggle */}
                              <button
                                type="button"
                                onClick={() => setBotForm({ ...botForm, is_active: !botForm.is_active })}
                                className={`relative w-12 h-6 rounded-full p-1 transition-colors ${
                                  botForm.is_active ? 'bg-[#00d4a4]' : 'bg-gray-800'
                                }`}
                              >
                                <motion.div
                                  layout
                                  className="w-4 h-4 rounded-full bg-background"
                                  animate={{ x: botForm.is_active ? 24 : 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Parámetros Avanzados LLM */}
                        <div className="mb-6 p-5 bg-background/50 border border-hairline-soft rounded-2xl">
                          <h4 className="text-[#00d4a4] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" /> Controles Avanzados de IA
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Temperatura</label>
                                <span className="text-[#00d4a4] text-xs font-mono">{botForm.temperature}</span>
                              </div>
                              <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={botForm.temperature}
                                onChange={(e) => setBotForm({ ...botForm, temperature: parseFloat(e.target.value) })}
                                className="w-full accent-[#00d4a4]"
                              />
                              <p className="text-[10px] text-gray-500 mt-1">Creatividad (0.6 - 0.7 recomendado)</p>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Top P</label>
                                <span className="text-[#00d4a4] text-xs font-mono">{botForm.top_p}</span>
                              </div>
                              <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={botForm.top_p}
                                onChange={(e) => setBotForm({ ...botForm, top_p: parseFloat(e.target.value) })}
                                className="w-full accent-[#00d4a4]"
                              />
                              <p className="text-[10px] text-gray-500 mt-1">Diversidad (0.9 recomendado)</p>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Max Tokens</label>
                                <span className="text-[#00d4a4] text-xs font-mono">{botForm.max_tokens}</span>
                              </div>
                              <input
                                type="number"
                                min="100" max="4000" step="100"
                                value={botForm.max_tokens}
                                onChange={(e) => setBotForm({ ...botForm, max_tokens: parseInt(e.target.value) })}
                                className="w-full bg-[#0A0A0E] text-white px-3 py-1.5 rounded-lg border border-hairline-soft focus:border-[#00d4a4] outline-none text-sm font-mono"
                              />
                              <p className="text-[10px] text-gray-500 mt-1">Límite de respuesta (800-1000 rec.)</p>
                            </div>
                          </div>
                        </div>

                        {/* Master Prompt Instruction Text Area */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2.5">
                            <label className="block text-[#00d4a4] text-xs font-bold uppercase tracking-widest">
                              Instrucciones del Sistema (Master Prompt)
                            </label>
                            <span className="text-[10px] font-mono text-gray-500">
                              Formato System Context
                            </span>
                          </div>
                          <textarea
                            value={botForm.master_prompt}
                            onChange={(e) => setBotForm({ ...botForm, master_prompt: e.target.value })}
                            className="w-full h-80 bg-[#0A0A0E] text-gray-300 p-5 rounded-2xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all font-mono text-xs md:text-sm leading-relaxed resize-none shadow-inner"
                            placeholder="Ej. Actúa como el asistente dental experto de Clínica GAP..."
                          />
                        </div>

                        {/* Form Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hairline-soft pt-6">
                          {selectedBotId !== 'new' ? (
                            <button
                              type="button"
                              onClick={handleDeleteBot}
                              className="text-red-400 hover:text-red-300 font-semibold text-sm transition-all hover:bg-red-500/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-transparent hover:border-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" /> Eliminar Configuración
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (bots.length > 0) {
                                  selectBot(bots[0]);
                                } else {
                                  setSelectedBotId(null);
                                }
                              }}
                              className="text-gray-400 hover:text-white font-semibold text-sm transition-all px-4 py-2 rounded-xl"
                            >
                              Cancelar
                            </button>
                          )}

                          <button
                            type="submit"
                            disabled={savingBot}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#00d4a4] to-emerald-600 px-8 py-3.5 rounded-xl text-black font-extrabold text-sm hover:shadow-[0_0_25px_rgba(0,212,164,0.35)] transition-all disabled:opacity-50"
                          >
                            {savingBot ? (
                              <>
                                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Guardando...
                              </>
                            ) : (
                              <>
                                <Save className="w-4.5 h-4.5" /> Guardar Cambios
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-surface border border-hairline-soft rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                        <Bot className="w-16 h-16 text-gray-700 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-gray-300">Ningún Bot Seleccionado</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                          Sincroniza y configura un bot de mensajería agregando un asistente con credenciales de Meta y modelo IA.
                        </p>
                        <button
                          onClick={handleCreateNewBotState}
                          className="mt-6 bg-[#00d4a4]/10 border border-[#00d4a4]/20 hover:bg-[#00d4a4]/20 text-[#00d4a4] transition-all px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4.5 h-4.5" /> Crear Nuevo Asistente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB CONTENT: BASE RAG (EMBEDDINGS)
                  ========================================== */}
              {activeTab === 'rag' && (
                <div className="space-y-6">
                  {/* Summary & Reindex Area */}
                  <div className="bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[30%] h-full bg-[#00d4a4]/5 blur-[60px] pointer-events-none" />
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        <Database className="w-5 h-5 text-[#00d4a4]" /> Base Vectorial RAG (Fichas Clínicas)
                      </h3>
                      <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
                        Sube trozos de texto con detalles sobre tratamientos, horarios, doctores y promociones. El sistema transformará este texto en vectores numéricos de 1024 dimensiones para realizar búsquedas semánticas eficientes en tiempo real.
                      </p>
                    </div>
                    <button
                      onClick={handleReindex}
                      disabled={isReindexing || chunks.length === 0}
                      className="bg-transparent border border-[#00d4a4]/30 hover:border-[#00d4a4] text-[#00d4a4] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,212,164,0.15)] disabled:opacity-40"
                    >
                      <RefreshCw className={`w-4 h-4 ${isReindexing ? 'animate-spin' : ''}`} />
                      {isReindexing ? 'Reindexando...' : 'Re-indexar Embeddings'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Write section */}
                    <div className="lg:col-span-1 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-hairline-soft">
                        {editingChunkId ? 'Editar Fragmento' : 'Agregar Fragmento de Información'}
                      </h4>
                      <form onSubmit={handleSaveChunk} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Contenido del Fragmento
                          </label>
                          <textarea
                            value={chunkContent}
                            onChange={(e) => setChunkContent(e.target.value)}
                            placeholder="Escribe la información de relevancia. Ej: El Dr. Sebastián León atiende los martes de 09:00 a 14:00 en la sucursal de Puerto Varas..."
                            className="w-full h-64 bg-[#0A0A0E] text-gray-200 p-4 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm leading-relaxed resize-none"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          {editingChunkId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingChunkId(null);
                                setChunkContent('');
                              }}
                              className="text-gray-400 hover:text-white font-semibold text-xs transition-all py-2 px-3 rounded-lg"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isSavingChunk}
                            className="bg-[#00d4a4]/10 border border-[#00d4a4]/20 hover:bg-[#00d4a4]/20 text-[#00d4a4] font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            {isSavingChunk ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                {editingChunkId ? 'Actualizar Chunk' : 'Agregar Chunk'}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* List section */}
                    <div className="lg:col-span-2 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-hairline-soft pb-4">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={searchChunk}
                            onChange={(e) => setSearchChunk(e.target.value)}
                            placeholder="Buscar fragmentos por texto..."
                            className="w-full bg-[#0A0A0E] text-white pl-10 pr-4 py-2.5 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm"
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                          {filteredChunks.length} de {chunks.length} registros
                        </span>
                      </div>

                      {/* Chunks grid list */}
                      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {filteredChunks.length === 0 ? (
                          <div className="text-center py-16 text-gray-600">
                            <Database className="w-8 h-8 mx-auto mb-2 text-gray-800" />
                            No se encontraron fragmentos semánticos.
                          </div>
                        ) : (
                          filteredChunks.map((chunk) => {
                            const isExpanded = expandedChunkId === chunk.id;
                            const previewText =
                              chunk.content.length > 180 && !isExpanded
                                ? chunk.content.slice(0, 180) + '...'
                                : chunk.content;

                            return (
                              <motion.div
                                key={chunk.id}
                                layout
                                className={`p-4 md:p-5 rounded-2xl bg-[#0A0A0E] border transition-all ${
                                  editingChunkId === chunk.id
                                    ? 'border-[#00d4a4]/30 bg-[#00d4a4]/2'
                                    : 'border-hairline-soft hover:border-hairline'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <span className="px-2 py-0.5 text-[9px] font-mono bg-foreground/5 rounded text-gray-500 border border-hairline-soft">
                                    Vectorial ID: {chunk.id.slice(0, 8)}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingChunkId(chunk.id);
                                        setChunkContent(chunk.content);
                                      }}
                                      className="p-1 hover:text-[#00d4a4] text-gray-500 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit className="w-4.5 h-4.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteChunk(chunk.id)}
                                      className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-mono select-all">
                                  {previewText}
                                </p>

                                {chunk.content.length > 180 && (
                                  <button
                                    onClick={() =>
                                      setExpandedChunkId(isExpanded ? null : chunk.id)
                                    }
                                    className="text-[10px] text-[#00d4a4] font-semibold mt-2 hover:underline transition-all block"
                                  >
                                    {isExpanded ? 'Ver menos' : 'Expandir fragmento completo'}
                                  </button>
                                )}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB CONTENT: PREGUNTAS FRECUENTES (FAQS)
                  ========================================== */}
              {activeTab === 'faqs' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form section */}
                  <div className="lg:col-span-1 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-hairline-soft">
                      Agregar Pregunta Frecuente
                    </h4>
                    <form onSubmit={handleAddFaq} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Pregunta Estándar
                        </label>
                        <input
                          type="text"
                          value={faqForm.question}
                          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                          placeholder="Ej: ¿Cuáles son las formas de pago?"
                          className="w-full bg-[#0A0A0E] text-foreground px-4 py-3 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Respuesta Exacta de la IA
                        </label>
                        <textarea
                          value={faqForm.answer}
                          onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                          placeholder="Ej: Aceptamos Webpay (Flow), transferencia directa y Mercado Pago..."
                          className="w-full h-32 bg-[#0A0A0E] text-gray-200 p-4 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm leading-relaxed resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingFaq}
                        className="w-full bg-[#00d4a4] text-black font-extrabold text-xs py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,212,164,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        {savingFaq ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Agregar FAQ
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* List section */}
                  <div className="lg:col-span-2 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-hairline-soft">
                      Tabla de Respuestas Configuradas
                    </h3>

                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                      {faqs.length === 0 ? (
                        <div className="text-center py-20 text-gray-600 text-sm">
                          No hay preguntas registradas en el sistema.
                        </div>
                      ) : (
                        faqs.map((faq) => (
                          <div
                            key={faq.id}
                            className="p-5 rounded-2xl bg-[#0A0A0E] border border-hairline-soft flex flex-col gap-3 relative"
                          >
                            {editingFaqId === faq.id ? (
                              <div className="space-y-3 w-full">
                                <input
                                  type="text"
                                  value={editFaqForm.question}
                                  onChange={(e) =>
                                    setEditFaqForm({ ...editFaqForm, question: e.target.value })
                                  }
                                  className="w-full bg-surface text-white px-3 py-2 rounded-lg border border-[#00d4a4]/30 focus:border-[#00d4a4] outline-none text-xs md:text-sm font-semibold"
                                />
                                <textarea
                                  value={editFaqForm.answer}
                                  onChange={(e) =>
                                    setEditFaqForm({ ...editFaqForm, answer: e.target.value })
                                  }
                                  className="w-full bg-surface text-gray-200 p-3 rounded-lg border border-[#00d4a4]/30 focus:border-[#00d4a4] outline-none text-xs md:text-sm leading-relaxed resize-none h-24"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingFaqId(null)}
                                    className="px-3 py-1.5 text-gray-400 hover:text-white text-xs font-semibold"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleSaveEditFaq(faq.id)}
                                    className="bg-[#00d4a4]/10 border border-[#00d4a4]/20 text-[#00d4a4] px-4.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00d4a4]/20 transition-all"
                                  >
                                    Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-4">
                                  <span className="font-extrabold text-sm text-[#00d4a4] flex items-center gap-1.5">
                                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#00d4a4]/10 rounded border border-[#00d4a4]/20">
                                      Pregunta
                                    </span>
                                    {faq.question}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleStartEditFaq(faq)}
                                      className="p-1 hover:text-[#00d4a4] text-gray-500 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFaq(faq.id)}
                                      className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-surface/40 border border-hairline-soft p-4 rounded-xl">
                                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB CONTENT: PLANTILLAS (QUICK REPLIES)
                  ========================================== */}
              {activeTab === 'plantillas' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form section */}
                  <div className="lg:col-span-1 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-hairline-soft">
                      Agregar Plantilla Rápida
                    </h4>
                    <form onSubmit={handleAddQr} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Título Interno
                        </label>
                        <input
                          type="text"
                          value={qrForm.title}
                          onChange={(e) => setQrForm({ ...qrForm, title: e.target.value })}
                          placeholder="Ej: Agendar Cita"
                          className="w-full bg-[#0A0A0E] text-foreground px-4 py-3 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Atajo (Shortcut)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">
                            /
                          </span>
                          <input
                            type="text"
                            value={qrForm.shortcut.replace(/^\//, '')}
                            onChange={(e) => setQrForm({ ...qrForm, shortcut: e.target.value })}
                            placeholder="agenda"
                            className="w-full bg-[#0A0A0E] text-white pl-7 pr-4 py-3 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm font-mono"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 font-mono">
                          Comando rápido de teclado en el chat (ej: /agenda)
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Mensaje Rápido Predefinido
                        </label>
                        <textarea
                          value={qrForm.message}
                          onChange={(e) => setQrForm({ ...qrForm, message: e.target.value })}
                          placeholder="Ej: Hola, puedes agendar tu cita dental aquí: clinicagap.cl/agendar..."
                          className="w-full h-32 bg-[#0A0A0E] text-gray-200 p-4 rounded-xl border border-hairline-soft focus:border-[#00d4a4] outline-none transition-all text-xs md:text-sm leading-relaxed resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingQr}
                        className="w-full bg-[#00d4a4] text-black font-extrabold text-xs py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,212,164,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        {savingQr ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Agregar Plantilla
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* List section */}
                  <div className="lg:col-span-2 bg-surface border border-hairline-soft rounded-3xl p-6 shadow-2xl">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-hairline-soft">
                      Fichas de Respuestas Rápidas (Chips)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                      {quickReplies.length === 0 ? (
                        <div className="col-span-2 text-center py-20 text-gray-600 text-sm">
                          No hay plantillas registradas en el sistema.
                        </div>
                      ) : (
                        quickReplies.map((qr) => (
                          <div
                            key={qr.id}
                            className="p-5 rounded-2xl bg-[#0A0A0E] border border-hairline-soft flex flex-col gap-3 relative justify-between"
                          >
                            {editingQrId === qr.id ? (
                              <div className="space-y-3 w-full">
                                <input
                                  type="text"
                                  value={editQrForm.title}
                                  onChange={(e) =>
                                    setEditQrForm({ ...editQrForm, title: e.target.value })
                                  }
                                  placeholder="Título"
                                  className="w-full bg-surface text-white px-3 py-2 rounded-lg border border-[#00d4a4]/30 focus:border-[#00d4a4] outline-none text-xs md:text-sm font-semibold"
                                />
                                <input
                                  type="text"
                                  value={editQrForm.shortcut}
                                  onChange={(e) =>
                                    setEditQrForm({ ...editQrForm, shortcut: e.target.value })
                                  }
                                  placeholder="Shortcut"
                                  className="w-full bg-surface text-white px-3 py-2 rounded-lg border border-[#00d4a4]/30 focus:border-[#00d4a4] outline-none text-xs md:text-sm font-mono"
                                />
                                <textarea
                                  value={editQrForm.message}
                                  onChange={(e) =>
                                    setEditQrForm({ ...editQrForm, message: e.target.value })
                                  }
                                  className="w-full bg-surface text-gray-200 p-3 rounded-lg border border-[#00d4a4]/30 focus:border-[#00d4a4] outline-none text-xs md:text-sm leading-relaxed resize-none h-24"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingQrId(null)}
                                    className="px-3 py-1.5 text-gray-400 hover:text-white text-xs font-semibold"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleSaveEditQr(qr.id)}
                                    className="bg-[#00d4a4]/10 border border-[#00d4a4]/20 text-[#00d4a4] px-4.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00d4a4]/20 transition-all"
                                  >
                                    Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <div className="flex items-center justify-between gap-4 mb-2">
                                    <span className="font-extrabold text-sm text-white">
                                      {qr.title}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleStartEditQr(qr)}
                                        className="p-1 hover:text-[#00d4a4] text-gray-500 transition-colors"
                                        title="Editar"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteQr(qr.id)}
                                        className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                                        title="Eliminar"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00d4a4]/10 text-[#00d4a4] border border-[#00d4a4]/20 rounded-md">
                                      {qr.shortcut}
                                    </span>
                                  </div>
                                  <div className="bg-surface/40 border border-hairline-soft p-4 rounded-xl">
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed select-all">
                                      {qr.message}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
