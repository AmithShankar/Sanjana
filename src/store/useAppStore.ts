'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

export type BgCategory = 'landscape' | 'abstract'

export type BackgroundPreset = {
  label: string
  category: BgCategory
  css: string
  thumb: string
}

const UNS = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop&auto=format`

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    label: 'Mountains',
    category: 'landscape',
    css:   `url(${UNS('1506905925346-21bda4d32df4', 1920)}) center/cover no-repeat`,
    thumb: UNS('1506905925346-21bda4d32df4', 400),
  },
  {
    label: 'Ocean',
    category: 'landscape',
    css:   `url(${UNS('1507525428034-b723cf961d3e', 1920)}) center/cover no-repeat`,
    thumb: UNS('1507525428034-b723cf961d3e', 400),
  },
  {
    label: 'Desert',
    category: 'landscape',
    css:   `url(${UNS('1509316785289-025f5b846b35', 1920)}) center/cover no-repeat`,
    thumb: UNS('1509316785289-025f5b846b35', 400),
  },
  {
    label: 'Forest',
    category: 'landscape',
    css:   `url(${UNS('1448375240033-7b5bb2d34e23', 1920)}) center/cover no-repeat`,
    thumb: UNS('1448375240033-7b5bb2d34e23', 400),
  },
  {
    label: 'Sunset',
    category: 'landscape',
    css:   `url(${UNS('1495756111155-54ccf3a09c27', 1920)}) center/cover no-repeat`,
    thumb: UNS('1495756111155-54ccf3a09c27', 400),
  },
  {
    label: 'Lake',
    category: 'landscape',
    css:   `url(${UNS('1439853949212-36089c24b0a5', 1920)}) center/cover no-repeat`,
    thumb: UNS('1439853949212-36089c24b0a5', 400),
  },
  {
    label: 'Blue Waves',
    category: 'abstract',
    css:   `url(${UNS('1557682224-5b8590cd9ec5', 1920)}) center/cover no-repeat`,
    thumb: UNS('1557682224-5b8590cd9ec5', 400),
  },
  {
    label: 'Purple Flow',
    category: 'abstract',
    css:   `url(${UNS('1553356084-58ef4a67b2a7', 1920)}) center/cover no-repeat`,
    thumb: UNS('1553356084-58ef4a67b2a7', 400),
  },
  {
    label: 'Orange Burst',
    category: 'abstract',
    css:   `url(${UNS('1541701494587-cb58502866ab', 1920)}) center/cover no-repeat`,
    thumb: UNS('1541701494587-cb58502866ab', 400),
  },
  {
    label: 'Teal Smoke',
    category: 'abstract',
    css:   `url(${UNS('1558618666-fcd25c85cd64', 1920)}) center/cover no-repeat`,
    thumb: UNS('1558618666-fcd25c85cd64', 400),
  },
  {
    label: 'Nebula',
    category: 'abstract',
    css:   `url(${UNS('1419242902214-272b3f66ee7a', 1920)}) center/cover no-repeat`,
    thumb: UNS('1419242902214-272b3f66ee7a', 400),
  },
  {
    label: 'Pink Dream',
    category: 'abstract',
    css:   `url(${UNS('1618556450991-2f1af64e8191', 1920)}) center/cover no-repeat`,
    thumb: UNS('1618556450991-2f1af64e8191', 400),
  },
]

export const OVERLAY_COLORS = [
  null,
  'rgba(0,0,0,0.2)',
  'rgba(59,130,246,0.2)',
  'rgba(168,85,247,0.2)',
  'rgba(239,68,68,0.2)',
  'rgba(34,197,94,0.2)',
]

interface AppState {
  theme: Theme
  sidebarCollapsed: boolean
  backgroundEnabled: boolean
  backgroundPreset: number
  overlayColor: number
  blurEnabled: boolean

  toggleTheme: () => void
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
  setAppearance: (opts: {
    backgroundEnabled?: boolean
    backgroundPreset?: number
    overlayColor?: number
    blurEnabled?: boolean
  }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      backgroundEnabled: false,
      backgroundPreset: 0,
      overlayColor: 0,
      blurEnabled: false,

      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setAppearance: (opts) => set(s => ({ ...s, ...opts })),
    }),
    { name: 'sanjana-store' }
  )
)
