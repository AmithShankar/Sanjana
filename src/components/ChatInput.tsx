'use client'

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OrbState } from '@/types'
import { cn } from '@/lib/utils'
import { Paperclip, Mic, ArrowUp, X, FileText, ChevronDown, Globe } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import VoiceOrb from '@/components/VoiceOrb'

interface AttachedFile { id: string; name: string; size: string }

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  orbState: OrbState
  audioLevel: number
  isVoiceMode: boolean
  transcript: string
  externalText?: string
  onExternalTextConsumed?: () => void
  onToggleVoice: () => void
  onStartListening: () => void
  onStopListening: () => void
  onClearTranscript: () => void
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSend, isLoading, orbState, audioLevel, isVoiceMode, transcript,
  externalText, onExternalTextConsumed,
  onToggleVoice, onStopListening, onClearTranscript,
  placeholder = 'Ask Sanjana AI...', className,
}: ChatInputProps) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [focused, setFocused] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const sentTranscriptRef = useRef('')
  const isMicActive = orbState === 'listening'
  const canSend = (text.trim().length > 0 || files.length > 0) && !isLoading

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
  }, [text])

  useEffect(() => {
    if (transcript && transcript !== sentTranscriptRef.current) {
      setText(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if (externalText) {
      setText(externalText)
      setTimeout(() => {
        const ta = taRef.current
        if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length) }
      }, 0)
      onExternalTextConsumed?.()
    }
  }, [externalText])

  const handleSend = useCallback(() => {
    if (!canSend) return
    const msg = text.trim()
    sentTranscriptRef.current = msg
    onClearTranscript()
    setText('')
    setFiles([])
    if (isMicActive) onStopListening()
    onSend(msg)
  }, [canSend, text, isMicActive, onClearTranscript, onStopListening, onSend])

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files ?? []).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
    }))
    setFiles(p => [...p, ...items])
    e.target.value = ''
  }

  return (
    <div className={cn('w-full', className)}>
        <AnimatePresence>
          {isVoiceMode && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 104 }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center overflow-hidden"
            >
              <VoiceOrb state={orbState} audioLevel={audioLevel} size="sm" />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            'rounded-2xl border bg-[var(--c-input-bg)] transition-all duration-150',
            focused ? 'border-ln-strong' : 'border-ln'
          )}
          style={{ boxShadow: focused ? `0 0 0 1px var(--c-border-strong), 0 2px 8px var(--c-shadow-sm)` : undefined }}
        >
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 bg-bg-elevated border border-ln rounded-lg px-2.5 py-1.5">
                  <FileText size={11} className="text-tx-muted flex-shrink-0" />
                  <span className="text-xs text-tx-secondary max-w-[120px] truncate">{f.name}</span>
                  <span className="text-[10px] text-tx-muted">{f.size}</span>
                  <button onClick={() => setFiles(p => p.filter(x => x.id !== f.id))} className="text-tx-muted hover:text-tx-primary ml-0.5 cursor-pointer">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            ref={taRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full bg-transparent text-sm text-tx-primary placeholder:text-tx-muted px-4 py-3 resize-none outline-none min-h-[52px] max-h-[200px] disabled:opacity-50"
          />

          <div className="flex items-center justify-between px-3 pb-3 gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated border border-ln transition-all cursor-pointer text-xs font-medium flex-shrink-0">
              Sanjana <ChevronDown size={11} />
            </button>

            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="p-2 rounded-xl text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer"
                  >
                    <Paperclip size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
              <input ref={fileRef} type="file" multiple onChange={handleFile} className="hidden" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-xl text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer">
                    <Globe size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Browse web</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleVoice}
                    className={cn(
                      'p-2 rounded-xl transition-all cursor-pointer',
                      isMicActive
                        ? 'bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)]'
                        : isVoiceMode
                          ? 'bg-[var(--c-accent-light)] text-[var(--c-accent)]'
                          : 'text-tx-muted hover:text-tx-primary hover:bg-bg-elevated'
                    )}
                  >
                    <Mic size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{isMicActive ? 'Stop recording' : 'Voice input'}</TooltipContent>
              </Tooltip>

              <button
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ml-1',
                  canSend
                    ? 'bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)] hover:scale-105 active:scale-95'
                    : 'bg-bg-elevated text-tx-muted cursor-not-allowed border border-ln'
                )}
              >
                <ArrowUp size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-tx-muted mt-2">
          Sanjana can make mistakes. Check important info.
        </p>
      </div>
  )
}
