"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full h-10 px-3 text-[14px] bg-elevated border rounded-sm text-ink placeholder:text-ink-3 transition-colors duration-fast outline-none",
            leftIcon ? "pl-9" : "pl-3",
            rightIcon ? "pr-9" : "pr-3",
            error
              ? "border-error focus:border-error focus:ring-1 focus:ring-error"
              : "border-line-2 hover:border-ink-3 focus:border-primary focus:ring-2 focus:ring-primary-t",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">
            {rightIcon}
          </div>
        )}
        {error && <p className="mt-1 text-[12px] text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <label className={clsx("inline-flex items-center gap-3 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
          checked ? "bg-primary" : "bg-sunken border-line-2"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-elevated shadow-sh-1 transition-transform duration-fast",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[13px] font-medium text-ink">{label}</span>}
          {description && <span className="text-[12px] text-ink-3">{description}</span>}
        </div>
      )}
    </label>
  );
}
