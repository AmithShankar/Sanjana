export type MessageRole = 'user' | 'assistant'

export type OrbState = 'idle' | 'listening' | 'responding'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  folderId?: string
}

export interface ConversationFolder {
  id: string
  name: string
  conversationIds: string[]
  isExpanded: boolean
}

export interface ChatState {
  conversations: Conversation[]
  folders: ConversationFolder[]
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
}
