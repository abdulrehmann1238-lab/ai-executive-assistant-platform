"use client";

import React, { useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeTask, canSeeApproval } from "@/lib/mock/policy";
import {
  Search,
  CheckCircle,
  FileText,
  Bot,
  Users,
  Calendar,
  Activity,
  Shield,
  Mic,
  RefreshCw,
  Sliders,
  FolderOpen,
} from "lucide-react";
import { Keycap } from "../ui/Badge";

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    approvals,
    people,
    role,
    setRole,
    resetDemo,
    openVoice,
    toggleInspector,
  } = useStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "i" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        toggleInspector();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, toggleInspector]);

  if (!commandPaletteOpen) return null;

  const visibleTasks = tasks.filter((t) => canSeeTask(role, t)).slice(0, 5);
  const visibleApprovals = approvals.filter((a) => canSeeApproval(role, a)).slice(0, 4);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modal flex items-start justify-center pt-20 px-4"
    >
      <div
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-[#1F2421]/40 transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-elevated border border-line rounded-lg shadow-sh-3 overflow-hidden z-modal font-sans animate-in zoom-in-95 fade-in duration-150">
        <Command label="Global Command Menu" className="w-full">
          <div className="flex items-center px-4 py-3 border-b border-line gap-2.5">
            <Search className="w-4 h-4 text-ink-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search actions, drafts, tasks, or navigation (↑↓ to move, Enter to run)..."
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-3 outline-none"
            />
            <Keycap>ESC</Keycap>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 text-[13px] divide-y divide-line/40">
            <Command.Empty className="p-4 text-center text-ink-3 text-[13px]">
              No matching records found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading="Navigation" className="py-1 px-1 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/app"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <FolderOpen className="w-4 h-4 text-ink-3" />
                <span>Go to Home (Needs You Queue)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/app/approvals"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Go to Approvals</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/app/tasks"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <FileText className="w-4 h-4 text-ink-3" />
                <span>Go to Tasks</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/app/agents"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <Bot className="w-4 h-4 text-info" />
                <span>Go to Agents</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/app/meetings"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <Calendar className="w-4 h-4 text-ink-3" />
                <span>Go to Meetings & Prep</span>
              </Command.Item>
            </Command.Group>

            {/* Quick Actions */}
            <Command.Group heading="Actions" className="py-1 px-1 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => openVoice("brief"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <Mic className="w-4 h-4 text-accent" />
                <span>Play Today's Voice Brief</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => toggleInspector())}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span>Toggle "Under the Hood" Inspector</span>
                <span className="ml-auto font-mono text-[10px] text-ink-3">Key: I</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => resetDemo())}
                className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
              >
                <RefreshCw className="w-4 h-4 text-ink-3" />
                <span>Reset Demo State</span>
              </Command.Item>
            </Command.Group>

            {/* Pending Approvals */}
            {visibleApprovals.length > 0 && (
              <Command.Group heading="Approvals Waiting" className="py-1 px-1 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
                {visibleApprovals.map((a) => (
                  <Command.Item
                    key={a.id}
                    onSelect={() => runCommand(() => router.push(`/app/approvals/${a.id}`))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
                  >
                    <span className="font-mono text-[11px] text-ink-3">{a.id}</span>
                    <span className="truncate flex-1">{a.title}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-xs bg-accent-t text-accent font-medium">
                      {a.risk} Risk
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Filtered Tasks */}
            {visibleTasks.length > 0 && (
              <Command.Group heading="Tasks" className="py-1 px-1 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
                {visibleTasks.map((t) => (
                  <Command.Item
                    key={t.id}
                    onSelect={() => runCommand(() => router.push(`/app/tasks?drawer=${t.id}`))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-ink hover:bg-sunken cursor-pointer aria-selected:bg-primary-t aria-selected:text-primary transition-colors text-[13px]"
                  >
                    <span className="font-mono text-[11px] text-ink-3">{t.id}</span>
                    <span className="truncate flex-1">{t.title}</span>
                    <span className="text-[11px] text-ink-3">{t.dueLabel}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-surface text-[11px] text-ink-3">
            <span>Press <Keycap>↑</Keycap> <Keycap>↓</Keycap> to navigate, <Keycap>↵</Keycap> to select</span>
            <span>Halden Command Center</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
