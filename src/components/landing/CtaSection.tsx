import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative px-4 max-w-5xl mx-auto">
      <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/15 overflow-hidden text-center shadow-2xl">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.08] blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>INSTANT DEPLOYMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to upgrade your AI conversational workflow?
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Experience real-time streaming, persistent PostgreSQL chat history, and clean developer ergonomics right now.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-sm text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group"
            >
              <span>Launch AURA Chatbot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
