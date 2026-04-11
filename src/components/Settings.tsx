'use client'

import { useEffect, useRef } from 'react'
import { X, Volume2, VolumeX, Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  isTTSEnabled: boolean
  isTTSSupported: boolean
  onToggleTTS: (v: boolean) => void
}

export function Settings({ isOpen, onClose, isTTSEnabled, isTTSSupported, onToggleTTS }: SettingsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div ref={ref} className="absolute bottom-16 left-2 right-2 z-50 border border-ln rounded-2xl shadow-card-md animate-fade-in overflow-hidden" style={{ background: 'var(--c-panel-bg)', boxShadow: '0 8px 32px var(--c-shadow-md)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-ln">
        <span className="text-sm font-semibold text-tx-primary">Settings</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-bg-hover text-tx-muted hover:text-tx-primary transition-all cursor-pointer">
          <X size={14} />
        </button>
      </div>

      <div className="px-4 py-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5 p-1.5 rounded-lg flex-shrink-0', isTTSEnabled ? 'bg-[var(--c-accent-light)] text-[var(--c-accent)]' : 'bg-bg-hover text-tx-muted')}>
            {isTTSEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-tx-primary">Voice responses</p>
              <Switch
                checked={isTTSEnabled && isTTSSupported}
                onCheckedChange={onToggleTTS}
                disabled={!isTTSSupported}
                className="data-[state=checked]:bg-[var(--c-accent)]"
              />
            </div>
            <p className="text-xs text-tx-muted mt-1 leading-relaxed">
              Sanjana speaks her replies aloud using your device&apos;s built-in speech engine.
            </p>
          </div>
        </div>

        {!isTTSSupported && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-bg-hover rounded-xl border border-ln">
            <Info size={12} className="text-tx-muted mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Not supported in this browser. Try Chrome, Edge, or Safari.
            </p>
          </div>
        )}

        <p className="text-[11px] text-tx-muted leading-relaxed pt-1 border-t border-ln">
          No audio is sent to any server — speech runs entirely on your device.
        </p>
      </div>
    </div>
  )
}
