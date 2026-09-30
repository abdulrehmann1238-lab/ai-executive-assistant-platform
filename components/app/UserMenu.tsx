"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/mock/store";
import { Avatar } from "../ui/Badge";
import { Role } from "@/lib/mock/policy";
import { ChevronUp, RefreshCw, UserCheck, Shield, LogOut, Check } from "lucide-react";
import clsx from "clsx";

export function UserMenu() {
  const { user, role, setRole, resetDemo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
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

  const roles: Role[] = ["Owner", "Chief of Staff", "Finance lead", "Contractor"];

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-sm bg-surface hover:bg-secondary/70 border border-line text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            initials={user.initials}
            bg={user.avatarBg}
            fg={user.avatarFg}
            size="sm"
          />
          <div className="truncate min-w-0">
            <div className="text-[13px] font-medium text-ink truncate leading-tight">
              {user.name}
            </div>
            <div className="text-[11px] text-ink-3 truncate">{role}</div>
          </div>
        </div>
        <ChevronUp className="w-4 h-4 text-ink-3 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-elevated border border-line rounded-md shadow-sh-3 py-1.5 z-popover animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-ink-3 font-medium">
            Switch Simulated Role
          </div>

          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-1.5 text-left text-[13px] hover:bg-sunken transition-colors",
                role === r && "bg-primary-t/50 font-medium text-primary"
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-ink-3" />
                <span>{r}</span>
              </div>
              {role === r && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}

          <div className="my-1.5 border-t border-line" />

          <button
            onClick={() => {
              if (confirm("Reset demo? All changes will be cleared.")) {
                resetDemo();
                setIsOpen(false);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink hover:bg-sunken transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-ink-3" />
            <span>Reset Demo State</span>
          </button>

          <button
            onClick={() => {
              alert("Interactive demo mode. Session is managed locally in memory.");
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink-3 hover:bg-sunken hover:text-ink transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out (Inert)</span>
          </button>
        </div>
      )}
    </div>
  );
}
