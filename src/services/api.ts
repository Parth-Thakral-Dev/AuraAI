import { Chat, Message, ModelInfo, AppHealth } from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<AppHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getModels(): Promise<{ models: ModelInfo[]; defaultModel: string }> {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch available models');
    return res.json();
  },

  async getChats(userId?: string): Promise<Chat[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE}/chats${query}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async getChat(id: string): Promise<{ chat: Chat; messages: Message[] }> {
    const res = await fetch(`${API_BASE}/chats/${id}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  },

  async createChat(title: string = 'New Conversation', model: string = 'aura-3.8-flash'): Promise<Chat> {
    const res = await fetch(`${API_BASE}/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, model }),
    });
    if (!res.ok) throw new Error('Failed to create new conversation');
    return res.json();
  },

  async updateChat(id: string, updates: Partial<Chat>): Promise<Chat> {
    const res = await fetch(`${API_BASE}/chats/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update conversation');
    return res.json();
  },

  async deleteChat(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/chats/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
    const data = await res.json();
    return data.success;
  },

  async clearMessages(chatId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear messages');
    const data = await res.json();
    return data.success;
  },

  /**
   * Connect to Server-Sent Events stream for real-time AI response
   */
  async streamChat({
    chatId,
    message,
    history,
    model = 'aura-3.8-flash',
    systemInstruction,
    signal,
    onDelta,
    onDone,
    onError,
  }: {
    chatId: string;
    message: string;
    history: Array<{ role: string; content: string }>;
    model?: string;
    systemInstruction?: string;
    signal?: AbortSignal;
    onDelta: (chunk: string) => void;
    onDone: (data: { chatId: string; messageId: string; title?: string }) => void;
    onError: (errMessage: string) => void;
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          message,
          history,
          model,
          systemInstruction,
        }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = errorText;
        try {
          const json = JSON.parse(errorText);
          parsedMessage = json.error || errorText;
        } catch (_) {}
        onError(parsedMessage || `Server responded with status ${response.status}`);
        return;
      }

      if (!response.body) {
        onError('Response body is missing');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              if (data.type === 'delta') {
                onDelta(data.content);
              } else if (data.type === 'done') {
                onDone(data);
              } else if (data.type === 'error') {
                onError(data.error);
              }
            } catch (e) {
              console.error('Failed to parse SSE JSON payload', e, jsonStr);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Stream chat exception:', err);
      onError(err.message || 'Network stream error');
    }
  },
};
