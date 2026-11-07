import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Menu, X, Cpu } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { systemHealth } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pb-2 transition-all duration-300">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full max-w-6xl flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#0b0d13]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50'
            : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
        }`}
      >
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/15 overflow-hidden group-hover:border-white/30 transition-all">
            <span className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
              AURA
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                3.8 Flash
              </span>
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            Features
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors duration-200">
            Capabilities
          </a>
          <a href="#architecture" className="hover:text-white transition-colors duration-200">
            Architecture
          </a>
          <a href="#pipeline" className="hover:text-white transition-colors duration-200">
            How It Works
          </a>
        </div>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Health indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-400">
            <span
              className={`w-2 h-2 rounded-full ${
                systemHealth?.engineConfigured
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            ></span>
            <span className="font-mono text-[11px]">
              {systemHealth?.engineConfigured ? 'AURA Engine Connected' : 'Engine Standby'}
            </span>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all duration-200 shadow-md shadow-white/10"
          >
            <span>Open Chatbot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden absolute top-20 left-4 right-4 p-5 rounded-2xl bg-[#0b0d13]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-4 text-sm"
        >
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white py-1"
          >
            Features
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white py-1"
          >
            Capabilities
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white py-1"
          >
            Architecture
          </a>
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white py-1"
          >
            How It Works
          </a>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/chat');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-black bg-white"
            >
              <span>Launch Chatbot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
