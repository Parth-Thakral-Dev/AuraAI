import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#090b10] shadow-xl group">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 inline-block"></span>
          </div>
          <span className="ml-2 uppercase tracking-wider font-semibold text-zinc-300">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-sans"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto text-[13px] font-mono leading-relaxed p-1">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.6',
          }}
          wrapLines={true}
        >
          {value.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
