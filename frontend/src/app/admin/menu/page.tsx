"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  addMenuCategory,
  ADMIN_RESTAURANT_ID,
  createDish,
  deleteDish,
  getAdminRestaurant,
  reorderMenuCategory,
  toggleDishAvailability,
  updateDish,
  updateMenuCategory
} from "@/lib/api";
import { DietaryTag, Dish, MenuCategory, Restaurant } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface DishForm {
  name: string;
  description: string;
  price: string;
  photoUrl: string;
  tags: DietaryTag[];
  available: boolean;
}

const tagOptions: DietaryTag[] = ["vegan", "vegetarian", "spicy", "gluten-free", "chef-pick"];

const emptyDishForm: DishForm = {
  name: "",
  description: "",
  price: "",
  photoUrl: "",
  tags: [],
  available: true
};

export default function AdminMenuPage() {
  const { push } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categoryDrafts, setCategoryDrafts] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState("");

  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState<DishForm>(emptyDishForm);
  const [dishFormErrors, setDishFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const categories = useMemo(() => {
    return restaurant?.menu ? [...restaurant.menu].sort((a, b) => a.order - b.order) : [];
  }, [restaurant]);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id === selectedCategoryId) ?? categories[0] ?? null;
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    void loadRestaurant();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }

    const nextDrafts: Record<string, string> = {};
    categories.forEach((category) => {
      nextDrafts[category.id] = category.name;
    });
    setCategoryDrafts(nextDrafts);
  }, [categories, selectedCategoryId]);

  async function loadRestaurant() {
    try {
      setLoading(true);
      const data = await getAdminRestaurant(ADMIN_RESTAURANT_ID);
      setRestaurant(data);
    } catch {
      push({
        kind: "error",
        title: "Unable to load menu",
        description: "Try refreshing the page."
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) {
      return;
    }

    try {
      await addMenuCategory(ADMIN_RESTAURANT_ID, name);
      setNewCategoryName("");
      await loadRestaurant();
      push({ kind: "success", title: "Category added" });
    } catch {
      push({ kind: "error", title: "Could not add category" });
    }
  }

  async function handleRenameCategory(categoryId: string) {
    const draft = categoryDrafts[categoryId]?.trim();
    if (!draft) {
      return;
    }

    try {
      await updateMenuCategory(ADMIN_RESTAURANT_ID, categoryId, draft);
      await loadRestaurant();
      push({ kind: "success", title: "Category updated" });
    } catch {
      push({ kind: "error", title: "Could not update category" });
    }
  }

  async function handleReorder(categoryId: string, direction: "up" | "down") {
    try {
      await reorderMenuCategory(ADMIN_RESTAURANT_ID, categoryId, direction);
      await loadRestaurant();
    } catch {
      push({ kind: "error", title: "Reorder failed" });
    }
  }

  function openCreateDishModal() {
    setEditingDish(null);
    setDishForm(emptyDishForm);
    setDishFormErrors({});
    setDishModalOpen(true);
  }

  function openEditDishModal(dish: Dish) {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: String(dish.price),
      photoUrl: dish.photoUrl,
      tags: dish.tags,
      available: dish.available
    });
    setDishFormErrors({});
    setDishModalOpen(true);
  }

  function validateDishForm() {
    const errors: Record<string, string> = {};

    if (dishForm.name.trim().length < 2) {
      errors.name = "Dish name is required.";
    }

    if (dishForm.description.trim().length < 6) {
      errors.description = "Description should be at least 6 characters.";
    }

    const price = Number(dishForm.price);
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Price must be a valid number.";
    }

    if (!dishForm.photoUrl.trim()) {
      errors.photoUrl = "Photo URL is required for this mock flow.";
    }

    setDishFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSaveDish() {
    if (!selectedCategory || !validateDishForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: dishForm.name.trim(),
        description: dishForm.description.trim(),
        price: Number(dishForm.price),
        photoUrl: dishForm.photoUrl.trim(),
        tags: dishForm.tags,
        available: dishForm.available
      };

      if (editingDish) {
        await updateDish(ADMIN_RESTAURANT_ID, selectedCategory.id, editingDish.id, payload);
        push({ kind: "success", title: "Dish updated" });
      } else {
        await createDish(ADMIN_RESTAURANT_ID, selectedCategory.id, payload);
        push({ kind: "success", title: "Dish created" });
      }

      setDishModalOpen(false);
      await loadRestaurant();
    } catch {
      push({ kind: "error", title: "Could not save dish" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteDish(categoryId: string, dishId: string) {
    try {
      await deleteDish(ADMIN_RESTAURANT_ID, categoryId, dishId);
      await loadRestaurant();
      push({ kind: "success", title: "Dish removed" });
    } catch {
      push({ kind: "error", title: "Could not remove dish" });
    }
  }

  async function handleToggleAvailability(categoryId: string, dishId: string) {
    try {
      await toggleDishAvailability(ADMIN_RESTAURANT_ID, categoryId, dishId);
      await loadRestaurant();
    } catch {
      push({ kind: "error", title: "Could not update availability" });
    }
  }

  function toggleTag(tag: DietaryTag) {
    setDishForm((current) => {
      const hasTag = current.tags.includes(tag);
      return {
        ...current,
        tags: hasTag ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
      };
    });
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
      <EmptyState
        title="Menu unavailable"
        description="Could not load restaurant menu data."
      />
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Create categories, reorder sections, and manage dishes.</p>
        </div>
        <Button onClick={openCreateDishModal} disabled={!selectedCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add dish
        </Button>
      </header>

      <Card className="space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold">Categories</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Input
            id="new-category"
            label="New category"
            placeholder="Desserts"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
          />
          <Button className="sm:mb-[2px]" onClick={handleAddCategory}>
            Add category
          </Button>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category to start publishing dishes."
          />
        ) : (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={category.id} className="glass-subtle rounded-xl p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(category.id, "up")}
                      disabled={index === 0}
                      aria-label="Move category up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(category.id, "down")}
                      disabled={index === categories.length - 1}
                      aria-label="Move category down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedCategory?.id === category.id ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {category.name}
                    </Button>
                  </div>
                  <div className="flex w-full items-center gap-2 md:w-auto">
                    <Input
                      id={`cat-${category.id}`}
                      className="h-9"
                      value={categoryDrafts[category.id] ?? ""}
                      onChange={(event) =>
                        setCategoryDrafts((current) => ({
                          ...current,
                          [category.id]: event.target.value
                        }))
                      }
                    />
                    <Button size="sm" variant="secondary" onClick={() => handleRenameCategory(category.id)}>
                      Rename
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {selectedCategory ? `${selectedCategory.name} Dishes` : "Dishes"}
          </h2>
          <p className="text-sm text-muted-foreground">{selectedCategory?.dishes.length ?? 0} items</p>
        </div>

        {!selectedCategory ? (
          <EmptyState
            title="Choose a category"
            description="Select a category above to view and manage dishes."
          />
        ) : selectedCategory.dishes.length === 0 ? (
          <EmptyState
            title="No dishes in this category"
            description="Add your first dish to populate this section in the public menu."
            action={<Button onClick={openCreateDishModal}>Add dish</Button>}
          />
        ) : (
          <div className="space-y-3">
            {selectedCategory.dishes.map((dish) => (
              <div
                key={dish.id}
                className="glass-subtle flex flex-col gap-3 rounded-xl p-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{dish.name}</p>
                  <p className="text-sm text-muted-foreground">{dish.description}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {dish.tags.map((tag) => (
                      <Badge key={`${dish.id}-${tag}`}>{tag}</Badge>
                    ))}
                    {!dish.available ? <Badge variant="danger">Unavailable</Badge> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="min-w-14 text-sm font-semibold text-foreground">{formatCurrency(dish.price)}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleAvailability(selectedCategory.id, dish.id)}
                  >
                    {dish.available ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditDishModal(dish)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDish(selectedCategory.id, dish.id)}
                    aria-label="Delete dish"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={dishModalOpen}
        onClose={() => setDishModalOpen(false)}
        title={editingDish ? "Edit dish" : "Create dish"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDishModalOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={submitting} onClick={() => void handleSaveDish()}>
              {editingDish ? "Save changes" : "Create dish"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <Input
            id="dish-name"
            label="Dish name"
            value={dishForm.name}
            onChange={(event) => setDishForm((current) => ({ ...current, name: event.target.value }))}
            error={dishFormErrors.name}
          />
          <Textarea
            id="dish-description"
            label="Description"
            value={dishForm.description}
            onChange={(event) =>
              setDishForm((current) => ({
                ...current,
                description: event.target.value
              }))
            }
            error={dishFormErrors.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="dish-price"
              label="Price (USD)"
              type="number"
              min={0}
              step="0.01"
              value={dishForm.price}
              onChange={(event) => setDishForm((current) => ({ ...current, price: event.target.value }))}
              error={dishFormErrors.price}
            />
            <Input
              id="dish-photo"
              label="Photo URL"
              value={dishForm.photoUrl}
              onChange={(event) =>
                setDishForm((current) => ({
                  ...current,
                  photoUrl: event.target.value
                }))
              }
              error={dishFormErrors.photoUrl}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Dietary tags</p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    dishForm.tags.includes(tag)
                      ? "border-accent bg-accent text-accent-foreground"
                      : "glass-subtle border-border text-muted-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="dish-available">
            <input
              id="dish-available"
              type="checkbox"
              checked={dishForm.available}
              onChange={(event) => setDishForm((current) => ({ ...current, available: event.target.checked }))}
            />
            Available for reservations
          </label>
        </div>
      </Modal>
    </div>
  );
}
