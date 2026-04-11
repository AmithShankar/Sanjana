'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Conversation, OrbState } from '@/types'
import { ChatInput } from '@/components/ChatInput'
import { getTimeOfDay, getRelativeTime } from '@/lib/utils'
import { MessageSquare, ChevronRight, ImageIcon, ListTodo, FileText, PenLine, Lightbulb } from 'lucide-react'

const ACTION_CHIPS = [
  { icon: ImageIcon,  label: 'Create image',   prompt: 'Create an image of ' },
  { icon: ListTodo,   label: 'Make a plan',     prompt: 'Help me make a plan for ' },
  { icon: FileText,   label: 'Summarize text',  prompt: 'Summarize this text: ' },
  { icon: PenLine,    label: 'Help me write',   prompt: 'Help me write ' },
  { icon: Lightbulb, label: 'Brainstorm',       prompt: 'Brainstorm ideas for ' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
}
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
}

interface HomeViewProps {
  conversations: Conversation[]
  onSend: (message: string) => void
  onSelectConversation: (id: string) => void
  isLoading: boolean
  orbState: OrbState
  audioLevel: number
  isVoiceMode: boolean
  transcript: string
  chipText: string
  onChipClick: (prompt: string) => void
  onToggleVoice: () => void
  onStartListening: () => void
  onStopListening: () => void
  onClearTranscript: () => void
}

export function HomeView({
  conversations, onSend, onSelectConversation, isLoading,
  orbState, audioLevel, isVoiceMode, transcript, chipText, onChipClick,
  onToggleVoice, onStartListening, onStopListening, onClearTranscript,
}: HomeViewProps) {
  const [timeLabel, setTimeLabel] = useState<string>('')
  useEffect(() => { setTimeLabel(getTimeOfDay()) }, [])
  const recent = conversations.filter(c => c.messages.length > 0).slice(0, 3)

  return (
    <motion.div
      className="flex-1 overflow-y-auto scrollbar-none relative"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(ellipse at center, #3B82F6 0%, #8B5CF6 50%, transparent 80%)' }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: '#A855F7' }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">

        <motion.div variants={fadeUp} className="text-center space-y-1.5">
          <h1 className="text-4xl font-display font-semibold text-tx-primary tracking-tight">
            Good {timeLabel}, User
          </h1>
          <p className="text-base text-tx-secondary">How can I help you?</p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <ChatInput
            onSend={onSend}
            isLoading={isLoading}
            orbState={orbState}
            audioLevel={audioLevel}
            isVoiceMode={isVoiceMode}
            transcript={transcript}
            externalText={chipText}
            onExternalTextConsumed={() => onChipClick('')}
            onToggleVoice={onToggleVoice}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
            onClearTranscript={onClearTranscript}
            placeholder="Ask Sanjana AI..."
          />
        </motion.div>

        <motion.div variants={stagger} className="flex flex-wrap gap-2 justify-center">
          {ACTION_CHIPS.map(({ icon: Icon, label, prompt }, i) => (
            <motion.button
              key={label}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChipClick(prompt)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-bg-elevated hover:bg-bg-hover border border-ln text-tx-secondary hover:text-tx-primary text-sm transition-colors cursor-pointer"
            >
              <Icon size={14} className="text-tx-muted" />
              {label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {recent.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-tx-primary">
                <MessageSquare size={14} className="text-tx-muted" />
                Your recent chats
                <ChevronRight size={14} className="text-tx-muted" />
              </div>
              <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
                {recent.map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectConversation(conv.id)}
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-bg-surface hover:bg-bg-elevated border border-ln text-left transition-colors cursor-pointer"
                  >
                    <MessageSquare size={16} className="text-tx-muted" />
                    <div>
                      <p className="text-sm font-medium text-tx-primary line-clamp-1">{conv.title}</p>
                      <p className="text-xs text-tx-muted mt-0.5">{getRelativeTime(conv.updatedAt)}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
