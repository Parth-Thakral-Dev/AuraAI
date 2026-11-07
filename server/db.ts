import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  role: 'user' | 'model' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

interface LocalStore {
  chats: Chat[];
  messages: Message[];
}

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure local storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Supabase if keys provided
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
let useSupabase = false;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    useSupabase = true;
    console.log('[Database] Supabase client initialized with endpoint:', supabaseUrl);
  } catch (err) {
    console.warn('[Database] Failed to initialize Supabase client, falling back to local persistent store.', err);
    useSupabase = false;
  }
} else {
  console.log('[Database] Running in local persistent mode (Supabase credentials not configured in .env).');
}

// Local persistent store helper
function readLocalStore(): LocalStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Database] Error reading local store:', err);
  }
  return { chats: [], messages: [] };
}

function writeLocalStore(store: LocalStore): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Error writing to local store:', err);
  }
}

export const db = {
  isSupabaseConfigured(): boolean {
    return useSupabase && !!supabase;
  },

  async getChats(userId?: string): Promise<Chat[]> {
    if (useSupabase && supabase) {
      try {
        let query = supabase.from('chats').select('*').order('updated_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) return data;
        console.warn('[Database] Supabase getChats error, using local fallback:', error?.message);
      } catch (e) {
        console.warn('[Database] Supabase getChats exception, using local fallback:', e);
      }
    }

    const store = readLocalStore();
    return store.chats.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getChat(id: string): Promise<{ chat: Chat; messages: Message[] } | null> {
    if (useSupabase && supabase) {
      try {
        const { data: chat, error: chatError } = await supabase.from('chats').select('*').eq('id', id).single();
        if (chat && !chatError) {
          const { data: messages } = await supabase.from('messages').select('*').eq('chat_id', id).order('created_at', { ascending: true });
          return { chat, messages: messages || [] };
        }
      } catch (e) {
        console.warn('[Database] Supabase getChat exception, using local fallback:', e);
      }
    }

    const store = readLocalStore();
    const chat = store.chats.find(c => c.id === id);
    if (!chat) return null;
    const messages = store.messages
      .filter(m => m.chat_id === id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return { chat, messages };
  },

  async createChat(title: string = 'New Conversation', model: string = 'gemini-3.8-flash', userId?: string): Promise<Chat> {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      user_id: userId || null,
      title: title || 'New Conversation',
      model: model || 'gemini-3.8-flash',
      pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('chats').insert([newChat]).select().single();
        if (!error && data) return data;
        console.warn('[Database] Supabase createChat error, using local fallback:', error?.message);
      } catch (e) {
        console.warn('[Database] Supabase createChat exception, using local fallback:', e);
      }
    }

    const store = readLocalStore();
    store.chats.unshift(newChat);
    writeLocalStore(store);
    return newChat;
  },

  async updateChat(id: string, updates: Partial<Chat>): Promise<Chat | null> {
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updated_at: now };

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('chats').update(cleanUpdates).eq('id', id).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('[Database] Supabase updateChat exception:', e);
      }
    }

    const store = readLocalStore();
    const index = store.chats.findIndex(c => c.id === id);
    if (index === -1) return null;
    store.chats[index] = { ...store.chats[index], ...cleanUpdates };
    writeLocalStore(store);
    return store.chats[index];
  },

  async deleteChat(id: string): Promise<boolean> {
    if (useSupabase && supabase) {
      try {
        await supabase.from('messages').delete().eq('chat_id', id);
        const { error } = await supabase.from('chats').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('[Database] Supabase deleteChat exception:', e);
      }
    }

    const store = readLocalStore();
    store.chats = store.chats.filter(c => c.id !== id);
    store.messages = store.messages.filter(m => m.chat_id !== id);
    writeLocalStore(store);
    return true;
  },

  async addMessage(chatId: string, role: 'user' | 'model' | 'system', content: string, metadata: Record<string, any> = {}): Promise<Message> {
    const message: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      role,
      content,
      metadata,
      created_at: new Date().toISOString(),
    };

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('messages').insert([message]).select().single();
        if (!error && data) {
          // Touch chat updated_at
          await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', chatId);
          return data;
        }
      } catch (e) {
        console.warn('[Database] Supabase addMessage exception, fallback to local:', e);
      }
    }

    const store = readLocalStore();
    store.messages.push(message);

    // Update parent chat's updated_at timestamp
    const chatIndex = store.chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      store.chats[chatIndex].updated_at = message.created_at;
    }

    writeLocalStore(store);
    return message;
  },

  async clearMessages(chatId: string): Promise<boolean> {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase.from('messages').delete().eq('chat_id', chatId);
        if (!error) return true;
      } catch (e) {
        console.warn('[Database] Supabase clearMessages error:', e);
      }
    }

    const store = readLocalStore();
    store.messages = store.messages.filter(m => m.chat_id !== chatId);
    writeLocalStore(store);
    return true;
  }
};
