import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-[#f7a24c] to-[#f97b43] text-accent-foreground shadow-[0_12px_24px_rgba(249,123,67,0.32)] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent/30",
  secondary:
    "glass-subtle text-foreground hover:bg-[#fff8ee] focus-visible:ring-2 focus-visible:ring-accent/20",
  ghost:
    "bg-transparent text-foreground hover:bg-[#fff2e1] focus-visible:ring-2 focus-visible:ring-accent/20",
  danger:
    "bg-danger text-white shadow-[0_8px_18px_rgba(220,38,38,0.25)] hover:bg-danger/90 focus-visible:ring-2 focus-visible:ring-danger/30"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
});
