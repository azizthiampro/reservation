"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Discover" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="glass-surface sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Reservation
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#fff7eb] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                    : "text-muted-foreground hover:bg-[#fff2e1] hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/restaurants"
          className="glass-subtle hidden h-9 items-center justify-center rounded-xl px-3 text-sm font-medium text-foreground transition hover:bg-[#fff8ee] sm:inline-flex"
        >
          Book a Table
        </Link>
      </div>
    </header>
  );
}
