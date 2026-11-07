import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Zap,
  Database,
  Code2,
  Lock,
  History,
  Layers,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Cpu,
    title: 'AURA 3.8 Cognitive Engine',
    description:
      'Proprietary high-throughput neural architecture. Unmatched multimodal understanding and 1,000,000 token active context window.',
    badge: 'Proprietary',
    colSpan: 'md:col-span-2',
    visual: (
      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-400 space-y-1">
        <div className="flex items-center justify-between text-zinc-500">
          <span>NEURAL ENGINE</span>
          <span className="text-emerald-400">STATUS: CONNECTED</span>
        </div>
        <div className="text-zinc-200">aura.neuralStream({`\n  model: "aura-3.8-flash",\n  contextTokens: 1000000\n`})</div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Sub-Millisecond SSE Streaming',
    description:
      'Responses stream progressively via Server-Sent Events, achieving immediate visual feedback without latency bottlenecking.',
    badge: 'Real-time',
    colSpan: 'md:col-span-1',
    visual: (
      <div className="mt-4 flex items-center justify-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        <span className="text-xs font-mono text-zinc-300">12ms Time To First Token</span>
      </div>
    ),
  },
  {
    icon: Database,
    title: 'Supabase & PostgreSQL Persistence',
    description:
      'Full conversation history stored in PostgreSQL with Row Level Security (RLS). Survives page refreshes, browser reboots, and multi-device access.',
    badge: 'PostgreSQL',
    colSpan: 'md:col-span-1',
    visual: (
      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400">
        <div className="text-sky-400">RLS: ENABLED</div>
        <div className="text-zinc-500">auth.uid() = user_id</div>
      </div>
    ),
  },
  {
    icon: Code2,
    title: 'Syntax Highlighting & Markdown',
    description:
      'Full GitHub-flavored markdown parsing, syntax highlighting for 100+ languages, one-click code copying, and formatted tables.',
    badge: 'Developer First',
    colSpan: 'md:col-span-2',
    visual: (
      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-300 flex items-center justify-between">
        <span className="text-zinc-400">const tokenStream = await response...</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white">TSX</span>
      </div>
    ),
  },
  {
    icon: Lock,
    title: 'Zero-Leak Key Architecture',
    description:
      'Your secret backend keys are isolated inside a hardened server proxy. Client bundles never inspect or hold credentials.',
    badge: 'Security',
    colSpan: 'md:col-span-1',
  },
  {
    icon: History,
    title: 'Context Memory & Auto-Naming',
    description:
      'Multi-turn stateful history ensures deep context retention. Intelligent automatic conversation titling creates clean organizational feeds.',
    badge: 'Cognitive Flow',
    colSpan: 'md:col-span-2',
  },
];

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-24 relative px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400">
          <Layers className="w-3.5 h-3.5 text-zinc-300" />
          <span>ENGINEERED FOUNDATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Architected for uncompromising speed.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400">
          Every component was conceived with deliberate SaaS aesthetics, zero boilerplate styling, and reliable persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.035] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${item.colSpan}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-zinc-200" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-zinc-400 border border-white/5">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {item.visual && <div>{item.visual}</div>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
