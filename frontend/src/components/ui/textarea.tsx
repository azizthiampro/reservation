import { TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, hint, error, className, ...props },
  ref
) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label && <span className="block text-sm font-medium text-foreground">{label}</span>}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "min-h-[96px] w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/25",
          error && "border-danger focus:ring-danger/25",
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
