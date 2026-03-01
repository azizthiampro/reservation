"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  ADMIN_RESTAURANT_ID,
  getRestaurantReservations,
  updateReservationStatus
} from "@/lib/api";
import { Reservation, ReservationStatus } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" }
];

export default function AdminReservationsPage() {
  const { push } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<"all" | ReservationStatus>("all");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    void loadReservations();
  }, [statusFilter, dateFilter]);

  async function loadReservations() {
    try {
      setLoading(true);
      const data = await getRestaurantReservations(ADMIN_RESTAURANT_ID, {
        date: dateFilter || undefined,
        status: statusFilter
      });
      setReservations(data);
    } catch {
      push({ kind: "error", title: "Could not load reservations" });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(status: ReservationStatus) {
    if (!selectedReservation) {
      return;
    }

    try {
      setUpdatingStatus(true);
      const updated = await updateReservationStatus(selectedReservation.id, status);
      setSelectedReservation(updated);
      await loadReservations();
      push({ kind: "success", title: `Status updated to ${status}` });
    } catch {
      push({ kind: "error", title: "Status update failed" });
    } finally {
      setUpdatingStatus(false);
    }
  }

  const counts = useMemo(() => {
    return {
      total: reservations.length,
      pending: reservations.filter((reservation) => reservation.status === "pending").length,
      confirmed: reservations.filter((reservation) => reservation.status === "confirmed").length
    };
  }, [reservations]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-4xl font-semibold">Reservations Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Review incoming bookings and update statuses for your team.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total results</p>
          <p className="text-3xl font-semibold">{counts.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-3xl font-semibold">{counts.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-3xl font-semibold">{counts.confirmed}</p>
        </Card>
      </section>

      <Card className="space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold">Filters</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="reservation-date"
            label="Date"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />
          <Select
            id="reservation-status"
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | ReservationStatus)}
          />
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Reservation list</h2>
          <Button variant="secondary" onClick={() => void loadReservations()}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : reservations.length === 0 ? (
          <EmptyState
            title="No reservations found"
            description="Try a different date or status filter."
          />
        ) : (
          <div className="space-y-2">
            {reservations.map((reservation) => (
              <button
                key={reservation.id}
                type="button"
                onClick={() => setSelectedReservation(reservation)}
                className="flex w-full flex-col gap-2 rounded-xl border border-border bg-white p-3 text-left transition hover:bg-muted/25 sm:flex-row sm:items-center sm:justify-between"
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
              </button>
            ))}
          </div>
        )}
      </Card>

      <Drawer
        open={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        title="Reservation details"
      >
        {selectedReservation ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="text-sm font-semibold text-foreground">{selectedReservation.id}</p>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Guest:</span> {selectedReservation.customerName}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span> {selectedReservation.customerEmail}
              </p>
              <p>
                <span className="font-medium text-foreground">Phone:</span> {selectedReservation.customerPhone}
              </p>
              <p>
                <span className="font-medium text-foreground">Date:</span> {formatDate(selectedReservation.date)}
              </p>
              <p>
                <span className="font-medium text-foreground">Time:</span> {selectedReservation.time}
              </p>
              <p>
                <span className="font-medium text-foreground">Party size:</span> {selectedReservation.partySize}
              </p>
              <p>
                <span className="font-medium text-foreground">Created:</span> {formatDateTime(selectedReservation.createdAt)}
              </p>
            </div>

            {selectedReservation.notes ? (
              <div className="rounded-xl border border-border bg-white p-3">
                <p className="text-sm font-medium text-foreground">Guest notes</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedReservation.notes}</p>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Update status</p>
              <div className="grid grid-cols-3 gap-2">
                {(["pending", "confirmed", "cancelled"] as ReservationStatus[]).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedReservation.status === status ? "primary" : "secondary"}
                    isLoading={updatingStatus && selectedReservation.status !== status}
                    onClick={() => void handleStatusUpdate(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
