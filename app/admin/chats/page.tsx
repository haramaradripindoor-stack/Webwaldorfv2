'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, User, Bot, AlertTriangle, Phone, Mail, Tag, ArrowUpRight, Search, CheckCircle2, Clock } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

type ChatSession = {
  id: string;
  created_at: string;
  status: string;
  messages: ChatMessage[];
};

export default function AuditarChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      const { data: sessionsData, error } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          created_at,
          status,
          chat_messages (
            id, role, content, created_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (sessionsData) {
        const formatted = sessionsData.map((s: any) => ({
          ...s,
          messages: s.chat_messages.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        }));
        setSessions(formatted);
      }
      setLoading(false);
    }
    fetchSessions();
  }, []);

  return (
    <div className="-m-8 flex h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* LEFT COLUMN: INBOX LIST */}
      <div className="w-[340px] flex-shrink-0 border-r border-hairline-soft bg-[#0C0C12] flex flex-col">
        {/* Inbox Header */}
        <div className="h-16 flex-shrink-0 px-5 flex items-center justify-between border-b border-hairline-soft">
          <h2 className="font-semibold text-white tracking-tight">Inbox</h2>
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-foreground/5">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters/Tabs (Plain style) */}
        <div className="px-3 py-2 border-b border-hairline-soft flex gap-1">
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-foreground/10 rounded-md">Todos</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-foreground/5 rounded-md transition-colors">Activos</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-foreground/5 rounded-md transition-colors">Atendidos</button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500 text-sm">No hay chats recientes.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {sessions.map(session => {
                const isSelected = selectedSession?.id === session.id;
                const lastMessage = session.messages[session.messages.length - 1];
                const date = new Date(session.created_at);
                const isToday = date.toDateString() === new Date().toDateString();
                const timeString = isToday 
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-4 border-l-2 transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-white/[0.03]'
                        : 'border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                        Paciente Anónimo
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-violet-400' : 'text-gray-500'}`}>
                        {timeString}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lastMessage?.role === 'assistant' ? (
                        <Bot className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      )}
                      <p className={`text-xs line-clamp-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {lastMessage?.content || 'Iniciando chat...'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CENTER COLUMN: CHAT VIEWER */}
      <div className="flex-1 flex flex-col bg-background relative min-w-0">
        {!selectedSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-10 h-10 mb-4 opacity-20" />
            <p className="text-sm">Selecciona una conversación para verla</p>
          </div>
        ) : (
          <>
            {/* Viewer Header */}
            <div className="h-16 flex-shrink-0 px-6 flex items-center justify-between border-b border-hairline-soft">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  PA
                </div>
                <div>
                  <h3 className="font-semibold text-white leading-tight">Paciente Anónimo</h3>
                  <p className="text-xs text-gray-500 font-mono">ID: {selectedSession.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-hairline-soft text-xs text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Bot Respondiendo
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
              {selectedSession.messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-[#15151D] border border-hairline-soft flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] text-sm leading-relaxed relative group ${
                    msg.role === 'user' 
                      ? 'bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md'
                      : 'bg-[#12121A] text-gray-200 border border-hairline-soft rounded-2xl rounded-tl-sm px-4 py-3'
                  }`}>
                    {msg.content}
                    <span className={`text-[10px] absolute -bottom-5 ${msg.role === 'user' ? 'right-1 text-gray-500' : 'left-1 text-gray-500'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-hairline-soft flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Bar (Mock) */}
            <div className="p-4 bg-background border-t border-hairline-soft">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-200/80 text-xs">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p>Si la IA falló en esta respuesta, actualiza su conocimiento en el <strong>CMS de IA</strong>.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT COLUMN: PATIENT CONTEXT (Mocked for now) */}
      {selectedSession && (
        <div className="w-[300px] flex-shrink-0 border-l border-hairline-soft bg-[#0C0C12] flex flex-col">
          <div className="h-16 flex-shrink-0 px-5 flex items-center border-b border-hairline-soft">
            <h2 className="font-semibold text-white tracking-tight">Contexto del Paciente</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 mb-3 flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                PA
              </div>
              <h3 className="text-base font-semibold text-white">Paciente Anónimo</h3>
              <p className="text-xs text-gray-500 mt-1">+56 9 1234 5678</p>
            </div>

            {/* Badges Stripe-style */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                Lead Nuevo
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                Consulta Online
              </span>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detalles de Contacto</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">No verificado</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">No proporcionado</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Atributos</h4>
                <div className="bg-[#12121A] rounded-xl border border-hairline-soft p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Tarifa Estimada</span>
                    <span className="text-white font-mono">$45.000 CLP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Motivo Inicial</span>
                    <span className="text-gray-300">Dolor lumbar</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-hairline-soft rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2">
                Ver Ficha Completa
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
