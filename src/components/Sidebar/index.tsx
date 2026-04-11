"use client";

import { useState, useMemo } from "react";
import { Conversation, ConversationFolder } from "@/types";
import { getDateGroup, cn } from "@/lib/utils";
import { FolderItem } from "./FolderItem";
import { ConversationItem } from "./ConversationItem";
import { Settings } from "@/components/Settings";
import { useAppStore } from "@/store/useAppStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SquarePen,
  Search,
  X,
  FolderPlus,
  Sun,
  Moon,
  Home,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  conversations: Conversation[];
  folders: ConversationFolder[];
  activeConversationId: string | null;
  isTTSEnabled: boolean;
  isTTSSupported: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onToggleFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onToggleTTS: (v: boolean) => void;
  onGoHome: () => void;
}

export function Sidebar({
  conversations,
  folders,
  activeConversationId,
  isTTSEnabled,
  isTTSSupported,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onToggleFolder,
  onCreateFolder,
  onToggleTTS,
  onGoHome,
}: SidebarProps) {
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useAppStore();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const loose = useMemo(
    () => conversations.filter((c) => !c.folderId),
    [conversations],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [search, conversations]);

  const grouped = useMemo(() => {
    const g: Record<string, Conversation[]> = {};
    for (const c of loose) {
      const k = getDateGroup(c.updatedAt);
      if (!g[k]) g[k] = [];
      g[k].push(c);
    }
    return g;
  }, [loose]);

  const addFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName("");
      setShowFolderInput(false);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col h-full border-r border-ln transition-all duration-300 overflow-hidden relative",
          sidebarCollapsed ? "w-0" : "w-64",
        )}
        style={{ background: "var(--c-sidebar-bg)" }}
      >
        <div className="flex flex-col h-full w-64">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                className="w-6 h-6 flex-shrink-0"
                alt="Sanjana"
              />
              <span className="font-display font-semibold text-sm text-tx-primary">
                Sanjana
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer"
                >
                  <PanelLeftClose size={15} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Collapse sidebar</TooltipContent>
            </Tooltip>
          </div>

          <div className="px-3 pb-2">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-ln text-tx-secondary hover:text-tx-primary text-sm font-medium transition-all cursor-pointer"
            >
              <SquarePen size={14} />
              New Chat
            </button>
          </div>

          <div className="px-3 pb-2 space-y-0.5">
            <button
              onClick={onGoHome}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated text-sm transition-all cursor-pointer"
            >
              <Home size={14} />
              Home
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated text-sm transition-all cursor-pointer">
              <Globe size={14} />
              Explore Sanjana AI
            </button>
          </div>

          <div className="px-3 py-1">
            {showSearch ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated border border-ln focus-within:border-ln-strong transition-all">
                <Search size={12} className="text-tx-muted flex-shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats…"
                  className="flex-1 bg-transparent text-xs text-tx-primary placeholder:text-tx-muted outline-none min-w-0"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearch("");
                  }}
                  className="text-tx-muted hover:text-tx-primary cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-tx-muted hover:text-tx-primary hover:bg-bg-elevated text-xs transition-all cursor-pointer"
              >
                <Search size={12} />
                <span>Search chats</span>
              </button>
            )}
          </div>

          <ScrollArea className="flex-1 px-2 py-1">
            {filtered !== null ? (
              <div className="space-y-0.5 px-1">
                <p className="text-[10px] text-tx-muted px-2 py-1.5">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
                {filtered.length === 0 ? (
                  <p className="text-xs text-tx-muted px-2 py-2">No matches</p>
                ) : (
                  filtered.map((c) => (
                    <ConversationItem
                      key={c.id}
                      conversation={c}
                      isActive={c.id === activeConversationId}
                      onSelect={onSelectConversation}
                      onDelete={onDeleteConversation}
                      onRename={onRenameConversation}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4 px-1">
                {folders.length > 0 && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[11px] text-tx-secondary font-medium">
                        Folder
                      </span>
                      <button
                        onClick={() => setShowFolderInput((v) => !v)}
                        className="text-tx-muted hover:text-tx-primary transition-colors cursor-pointer"
                      >
                        <FolderPlus size={12} />
                      </button>
                    </div>
                    {showFolderInput && (
                      <div className="mx-1 mb-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bg-elevated border border-ln">
                          <input
                            autoFocus
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addFolder()}
                            placeholder="Folder name…"
                            className="flex-1 bg-transparent text-xs text-tx-primary placeholder:text-tx-muted outline-none"
                          />
                          <button
                            onClick={addFolder}
                            className="text-[var(--c-accent)] text-xs font-medium cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                    {folders.map((f) => (
                      <FolderItem
                        key={f.id}
                        folder={f}
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onToggle={onToggleFolder}
                        onSelect={onSelectConversation}
                        onDelete={onDeleteConversation}
                        onRename={onRenameConversation}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-[11px] text-tx-secondary font-medium px-2">
                    History
                  </p>
                  {Object.entries(grouped).map(([group, convs]) => (
                    <div key={group} className="space-y-0.5">
                      <p className="text-[10px] text-tx-muted px-2 mb-1">
                        {group}
                      </p>
                      {convs.map((c) => (
                        <ConversationItem
                          key={c.id}
                          conversation={c}
                          isActive={c.id === activeConversationId}
                          onSelect={onSelectConversation}
                          onDelete={onDeleteConversation}
                          onRename={onRenameConversation}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          <Settings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            isTTSEnabled={isTTSEnabled}
            isTTSSupported={isTTSSupported}
            onToggleTTS={onToggleTTS}
          />

          <div className="px-3 py-2">
            <div className="rounded-2xl bg-bg-elevated border border-ln p-3 space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.svg"
                  className="w-5 h-5 flex-shrink-0"
                  alt="Sanjana"
                />
                <span className="text-xs font-semibold text-tx-primary">
                  Sanjana
                </span>
              </div>
              <p className="text-[11px] text-tx-muted leading-relaxed">
                Enjoy priority processing, custom AI models, and unlimited
                access.
              </p>
              <button className="w-full py-1.5 rounded-xl bg-bg-surface hover:bg-bg-hover border border-ln text-tx-secondary text-xs font-medium transition-colors cursor-pointer">
                Upgrade Plan
              </button>
            </div>
          </div>

          <div className="px-3 py-3 border-t border-ln">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[var(--c-bg-card)] border border-ln flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] text-tx-secondary font-semibold">
                  U
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-tx-primary truncate">
                  User
                </p>
                <p className="text-[10px] text-tx-muted">Free Plan</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer"
                  >
                    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowSettings((v) => !v)}
                    className={cn(
                      "p-1.5 rounded-lg transition-all cursor-pointer",
                      showSettings
                        ? "text-[var(--c-accent)] bg-[var(--c-accent-light)]"
                        : "text-tx-muted hover:text-tx-primary hover:bg-bg-elevated",
                    )}
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Settings</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </aside>

      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-xl bg-bg-surface border border-ln text-tx-muted hover:text-tx-primary hover:bg-bg-elevated transition-all cursor-pointer shadow-card"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}
    </>
  );
}
