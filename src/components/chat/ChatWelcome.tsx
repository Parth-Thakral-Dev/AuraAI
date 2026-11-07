import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Database, Shield, Zap, ArrowUpRight } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const STARTER_PROMPTS = [
  {
    category: 'System Design',
    title: 'High-Concurrency Event Bus',
    prompt:
      'Design an event-driven architecture using Kafka, Redis, and PostgreSQL for handling 50,000 orders/sec with idempotent guarantees.',
    icon: Database,
  },
  {
    category: 'Code Craft',
    title: 'TypeScript Type-Level Gymnastics',
    prompt:
      'Write a strict TypeScript utility type that deeply validates nested JSON schemas and extracts strongly-typed payload paths.',
    icon: Code2,
  },
  {
    category: 'Reasoning',
    title: 'Distributed State Synchronization',
    prompt:
      'Explain Conflict-Free Replicated Data Types (CRDTs) vs Operational Transformation for real-time collaborative document editing.',
    icon: Zap,
  },
  {
    category: 'Security',
    title: 'Zero-Trust API Gateway Patterns',
    prompt:
      'Explain how to design an mTLS and JWT rotation scheme for internal microservices communication with automated certificate authority renewal.',
    icon: Shield,
  },
];

export const ChatWelcome: React.FC = () => {
  const { sendMessage, currentModel } = useChat();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto my-auto space-y-8 select-none">
      {/* Animated Core Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute w-24 h-24 rounded-full bg-white/[0.04] animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      {/* Greeting & Headline */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-2"
      >
        <div className="text-xs font-mono tracking-widest uppercase text-zinc-500">
          AURA COGNITIVE AGENT // {currentModel}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {getGreeting()}. What will we architect?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Powered by our proprietary neural engine with persistent PostgreSQL storage, 1M context tokens, and streaming responses.
        </p>
      </motion.div>

      {/* Starter Prompt Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left"
      >
        {STARTER_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => sendMessage(item.prompt)}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {item.category}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors pt-3">
                <span>Dispatch prompt</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
