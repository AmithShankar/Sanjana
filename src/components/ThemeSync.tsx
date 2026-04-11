'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function ThemeSync() {
  const theme = useAppStore(s => s.theme)
  const backgroundEnabled = useAppStore(s => s.backgroundEnabled)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.bg = backgroundEnabled ? 'active' : ''
  }, [theme, backgroundEnabled])

  return null
}
