"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { createReservation, getRestaurantById } from "@/lib/api";
import { Reservation, Restaurant } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type ReservationStep = 1 | 2 | 3;

interface Step1Data {
  date: string;
  time: string;
  partySize: string;
}

interface Step2Data {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const partySizeOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1);
  return { label: value, value };
});

const initialStep1: Step1Data = {
  date: "",
  time: "",
  partySize: "2"
};

const initialStep2: Step2Data = {
  name: "",
  email: "",
  phone: "",
  notes: ""
};

export default function ReservationPage() {
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params.restaurantId;

  const { push } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<ReservationStep>(1);
  const [step1, setStep1] = useState<Step1Data>(initialStep1);
  const [step2, setStep2] = useState<Step2Data>(initialStep2);
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

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
          setStep1((current) => ({
            ...current,
            time: data.nextAvailableSlots[0] ?? ""
          }));
          setError(null);
        }
      } catch {
        if (mounted) {
          setError("Could not load reservation flow for this restaurant.");
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

  const summary = useMemo(() => {
    return {
      date: step1.date ? formatDate(step1.date) : "Select date",
      time: step1.time || "Select time",
      partySize: step1.partySize,
      name: step2.name || "Guest"
    };
  }, [step1, step2]);

  function validateStep1() {
    const errors: Record<string, string> = {};

    if (!step1.date) {
      errors.date = "Please choose a reservation date.";
    } else {
      const selected = new Date(`${step1.date}T00:00:00`);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (selected < today) {
        errors.date = "Date cannot be in the past.";
      }
    }

    if (!step1.time) {
      errors.time = "Please choose an available time.";
    }

    const party = Number(step1.partySize);
    if (!Number.isFinite(party) || party <= 0) {
      errors.partySize = "Party size must be at least 1.";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep2() {
    const errors: Record<string, string> = {};

    if (step2.name.trim().length < 2) {
      errors.name = "Please enter your full name.";
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(step2.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    const digits = step2.phone.replace(/\D/g, "");
    if (digits.length < 8) {
      errors.phone = "Please provide a valid phone number.";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  }

  async function submitReservation() {
    if (!restaurant) {
      return;
    }

    try {
      setSubmitting(true);
      const reservation = await createReservation({
        restaurantId: restaurant.id,
        date: step1.date,
        time: step1.time,
        partySize: Number(step1.partySize),
        customerName: step2.name,
        customerEmail: step2.email,
        customerPhone: step2.phone,
        notes: step2.notes.trim() || undefined
      });

      setCreatedReservation(reservation);
      setStep(3);
      setValidation({});
      push({
        kind: "success",
        title: "Reservation request submitted",
        description: "The restaurant can now review and confirm your booking."
      });
    } catch {
      push({
        kind: "error",
        title: "Submission failed",
        description: "Please try again in a moment."
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Reservation unavailable"
          description={error ?? "The restaurant could not be found."}
          action={
            <Link
              href="/restaurants"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground"
            >
              Browse restaurants
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
      <section className="space-y-4">
        <header className="space-y-2">
          <h1 className="font-display text-4xl font-semibold">Reserve at {restaurant.name}</h1>
          <p className="text-sm text-muted-foreground">
            Guest checkout is supported. You will receive a confirmation status by email.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`rounded-xl border px-3 py-2 text-center text-xs font-medium uppercase tracking-[0.14em] ${
                item === step
                  ? "border-accent bg-accent text-accent-foreground"
                  : item < step
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-border bg-white text-muted-foreground"
              }`}
            >
              Step {item}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <Card className="space-y-4 p-5">
            <h2 className="font-display text-2xl font-semibold">Step 1: Date and party</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                id="date"
                label="Date"
                type="date"
                value={step1.date}
                onChange={(event) => setStep1((current) => ({ ...current, date: event.target.value }))}
                error={validation.date}
              />
              <Select
                id="time"
                label="Time"
                value={step1.time}
                onChange={(event) => setStep1((current) => ({ ...current, time: event.target.value }))}
                options={[
                  { label: "Select time", value: "" },
                  ...restaurant.nextAvailableSlots.map((slot) => ({ label: slot, value: slot }))
                ]}
                error={validation.time}
              />
              <Select
                id="party"
                label="Party size"
                value={step1.partySize}
                onChange={(event) => setStep1((current) => ({ ...current, partySize: event.target.value }))}
                options={partySizeOptions}
                error={validation.partySize}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
              >
                Continue
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="space-y-4 p-5">
            <h2 className="font-display text-2xl font-semibold">Step 2: Guest details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                id="name"
                label="Full name"
                placeholder="Jane Doe"
                value={step2.name}
                onChange={(event) => setStep2((current) => ({ ...current, name: event.target.value }))}
                error={validation.name}
              />
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="jane@email.com"
                value={step2.email}
                onChange={(event) => setStep2((current) => ({ ...current, email: event.target.value }))}
                error={validation.email}
              />
              <Input
                id="phone"
                label="Phone"
                placeholder="+1 (555) 000-0000"
                value={step2.phone}
                onChange={(event) => setStep2((current) => ({ ...current, phone: event.target.value }))}
                error={validation.phone}
              />
            </div>
            <Textarea
              id="notes"
              label="Notes (optional)"
              placeholder="Dietary requests, occasion, seating preferences"
              value={step2.notes}
              onChange={(event) => setStep2((current) => ({ ...current, notes: event.target.value }))}
            />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                isLoading={submitting}
                onClick={() => {
                  if (validateStep2()) {
                    void submitReservation();
                  }
                }}
              >
                Confirm request
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 3 && createdReservation ? (
          <Card className="space-y-4 p-5">
            <Badge variant="success">Request sent</Badge>
            <h2 className="font-display text-3xl font-semibold">Reservation submitted</h2>
            <p className="text-sm text-muted-foreground">
              Your request is currently <strong className="text-foreground">pending</strong>. The restaurant will confirm soon.
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="text-sm font-semibold text-foreground">{createdReservation.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/restaurants/${restaurant.id}`}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground"
              >
                Back to restaurant
              </Link>
              <Link
                href="/restaurants"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-medium text-foreground"
              >
                Explore more
              </Link>
            </div>
          </Card>
        ) : null}
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-3 p-4">
          <h3 className="font-display text-2xl font-semibold">Summary</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Restaurant:</span> {restaurant.name}
            </p>
            <p>
              <span className="font-medium text-foreground">Date:</span> {summary.date}
            </p>
            <p>
              <span className="font-medium text-foreground">Time:</span> {summary.time}
            </p>
            <p>
              <span className="font-medium text-foreground">Party:</span> {summary.partySize}
            </p>
            <p>
              <span className="font-medium text-foreground">Guest:</span> {summary.name}
            </p>
          </div>
        </Card>
      </aside>
    </div>
  );
}
