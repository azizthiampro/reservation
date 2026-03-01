"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

import { cn, generateId } from "@/lib/utils";

type ToastKind = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
}

interface ToastContextValue {
  push: (payload: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const kindMap: Record<ToastKind, { icon: ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "border-success/30 bg-success/10 text-success"
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    className: "border-danger/30 bg-danger/10 text-danger"
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    className: "border-accent/30 bg-accent/10 text-foreground"
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "border-warning/30 bg-warning/15 text-[#8A5A00]"
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((payload: Omit<ToastItem, "id">) => {
    const next: ToastItem = {
      id: generateId("toast"),
      ...payload
    };

    setToasts((current) => [next, ...current].slice(0, 4));

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== next.id));
    }, 3600);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-xl border px-3 py-2 shadow-soft backdrop-blur",
              kindMap[toast.kind].className,
              "animate-[fadeIn_.2s_ease-out]"
            )}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{kindMap[toast.kind].icon}</span>
              <div>
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description ? (
                  <p className="text-xs text-muted-foreground">{toast.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
