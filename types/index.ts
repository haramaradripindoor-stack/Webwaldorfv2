export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  created_at?: string;
}

export interface BotSettings {
  id: string;
  bot_name: string;
  phone_number_id?: string;
  master_prompt: string;
}

export interface Lead {
  id?: string;
  nombre: string;
  servicio: string;
  clasificacion: 'HOT' | 'WARM' | 'COLD';
  estado: string;
  canal: string;
  ultimo_mensaje: string;
  requiere_humano: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AIResponse {
  messageToUser: string;
  leadClassification: 'HOT' | 'WARM' | 'COLD';
  interestedService: string;
  requiresHuman: boolean;
  extractedEntities?: {
    nombre: string | null;
    dolencia: string | null;
    comuna: string | null;
  };
}

