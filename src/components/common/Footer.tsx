import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07080a] text-zinc-400 text-sm overflow-hidden pt-16 pb-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight">AURA AI</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Proprietary cognitive AI workspace engineered with high-throughput neural architecture, stateful PostgreSQL persistence, and sub-millisecond streaming.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational • 99.9% Uptime
              </span>
            </div>
          </div>

          {/* Column 1: Engine */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-300">
              Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="hover:text-white transition-colors">AURA 3.8 Flash</li>
              <li className="hover:text-white transition-colors">AURA 4 Pro</li>
              <li className="hover:text-white transition-colors">AURA 3.5 Lite</li>
              <li className="hover:text-white transition-colors">1M Context Window</li>
              <li className="hover:text-white transition-colors">Real-time SSE Streaming</li>
            </ul>
          </div>

          {/* Column 2: Data & Security */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-300">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="hover:text-white transition-colors">Supabase PostgreSQL</li>
              <li className="hover:text-white transition-colors">Row Level Security (RLS)</li>
              <li className="hover:text-white transition-colors">Zero-Leak Backend Proxy</li>
              <li className="hover:text-white transition-colors">Dual Storage Fallback</li>
              <li className="hover:text-white transition-colors">Markdown & Prism Highlighting</li>
            </ul>
          </div>

          {/* Column 3: Stack */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-300">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="hover:text-white transition-colors">High-Throughput Neural Engine</li>
              <li className="hover:text-white transition-colors">React 18 & TypeScript</li>
              <li className="hover:text-white transition-colors">Framer Motion Physics</li>
              <li className="hover:text-white transition-colors">Tailwind CSS</li>
              <li className="hover:text-white transition-colors">Express 4 Enterprise API</li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AURA Platforms Inc. Designed with Skiper UI aesthetic principles.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-zinc-600">v1.0.0-production</span>
            <span className="text-zinc-600">•</span>
            <span>Security & Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
