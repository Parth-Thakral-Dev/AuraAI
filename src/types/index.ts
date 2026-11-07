export interface Chat {
  id: string;
  user_id?: string | null;
  title: string;
  model: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'model' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  isStreaming?: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  tag: string;
  description: string;
  contextWindow: string;
  speed: string;
}

export interface AppHealth {
  status: string;
  version: string;
  engineConfigured: boolean;
  supabaseConfigured: boolean;
  storageMode: string;
  defaultModel: string;
}

export interface AppSettings {
  model: string;
  systemInstruction: string;
  temperature: number;
  autoScroll: boolean;
  apiKeyOverride?: string;
}
