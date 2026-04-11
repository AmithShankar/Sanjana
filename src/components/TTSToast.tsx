'use client'

import { useEffect, useState } from 'react'
import { Volume2, X } from 'lucide-react'

interface TTSToastProps {
  show: boolean
  onDismiss: () => void
  onOpenSettings: () => void
}

export function TTSToast({ show, onDismiss, onOpenSettings }: TTSToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 6000)
      return () => clearTimeout(t)
    }
  }, [show])

  useEffect(() => {
    if (!visible && show) onDismiss()
  }, [visible, show, onDismiss])

  if (!visible) return null

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-bg-elevated border border-ln shadow-card-md text-sm text-tx-secondary whitespace-nowrap">
        <Volume2 size={14} className="text-[var(--c-accent)] flex-shrink-0" />
        <span>Voice responses are on</span>
        <span className="text-tx-muted">—</span>
        <button onClick={onOpenSettings} className="text-[var(--c-accent)] hover:opacity-80 font-medium transition-opacity cursor-pointer">
          turn off in Settings
        </button>
        <button onClick={() => setVisible(false)} className="ml-1 text-tx-muted hover:text-tx-primary transition-colors cursor-pointer">
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
