'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Bot, AlertTriangle, Plus, Phone, Edit3 } from 'lucide-react';

type BotSetting = {
  id: string;
  bot_name: string;
  phone_number_id: string;
  master_prompt: string;
};

export default function BotConfigPage() {
  const [bots, setBots] = useState<BotSetting[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [botName, setBotName] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [prompt, setPrompt] = useState('');

  const loadBots = async () => {
    const { data, error } = await supabase.from('bot_settings').select('*').order('created_at', { ascending: true });
    if (data) {
      setBots(data);
      if (data.length > 0 && !selectedBotId) {
        selectBot(data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBots();
  }, []);

  const selectBot = (bot: BotSetting) => {
    setSelectedBotId(bot.id);
    setBotName(bot.bot_name || '');
    setPhoneId(bot.phone_number_id || '');
    setPrompt(bot.master_prompt || '');
  };

  const handleNewBot = () => {
    setSelectedBotId('new');
    setBotName('Nuevo Bot');
    setPhoneId('');
    setPrompt('Eres un nuevo asistente...');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      if (selectedBotId === 'new') {
        const { data, error } = await supabase.from('bot_settings').insert([{ 
          bot_name: botName, 
          phone_number_id: phoneId, 
          master_prompt: prompt 
        }]).select().single();
        if (error) throw error;
        setMessage('¡Bot creado con éxito!');
        setSelectedBotId(data.id);
        loadBots();
      } else {
        const { error } = await supabase.from('bot_settings').update({ 
          bot_name: botName, 
          phone_number_id: phoneId, 
          master_prompt: prompt 
        }).eq('id', selectedBotId);
        if (error) throw error;
        setMessage('¡Cerebro del Bot actualizado!');
        loadBots();
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar. Verifica los permisos o si el Phone ID ya existe.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-hairline pb-6">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Bot className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Cerebro de la IA
            </h1>
            <p className="text-gray-400">Instrucciones y personalidad de tu asistente virtual.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Cargando cerebro...</p>
        ) : selectedBotId ? (
          <div className="bg-surface border border-hairline rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              <div className="text-sm text-yellow-200">
                <strong className="block mb-1">Zona Crítica de Instrucciones</strong>
                Escribe las reglas de tu clínica, precios y tono de voz. La IA leerá esto antes de responder cada mensaje.
              </div>
            </div>

            <label className="block text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3">
              Master Prompt (Instrucciones)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-96 bg-background text-gray-300 p-6 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none transition-colors font-mono text-sm leading-relaxed resize-none shadow-inner"
              placeholder="Escribe las instrucciones aquí..."
            />

            <div className="mt-6 flex items-center justify-between">
              <span className="text-green-400 font-medium animate-pulse">{message}</span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Guardando...' : 'Guardar Instrucciones'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-hairline-soft rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Bot className="w-16 h-16 text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Sistema No Configurado</h3>
            <p className="text-sm text-gray-600 mt-2">Contacta a soporte para inicializar tu asistente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
