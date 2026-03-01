"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="glass-surface rounded-2xl p-3 lg:h-fit">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Restaurant Admin
        </p>
        <nav className="grid gap-1">
          {links.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gradient-to-br from-[#f7a24c] to-[#f97b43] text-accent-foreground"
                    : "text-muted-foreground hover:bg-[#fff2e1] hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
