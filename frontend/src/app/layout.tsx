import type { Metadata } from "next";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Reservation | Discover and book restaurants",
  description:
    "A premium reservation experience for customers and restaurant teams. Frontend-only demo with mocked APIs."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${montserrat.variable} antialiased`}>
        <ToastProvider>
          <div className="min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
