import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Trash2,
  Download,
  Settings,
  Cpu,
  Check,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ChatHeaderProps {
  onOpenSettings: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onOpenSettings }) => {
  const {
    activeChat,
    messages,
    models,
    currentModel,
    setCurrentModel,
    clearCurrentChatMessages,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useChat();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const selectedModelInfo = models.find((m) => m.id === currentModel) || {
    id: currentModel,
    name: 'AURA 3.8 Flash',
    tag: 'Active',
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const text = messages
      .map((m) => `### ${m.role === 'user' ? 'User' : 'AURA Assistant'}\n\n${m.content}\n\n---\n`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeChat?.title || 'conversation').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <header className="h-14 px-4 border-b border-white/[0.08] bg-[#090b10]/80 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
      {/* Left: Sidebar toggle & Title */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-medium text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-xs">
            {activeChat?.title || 'New Conversation'}
          </span>
        </div>
      </div>

      {/* Center/Right: Model selector & Action buttons */}
      <div className="flex items-center gap-2">
        {/* Model dropdown */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-200 transition-all font-mono"
          >
            <Cpu className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">{selectedModelInfo.name}</span>
            <span className="sm:hidden text-[11px]">3.8 Flash</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f1117] border border-white/15 shadow-2xl p-2 z-40 space-y-1 font-sans">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Select Model Tier
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentModel(m.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentModel === m.id
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="text-white font-medium">{m.name}</div>
                      <div className="text-[10px] text-zinc-500">{m.speed}</div>
                    </div>
                    {currentModel === m.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clear messages */}
        {messages.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all messages in this conversation?')) {
                clearCurrentChatMessages();
              }
            }}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-red-400 transition-colors"
            title="Clear conversation messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Export chat */}
        {messages.length > 0 && (
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            title="Export conversation to Markdown"
          >
            {copiedExport ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
          title="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
