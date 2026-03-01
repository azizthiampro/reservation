import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Reservation demo app. Frontend-only with mocked API.</p>
        <div className="flex items-center gap-4">
          <Link href="/restaurants" className="hover:text-foreground">
            Explore restaurants
          </Link>
          <Link href="/admin" className="hover:text-foreground">
            Restaurant admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
