"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingGrid } from "@/components/shared/loading-grid";
import { Card } from "@/components/ui/card";
import { getFeaturedRestaurants } from "@/lib/api";
import { Restaurant } from "@/lib/types";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getFeaturedRestaurants();
        if (mounted) {
          setRestaurants(data);
        }
      } catch {
        if (mounted) {
          setError("Could not load featured restaurants. Please refresh.");
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="glass-surface rounded-3xl p-6 sm:p-10">
        <p className="glass-subtle mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Premium dining, simplified
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          Discover standout restaurants and reserve in under a minute.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Browse curated menus, check real-time availability, and confirm your reservation with an elegant step-by-step flow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/restaurants"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f7a24c] to-[#f97b43] px-5 text-base font-medium text-accent-foreground shadow-[0_14px_24px_rgba(249,123,67,0.32)] transition hover:brightness-105 sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Explore Restaurants
          </Link>
          <Link
            href="/admin"
            className="glass-subtle inline-flex h-12 items-center justify-center rounded-xl px-5 text-base font-medium text-foreground transition hover:bg-[#fff8ee] sm:w-auto"
          >
            Restaurant Admin
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground">Featured this week</h2>
            <p className="text-sm text-muted-foreground">Highly rated spots with immediate availability.</p>
          </div>
          <Link href="/restaurants" className="text-sm font-medium text-accent hover:underline">
            See all
          </Link>
        </div>

        {loading ? <LoadingGrid count={3} /> : null}

        {!loading && error ? (
          <Card className="p-6">
            <p className="text-sm text-danger">{error}</p>
          </Card>
        ) : null}

        {!loading && !error && restaurants.length === 0 ? (
          <EmptyState
            title="No featured restaurants yet"
            description="Once restaurants are published, curated picks will appear here."
          />
        ) : null}

        {!loading && !error && restaurants.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Browse quickly",
            text: "Smart filters for cuisine, price, rating, and open-now status."
          },
          {
            title: "Reserve as a guest",
            text: "No login required. Complete reservation in three clear steps."
          },
          {
            title: "Manage operations",
            text: "Admin tools for menus, photos, settings, and reservation inbox."
          }
        ].map((item) => (
          <Card key={item.title} className="p-5">
            <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
