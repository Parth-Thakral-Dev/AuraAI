import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Bot, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_INTERACTIONS = [
  {
    prompt: 'Design a resilient rate limiter for a distributed API gateway.',
    response: `### Token Bucket Algorithm with Redis & Lua

To prevent race conditions across distributed microservices, use atomic Lua script execution:

\`\`\`typescript
const RATE_LIMIT_LUA = \`
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local current = tonumber(redis.call('get', key) or "0")
  if current + 1 > limit then
    return 0
  else
    redis.call("INCRBY", key, 1)
    if current == 0 then
      redis.call("EXPIRE", key, ARGV[2])
    end
    return 1
  end
\`;
\`\`\`

**Key Benefits:**
- **Zero Drift**: Atomic increments in single-threaded Redis engine.
- **Sub-millisecond overhead**: Evaluated at memory speed.
- **Fail-open fallback**: Continues serving core routes during transient cache partition.`,
  },
  {
    prompt: 'What are the performance advantages of AURA 3.8 for agentic workflows?',
    response: `### AURA 3.8 Flash Core Advantages

1. **Massive Context Depth**: 1,000,000 tokens allow ingesting entire repositories and documentation sets into active context.
2. **Sub-second Time-To-First-Token (TTFT)**: Instantaneous responsiveness optimized for iterative agent tool-calling loops.
3. **Multimodal Native**: Simultaneous spatial reasoning over architecture diagrams, schemas, and live source files.
4. **Structured JSON Validation**: Guaranteed schema adherence for deterministic tool execution.`,
  },
];

export const InteractivePreview: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const active = SAMPLE_INTERACTIONS[activeIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="preview" className="py-20 relative px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          <span>LIVE PREVIEW EXPERIENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          A chat interface designed for focus.
        </h2>
        <p className="text-sm text-zinc-400">
          Crafted with subtle hairlines, pure typography, and high-legibility markdown formatting.
        </p>
      </div>

      {/* Main Preview Frame */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0d13] shadow-2xl overflow-hidden">
        {/* Window Chrome Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white/20"></span>
              <span className="w-3 h-3 rounded-full bg-white/20"></span>
              <span className="w-3 h-3 rounded-full bg-white/20"></span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
            <span className="text-xs font-mono text-zinc-400">AURA // Chat Session Sandbox</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Context
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Prompt Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">Example Topics:</span>
            {SAMPLE_INTERACTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeIdx === idx
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                }`}
              >
                {idx === 0 ? 'Distributed Rate Limiter' : 'AURA 3.8 Capabilities'}
              </button>
            ))}
          </div>

          {/* User Message Bubble */}
          <div className="flex items-start gap-3.5 max-w-2xl ml-auto">
            <div className="p-4 rounded-2xl rounded-tr-sm bg-white/10 border border-white/15 text-sm text-zinc-100 leading-relaxed shadow-sm">
              {active.prompt}
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
              <User className="w-4 h-4" />
            </div>
          </div>

          {/* AI Response Bubble */}
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>

            <div className="flex-1 p-5 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.08] text-sm text-zinc-200 leading-relaxed space-y-3">
              <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                {active.response}
              </div>

              {/* Action buttons inside message */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-zinc-500">
                <span className="font-mono text-[11px]">Model: AURA 3.8 Flash</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to clipboard' : 'Copy answer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Persistent chat history ready • Powered by Supabase PostgreSQL</span>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Launch Standalone Chatbot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
