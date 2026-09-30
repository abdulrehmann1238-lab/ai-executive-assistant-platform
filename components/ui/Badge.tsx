"use client";

import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent" | "neutral";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = "default", size = "sm", className, icon }: BadgeProps) {
  const variants = {
    default: "bg-sunken text-ink-2 border-line",
    success: "bg-[#E2EFE7] text-success border-[#CBE2D4]",
    warning: "bg-[#F6EBD3] text-warning border-[#EBD6B1]",
    error: "bg-[#F6E1DD] text-error border-[#ECC6C0]",
    info: "bg-[#E1EAF1] text-info border-[#C4D8E6]",
    accent: "bg-[#F3E8D6] text-accent border-[#DEC4A5]",
    neutral: "bg-surface text-ink-2 border-line-2",
  }[variant];

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-full font-medium gap-1",
    md: "text-[12px] px-2.5 py-1 rounded-full font-medium gap-1.5",
  }[size];

  return (
    <span className={clsx("inline-flex items-center border font-sans tracking-wide leading-none select-none", variants, sizes, className)}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

interface AvatarProps {
  initials: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  bg?: string;
  fg?: string;
  className?: string;
}

export function Avatar({ initials, name, size = "md", bg = "var(--sunken)", fg = "var(--ink)", className }: AvatarProps) {
  const sizes = {
    sm: "w-6 h-6 text-[11px]",
    md: "w-8 h-8 text-[12px]",
    lg: "w-10 h-10 text-[14px]",
  }[size];

  return (
    <div
      title={name}
      style={{ backgroundColor: bg, color: fg }}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium font-sans border border-line select-none shrink-0",
        sizes,
        className
      )}
    >
      {initials}
    </div>
  );
}

interface KeycapProps {
  children: React.ReactNode;
  className?: string;
}

export function Keycap({ children, className }: KeycapProps) {
  return (
    <kbd
      className={clsx(
        "inline-flex items-center justify-center font-mono text-[11px] text-ink-3 bg-sunken border border-line px-1.5 py-0.5 rounded-xs leading-none shadow-[0_1px_0_rgba(31,36,33,0.1)]",
        className
      )}
    >
      {children}
    </kbd>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "bg-sunken rounded-sm animate-pulse-subtle",
        className
      )}
    />
  );
}
