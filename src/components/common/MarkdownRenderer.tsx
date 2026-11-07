import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-zinc-200 leading-relaxed text-[15px] space-y-3 font-normal break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return <CodeBlock language={match[1]} value={value} />;
            } else if (!inline && value.includes('\n')) {
              return <CodeBlock language="text" value={value} />;
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-zinc-100 font-mono text-[13px] border border-white/10"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-7 text-zinc-200">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1.5 text-zinc-200">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1.5 text-zinc-200">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-zinc-200 leading-normal">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold tracking-tight text-white mt-5 mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold tracking-tight text-white mt-4 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium tracking-tight text-white mt-3 mb-1.5">{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-zinc-500/50 pl-4 py-1 italic text-zinc-400 bg-white/[0.02] rounded-r-lg my-2">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-white/[0.04] text-zinc-300 font-semibold">{children}</thead>;
          },
          th({ children }) {
            return <th className="p-3 border-b border-white/10">{children}</th>;
          },
          td({ children }) {
            return <td className="p-3 border-b border-white/5 text-zinc-300">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
