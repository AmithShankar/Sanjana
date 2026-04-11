'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseSpeechReturn {
  isTTSEnabled: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
  setTTSEnabled: (v: boolean) => void
  isSupported: boolean
}

export function useSpeech(): UseSpeechReturn {
  const [isTTSEnabled, setTTSEnabledState] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const supported = 'speechSynthesis' in window
    setIsSupported(supported)
    if (!supported) return

    const saved = localStorage.getItem('sanjana-tts')
    if (saved === 'false') setTTSEnabledState(false)

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) voicesRef.current = v
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current
    if (!voices.length) return null
    const preferred = [
      'Samantha',
      'Google US English',
      'Microsoft Aria',
      'Microsoft Jenny',
      'Karen',
      'Moira',
    ]
    for (const name of preferred) {
      const found = voices.find(v => v.name.includes(name))
      if (found) return found
    }
    return voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isTTSEnabled || typeof window === 'undefined' || !window.speechSynthesis) return
      const clean = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim()

      if (!clean) return
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(clean)
      utterance.rate = 0.95
      utterance.pitch = 1.08
      utterance.volume = 1.0
      const voice = getBestVoice()
      if (voice) utterance.voice = voice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend   = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isTTSEnabled, getBestVoice]
  )

  const setTTSEnabled = useCallback(
    (v: boolean) => {
      setTTSEnabledState(v)
      localStorage.setItem('sanjana-tts', String(v))
      if (!v) stop()
    },
    [stop]
  )

  return { isTTSEnabled, isSpeaking, speak, stop, setTTSEnabled, isSupported }
}
