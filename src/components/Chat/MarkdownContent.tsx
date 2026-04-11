'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  isStreaming?: boolean
  className?: string
}

export function MarkdownContent({ content, isStreaming, className }: MarkdownContentProps) {
  return (
    <div className={cn('markdown-body text-sm leading-relaxed text-tx-primary', isStreaming && 'stream-cursor', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0 whitespace-pre-wrap break-words">{children}</p>,

          h1: ({ children }) => <h1 className="text-lg font-semibold text-tx-primary mt-5 mb-2 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold text-tx-primary mt-4 mb-2 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold text-tx-primary mt-3 mb-1.5 first:mt-0">{children}</h3>,

          strong: ({ children }) => <strong className="font-semibold text-tx-primary">{children}</strong>,
          em: ({ children }) => <em className="italic text-tx-secondary">{children}</em>,

          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <code className={cn('block text-[13px] font-mono leading-relaxed', className)}>
                  {children}
                </code>
              )
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md text-[12px] font-mono bg-bg-elevated border border-ln text-[var(--c-accent)]">
                {children}
              </code>
            )
          },

          pre: ({ children }) => (
            <pre className="my-3 p-4 rounded-xl bg-bg-elevated border border-ln overflow-x-auto text-[13px] font-mono leading-relaxed">
              {children}
            </pre>
          ),

          ul: ({ children }) => <ul className="mb-3 pl-5 space-y-1 list-disc marker:text-tx-muted">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 pl-5 space-y-1 list-decimal marker:text-tx-muted">{children}</ol>,
          li: ({ children }) => <li className="text-tx-primary">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-4 border-l-2 border-[var(--c-accent)] text-tx-secondary italic">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-4 border-ln" />,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--c-accent)] hover:underline underline-offset-2"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-ln">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-bg-elevated border-b border-ln">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-ln last:border-0">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2.5 text-left font-medium text-tx-primary">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 text-tx-secondary">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
