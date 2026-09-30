"use client";

import React from "react";
import clsx from "clsx";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-12 text-center max-w-sm mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-sunken flex items-center justify-center text-ink-3 mb-4 border border-line">
        {icon}
      </div>
      <h3 className="font-serif text-[1.25rem] font-medium text-ink mb-1.5">{title}</h3>
      <p className="text-[13px] text-ink-3 leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
