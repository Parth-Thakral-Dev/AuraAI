import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { streamChatResponse, generateChatTitle, SUPPORTED_MODELS, getEngineClient } from './gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Health & Config endpoint
app.get('/api/health', (req, res) => {
  const engineConfigured = !!getEngineClient();
  const supabaseConfigured = db.isSupabaseConfigured();

  res.json({
    status: 'ok',
    version: '1.0.0',
    engineConfigured,
    supabaseConfigured,
    storageMode: supabaseConfigured ? 'supabase-postgresql' : 'local-persistent-store',
    defaultModel: 'aura-3.8-flash',
  });
});

// 2. Available Models
app.get('/api/models', (req, res) => {
  res.json({
    models: SUPPORTED_MODELS,
    defaultModel: 'aura-3.8-flash',
  });
});

// 3. List all conversations
app.get('/api/chats', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const chats = await db.getChats(userId);
    res.json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch conversations' });
  }
});

// 4. Create new conversation
app.post('/api/chats', async (req, res) => {
  try {
    const { title, model, userId } = req.body;
    const newChat = await db.createChat(title, model || 'aura-3.8-flash', userId);
    res.status(201).json(newChat);
  } catch (error: any) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: error.message || 'Failed to create conversation' });
  }
});

// 5. Get conversation by ID with its messages
app.get('/api/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.getChat(id);
    if (!data) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch conversation' });
  }
});

// 6. Update conversation (rename, pin, change model)
app.patch('/api/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pinned, model } = req.body;
    const updated = await db.updateChat(id, { title, pinned, model });
    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating chat:', error);
    res.status(500).json({ error: error.message || 'Failed to update conversation' });
  }
});

// 7. Delete conversation
app.delete('/api/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteChat(id);
    res.json({ success: deleted });
  } catch (error: any) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: error.message || 'Failed to delete conversation' });
  }
});

// 8. Clear messages in a conversation
app.delete('/api/chats/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const cleared = await db.clearMessages(id);
    res.json({ success: cleared });
  } catch (error: any) {
    console.error('Error clearing messages:', error);
    res.status(500).json({ error: error.message || 'Failed to clear messages' });
  }
});

// 9. Generate title for a chat
app.post('/api/chat/generate-title', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const title = await generateChatTitle(prompt);
    res.json({ title });
  } catch (error: any) {
    console.error('Error generating title:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Real-time Streaming Chat Endpoint (SSE)
app.post('/api/chat/stream', async (req, res) => {
  const { chatId, message, history = [], model = 'aura-3.8-flash', systemInstruction } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  let activeChatId = chatId;

  if (!activeChatId) {
    const newChat = await db.createChat('New Conversation', model);
    activeChatId = newChat.id;
  }

  // Save user message immediately
  await db.addMessage(activeChatId, 'user', message);

  // Set SSE response headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Send initial start event
  res.write(`data: ${JSON.stringify({ type: 'start', chatId: activeChatId })}\n\n`);

  let accumulatedContent = '';

  try {
    const stream = streamChatResponse({
      message,
      history,
      model,
      systemInstruction,
    });

    for await (const chunk of stream) {
      accumulatedContent += chunk;
      res.write(`data: ${JSON.stringify({ type: 'delta', content: chunk })}\n\n`);
    }

    // Persist completed response
    const savedMsg = await db.addMessage(activeChatId, 'model', accumulatedContent);

    // Immediately send completion event to unblock UI
    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        chatId: activeChatId,
        messageId: savedMsg.id,
      })}\n\n`
    );
    res.end();

    // Generate title asynchronously in the background so it never blocks chat stream completion
    const currentChatData = await db.getChat(activeChatId);
    if (
      currentChatData &&
      (currentChatData.chat.title === 'New Conversation' || !currentChatData.chat.title)
    ) {
      generateChatTitle(message).then(async (newTitle) => {
        if (newTitle) {
          await db.updateChat(activeChatId, { title: newTitle });
        }
      }).catch((e) => console.warn('Async title generation skipped:', e));
    }
  } catch (error: any) {
    console.error('[Stream Error]', error);
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        error: error.message || 'An unexpected error occurred while generating response',
      })}\n\n`
    );
    res.end();
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('API Server is running. Vite dev server handles frontend during development.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[AURA Server] Running on http://localhost:${PORT}`);
  console.log(`[AURA Server] Neural Engine: ${getEngineClient() ? 'Active (Connected)' : 'Standby (Key not set)'}`);
  console.log(`[AURA Server] Storage: ${db.isSupabaseConfigured() ? 'Supabase PostgreSQL' : 'Local Persistent Storage'}`);
});
