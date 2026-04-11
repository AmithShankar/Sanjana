'use client'

import { Conversation } from '@/types'
import { cn, truncate } from '@/lib/utils'
import { MessageSquare, MoreHorizontal, Trash2, Pencil, Check, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onRename?: (id: string, title: string) => void
  indent?: boolean
}

export function ConversationItem({ conversation, isActive, onSelect, onDelete, onRename, indent }: ConversationItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(conversation.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (renaming) {
      setRenameValue(conversation.title)
      setTimeout(() => inputRef.current?.select(), 0)
    }
  }, [renaming, conversation.title])

  const commitRename = () => {
    if (renameValue.trim()) onRename?.(conversation.id, renameValue.trim())
    setRenaming(false)
  }

  const cancelRename = () => {
    setRenameValue(conversation.title)
    setRenaming(false)
  }

  if (renaming) {
    return (
      <div className={cn('flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-bg-elevated border border-ln', indent && 'ml-3')}>
        <input
          ref={inputRef}
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') cancelRename()
          }}
          className="flex-1 bg-transparent text-xs text-tx-primary outline-none min-w-0"
        />
        <button onClick={commitRename} className="p-0.5 text-green-500 hover:text-green-600 cursor-pointer flex-shrink-0">
          <Check size={12} />
        </button>
        <button onClick={cancelRename} className="p-0.5 text-tx-muted hover:text-tx-primary cursor-pointer flex-shrink-0">
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150',
        indent && 'ml-3',
        isActive
          ? 'bg-[var(--c-accent-light)] text-[var(--c-accent)]'
          : 'text-tx-secondary hover:bg-bg-elevated hover:text-tx-primary'
      )}
      onClick={() => onSelect(conversation.id)}
    >
      <MessageSquare size={12} className="flex-shrink-0 text-tx-muted" />
      <span className="flex-1 text-xs truncate min-w-0">{truncate(conversation.title, 28)}</span>

      <button
        onClick={e => { e.stopPropagation(); setShowMenu(v => !v) }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-lg hover:bg-bg-hover transition-all cursor-pointer flex-shrink-0"
      >
        <MoreHorizontal size={13} className="text-tx-muted" />
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setShowMenu(false) }} />
            <motion.div
              className="absolute right-1 top-8 z-50 w-44 bg-bg-surface border border-ln rounded-xl shadow-card-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-tx-secondary hover:bg-bg-elevated hover:text-tx-primary transition-colors cursor-pointer"
                onClick={e => { e.stopPropagation(); setShowMenu(false); setRenaming(true) }}
              >
                <Pencil size={12} /> Rename
              </button>
              <div className="h-px bg-ln mx-2" />
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete?.(conversation.id) }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
