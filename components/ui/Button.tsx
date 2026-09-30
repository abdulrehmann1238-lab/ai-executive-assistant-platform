"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";
import { Loader2, Check } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isSuccess = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium font-sans select-none transition-all duration-fast disabled:opacity-50 disabled:pointer-events-none rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 btn-press";

    const sizeStyles = {
      sm: "h-8 px-3 text-[13px] gap-1.5",
      md: "h-10 px-4 text-[14px] gap-2",
      lg: "h-12 px-6 text-[15px] gap-2.5",
      icon: "h-9 w-9 p-0 text-[14px]",
    }[size];

    const variantStyles = {
      primary: "bg-primary text-[#FFFFFF] hover:bg-primary-h active:bg-primary-a shadow-sh-1",
      secondary: "bg-secondary text-ink hover:bg-[#E4DED1] active:bg-[#DCD5C6] border border-line",
      ghost: "bg-transparent text-ink hover:bg-secondary/70 active:bg-secondary",
      danger: "bg-error text-[#FFFFFF] hover:bg-[#963C31] active:bg-[#7D3229]",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            <span>Loading…</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4 mr-1.5 text-success" />
            <span>Done</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
