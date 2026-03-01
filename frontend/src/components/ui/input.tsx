import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, error, className, ...props },
  ref
) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label && <span className="block text-sm font-medium text-foreground">{label}</span>}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-11 w-full rounded-xl glass-subtle px-3 text-sm text-foreground placeholder:text-muted-foreground/90 focus:outline-none focus:ring-2 focus:ring-accent/25",
          error && "border-danger/60 focus:ring-danger/25",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="block text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
});
