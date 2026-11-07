import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Chat, Message, ModelInfo, AppHealth, AppSettings } from '../types';
import { api } from '../services/api';

interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  messages: Message[];
  isStreaming: boolean;
  models: ModelInfo[];
  currentModel: string;
  systemHealth: AppHealth | null;
  settings: AppSettings;
  searchQuery: string;
  error: string | null;
  isSidebarOpen: boolean;
  setSearchQuery: (q: string) => void;
  setCurrentModel: (m: string) => void;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectChat: (id: string) => Promise<void>;
  createNewChat: (title?: string, model?: string) => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId?: string) => Promise<void>;
  stopStreaming: () => void;
  renameChat: (id: string, newTitle: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  clearCurrentChatMessages: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  refreshHealth: () => Promise<void>;
  clearError: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  model: 'aura-3.8-flash',
  systemInstruction:
    'You are AURA, an elite AI cognitive partner engineered for clarity, depth, precision, and modern software craftsmanship. Your responses are thoughtful, impeccably formatted in GitHub-flavored Markdown, and free of unnecessary fluff. When providing code, write clean, production-grade code with comments and modern syntax.',
  temperature: 0.7,
  autoScroll: true,
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('aura-3.8-flash');
  const [systemHealth, setSystemHealth] = useState<AppHealth | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('aura_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  useEffect(() => {
    refreshHealth();
    loadModels();
    loadChats();
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_settings', JSON.stringify(settings));
  }, [settings]);

  const refreshHealth = async () => {
    try {
      const health = await api.getHealth();
      setSystemHealth(health);
      if (health.defaultModel) {
        setCurrentModel(health.defaultModel);
      }
    } catch (err) {
      console.warn('Backend server may not be running yet:', err);
    }
  };

  const loadModels = async () => {
    try {
      const data = await api.getModels();
      if (data && data.models) {
        setModels(data.models);
      }
    } catch (err) {
      console.warn('Failed to load models:', err);
    }
  };

  const loadChats = async () => {
    try {
      const list = await api.getChats();
      setChats(list);
      const lastActiveId = localStorage.getItem('aura_active_chat_id');
      if (lastActiveId && list.some((c) => c.id === lastActiveId)) {
        await selectChat(lastActiveId);
      } else if (list.length > 0) {
        await selectChat(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const selectChat = async (id: string) => {
    try {
      setError(null);
      setActiveChatId(id);
      localStorage.setItem('aura_active_chat_id', id);
      const data = await api.getChat(id);
      setMessages(data.messages);
      if (data.chat.model) {
        setCurrentModel(data.chat.model);
      }
    } catch (err: any) {
      console.error('Failed to select chat:', err);
      setError(err.message || 'Failed to load conversation');
    }
  };

  const createNewChat = async (title: string = 'New Conversation', model?: string): Promise<string> => {
    try {
      setError(null);
      const chosenModel = model || currentModel || 'aura-3.8-flash';
      const newChat = await api.createChat(title, chosenModel);
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages([]);
      localStorage.setItem('aura_active_chat_id', newChat.id);
      return newChat.id;
    } catch (err: any) {
      console.error('Failed to create new chat:', err);
      setError(err.message || 'Failed to start conversation');
      throw err;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    let targetChatId = activeChatId;

    if (!targetChatId) {
      targetChatId = await createNewChat('New Conversation', currentModel);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: targetChatId,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    const streamingMessageId = crypto.randomUUID();
    const modelPlaceholder: Message = {
      id: streamingMessageId,
      chat_id: targetChatId,
      role: 'model',
      content: '',
      created_at: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, modelPlaceholder]);
    setIsStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const historyPayload = messages
      .filter((m) => m.content && !m.isStreaming)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      await api.streamChat({
        chatId: targetChatId,
        message: content.trim(),
        history: historyPayload,
        model: currentModel,
        systemInstruction: settings.systemInstruction,
        signal: controller.signal,
        onDelta: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        onDone: (data) => {
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? { ...msg, id: data.messageId || msg.id, isStreaming: false }
                : msg
            )
          );
          if (data.title) {
            setChats((prev) =>
              prev.map((c) => (c.id === targetChatId ? { ...c, title: data.title! } : c))
            );
          }
          abortControllerRef.current = null;
        },
        onError: (errMessage) => {
          setIsStreaming(false);
          setError(errMessage);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      `⚠️ *${errMessage}*\n\nPlease configure your backend service key in the server \`.env\` file.`,
                    isStreaming: false,
                  }
                : msg
            )
          );
          abortControllerRef.current = null;
        },
      });
    } catch (err: any) {
      setIsStreaming(false);
      setError(err.message || 'Stream communication failed');
      abortControllerRef.current = null;
    }
  };

  const regenerateMessage = async (messageId?: string) => {
    if (isStreaming || messages.length === 0) return;

    let lastUserIndex = -1;
    if (messageId) {
      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx > 0 && messages[idx].role === 'model') {
        lastUserIndex = idx - 1;
      }
    } else {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          lastUserIndex = i;
          break;
        }
      }
    }

    if (lastUserIndex === -1) return;

    const userMessageContent = messages[lastUserIndex].content;
    const preservedMessages = messages.slice(0, lastUserIndex);
    setMessages(preservedMessages);

    await sendMessage(userMessageContent);
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
      );
    }
  };

  const renameChat = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const updated = await api.updateChat(id, { title: newTitle.trim() });
      setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: updated.title } : c)));
    } catch (err: any) {
      setError(err.message || 'Failed to rename conversation');
    }
  };

  const deleteChat = async (id: string) => {
    try {
      await api.deleteChat(id);
      const remaining = chats.filter((c) => c.id !== id);
      setChats(remaining);
      if (activeChatId === id) {
        if (remaining.length > 0) {
          selectChat(remaining[0].id);
        } else {
          setActiveChatId(null);
          setMessages([]);
          localStorage.removeItem('aura_active_chat_id');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete conversation');
    }
  };

  const clearCurrentChatMessages = async () => {
    if (!activeChatId) return;
    try {
      await api.clearMessages(activeChatId);
      setMessages([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear conversation messages');
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const clearError = () => setError(null);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        messages,
        isStreaming,
        models,
        currentModel,
        systemHealth,
        settings,
        searchQuery,
        error,
        isSidebarOpen,
        setSearchQuery,
        setCurrentModel,
        setIsSidebarOpen,
        selectChat,
        createNewChat,
        sendMessage,
        regenerateMessage,
        stopStreaming,
        renameChat,
        deleteChat,
        clearCurrentChatMessages,
        updateSettings,
        refreshHealth,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
