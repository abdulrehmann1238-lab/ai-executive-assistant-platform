"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/mock/store";
import { Search, Mic, Shield, ChevronRight } from "lucide-react";
import { NotificationsPopover } from "./NotificationsPopover";
import { Keycap } from "../ui/Badge";
import clsx from "clsx";

export function Topbar() {
  const pathname = usePathname();
  const { setCommandPaletteOpen, openVoice, toggleInspector, inspector } = useStore();

  const segments = pathname.split("/").filter(Boolean);
  const isDetail = segments.length > 2;

  return (
    <header className="h-14 border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-sticky flex items-center justify-between px-4 sm:px-6 shrink-0 font-sans">
      {/* Left: Breadcrumbs or Active Route */}
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/app" className="text-[13px] font-medium text-ink-3 hover:text-ink transition-colors">
          App
        </Link>
        {segments.slice(1).map((seg, idx) => (
          <React.Fragment key={seg}>
            <ChevronRight className="w-3.5 h-3.5 text-ink-3/50" />
            <span
              className={clsx(
                "text-[13px] capitalize truncate",
                idx === segments.length - 2 ? "font-semibold text-ink" : "text-ink-3"
              )}
            >
              {seg.replace("-", " ")}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search / Command palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 h-8 px-2.5 rounded-sm bg-sunken/80 hover:bg-secondary border border-line text-ink-3 hover:text-ink text-[12px] transition-colors"
          aria-label="Open command palette"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search or command...</span>
          <div className="flex items-center gap-0.5 ml-1">
            <Keycap>⌘K</Keycap>
          </div>
        </button>

        {/* Voice Trigger */}
        <button
          onClick={() => openVoice("brief")}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-sm bg-surface hover:bg-secondary border border-line text-ink text-[12px] font-medium transition-colors"
        >
          <Mic className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">Voice</span>
        </button>

        {/* Notifications */}
        <NotificationsPopover />

        {/* Under the Hood Inspector Toggle */}
        <button
          onClick={() => toggleInspector()}
          className={clsx(
            "flex items-center gap-1.5 h-8 px-2.5 rounded-sm border text-[12px] font-medium transition-colors",
            inspector.isOpen
              ? "bg-primary text-white border-primary shadow-sh-1"
              : "bg-surface hover:bg-secondary border-line text-ink"
          )}
          title="Toggle Under the Hood Inspector (I)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Trust Layer</span>
          <Keycap className={inspector.isOpen ? "bg-white/20 text-white border-white/30" : ""}>
            I
          </Keycap>
        </button>
      </div>
    </header>
  );
}
