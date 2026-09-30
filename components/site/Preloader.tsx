"use client";

import React, { useState, useEffect } from "react";
import { BRAND } from "@/config/brand";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("haldenIntro")) {
      onComplete();
      return;
    }

    setMounted(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsWiping(true);
            setTimeout(() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("haldenIntro", "1");
              }
              onComplete();
            }, 520);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div
      style={{
        clipPath: isWiping ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
        transition: "clip-path 520ms cubic-bezier(0.65, 0.05, 0.36, 1)",
      }}
      className="fixed inset-0 z-loader bg-bg flex flex-col items-center justify-center font-sans select-none"
    >
      <div
        className={`flex items-center gap-3 transition-all duration-med ${
          isWiping ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="w-3.5 h-3.5 bg-accent rounded-xs shadow-sh-1" />
        <span className="font-serif text-[42px] font-medium text-ink tracking-tight">
          {BRAND.name}
        </span>
      </div>

      {/* Progress hairline */}
      <div className="w-32 h-[2px] bg-line mt-4 overflow-hidden rounded-full">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-primary transition-all duration-150 ease-out"
        />
      </div>
    </div>
  );
}
