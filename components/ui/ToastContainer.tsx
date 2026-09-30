"use client";

import React from "react";
import { useStore } from "@/lib/mock/store";
import { X, CheckCircle2, AlertCircle, Info, RotateCcw } from "lucide-react";
import clsx from "clsx";

export function ToastContainer() {
  const { toasts, dismissToast, undoApprove } = useStore();

  if (!toasts.length) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-toast flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isCountdown = toast.hasUndo && toast.remainingSeconds !== undefined;
        const progressPercent = isCountdown ? ((toast.remainingSeconds || 0) / 10) * 100 : 100;

        return (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-elevated border border-line-2 rounded-md shadow-sh-2 text-ink text-[13px] font-sans transition-all duration-med animate-in slide-in-from-bottom-2 fade-in"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 text-error shrink-0" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-info shrink-0" />}
              {toast.type === "warning" && <AlertCircle className="w-4 h-4 text-warning shrink-0" />}

              <span className="truncate">{toast.message}</span>
            </div>

            {toast.hasUndo && toast.undoApprovalId && (
              <button
                onClick={() => undoApprove(toast.undoApprovalId!)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-xs bg-primary-t text-primary hover:bg-primary/20 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
                {isCountdown && (
                  <span className="font-mono text-[11px] font-semibold">
                    ({toast.remainingSeconds}s)
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-xs text-ink-3 hover:text-ink hover:bg-sunken transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
