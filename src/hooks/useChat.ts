'use client'

import { useState, useCallback, useRef } from 'react'
import { Conversation, ConversationFolder, Message } from '@/types'
import { sendMessage } from '@/lib/api'
import { generateId } from '@/lib/utils'

const msg = (role: 'user' | 'assistant', content: string, daysAgo = 0): Message => ({
  id: generateId(),
  role,
  content,
  timestamp: new Date(Date.now() - daysAgo * 86400000),
})

const INITIAL_FOLDERS: ConversationFolder[] = [
  { id: 'f1', name: 'Work Projects', conversationIds: ['c2', 'c3'], isExpanded: true },
  { id: 'f2', name: 'Research', conversationIds: ['c4'], isExpanded: false },
]

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    title: 'Getting started with Sanjana',
    messages: [
      msg('assistant', "Hi! I'm Sanjana, your intelligent AI assistant. I'm here to help you think, create, and explore.\n\nYou can ask me anything — from drafting emails and summarizing documents to brainstorming ideas or explaining complex topics. What would you like to work on today?"),
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'c2',
    title: 'Q4 Strategy Planning',
    messages: [
      msg('user', 'Can you help me outline Q4 goals and priorities? We need to cover product, marketing, and revenue targets.', 1),
      msg('assistant', "Absolutely! Here's a structured Q4 framework for your team:\n\n**Product**\n• Ship 2 major feature releases\n• Reduce critical bug count by 40%\n• Improve onboarding completion rate to 70%\n\n**Marketing**\n• Launch 3 content campaigns targeting mid-market\n• Grow email list by 25%\n• Host 2 webinars with 200+ attendees each\n\n**Revenue**\n• Hit $2.4M ARR by end of Q4\n• Reduce churn to below 3%\n• Close 15 enterprise deals\n\nWant me to expand on any of these areas or help prioritize them?", 1),
      msg('user', 'Can you break down the revenue targets more specifically?', 1),
      msg('assistant', "For a more specific revenue breakdown:\n\n**Monthly targets:**\n- October: $750K (focus on pipeline conversion)\n- November: $820K (push mid-market expansion)\n- December: $830K (enterprise close cycle)\n\n**By segment:**\n- SMB (≤50 seats): 45% of new ARR\n- Mid-market (51–500 seats): 35%\n- Enterprise (500+ seats): 20%\n\n**Key levers to hit targets:**\n1. Accelerate trial-to-paid conversion with dedicated success calls\n2. Upsell existing accounts on new seat tiers\n3. Reactivate churned customers with win-back offers\n\nShall I draft talking points for your Q4 kickoff meeting?", 1),
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    folderId: 'f1',
  },
  {
    id: 'c3',
    title: 'Product roadmap brainstorm',
    messages: [
      msg('user', 'I need fresh ideas for our product roadmap. We\'re a B2B SaaS tool for project management.', 2),
      msg('assistant', "Here are some high-impact roadmap ideas for a B2B project management SaaS:\n\n**AI-Powered Features**\n• Smart task prioritization based on deadlines + dependencies\n• Auto-generated project summaries for stakeholders\n• Predictive completion dates using historical velocity\n\n**Collaboration**\n• Real-time multiplayer editing (like Figma for tasks)\n• Video async updates embedded in tasks\n• Guest access with granular permissions\n\n**Integrations**\n• Native Slack + Teams notifications with 2-way sync\n• GitHub/GitLab PR-to-task linking\n• Zapier/Make templates marketplace\n\n**Analytics**\n• Team productivity heatmaps\n• Burndown + cumulative flow charts\n• Custom KPI dashboards per project\n\nWhich area resonates most with your current user feedback?", 2),
    ],
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    folderId: 'f1',
  },
  {
    id: 'c4',
    title: 'AI trends deep dive',
    messages: [
      msg('user', 'What are the most important AI trends shaping industries in 2025?', 3),
      msg('assistant', "The AI landscape is evolving faster than ever. Here are the trends with the biggest impact:\n\n**1. Multimodal AI Goes Mainstream**\nModels that see, hear, and read simultaneously are becoming standard — transforming healthcare diagnostics, manufacturing QC, and content creation.\n\n**2. Agentic AI Systems**\nAI that can plan, use tools, and complete multi-step tasks autonomously. Think AI that can research, write, publish, and analyze results without human hand-holding.\n\n**3. Small, Specialized Models**\nThe shift from massive general models toward compact, fine-tuned models that run on-device — better privacy, lower cost, faster inference.\n\n**4. AI in Science & Research**\nAlphaFold-style breakthroughs are spreading to materials science, drug discovery, and climate modeling.\n\n**5. Synthetic Data at Scale**\nCompanies are training on AI-generated datasets to overcome real-world data scarcity and privacy constraints.\n\nWhich industry are you most interested in exploring?", 3),
    ],
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    folderId: 'f2',
  },
  {
    id: 'c5',
    title: 'Weekly review summary',
    messages: [
      msg('user', 'Can you give me a good template for a weekly review?', 5),
      msg('assistant', "Here's a 15-minute weekly review template that covers what matters:\n\n**🔁 Look Back (5 min)**\n- What did I complete this week? (list 3–5 wins)\n- What didn't get done? (1 sentence why)\n- What surprised me?\n\n**📊 Measure (3 min)**\n- Check your key metrics vs. targets\n- Note any trends (up/down/flat)\n\n**🧠 Learn (3 min)**\n- What's one thing I'd do differently?\n- What's a skill I want to improve next week?\n\n**📋 Plan Ahead (4 min)**\n- What are my top 3 priorities next week?\n- What blockers do I need to clear?\n- Who do I need to follow up with?\n\n**Pro tip:** Keep it in the same doc each week so you build a searchable log. Want me to turn this into a Notion template or a shareable doc?", 5),
    ],
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 5),
  },
]

const STREAM_INTERVAL_MS = 38

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [folders, setFolders] = useState<ConversationFolder[]>(INITIAL_FOLDERS)
  const [activeConversationId, setActiveConversationId] = useState<string | null>('c1')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null

  const cancelStream = useCallback(() => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
      streamTimerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const streamIntoMessage = useCallback(
    (msgId: string, fullText: string, convId: string, onComplete?: (text: string) => void) => {
      const chunks = fullText.match(/\S+|\s+/g) ?? [fullText]
      let idx = 0
      setIsStreaming(true)

      streamTimerRef.current = setInterval(() => {
        idx++
        const visible = chunks.slice(0, idx).join('')

        setConversations(prev =>
          prev.map(c =>
            c.id !== convId
              ? c
              : { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, content: visible } : m) }
          )
        )

        if (idx >= chunks.length) {
          clearInterval(streamTimerRef.current!)
          streamTimerRef.current = null
          setConversations(prev =>
            prev.map(c =>
              c.id !== convId
                ? c
                : { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, isStreaming: false } : m) }
            )
          )
          setIsStreaming(false)
          onComplete?.(fullText)
        }
      }, STREAM_INTERVAL_MS)
    },
    []
  )

  const createNewConversation = useCallback(() => {
    cancelStream()
    const newConv: Conversation = {
      id: generateId(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
    setError(null)
  }, [cancelStream])

  const selectConversation = useCallback(
    (id: string) => {
      cancelStream()
      setActiveConversationId(id)
      setError(null)
    },
    [cancelStream]
  )

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev =>
      prev.map(f => (f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f))
    )
  }, [])

  const createFolder = useCallback((name: string) => {
    setFolders(prev => [
      ...prev,
      { id: generateId(), name, conversationIds: [], isExpanded: true },
    ])
  }, [])

  const deleteConversation = useCallback((id: string) => {
    cancelStream()
    setConversations(prev => prev.filter(c => c.id !== id))
    setFolders(prev => prev.map(f => ({ ...f, conversationIds: f.conversationIds.filter(cid => cid !== id) })))
    setActiveConversationId(prev => (prev === id ? null : prev))
  }, [cancelStream])

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: title.trim() || c.title } : c))
  }, [])

  const send = useCallback(
    async (content: string, onStreamComplete?: (text: string) => void) => {
      if (!content.trim() || isLoading || isStreaming) return
      setError(null)

      let convId = activeConversationId
      let isNewConv = false

      if (!convId) {
        const newConv: Conversation = {
          id: generateId(),
          title: content.slice(0, 45),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setConversations(prev => [newConv, ...prev])
        setActiveConversationId(newConv.id)
        convId = newConv.id
        isNewConv = true
      }

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      setConversations(prev =>
        prev.map(c => {
          if (c.id !== convId) return c
          const isFirst = c.messages.filter(m => m.role === 'user').length === 0 || isNewConv
          return {
            ...c,
            title: isFirst ? content.slice(0, 45) : c.title,
            messages: [...c.messages, userMsg],
            updatedAt: new Date(),
          }
        })
      )

      setIsLoading(true)

      try {
        const fullText = await sendMessage(content.trim())
        const assistantMsgId = generateId()
        const assistantMsg: Message = {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        }
        setConversations(prev =>
          prev.map(c =>
            c.id === convId
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date() }
              : c
          )
        )
        setIsLoading(false)
        streamIntoMessage(assistantMsgId, fullText, convId!, onStreamComplete)
      } catch (err) {
        setIsLoading(false)
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    },
    [activeConversationId, isLoading, isStreaming, streamIntoMessage]
  )

  return {
    conversations,
    folders,
    activeConversation,
    activeConversationId,
    isLoading,
    isStreaming,
    error,
    send,
    createNewConversation,
    selectConversation,
    toggleFolder,
    createFolder,
    deleteConversation,
    renameConversation,
  }
}
