"use client";

import { ReactNode, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ items, defaultTab, className }: TabsProps) {
  const initial = useMemo(() => defaultTab ?? items[0]?.id ?? "", [defaultTab, items]);
  const [activeTab, setActiveTab] = useState(initial);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-border bg-white p-1">
        {items.map((item) => {
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/25",
                active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">{items.find((item) => item.id === activeTab)?.content}</div>
    </div>
  );
}
