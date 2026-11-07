import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { InteractiveConsole } from './InteractiveConsole';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden flex flex-col items-center text-center px-4">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-white/[0.07] to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-sky-500/[0.04] blur-3xl pointer-events-none rounded-full" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          <span className="text-xs font-mono font-medium text-zinc-300 tracking-wide">
            AURA 3.8 NEURAL ENGINE
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-mono text-zinc-400">1M CONTEXT DEPTH</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          Intelligence refined. <br />
          <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Beyond ordinary chat.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          A minimal, high-velocity cognitive workspace built for developers and innovators.
          Real-time streaming responses, persistent PostgreSQL memory, and zero-leak API security.
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
        >
          <button
            onClick={() => navigate('/chat')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group"
          >
            <span>Open Chatbot</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </a>
        </motion.div>
      </div>

      {/* Hero Interactive Console */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full mt-12 md:mt-16 px-2 z-10"
      >
        <InteractiveConsole />
      </motion.div>
    </section>
  );
};
