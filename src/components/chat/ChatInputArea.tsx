import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Sparkles,
  AlertCircle,
  X,
  Cpu,
  CornerDownLeft,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ChatInputAreaProps {
  onOpenSettings: () => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onOpenSettings }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming, stopStreaming, error, clearError, currentModel } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const content = input;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-1 relative z-10 shrink-0">
      {/* Error Alert Banner */}
      {error && (
        <div className="mb-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start justify-between gap-3 backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-red-300">Action Required:</span>
              <p className="leading-relaxed">{error}</p>
              <div className="pt-1">
                <button
                  onClick={onOpenSettings}
                  className="underline text-red-300 hover:text-white font-medium"
                >
                  Open Settings / API Setup →
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={clearError}
            className="p-1 rounded text-red-400 hover:text-red-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Island Container */}
      <div className="relative rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 shadow-2xl focus-within:border-white/25 transition-all">
        {/* Main Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything, draft architectures, or debug code... (Shift + Return for newline)"
          rows={1}
          disabled={isStreaming}
          className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none max-h-44 leading-relaxed font-sans"
        />

        {/* Input Footer Controls */}
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1 text-xs text-zinc-500 font-mono">
          {/* Left: Model chip indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/5 transition-all text-[11px]"
            >
              <Cpu className="w-3 h-3 text-zinc-400" />
              <span>{currentModel}</span>
            </button>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-[11px] text-zinc-500">1M Context</span>
          </div>

          {/* Right: Character count & Send/Stop action */}
          <div className="flex items-center gap-2.5">
            {input.length > 0 && (
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                {input.length} chars
              </span>
            )}

            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all font-sans font-medium text-xs shadow-sm"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className={`flex items-center justify-center p-2 rounded-xl transition-all shadow-md ${
                  input.trim()
                    ? 'bg-white text-black hover:bg-zinc-200 active:scale-95'
                    : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
