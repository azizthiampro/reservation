import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-[2px] hover:shadow-soft">
      <Link href={`/restaurants/${restaurant.id}`} className="group block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={restaurant.heroImages[0]}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <Badge variant={restaurant.isOpenNow ? "success" : "warning"}>
              {restaurant.isOpenNow ? "Open now" : "Opens later"}
            </Badge>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-foreground">{restaurant.name}</h3>
              <span className="text-sm font-medium text-muted-foreground">{restaurant.priceRange}</span>
            </div>
            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {restaurant.rating} ({restaurant.reviewCount} reviews)
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {restaurant.neighborhood}, {restaurant.city}
            </p>
            <p className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              Next slot: {restaurant.nextAvailableSlots[0] ?? "No slots"}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
}
