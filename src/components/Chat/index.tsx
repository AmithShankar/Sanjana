'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Conversation } from '@/types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppearanceModal } from '@/components/AppearanceModal'
import { useAppStore } from '@/store/useAppStore'
import { Lock, Star, Share2, Monitor, Settings } from 'lucide-react'

interface ChatWindowProps {
  conversation: Conversation | null
  isLoading: boolean
  error: string | null
  isSpeaking: boolean
  isTTSEnabled: boolean
  onSpeak: (text: string) => void
  onStopSpeaking: () => void
  hasBackground?: boolean
}

export function ChatWindow({ conversation, isLoading, error, isSpeaking, isTTSEnabled, onSpeak, onStopSpeaking, hasBackground }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showAppearance, setShowAppearance] = useState(false)
  const messages = conversation?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isLoading])

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {conversation && (
        <div
          className="relative z-10 flex items-center gap-2 px-6 py-3.5 border-b border-ln flex-shrink-0"
          style={{
            background: 'var(--c-bg-surface)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-sm font-semibold text-tx-primary truncate">{conversation.title}</span>
          <div className="flex items-center gap-1 text-[10px] text-tx-muted bg-bg-elevated border border-ln px-2 py-0.5 rounded-full ml-0.5 flex-shrink-0">
            <Lock size={9} />
            <span>Private</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setShowAppearance(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated/80 border border-ln text-xs font-medium transition-all cursor-pointer"
              style={{ backdropFilter: hasBackground ? 'blur(4px)' : undefined }}
            >
              <Monitor size={12} />
              Appearance
            </button>
            <button className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated/80 transition-all cursor-pointer">
              <Share2 size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated/80 transition-all cursor-pointer">
              <Star size={14} />
            </button>
            <button className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated/80 transition-all cursor-pointer">
              <Settings size={14} />
            </button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={conversation?.id}
            className="max-w-3xl mx-auto px-6 py-8 space-y-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSpeaking={isSpeaking}
                isTTSEnabled={isTTSEnabled}
                onSpeak={onSpeak}
                onStopSpeaking={onStopSpeaking}
              />
            ))}

            {isLoading && <TypingIndicator />}

            {error && (
              <div className="flex justify-center">
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-400/25 rounded-2xl px-4 py-2.5">
                  {error}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      <AppearanceModal isOpen={showAppearance} onClose={() => setShowAppearance(false)} />
    </div>
  )
}
