"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock3, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { getRestaurantById } from "@/lib/api";
import { Dish, Restaurant } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const tagVariant: Record<string, "neutral" | "success" | "warning"> = {
  vegan: "success",
  vegetarian: "neutral",
  spicy: "warning",
  "gluten-free": "neutral",
  "chef-pick": "success"
};

export default function RestaurantDetailsPage() {
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRestaurant() {
      try {
        setLoading(true);
        const data = await getRestaurantById(restaurantId);

        if (!data) {
          throw new Error("Restaurant not found");
        }

        if (mounted) {
          setRestaurant(data);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError("Could not load this restaurant.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRestaurant();

    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  const menuTabs = useMemo(() => {
    if (!restaurant) {
      return [];
    }

    return [...restaurant.menu]
      .sort((a, b) => a.order - b.order)
      .map((category) => ({
        id: category.id,
        label: category.name,
        content: (
          <div className="grid gap-3">
            {category.dishes.map((dish) => (
              <Card key={dish.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground">{dish.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.tags.map((tag) => (
                        <Badge key={tag} variant={tagVariant[tag] ?? "neutral"}>
                          {tag}
                        </Badge>
                      ))}
                      {!dish.available ? <Badge variant="danger">Unavailable</Badge> : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(dish.price)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSelectedDish(dish)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }));
  }, [restaurant]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-5/6" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <EmptyState
          title="Restaurant unavailable"
          description={error ?? "This listing could not be found."}
          action={
            <Link
              href="/restaurants"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground"
            >
              Back to restaurants
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-28 pt-6 sm:px-6 lg:pb-8 lg:px-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative h-72 overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-2 lg:h-[420px]">
          <Image
            src={restaurant.heroImages[0]}
            alt={`${restaurant.name} hero`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {restaurant.heroImages.slice(1, 3).map((image, index) => (
          <div key={image} className="relative h-36 overflow-hidden rounded-2xl sm:h-52 lg:h-[205px]">
            <Image
              src={image}
              alt={`${restaurant.name} gallery ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="font-display text-4xl font-semibold text-foreground">{restaurant.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {restaurant.cuisine} · {restaurant.priceRange}
                </p>
              </div>
              <Badge variant={restaurant.isOpenNow ? "success" : "warning"}>
                {restaurant.isOpenNow ? "Open now" : "Closed"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{restaurant.description}</p>

            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {restaurant.rating} ({restaurant.reviewCount} reviews)
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {restaurant.address}, {restaurant.neighborhood}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {restaurant.phone}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Next slot: {restaurant.nextAvailableSlots[0] ?? "N/A"}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Menu</h2>
            <Tabs items={menuTabs} />
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Gallery</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {restaurant.galleryImages.map((image) => (
                <div key={image} className="relative h-40 overflow-hidden rounded-xl border border-border">
                  <Image src={image} alt="Restaurant gallery" fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-white p-4 shadow-soft">
            <h3 className="font-display text-2xl font-semibold">Reserve a table</h3>
            <p className="mt-1 text-sm text-muted-foreground">Earliest availability: {restaurant.nextAvailableSlots[0]}</p>
            <Link
              href={`/reserve/${restaurant.id}`}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
            >
              Reserve now
            </Link>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Next available</p>
            <p className="text-sm font-semibold text-foreground">{restaurant.nextAvailableSlots[0]}</p>
          </div>
          <Link
            href={`/reserve/${restaurant.id}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground"
          >
            Reserve
          </Link>
        </div>
      </div>

      <Modal
        open={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
        title={selectedDish?.name ?? "Dish details"}
        footer={
          <Button variant="secondary" onClick={() => setSelectedDish(null)}>
            Close
          </Button>
        }
      >
        {selectedDish ? (
          <div className="space-y-4">
            <div className="relative h-44 overflow-hidden rounded-xl border border-border">
              <Image src={selectedDish.photoUrl} alt={selectedDish.name} fill className="object-cover" sizes="600px" />
            </div>
            <p className="text-sm text-muted-foreground">{selectedDish.description}</p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(selectedDish.price)}</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedDish.tags.map((tag) => (
                <Badge key={tag} variant={tagVariant[tag] ?? "neutral"}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
