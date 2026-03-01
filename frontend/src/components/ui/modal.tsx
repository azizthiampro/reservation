"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/35"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        className={cn(
          "glass-surface relative z-10 w-full max-w-lg rounded-2xl p-5",
          "animate-[fadeIn_.2s_ease-out]",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer ? <div className="mt-5 border-t border-border pt-4">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
