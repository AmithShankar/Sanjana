'use client'

import { ConversationFolder, Conversation } from '@/types'
import { cn } from '@/lib/utils'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { ConversationItem } from './ConversationItem'

interface FolderItemProps {
  folder: ConversationFolder
  conversations: Conversation[]
  activeConversationId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onRename?: (id: string, title: string) => void
}

export function FolderItem({ folder, conversations, activeConversationId, onToggle, onSelect, onDelete, onRename }: FolderItemProps) {
  const children = conversations.filter(c => folder.conversationIds.includes(c.id))

  return (
    <div>
      <button
        onClick={() => onToggle(folder.id)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer"
      >
        <ChevronRight size={12} className={cn('flex-shrink-0 transition-transform duration-200 text-tx-muted', folder.isExpanded && 'rotate-90')} />
        {folder.isExpanded
          ? <FolderOpen size={13} className="flex-shrink-0 text-tx-secondary" />
          : <Folder size={13} className="flex-shrink-0 text-tx-muted" />
        }
        <span className="flex-1 text-left text-xs font-medium">{folder.name}</span>
      </button>

      {folder.isExpanded && (
        <div className="mt-0.5 space-y-0.5 animate-fade-in">
          {children.map(c => (
            <ConversationItem key={c.id} conversation={c} isActive={c.id === activeConversationId} onSelect={onSelect} onDelete={onDelete} onRename={onRename} indent />
          ))}
        </div>
      )}
    </div>
  )
}
