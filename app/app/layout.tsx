"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { BottomTabs } from "@/components/app/BottomTabs";
import { Inspector } from "@/components/app/Inspector";
import { CommandPalette } from "@/components/app/CommandPalette";
import { VoiceOverlay } from "@/components/app/VoiceOverlay";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { Modal } from "@/components/ui/Modal";
import { Keycap } from "@/components/ui/Badge";
import { useStore } from "@/lib/mock/store";
import { HelpCircle } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { toggleInspector, openVoice, inspector } = useStore();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        toggleInspector();
      } else if (e.key === " ") {
        // Space opens voice if not typing
        e.preventDefault();
        openVoice("command");
      } else if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleInspector, openVoice]);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row font-sans selection:bg-primary-t selection:text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Global Footer Honesty Stamp */}
        <footer className="px-6 py-3 border-t border-line text-[11px] text-ink-3 flex items-center justify-between bg-surface/50">
          <span>Interactive prototype. Data is simulated.</span>
          <button
            onClick={() => setShortcutsOpen(true)}
            className="flex items-center gap-1 hover:text-ink transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Shortcuts (?)</span>
          </button>
        </footer>
      </div>

      {/* Mobile Navigation */}
      <BottomTabs />

      {/* Global Overlays */}
      <Inspector />
      <CommandPalette />
      <VoiceOverlay />
      <ToastContainer />

      {/* Keyboard Shortcuts Help Dialog */}
      <Modal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-4 text-[13px]">
          <p className="text-ink-3">
            Designed for executive velocity like Superhuman for leadership decisions.
          </p>

          <div className="divide-y divide-line border border-line rounded-md bg-surface">
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Approve highlighted draft</span>
              <Keycap>A</Keycap>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Reject draft with reason sheet</span>
              <Keycap>R</Keycap>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Toggle Under the Hood Inspector</span>
              <Keycap>I</Keycap>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Global Command Palette</span>
              <div className="flex gap-1">
                <Keycap>⌘</Keycap>
                <Keycap>K</Keycap>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Hold or press for Voice Command</span>
              <Keycap>Space</Keycap>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-ink font-medium">Navigate decision cards</span>
              <div className="flex gap-1">
                <Keycap>J</Keycap>
                <Keycap>K</Keycap>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
