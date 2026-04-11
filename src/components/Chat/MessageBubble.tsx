'use client'

import { Message } from '@/types'
import { formatTime, cn } from '@/lib/utils'
import { Copy, Check, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MarkdownContent } from './MarkdownContent'

interface MessageBubbleProps {
  message: Message
  isSpeaking?: boolean
  onSpeak?: (text: string) => void
  onStopSpeaking?: () => void
  isTTSEnabled?: boolean
}

function AIIcon() {
  return (
    <img src="/logo.svg" className="w-7 h-7 flex-shrink-0 mt-0.5" alt="Sanjana AI" />
  )
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
}

export function MessageBubble({ message, isSpeaking, onSpeak, onStopSpeaking, isTTSEnabled }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <motion.div variants={bubbleVariants} initial="hidden" animate="show" className="group flex items-start justify-end gap-2">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center pointer-events-none group-hover:pointer-events-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={copy} className="p-1.5 rounded-lg bg-bg-elevated border border-ln text-tx-muted hover:text-tx-primary cursor-pointer transition-colors">
                {copied ? <Check size={11} className="text-[var(--c-accent)]" /> : <Copy size={11} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
          </Tooltip>
        </div>

        <div className="max-w-[72%]">
          <div
            className="px-4 py-3 text-sm leading-relaxed rounded-2xl rounded-tr-sm border border-ln shadow-card"
            style={{ background: 'var(--c-msg-user-bg)', color: 'var(--c-msg-user-text)' }}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <div className="flex justify-end mt-1 px-1">
            <span className="text-[11px] text-tx-muted" suppressHydrationWarning>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={bubbleVariants} initial="hidden" animate="show" className="group flex gap-3">
      <AIIcon />

      <div className="flex-1 min-w-0">
        <MarkdownContent
          content={message.content || (message.isStreaming ? '' : '…')}
          isStreaming={message.isStreaming}
        />

        {!message.isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
            {isTTSEnabled !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => isSpeaking ? onStopSpeaking?.() : onSpeak?.(message.content)}
                    className="p-1.5 rounded-lg bg-bg-elevated border border-ln text-tx-muted hover:text-tx-primary cursor-pointer transition-colors"
                  >
                    {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">{isSpeaking ? 'Stop' : 'Speak'}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={copy} className="p-1.5 rounded-lg bg-bg-elevated border border-ln text-tx-muted hover:text-tx-primary cursor-pointer transition-colors">
                  {copied ? <Check size={11} className="text-[var(--c-accent)]" /> : <Copy size={11} />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
            </Tooltip>
            <span className="text-[11px] text-tx-muted ml-1" suppressHydrationWarning>{formatTime(message.timestamp)}</span>
          </div>
        )}
        {message.isStreaming && (
          <span className="text-[11px] text-tx-muted mt-1 block" suppressHydrationWarning>{formatTime(message.timestamp)}</span>
        )}
      </div>
    </motion.div>
  )
}
