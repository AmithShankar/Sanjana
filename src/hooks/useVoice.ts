'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { OrbState } from '@/types'

interface UseVoiceReturn {
  orbState: OrbState
  isVoiceMode: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
  toggleVoiceMode: () => void
  setRespondingState: (v: boolean) => void
  audioLevel: number
}

export function useVoice(): UseVoiceReturn {
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number>(0)

  const stopAudioAnalysis = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    sourceRef.current?.disconnect()
    streamRef.current?.getTracks().forEach(t => t.stop())
    analyserRef.current = null
    sourceRef.current = null
    streamRef.current = null
    setAudioLevel(0)
  }, [])

  const startAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      analyserRef.current = analyser
      sourceRef.current = source

      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setAudioLevel(avg / 128)
        animFrameRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {}
  }, [])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    setOrbState('listening')
    setTranscript('')
    startAudioAnalysis()

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      setTranscript(final || interim)
    }

    recognition.onend = () => {
      setOrbState('idle')
      stopAudioAnalysis()
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [startAudioAnalysis, stopAudioAnalysis])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    stopAudioAnalysis()
    setOrbState('idle')
  }, [stopAudioAnalysis])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceMode(prev => {
      if (prev) {
        stopListening()
        return false
      } else {
        startListening()
        return true
      }
    })
  }, [stopListening, startListening])

  const setRespondingState = useCallback((v: boolean) => {
    setOrbState(v ? 'responding' : 'idle')
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      stopAudioAnalysis()
    }
  }, [stopAudioAnalysis])

  return {
    orbState,
    isVoiceMode,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    toggleVoiceMode,
    setRespondingState,
    audioLevel,
  }
}
