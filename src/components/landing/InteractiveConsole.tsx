import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_PROMPTS = [
  {
    title: 'Distributed Consensus',
    prompt: 'Compare Raft vs Paxos in distributed systems with code examples.',
    response: `### Consensus Mechanisms: Raft vs. Paxos

**Paxos** operates on a two-phase protocol (Prepare/Promise, Accept/Accepted), resilient but notoriously subtle to implement safely.

**Raft** decomposes consensus into distinct subproblems:
1. **Leader Election**: Randomized timers prevent split votes.
2. **Log Replication**: Unidirectional append from leader to followers.
3. **Safety**: An elected leader is guaranteed to contain all committed entries.

\`\`\`typescript
interface LogEntry<T> {
  term: number;
  index: number;
  command: T;
}

// Leader append RPC guarantee
function replicateEntry<T>(entry: LogEntry<T>, quorum: number): boolean {
  return replicatedNodesCount >= Math.floor(quorum / 2) + 1;
}
\`\`\`
*Latency: 9ms • AURA High-Throughput Streaming Verified*`,
  },
  {
    title: 'PostgreSQL RLS Architecture',
    prompt: 'How to write secure Row Level Security policies for user isolation?',
    response: `### Multi-Tenant Row Level Security

By leveraging Postgres \`auth.uid()\`, tables are locked at the database kernel level:

\`\`\`sql
-- Enable strict table-level security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Dynamic tenant policy
CREATE POLICY "Tenant Chat Isolation"
ON public.chats FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
\`\`\`

All queries automatically inject tenant filters at the query planner level with zero SQL leakage.`,
  },
];

export const InteractiveConsole: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const current = DEMO_PROMPTS[selectedIdx];

  useEffect(() => {
    let currentText = '';
    let i = 0;
    setIsTyping(true);
    setDisplayedText('');

    const target = current.response;
    const interval = setInterval(() => {
      if (i < target.length) {
        currentText += target.charAt(i);
        setDisplayedText(currentText);
        i += 3;
      } else {
        setDisplayedText(target);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [selectedIdx]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl">
      <div className="rounded-2xl bg-[#090b10] border border-white/10 overflow-hidden shadow-inner">
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06] gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-white/20 inline-block"></span>
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-300" />
              aura-3.8-flash :: stream-live
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              142 tok/sec
            </span>
            <span className="hidden sm:inline-block font-mono text-xs text-zinc-500">12ms TTFT</span>
          </div>
        </div>

        {/* Prompt Selector Pills */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-white/[0.04] overflow-x-auto">
          <span className="text-xs text-zinc-500 font-mono shrink-0">Sample prompts:</span>
          {DEMO_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedIdx === idx
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Console Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed space-y-4 min-h-[260px] max-h-[380px] overflow-y-auto">
          {/* User query line */}
          <div className="flex items-start gap-3 text-zinc-300">
            <span className="text-zinc-500 select-none">❯</span>
            <span className="font-semibold text-white">{current.prompt}</span>
          </div>

          {/* Model streaming output */}
          <div className="pl-6 border-l border-white/10 text-zinc-300 whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-white/80 ml-1 animate-pulse" />}
          </div>
        </div>

        {/* Terminal Footer CTA */}
        <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-t border-white/[0.06] text-xs">
          <span className="text-zinc-500 font-mono">
            Stateful multi-turn history preserved with Supabase
          </span>
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1.5 text-white hover:text-zinc-300 transition-colors font-medium group"
          >
            <span>Try in Live Chat</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
