import { GoogleGenAI } from '@google/genai';

export interface ChatHistoryItem {
  role: 'user' | 'model' | 'assistant' | 'system';
  content: string;
}

export function getEngineClient(): GoogleGenAI | null {
  const apiKey = process.env.AURA_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_') || apiKey.includes('here')) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const SUPPORTED_MODELS = [
  {
    id: 'aura-3.8-flash',
    targetModel: 'gemini-3.5-flash-lite', // Using ultra-fast high-throughput engine for instant ~1s streaming
    name: 'AURA 3.8 Flash',
    tag: 'Recommended',
    description: 'Fast, high-throughput model with state-of-the-art multimodal reasoning',
    contextWindow: '1M tokens',
    speed: 'Ultra-fast',
  },
  {
    id: 'aura-4-pro',
    targetModel: 'gemini-4-argon',
    name: 'AURA 4 Pro',
    tag: 'Flagship',
    description: 'Deep cognitive synthesis, advanced architectural logic, and code generation',
    contextWindow: '1M tokens',
    speed: 'Deep thought',
  },
  {
    id: 'aura-3.5-lite',
    targetModel: 'gemini-3.5-flash-lite',
    name: 'AURA 3.5 Lite',
    tag: 'Lightweight',
    description: 'Lowest latency & high efficiency for everyday conversational workflows',
    contextWindow: '1M tokens',
    speed: 'Instant',
  },
];

// Map model IDs to backend engine models
function resolveModelId(modelId?: string): string {
  if (!modelId) return 'gemini-3.5-flash-lite';
  const found = SUPPORTED_MODELS.find((m) => m.id === modelId);
  return found ? found.targetModel : 'gemini-3.5-flash-lite';
}

export async function* streamChatResponse({
  message,
  history = [],
  model = 'aura-3.8-flash',
  systemInstruction,
}: {
  message: string;
  history?: ChatHistoryItem[];
  model?: string;
  systemInstruction?: string;
}) {
  const client = getEngineClient();

  if (!client) {
    throw new Error(
      'Neural Engine service key is not configured. Please set AURA_API_KEY in your backend .env file to enable live intelligence.'
    );
  }

  const primaryModel = resolveModelId(model);

  // Format previous conversation turns
  const contents = [
    ...history
      .filter((h) => h.content && h.content.trim().length > 0)
      .map((h) => ({
        role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  const config: Record<string, any> = {
    temperature: 0.7,
  };

  if (systemInstruction && systemInstruction.trim().length > 0) {
    config.systemInstruction = systemInstruction;
  } else {
    config.systemInstruction =
      'You are AURA, an elite AI cognitive partner engineered for clarity, depth, precision, and modern software craftsmanship. Your responses are thoughtful, impeccably formatted in GitHub-flavored Markdown, and free of unnecessary fluff. When providing code, write clean, production-grade code with comments and modern syntax.';
  }

  let activeModel = primaryModel;
  let stream;

  try {
    stream = await client.models.generateContentStream({
      model: activeModel,
      contents,
      config,
    });
  } catch (initialError: any) {
    console.warn(`[Engine] ${activeModel} encountered error, switching to resilient fallback...`, initialError?.message);
    activeModel = 'gemini-3.5-flash-lite';
    stream = await client.models.generateContentStream({
      model: activeModel,
      contents,
      config,
    });
  }

  try {
    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error('[Engine Stream Error]:', error);
    let friendlyMessage = error?.message || 'Error processing neural inference stream';
    const errorStr = (error?.message || '') + JSON.stringify(error);
    if (errorStr.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') || errorStr.includes('API key not valid') || errorStr.includes('invalid api key') || error?.status === 401) {
      friendlyMessage = 'Invalid API key. Your Gemini API key must start with "AIzaSy..." (obtained from https://aistudio.google.com/apikey). The current key in .env starts with "AQ." which is not a supported API key format.';
    } else if (friendlyMessage.includes('ResourceExhausted') || friendlyMessage.includes('429')) {
      friendlyMessage = 'Engine rate limit reached. Please wait a moment before sending another request.';
    }
    throw new Error(friendlyMessage);
  }
}

export async function generateChatTitle(firstPrompt: string): Promise<string> {
  const client = getEngineClient();
  if (!client) {
    const cleaned = firstPrompt.replace(/[^\w\s]/gi, '').trim();
    const words = cleaned.split(/\s+/).slice(0, 4);
    return words.length > 0 ? words.join(' ') : 'New Conversation';
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a concise 3 to 5 word title summarizing the topic of this user message. Do NOT use quotation marks, punctuation, or generic words like "Chat about":\n\n"${firstPrompt}"`,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 20,
        temperature: 0.3,
      },
    });

    const title = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : '';
    return title && title.length <= 40 ? title : 'New Conversation';
  } catch (err) {
    const words = firstPrompt.trim().split(/\s+/).slice(0, 4);
    return words.join(' ') || 'New Conversation';
  }
}
