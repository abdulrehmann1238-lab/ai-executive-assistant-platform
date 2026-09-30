"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Bot, ShieldAlert } from "lucide-react";
import clsx from "clsx";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: "approval" | "agent" | "security";
  unread: boolean;
}

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "Drafter submitted A-501 (Harlow renewal) for approval",
      time: "18m ago",
      type: "agent",
      unread: true,
    },
    {
      id: "n-2",
      title: "Contract Agent flagged 24mo auto-renewal on BlueRidge agreement",
      time: "45m ago",
      type: "approval",
      unread: true,
    },
    {
      id: "n-3",
      title: "Priya requested urgent decision on Crown FC5 lease ($42,500)",
      time: "1h ago",
      type: "approval",
      unread: false,
    },
    {
      id: "n-4",
      title: "Daily voice brief compiled for Thursday 1 October",
      time: "2h ago",
      type: "agent",
      unread: false,
    },
    {
      id: "n-5",
      title: "Google Calendar sync completed (42 events indexed)",
      time: "3h ago",
      type: "security",
      unread: false,
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-sm text-ink-2 hover:text-ink hover:bg-secondary transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-elevated" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-elevated border border-line rounded-md shadow-sh-3 z-popover animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between p-3.5 border-b border-line bg-surface">
            <span className="font-serif text-[14px] font-medium text-ink">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => setItems(items.map((i) => ({ ...i, unread: false })))}
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-line max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "p-3 text-[12px] flex items-start gap-2.5 transition-colors hover:bg-sunken/50",
                  item.unread && "bg-primary-t/20"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === "agent" && <Bot className="w-4 h-4 text-info" />}
                  {item.type === "approval" && <Clock className="w-4 h-4 text-accent" />}
                  {item.type === "security" && <ShieldAlert className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={clsx("leading-snug", item.unread ? "text-ink font-medium" : "text-ink-2")}>
                    {item.title}
                  </p>
                  <span className="text-[10px] text-ink-3 mt-1 inline-block">{item.time}</span>
                </div>
                {item.unread && <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-line bg-surface text-center">
            <span className="text-[11px] text-ink-3">Notifications are simulated in demo mode</span>
          </div>
        </div>
      )}
    </div>
  );
}
