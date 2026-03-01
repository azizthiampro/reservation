"use client";

import { useEffect, useMemo, useState } from "react";

import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { SearchFilters } from "@/components/restaurants/search-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingGrid } from "@/components/shared/loading-grid";
import { Card } from "@/components/ui/card";
import { getCuisines, getRestaurants } from "@/lib/api";
import { Restaurant, RestaurantFilters } from "@/lib/types";

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCuisines() {
      try {
        const data = await getCuisines();
        if (mounted) {
          setCuisines(data);
        }
      } catch {
        if (mounted) {
          setError("Could not load cuisines.");
        }
      }
    }

    loadCuisines();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadRestaurants() {
      try {
        setLoading(true);
        const data = await getRestaurants(filters);
        if (mounted) {
          setRestaurants(data);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError("Could not load restaurants. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRestaurants();

    return () => {
      mounted = false;
    };
  }, [filters]);

  const resultLabel = useMemo(() => {
    if (loading) {
      return "Searching restaurants...";
    }
    return `${restaurants.length} restaurant${restaurants.length === 1 ? "" : "s"} found`;
  }, [loading, restaurants.length]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-2">
        <h1 className="font-display text-4xl font-semibold">Find your next table</h1>
        <p className="text-sm text-muted-foreground">
          Filter by cuisine, rating, budget, and availability to find the right match quickly.
        </p>
      </section>

      <SearchFilters cuisines={cuisines} values={filters} onChange={setFilters} />

      <section className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">{resultLabel}</p>

        {loading ? <LoadingGrid /> : null}

        {!loading && error ? (
          <Card className="p-5">
            <p className="text-sm text-danger">{error}</p>
          </Card>
        ) : null}

        {!loading && !error && restaurants.length === 0 ? (
          <EmptyState
            title="No restaurants match those filters"
            description="Try removing a filter or expanding your search terms to discover more options."
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
    </div>
  );
}
