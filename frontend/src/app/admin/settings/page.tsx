"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { ADMIN_RESTAURANT_ID, getAdminRestaurant, updateRestaurantSettings } from "@/lib/api";
import { Restaurant } from "@/lib/types";

interface SettingsForm {
  name: string;
  address: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  phone: string;
  email: string;
  description: string;
  openingHoursText: string;
}

function toForm(restaurant: Restaurant): SettingsForm {
  return {
    name: restaurant.name,
    address: restaurant.address,
    city: restaurant.city,
    neighborhood: restaurant.neighborhood,
    cuisine: restaurant.cuisine,
    phone: restaurant.phone,
    email: restaurant.email,
    description: restaurant.description,
    openingHoursText: restaurant.openingHours
      .map((item) => `${item.day}: ${item.open} - ${item.close}`)
      .join("\n")
  };
}

export default function AdminSettingsPage() {
  const { push } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadRestaurant();
  }, []);

  async function loadRestaurant() {
    try {
      setLoading(true);
      const data = await getAdminRestaurant(ADMIN_RESTAURANT_ID);
      setRestaurant(data);
      setForm(toForm(data));
      setErrors({});
    } catch {
      push({ kind: "error", title: "Unable to load settings" });
    } finally {
      setLoading(false);
    }
  }

  function validate(current: SettingsForm) {
    const next: Record<string, string> = {};

    if (current.name.trim().length < 2) {
      next.name = "Restaurant name is required.";
    }

    if (current.address.trim().length < 5) {
      next.address = "Address is required.";
    }

    if (current.cuisine.trim().length < 3) {
      next.cuisine = "Cuisine type is required.";
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(current.email.trim())) {
      next.email = "A valid email is required.";
    }

    const digits = current.phone.replace(/\D/g, "");
    if (digits.length < 8) {
      next.phone = "A valid phone number is required.";
    }

    if (current.description.trim().length < 15) {
      next.description = "Description should be at least 15 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!form || !validate(form)) {
      return;
    }

    try {
      setSaving(true);
      const updated = await updateRestaurantSettings(ADMIN_RESTAURANT_ID, form);
      setRestaurant(updated);
      setForm(toForm(updated));
      push({ kind: "success", title: "Settings saved" });
    } catch {
      push({ kind: "error", title: "Could not save settings" });
    } finally {
      setSaving(false);
    }
  }

  const subtitle = useMemo(() => {
    if (!restaurant) {
      return "";
    }
    return `${restaurant.neighborhood}, ${restaurant.city}`;
  }, [restaurant]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!form || !restaurant) {
    return (
      <EmptyState
        title="Settings unavailable"
        description="Restaurant profile settings could not be loaded."
      />
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-4xl font-semibold">Restaurant Settings</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <Card className="space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold">Profile information</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="name"
            label="Restaurant name"
            value={form.name}
            onChange={(event) => setForm((current) => (current ? { ...current, name: event.target.value } : current))}
            error={errors.name}
          />
          <Input
            id="cuisine"
            label="Cuisine type"
            value={form.cuisine}
            onChange={(event) =>
              setForm((current) => (current ? { ...current, cuisine: event.target.value } : current))
            }
            error={errors.cuisine}
          />
          <Input
            id="address"
            label="Address"
            value={form.address}
            onChange={(event) =>
              setForm((current) => (current ? { ...current, address: event.target.value } : current))
            }
            error={errors.address}
          />
          <Input
            id="city"
            label="City"
            value={form.city}
            onChange={(event) => setForm((current) => (current ? { ...current, city: event.target.value } : current))}
          />
          <Input
            id="neighborhood"
            label="Neighborhood"
            value={form.neighborhood}
            onChange={(event) =>
              setForm((current) => (current ? { ...current, neighborhood: event.target.value } : current))
            }
          />
          <Input
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(event) => setForm((current) => (current ? { ...current, phone: event.target.value } : current))}
            error={errors.phone}
          />
          <Input
            id="email"
            label="Contact email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => (current ? { ...current, email: event.target.value } : current))}
            error={errors.email}
          />
        </div>

        <Textarea
          id="description"
          label="Description"
          value={form.description}
          onChange={(event) =>
            setForm((current) => (current ? { ...current, description: event.target.value } : current))
          }
          error={errors.description}
        />

        <Textarea
          id="hours"
          label="Opening hours"
          hint="Format: Mon: 11:30 - 22:00 (one day per line)"
          value={form.openingHoursText}
          onChange={(event) =>
            setForm((current) => (current ? { ...current, openingHoursText: event.target.value } : current))
          }
        />

        <div className="flex justify-end">
          <Button isLoading={saving} onClick={() => void handleSave()}>
            Save settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
