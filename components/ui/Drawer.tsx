"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: "md:w-[560px]",
    lg: "md:w-[680px]",
  }[width];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-drawer flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1F2421]/30 transition-opacity duration-med"
      />

      {/* Drawer content */}
      <div
        ref={drawerRef}
        className={clsx(
          "relative w-full h-full bg-elevated border-l border-line shadow-sh-3 z-drawer flex flex-col transition-transform duration-med animate-in slide-in-from-right duration-300",
          widthStyles
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-line bg-surface">
          <div>
            {title && <h2 className="text-[1.25rem] font-serif font-medium text-ink leading-tight">{title}</h2>}
            {subtitle && <p className="text-[13px] text-ink-3 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-ink-3 hover:text-ink hover:bg-sunken transition-colors ml-4"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-line bg-surface flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
