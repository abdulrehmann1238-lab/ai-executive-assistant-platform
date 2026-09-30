"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Bot, Mail, ShieldCheck, Clock, MousePointer } from "lucide-react";
import clsx from "clsx";

export function HeroFrame() {
  const [step, setStep] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scripted 14-second loop:
  // Step 0: Agent Drafter typing (0 - 4s)
  // Step 1: Draft slides to Needs You, count ticks 4 -> 5 (4 - 7s)
  // Step 2: Cursor glides to Approve (7 - 9s)
  // Step 3: Approved & Sent stamp, log appended (9 - 12s)
  // Step 4: Pause & Reset (12 - 14s)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-xl bg-elevated border border-line-2 rounded-lg shadow-sh-3 overflow-hidden font-sans select-none text-[13px] transition-all duration-med hover:border-ink-3"
    >
      {/* Mini App Frame Top Bar */}
      <div className="h-9 px-4 bg-surface border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-line-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-line-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-line-2" />
          </div>
          <span className="text-[11px] font-mono text-ink-3 ml-2">halden.executive / live-engine</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-accent-t text-accent font-semibold">
            {step >= 1 && step < 3 ? "5 need you" : "4 need you"}
          </span>
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      {/* Frame Interior Content */}
      <div className="p-5 space-y-4 min-h-[340px] flex flex-col justify-between bg-bg/50">
        {/* Stage 1: Drafter typing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-xs bg-primary text-white flex items-center justify-center font-mono text-[9px] font-bold">
                KP
              </span>
              <span className="font-serif text-[14px] font-medium text-ink">
                Kestrel Property Group
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-info">
              <Bot className="w-3.5 h-3.5" />
              <span>Drafter agent active</span>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            className={clsx(
              "p-4 bg-elevated border rounded-md transition-all duration-med space-y-2.5",
              step === 1 || step === 2
                ? "border-accent ring-1 ring-accent shadow-sh-2"
                : "border-line"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink text-[13px]">
                Reply to Harlow & Sons: lease renewal
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-accent-t text-accent font-medium">
                Pending Approval
              </span>
            </div>

            <p className="font-serif text-[13px] text-ink-2 leading-relaxed bg-surface p-2.5 rounded-sm border border-line">
              {step === 0
                ? "Drafter analyzing Harlow lease covenant... Drafting 12-month extension at +3.5% index..."
                : "Dear Harriet, We are pleased to offer a 12-month lease renewal for Unit 4B at St. Jude's Wharf with 3.5% commercial indexation..."}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-ink-3">To: harriet.harlow@harlowandsons.co.uk</span>

              {/* Approve button with cursor movement simulation */}
              <div className="relative">
                <button
                  className={clsx(
                    "px-3 py-1 text-[12px] font-medium rounded-xs transition-all flex items-center gap-1.5",
                    step >= 3
                      ? "bg-success text-white"
                      : step === 2
                      ? "bg-primary-h text-white scale-95"
                      : "bg-primary text-white"
                  )}
                >
                  {step >= 3 ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Sent after approval
                    </>
                  ) : (
                    <>Approve & Send</>
                  )}
                </button>

                {/* Animated simulated cursor */}
                {step === 2 && (
                  <div className="absolute -top-3 -right-3 animate-bounce text-accent pointer-events-none">
                    <MousePointer className="w-5 h-5 fill-accent" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mini Audit Stream at bottom */}
        <div className="pt-2 border-t border-line text-[11px] font-mono text-ink-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Audit Stream:</span>
            <span>Immutable log</span>
          </div>

          <div className="p-2 bg-surface border border-line rounded-sm flex items-center justify-between">
            <span className="text-ink truncate">
              {step === 0 && "09:08 Drafter searched Drive 'Lease_Harlow_2023.pdf'"}
              {step === 1 && "09:12 Drafter submitted A-501 for Owner approval"}
              {step === 2 && "09:14 Owner initiating approval verification..."}
              {step >= 3 && "09:14 Elena approved A-501 · Sent via Gmail after human gate"}
            </span>
            <span className="text-[10px] text-success font-semibold shrink-0 ml-2">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Hover Pause Caption */}
      {isHovered && (
        <div className="absolute inset-0 bg-[#1F2421]/60 flex items-center justify-center text-white text-[13px] font-medium backdrop-blur-[2px] transition-all">
          <span>Interactive on the next screen · Click "Open the live demo"</span>
        </div>
      )}
    </div>
  );
}
