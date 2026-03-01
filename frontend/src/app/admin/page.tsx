"use client";

import Link from "next/link";
import { CalendarClock, ImageIcon, MenuSquare, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_RESTAURANT_ID, getAdminRestaurant, getRestaurantReservations } from "@/lib/api";
import { Reservation, Restaurant } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [restaurantData, reservationsData] = await Promise.all([
          getAdminRestaurant(ADMIN_RESTAURANT_ID),
          getRestaurantReservations(ADMIN_RESTAURANT_ID)
        ]);

        if (mounted) {
          setRestaurant(restaurantData);
          setReservations(reservationsData);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const pending = reservations.filter((item) => item.status === "pending").length;
    const confirmed = reservations.filter((item) => item.status === "confirmed").length;
    const dishes = restaurant?.menu.reduce((sum, category) => sum + category.dishes.length, 0) ?? 0;
    const photos = restaurant?.galleryImages.length ?? 0;

    return { pending, confirmed, dishes, photos };
  }, [reservations, restaurant]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        title="Admin data unavailable"
        description="The selected restaurant profile could not be loaded."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-4xl font-semibold">{restaurant.name}</h1>
        <p className="text-sm text-muted-foreground">
          {restaurant.cuisine} · {restaurant.city} · Last synced {formatDateTime(new Date().toISOString())}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending reservations</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed reservations</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.confirmed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Published dishes</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.dishes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Gallery photos</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.photos}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Upcoming reservations</h2>
            <Link href="/admin/reservations" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>

          {reservations.length === 0 ? (
            <EmptyState
              title="No reservations yet"
              description="Incoming reservations will appear here once guests start booking."
            />
          ) : (
            <div className="space-y-3">
              {reservations.slice(0, 5).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{reservation.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(reservation.date)} at {reservation.time} · party of {reservation.partySize}
                    </p>
                  </div>
                  <Badge
                    variant={
                      reservation.status === "confirmed"
                        ? "success"
                        : reservation.status === "cancelled"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {reservation.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="font-display text-2xl font-semibold">Quick links</h2>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/30"
          >
            <MenuSquare className="h-4 w-4" />
            Manage menu
          </Link>
          <Link
            href="/admin/photos"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/30"
          >
            <ImageIcon className="h-4 w-4" />
            Update gallery
          </Link>
          <Link
            href="/admin/reservations"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/30"
          >
            <CalendarClock className="h-4 w-4" />
            Reservation inbox
          </Link>
          <Link
            href="/restaurants/r1"
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/30"
          >
            <Star className="h-4 w-4" />
            View public profile
          </Link>
        </Card>
      </section>
    </div>
  );
}
