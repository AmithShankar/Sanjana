"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Sun, Moon, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppStore,
  BACKGROUND_PRESETS,
  OVERLAY_COLORS,
  Theme,
  BgCategory,
} from "@/store/useAppStore";
import { Switch } from "@/components/ui/switch";

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppearanceModal({ isOpen, onClose }: AppearanceModalProps) {
  const {
    theme,
    setTheme,
    backgroundEnabled,
    backgroundPreset,
    overlayColor,
    blurEnabled,
    setAppearance,
  } = useAppStore();

  const [draftTheme, setDraftTheme] = useState<Theme>(theme);
  const [draftBgEnabled, setDraftBgEnabled] = useState(backgroundEnabled);
  const [draftBgPreset, setDraftBgPreset] = useState(backgroundPreset);
  const [draftOverlay, setDraftOverlay] = useState(overlayColor);
  const [draftBlur, setDraftBlur] = useState(blurEnabled);

  const handleSave = () => {
    setTheme(draftTheme);
    setAppearance({
      backgroundEnabled: draftBgEnabled,
      backgroundPreset: draftBgPreset,
      overlayColor: draftOverlay,
      blurEnabled: draftBlur,
    });
    onClose();
  };

  const handleCancel = () => {
    setDraftTheme(theme);
    setDraftBgEnabled(backgroundEnabled);
    setDraftBgPreset(backgroundPreset);
    setDraftOverlay(overlayColor);
    setDraftBlur(blurEnabled);
    onClose();
  };

  const landscapePresets = BACKGROUND_PRESETS.filter(p => p.category === 'landscape');
  const abstractPresets  = BACKGROUND_PRESETS.filter(p => p.category === 'abstract');

  const selectedPreset = BACKGROUND_PRESETS[draftBgPreset];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-ln shadow-card-lg flex flex-col"
            style={{ background: 'var(--c-bg-surface)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ln flex-shrink-0">
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-tx-muted" />
                <h2 className="text-sm font-semibold text-tx-primary">Appearance</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="w-56 flex-shrink-0 border-r border-ln flex flex-col">
                <div className="flex-1 relative overflow-hidden">
                  {draftBgEnabled && selectedPreset ? (
                    <div
                      className="absolute inset-0"
                      style={{ background: selectedPreset.css }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-bg-elevated" />
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2">
                    <div className="self-end max-w-[80%] rounded-xl rounded-tr-sm px-3 py-2 text-[10px] shadow-sm"
                      style={{ background: 'var(--c-msg-user-bg)', color: 'var(--c-msg-user-text)' }}>
                      What can you help me with?
                    </div>
                    <div className="self-start max-w-[80%] rounded-xl rounded-tl-sm px-3 py-2 text-[10px] shadow-sm"
                      style={{ background: 'var(--c-bg-elevated)', color: 'var(--c-text-primary)' }}>
                      I can help with writing, analysis, and more!
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="px-6 py-5 space-y-6">
                  <div>
                    <p className="text-xs font-medium text-tx-secondary mb-2">Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { value: "light" as Theme, label: "Light", icon: Sun },
                          { value: "dark"  as Theme, label: "Dark",  icon: Moon },
                        ] as const
                      ).map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setDraftTheme(value)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                            draftTheme === value
                              ? "border-[var(--c-accent)] bg-[var(--c-accent-light)] text-[var(--c-accent)]"
                              : "border-ln text-tx-secondary hover:bg-bg-elevated",
                          )}
                        >
                          <Icon size={15} />
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
                            ? "dark"
                            : "light";
                          setDraftTheme(sys);
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-ln text-tx-secondary hover:bg-bg-elevated text-xs font-medium transition-all cursor-pointer"
                      >
                        <Monitor size={15} />
                        System
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-tx-primary">Background</p>
                        <p className="text-xs text-tx-muted">Customize your chat background</p>
                      </div>
                      <Switch
                        checked={draftBgEnabled}
                        onCheckedChange={setDraftBgEnabled}
                        className="data-[state=checked]:bg-[var(--c-accent)]"
                      />
                    </div>

                    {draftBgEnabled && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-elevated border border-ln">
                          <div className="flex items-center gap-2">
                            <Sparkles size={13} className="text-tx-muted" />
                            <span className="text-xs text-tx-secondary">Auto generate background</span>
                          </div>
                          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)] transition-all cursor-pointer">
                            Generate
                          </button>
                        </div>

                        <BgSection
                          label="Landscape"
                          presets={landscapePresets}
                          allPresets={BACKGROUND_PRESETS}
                          selectedIndex={draftBgPreset}
                          onSelect={setDraftBgPreset}
                        />

                        <BgSection
                          label="Abstract"
                          presets={abstractPresets}
                          allPresets={BACKGROUND_PRESETS}
                          selectedIndex={draftBgPreset}
                          onSelect={setDraftBgPreset}
                        />

                        <div>
                          <p className="text-xs font-medium text-tx-secondary mb-2">Overlay tint</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {OVERLAY_COLORS.map((color, i) => (
                              <button
                                key={i}
                                onClick={() => setDraftOverlay(i)}
                                className={cn(
                                  "w-7 h-7 rounded-full border-2 transition-all cursor-pointer",
                                  draftOverlay === i
                                    ? "border-[var(--c-accent)] scale-110"
                                    : "border-ln",
                                )}
                                style={{
                                  background: color ?? "transparent",
                                  outline: i === 0 ? "1px solid var(--c-border)" : undefined,
                                }}
                              >
                                {i === 0 && (
                                  <span className="text-[10px] text-tx-muted flex items-center justify-center h-full">
                                    –
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-tx-primary">Blur effect</p>
                          <Switch
                            checked={draftBlur}
                            onCheckedChange={setDraftBlur}
                            className="data-[state=checked]:bg-[var(--c-accent)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-ln flex-shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated border border-ln transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)] transition-all cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BgSectionProps {
  label: string
  presets: { label: string; category: BgCategory; css: string; thumb: string }[]
  allPresets: { label: string; category: BgCategory; css: string; thumb: string }[]
  selectedIndex: number
  onSelect: (i: number) => void
}

function BgSection({ label, presets, allPresets, selectedIndex, onSelect }: BgSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-tx-secondary">{label}</p>
        <button className="text-[11px] text-[var(--c-accent)] hover:underline cursor-pointer">
          View All
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {presets.slice(0, 4).map((preset) => {
          const globalIdx = allPresets.indexOf(preset);
          const isSelected = globalIdx === selectedIndex;
          return (
            <button
              key={globalIdx}
              onClick={() => onSelect(globalIdx)}
              title={preset.label}
              className={cn(
                "relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105",
                isSelected ? "border-[var(--c-accent)]" : "border-transparent hover:border-ln",
              )}
            >
              <img
                src={preset.thumb}
                alt={preset.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check size={14} className="text-white drop-shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
