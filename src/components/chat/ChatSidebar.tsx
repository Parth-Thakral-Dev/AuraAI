import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Home,
  Sparkles,
  Shield,
  Cpu,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { Link } from 'react-router-dom';

interface ChatSidebarProps {
  onOpenSettings: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onOpenSettings }) => {
  const {
    chats,
    activeChatId,
    selectChat,
    createNewChat,
    renameChat,
    deleteChat,
    searchQuery,
    setSearchQuery,
    systemHealth,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useChat();

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter chats by search query
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats by date
  const groupChats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups: { [key: string]: typeof chats } = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    };

    filteredChats.forEach((chat) => {
      const date = new Date(chat.updated_at);
      if (date >= today) {
        groups['Today'].push(chat);
      } else if (date >= yesterday) {
        groups['Yesterday'].push(chat);
      } else if (date >= sevenDaysAgo) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups['Older'].push(chat);
      }
    });

    return groups;
  };

  const grouped = groupChats();

  const startEditing = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditTitleValue(currentTitle);
  };

  const saveEditing = async (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitleValue.trim()) {
      await renameChat(id, editTitleValue.trim());
    }
    setEditingChatId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      await deleteChat(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col w-72 bg-[#090b10] border-r border-white/[0.08] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full md:w-0'
        }`}
      >
        {/* Top Header & New Chat Button */}
        <div className="p-4 border-b border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight text-sm">AURA</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                PRO
              </span>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => createNewChat()}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 active:scale-98 text-black transition-all font-medium text-xs shadow-md"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-600 bg-black/5 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {Object.entries(grouped).map(([groupTitle, chatItems]) => {
            if (chatItems.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-1">
                <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  {groupTitle}
                </div>

                {chatItems.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  const isEditing = editingChatId === chat.id;
                  const isConfirmingDelete = deleteConfirmId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => !isEditing && selectChat(chat.id)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-white/10 text-white font-medium border border-white/15'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Left Title Area */}
                      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-1">
                        <MessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-white' : 'text-zinc-500'
                          }`}
                        />

                        {isEditing ? (
                          <form
                            onSubmit={(e) => saveEditing(chat.id, e)}
                            className="flex items-center gap-1 w-full"
                          >
                            <input
                              type="text"
                              value={editTitleValue}
                              onChange={(e) => setEditTitleValue(e.target.value)}
                              autoFocus
                              className="w-full bg-black/60 text-white text-xs px-1.5 py-0.5 rounded border border-white/30 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={(e) => saveEditing(chat.id, e)}
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="p-1 text-zinc-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </form>
                        ) : (
                          <span className="truncate">{chat.title}</span>
                        )}
                      </div>

                      {/* Right Action Icons (Edit & Delete) */}
                      {!isEditing && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => startEditing(chat.id, chat.title, e)}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(chat.id, e)}
                            className={`p-1 rounded transition-colors ${
                              isConfirmingDelete
                                ? 'bg-red-500/20 text-red-400'
                                : 'hover:bg-white/10 text-zinc-400 hover:text-red-400'
                            }`}
                            title={isConfirmingDelete ? 'Click again to confirm' : 'Delete'}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {filteredChats.length === 0 && (
            <div className="p-4 text-center text-xs text-zinc-500">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="p-3 border-t border-white/[0.06] bg-black/20 space-y-2">
          {/* Storage status pill */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  systemHealth?.supabaseConfigured ? 'bg-emerald-400' : 'bg-sky-400'
                }`}
              ></span>
              <span className="truncate">
                {systemHealth?.supabaseConfigured ? 'Supabase Postgres' : 'Persistent Storage'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">RLS</span>
          </div>

          {/* Action links */}
          <div className="flex items-center justify-between gap-1">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>

            <button
              onClick={onOpenSettings}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
