"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "md" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const maxWidthStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modal flex items-end md:items-center justify-center p-0 md:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1F2421]/40 transition-opacity duration-med"
      />

      {/* Dialog box / Mobile sheet */}
      <div
        ref={modalRef}
        className={clsx(
          "relative w-full bg-elevated border border-line md:rounded-lg shadow-sh-3 z-modal flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden transition-all duration-med animate-in fade-in zoom-in-95",
          maxWidthStyles
        )}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-line-2 rounded-full mx-auto mt-2 md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          {title && <h2 className="text-[1.25rem] font-serif font-medium text-ink">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-ink-3 hover:text-ink hover:bg-sunken transition-colors ml-auto"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line bg-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
