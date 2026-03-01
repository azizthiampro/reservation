"use client";

import { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PriceRange, RestaurantFilters } from "@/lib/types";

interface SearchFiltersProps {
  cuisines: string[];
  values: RestaurantFilters;
  onChange: (next: RestaurantFilters) => void;
}

const priceOptions: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
  { value: "$$$$", label: "$$$$" }
];

const ratingOptions = [
  { value: "", label: "Any" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
  { value: "4.7", label: "4.7+" }
];

export function SearchFilters({ cuisines, values, onChange }: SearchFiltersProps) {
  const update = (key: keyof RestaurantFilters, value: string | number | boolean | undefined) => {
    onChange({
      ...values,
      [key]: value
    });
  };

  const onOpenNowChange = (event: ChangeEvent<HTMLInputElement>) => {
    update("openNow", event.target.checked ? true : undefined);
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-white p-4">
      <Input
        id="search"
        label="Search"
        placeholder="Name, cuisine, neighborhood"
        value={values.query ?? ""}
        onChange={(event) => update("query", event.target.value || undefined)}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          id="cuisine"
          label="Cuisine"
          value={values.cuisine ?? ""}
          onChange={(event) => update("cuisine", event.target.value || undefined)}
          options={[{ value: "", label: "All cuisines" }, ...cuisines.map((cuisine) => ({ label: cuisine, value: cuisine }))]}
        />
        <Select
          id="price"
          label="Price"
          value={values.priceRange ?? ""}
          onChange={(event) => update("priceRange", (event.target.value as PriceRange) || undefined)}
          options={priceOptions}
        />
        <Select
          id="rating"
          label="Rating"
          value={values.ratingAtLeast ? String(values.ratingAtLeast) : ""}
          onChange={(event) =>
            update("ratingAtLeast", event.target.value ? Number(event.target.value) : undefined)
          }
          options={ratingOptions}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="openNow">
        <input
          id="openNow"
          type="checkbox"
          checked={Boolean(values.openNow)}
          onChange={onOpenNowChange}
          className="h-4 w-4 rounded border-border text-accent focus:ring-accent/20"
        />
        Open now only
      </label>
    </section>
  );
}
