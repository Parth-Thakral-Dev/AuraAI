import React, { useState } from 'react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessageList } from '../components/chat/ChatMessageList';
import { ChatInputArea } from '../components/chat/ChatInputArea';
import { SettingsModal } from '../components/common/SettingsModal';

export const ChatPage: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c] text-zinc-100">
      {/* Left Sidebar */}
      <ChatSidebar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#08090c] relative">
        <ChatHeader onOpenSettings={() => setSettingsOpen(true)} />
        <ChatMessageList />
        <ChatInputArea onOpenSettings={() => setSettingsOpen(true)} />
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};
