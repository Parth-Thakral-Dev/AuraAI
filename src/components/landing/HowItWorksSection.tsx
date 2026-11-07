import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Server, Database, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Contextual Dispatch',
    description:
      'Your prompt and previous multi-turn messages are packaged securely and dispatched to the local backend proxy.',
    detail: 'Zero API keys exposed in browser bundle',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'AURA 3.8 Flash Inference',
    description:
      'Our server pipeline opens an asynchronous SSE stream with 1M tokens of multi-modal attention.',
    detail: 'Real-time progressive token streaming',
    icon: Server,
  },
  {
    step: '03',
    title: 'PostgreSQL Persistence',
    description:
      'Messages and auto-generated titles are saved into Supabase with Row Level Security for seamless cross-session recovery.',
    detail: 'Survives reloads, tabs, and devices',
    icon: Database,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="pipeline" className="py-24 relative px-4 max-w-6xl mx-auto border-t border-white/[0.06]">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          <span>REAL-TIME PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          How AURA works under the hood.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400">
          An end-to-end resilient architecture combining high-speed streaming with relational database permanence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-zinc-500 font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    STEP {step.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-zinc-200" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-4">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{step.detail}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
