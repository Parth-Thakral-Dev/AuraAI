import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatWelcome } from './ChatWelcome';

export const ChatMessageList: React.FC = () => {
  const { messages, isStreaming } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as messages or chunks arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return <ChatWelcome />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-6 space-y-2 max-w-4xl w-full mx-auto">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      <div ref={bottomRef} className="h-6" />
    </div>
  );
};
