import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const STATS = [
  {
    label: 'Context Window',
    value: '1,000,000',
    unit: 'tokens',
    detail: 'Up to 700k words or 30,000 lines of source code in continuous memory',
  },
  {
    label: 'Time-to-First-Token',
    value: '< 150',
    unit: 'ms',
    detail: 'Instantaneous stream response with server-sent event progressive flushing',
  },
  {
    label: 'State Persistence',
    value: '100%',
    unit: 'PostgreSQL',
    detail: 'Row-Level Security isolation ensuring zero data cross-contamination',
  },
  {
    label: 'Neural Engine',
    value: 'AURA 3.8',
    unit: 'Proprietary',
    detail: 'High-throughput multimodal reasoning architecture with streaming interfaces',
  },
];

export const CapabilitiesSection: React.FC = () => {
  return (
    <section id="capabilities" className="py-24 relative px-4 max-w-6xl mx-auto border-t border-white/[0.06]">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400">
          <BarChart3 className="w-3.5 h-3.5 text-zinc-300" />
          <span>BENCHMARKS & SPECIFICATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Engineered for cognitive depth.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400">
          Designed with the speed, memory capacity, and safety profile demanded by modern engineering teams.
        </p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-mono text-zinc-400">{stat.unit}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
              {stat.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Model Comparison Table */}
      <div id="architecture" className="mt-16 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.07] overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Configurable Engine Architecture</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Switch between specialized AURA reasoning tiers dynamically</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-zinc-300 border border-white/10">
            Runtime Switchable
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 font-mono uppercase text-[11px]">
              <th className="py-3 px-4">Model Tier</th>
              <th className="py-3 px-4">Primary Specialization</th>
              <th className="py-3 px-4">Context Window</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                AURA 3.8 Flash
              </td>
              <td className="py-3.5 px-4 text-zinc-400">High-throughput reasoning, chat, & code generation</td>
              <td className="py-3.5 px-4 font-mono">1,000,000</td>
              <td className="py-3.5 px-4 font-mono text-emerald-400">Ultra-fast</td>
              <td className="py-3.5 px-4 font-mono text-zinc-400">Default</td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                AURA 4 Pro
              </td>
              <td className="py-3.5 px-4 text-zinc-400">Complex mathematical synthesis & deep software architecture</td>
              <td className="py-3.5 px-4 font-mono">1,000,000</td>
              <td className="py-3.5 px-4 font-mono text-sky-400">Deep thought</td>
              <td className="py-3.5 px-4 font-mono text-zinc-400">Available</td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                AURA 3.5 Lite
              </td>
              <td className="py-3.5 px-4 text-zinc-400">Micro-tasks, lightning-fast queries, and summaries</td>
              <td className="py-3.5 px-4 font-mono">1,000,000</td>
              <td className="py-3.5 px-4 font-mono text-amber-400">Instantaneous</td>
              <td className="py-3.5 px-4 font-mono text-zinc-400">Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
