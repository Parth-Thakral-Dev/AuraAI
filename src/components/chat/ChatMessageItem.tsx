import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
import { Message } from '../../types';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { useChat } from '../../context/ChatContext';

interface ChatMessageItemProps {
  message: Message;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const { regenerateMessage, isStreaming, currentModel } = useChat();

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy message:', e);
    }
  };

  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group w-full flex gap-3 sm:gap-4 py-4 px-2 sm:px-4 rounded-2xl transition-colors ${
        isUser ? 'justify-end' : 'justify-start hover:bg-white/[0.015]'
      }`}
    >
      {/* Bot Avatar (Left) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={`flex flex-col space-y-1.5 ${
          isUser
            ? 'items-end max-w-[85%] sm:max-w-[75%]'
            : 'items-start flex-1 max-w-full overflow-hidden'
        }`}
      >
        {/* User Message Bubble */}
        {isUser ? (
          <div className="p-4 rounded-2xl rounded-tr-sm bg-white/10 border border-white/15 text-sm sm:text-[15px] text-zinc-100 leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap font-sans">{message.content}</p>
          </div>
        ) : (
          /* AI Response Bubble / Body */
          <div className="w-full text-zinc-200">
            {message.content ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              /* Streaming indicator shimmer */
              <div className="flex items-center gap-2 py-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Synthesizing response via AURA Neural Engine...</span>
              </div>
            )}

            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-white/70 ml-1 translate-y-0.5 animate-pulse" />
            )}
          </div>
        )}

        {/* Message Meta & Action Bar */}
        <div
          className={`flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formattedTime}</span>

          {/* Actions on AI Message */}
          {!isUser && message.content && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {!isStreaming && (
                <button
                  onClick={() => regenerateMessage(message.id)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Regenerate this response"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Avatar (Right) */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
