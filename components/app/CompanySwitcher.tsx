"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/mock/store";
import { ChevronDown, Check, Building2 } from "lucide-react";
import clsx from "clsx";

export function CompanySwitcher() {
  const { companies, selectedCompany, setCompany } = useStore();
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

  const active =
    selectedCompany === "all"
      ? { name: "All companies", initials: "ALL", color: "#1F2421" }
      : companies.find((c) => c.id === selectedCompany) || {
          name: "All companies",
          initials: "ALL",
          color: "#1F2421",
        };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-sm bg-surface hover:bg-secondary/70 border border-line text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            style={{ backgroundColor: active.color }}
            className="w-6 h-6 rounded-xs flex items-center justify-center text-[10px] font-mono text-white font-bold shrink-0"
          >
            {active.initials}
          </div>
          <div className="truncate">
            <div className="text-[13px] font-medium text-ink truncate leading-tight">
              {active.name}
            </div>
            <div className="text-[11px] text-ink-3">
              {selectedCompany === "all" ? "3 holdings combined" : "Holding company"}
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-ink-3 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-elevated border border-line rounded-md shadow-sh-2 py-1 z-popover animate-in fade-in zoom-in-95">
          <button
            onClick={() => {
              setCompany("all");
              setIsOpen(false);
            }}
            className={clsx(
              "w-full flex items-center justify-between px-3 py-2 text-left hover:bg-sunken text-[13px] transition-colors",
              selectedCompany === "all" && "bg-primary-t/40 font-medium"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-xs bg-ink text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                ALL
              </div>
              <span className="truncate">All companies</span>
            </div>
            {selectedCompany === "all" && <Check className="w-4 h-4 text-primary shrink-0" />}
          </button>

          <div className="my-1 border-t border-line" />

          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCompany(c.id);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2 text-left hover:bg-sunken text-[13px] transition-colors",
                selectedCompany === c.id && "bg-primary-t/40 font-medium"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  style={{ backgroundColor: c.color }}
                  className="w-6 h-6 rounded-xs text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                >
                  {c.initials}
                </div>
                <div className="truncate">
                  <div className="text-[13px] text-ink truncate leading-tight">{c.name}</div>
                  <div className="text-[10px] text-ink-3">{c.openTasks} tasks · {c.overdue} overdue</div>
                </div>
              </div>
              {selectedCompany === c.id && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
