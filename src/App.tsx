import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ChatProvider, useChat } from './context/ChatContext';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';

const KeyboardShortcutHandler: React.FC = () => {
  const { createNewChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> New chat
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        createNewChat();
        navigate('/chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewChat, navigate]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ChatProvider>
      <Router>
        <KeyboardShortcutHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default App;
