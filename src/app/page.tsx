'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from '@/hooks/useChat'
import { useVoice } from '@/hooks/useVoice'
import { useSpeech } from '@/hooks/useSpeech'
import { useAppStore, BACKGROUND_PRESETS, OVERLAY_COLORS } from '@/store/useAppStore'
import { Sidebar } from '@/components/Sidebar'
import { ChatWindow } from '@/components/Chat'
import { ChatInput } from '@/components/ChatInput'
import { HomeView } from '@/components/HomeView'
import { TTSToast } from '@/components/TTSToast'

export default function Home() {
  const {
    conversations, folders, activeConversation, activeConversationId,
    isLoading, isStreaming, error, send,
    createNewConversation, selectConversation, toggleFolder, createFolder,
    deleteConversation, renameConversation,
  } = useChat()

  const {
    orbState, isVoiceMode, transcript, audioLevel,
    startListening, stopListening, clearTranscript, toggleVoiceMode, setRespondingState,
  } = useVoice()

  const { isTTSEnabled, isSpeaking, speak, stop, setTTSEnabled, isSupported } = useSpeech()
  const { backgroundEnabled, backgroundPreset, overlayColor, blurEnabled } = useAppStore()
  const [showTTSToast, setShowTTSToast] = useState(false)
  const [hasShownToast, setHasShownToast] = useState(false)
  const [chipText, setChipText] = useState('')

  useEffect(() => { setRespondingState(isLoading || isStreaming) }, [isLoading, isStreaming, setRespondingState])

  const handleStreamComplete = useCallback((text: string) => {
    if (isTTSEnabled) {
      speak(text)
      if (!hasShownToast) { setShowTTSToast(true); setHasShownToast(true) }
    }
  }, [isTTSEnabled, speak, hasShownToast])

  const handleSend = useCallback((message: string) => {
    if (!message.trim()) return
    stop()
    send(message, handleStreamComplete)
  }, [send, stop, handleStreamComplete])

  const handleGoHome = useCallback(() => { createNewConversation() }, [createNewConversation])

  const showHome = !activeConversation || activeConversation.messages.length === 0

  const bgStyle: React.CSSProperties = backgroundEnabled
    ? { background: BACKGROUND_PRESETS[backgroundPreset]?.css ?? undefined }
    : {}

  const hasOverlay = backgroundEnabled && overlayColor > 0
  const hasBlur    = backgroundEnabled && blurEnabled

  return (
    <div className="flex h-screen overflow-hidden" style={bgStyle}>
      {hasOverlay && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{ background: OVERLAY_COLORS[overlayColor] ?? undefined }}
        />
      )}
      {hasBlur && (
        <div className="fixed inset-0 pointer-events-none z-0 backdrop-blur-sm" />
      )}

      <Sidebar
        conversations={conversations}
        folders={folders}
        activeConversationId={activeConversationId}
        isTTSEnabled={isTTSEnabled}
        isTTSSupported={isSupported}
        onNewChat={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        onToggleFolder={toggleFolder}
        onCreateFolder={createFolder}
        onToggleTTS={setTTSEnabled}
        onGoHome={handleGoHome}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AnimatePresence>
          {showHome && (
            <motion.div
              key="home"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col flex-1 min-h-0">
                <HomeView
                  conversations={conversations}
                  onSend={handleSend}
                  onSelectConversation={selectConversation}
                  isLoading={isLoading || isStreaming}
                  orbState={orbState}
                  audioLevel={audioLevel}
                  isVoiceMode={isVoiceMode}
                  transcript={transcript}
                  chipText={chipText}
                  onChipClick={setChipText}
                  onToggleVoice={toggleVoiceMode}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  onClearTranscript={clearTranscript}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showHome && (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <ChatWindow
              conversation={activeConversation}
              isLoading={isLoading}
              error={error}
              isSpeaking={isSpeaking}
              isTTSEnabled={isTTSEnabled}
              onSpeak={speak}
              onStopSpeaking={stop}
              hasBackground={backgroundEnabled}
            />

            {!backgroundEnabled && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-base to-transparent pointer-events-none z-10" />
            )}

            <TTSToast show={showTTSToast} onDismiss={() => setShowTTSToast(false)} onOpenSettings={() => setShowTTSToast(false)} />

            <div className="relative z-20 px-4 pb-5 pt-2">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSend={handleSend}
                  isLoading={isLoading || isStreaming}
                  orbState={orbState}
                  audioLevel={audioLevel}
                  isVoiceMode={isVoiceMode}
                  transcript={transcript}
                  onToggleVoice={toggleVoiceMode}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  onClearTranscript={clearTranscript}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
