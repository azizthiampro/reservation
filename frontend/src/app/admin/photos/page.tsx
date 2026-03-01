"use client";

import Image from "next/image";
import { Trash2, UploadCloud } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  addGalleryPhoto,
  ADMIN_RESTAURANT_ID,
  getAdminRestaurant,
  removeGalleryPhoto
} from "@/lib/api";
import { Restaurant } from "@/lib/types";

export default function AdminPhotosPage() {
  const { push } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void loadRestaurant();
  }, []);

  async function loadRestaurant() {
    try {
      setLoading(true);
      const data = await getAdminRestaurant(ADMIN_RESTAURANT_ID);
      setRestaurant(data);
    } catch {
      push({ kind: "error", title: "Unable to load gallery" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPhoto(url: string) {
    if (!url.trim()) {
      return;
    }

    try {
      setUploading(true);
      await addGalleryPhoto(ADMIN_RESTAURANT_ID, url.trim());
      setUrlInput("");
      await loadRestaurant();
      push({ kind: "success", title: "Photo uploaded" });
    } catch {
      push({ kind: "error", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        void handleAddPhoto(result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemove(url: string) {
    try {
      await removeGalleryPhoto(ADMIN_RESTAURANT_ID, url);
      await loadRestaurant();
      push({ kind: "info", title: "Photo removed" });
    } catch {
      push({ kind: "error", title: "Could not remove photo" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState title="Gallery unavailable" description="Restaurant data could not be loaded." />
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-4xl font-semibold">Photo Gallery</h1>
        <p className="text-sm text-muted-foreground">Upload or remove restaurant gallery photos (mocked).</p>
      </header>

      <Card className="space-y-3 p-5">
        <h2 className="font-display text-2xl font-semibold">Add photo</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            id="photo-url"
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
          />
          <Button className="sm:mt-7" isLoading={uploading} onClick={() => void handleAddPhoto(urlInput)}>
            Add from URL
          </Button>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30"
          >
            <UploadCloud className="h-4 w-4" />
            Mock upload local file
          </label>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          <p className="mt-2 text-xs text-muted-foreground">Stored in localStorage as a data URL in this demo.</p>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Current gallery</h2>
          <p className="text-sm text-muted-foreground">{restaurant.galleryImages.length} photos</p>
        </div>

        {restaurant.galleryImages.length === 0 ? (
          <EmptyState title="No photos yet" description="Upload photos to enrich your public profile." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {restaurant.galleryImages.map((photo) => (
              <div key={photo} className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="relative h-44">
                  <Image src={photo} alt="Restaurant gallery photo" fill className="object-cover" sizes="33vw" />
                </div>
                <div className="flex items-center justify-between p-3">
                  <p className="truncate text-xs text-muted-foreground">{photo.slice(0, 32)}...</p>
                  <Button variant="ghost" size="sm" onClick={() => void handleRemove(photo)}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
