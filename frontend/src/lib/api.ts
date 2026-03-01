import { readDB, writeDB } from "@/lib/storage";
import {
  Dish,
  MenuCategory,
  Reservation,
  ReservationFilters,
  ReservationInput,
  ReservationStatus,
  Restaurant,
  RestaurantFilters
} from "@/lib/types";
import { generateId } from "@/lib/utils";

const API_LATENCY_MIN = 250;
const API_LATENCY_MAX = 800;

export const ADMIN_RESTAURANT_ID = "r1";

function randomLatency() {
  return Math.floor(Math.random() * (API_LATENCY_MAX - API_LATENCY_MIN + 1)) + API_LATENCY_MIN;
}

async function withLatency<T>(value: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  return value;
}

function mutateDB(mutator: (db: ReturnType<typeof readDB>) => void) {
  const db = readDB();
  mutator(db);
  writeDB(db);
  return db;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export async function getRestaurants(filters?: RestaurantFilters) {
  const db = readDB();
  let restaurants = [...db.restaurants];

  if (filters?.query) {
    const q = normalizeText(filters.query);
    restaurants = restaurants.filter((restaurant) => {
      const haystack = [restaurant.name, restaurant.cuisine, restaurant.neighborhood, restaurant.city]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (filters?.cuisine) {
    restaurants = restaurants.filter((restaurant) => restaurant.cuisine === filters.cuisine);
  }

  if (filters?.priceRange) {
    restaurants = restaurants.filter((restaurant) => restaurant.priceRange === filters.priceRange);
  }

  if (typeof filters?.ratingAtLeast === "number") {
    const minimumRating = filters.ratingAtLeast;
    restaurants = restaurants.filter((restaurant) => restaurant.rating >= minimumRating);
  }

  if (filters?.openNow) {
    restaurants = restaurants.filter((restaurant) => restaurant.isOpenNow);
  }

  return withLatency(restaurants);
}

export async function getFeaturedRestaurants() {
  const db = readDB();
  const featured = [...db.restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return withLatency(featured);
}

export async function getRestaurantById(id: string) {
  const db = readDB();
  const restaurant = db.restaurants.find((item) => item.id === id) ?? null;
  return withLatency(restaurant);
}

export async function getCuisines() {
  const db = readDB();
  const cuisines = Array.from(new Set(db.restaurants.map((item) => item.cuisine))).sort();
  return withLatency(cuisines);
}

export async function createReservation(input: ReservationInput) {
  const reservation: Reservation = {
    id: generateId("res"),
    restaurantId: input.restaurantId,
    date: input.date,
    time: input.time,
    partySize: input.partySize,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    notes: input.notes,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  mutateDB((db) => {
    db.reservations.unshift(reservation);
  });

  return withLatency(reservation);
}

export async function getReservations(filters?: ReservationFilters) {
  const db = readDB();
  let reservations = [...db.reservations];

  if (filters?.date) {
    reservations = reservations.filter((reservation) => reservation.date === filters.date);
  }

  if (filters?.status && filters.status !== "all") {
    reservations = reservations.filter((reservation) => reservation.status === filters.status);
  }

  reservations.sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time}:00`).getTime();
    const bDate = new Date(`${b.date}T${b.time}:00`).getTime();
    return aDate - bDate;
  });

  return withLatency(reservations);
}

export async function getRestaurantReservations(restaurantId: string, filters?: ReservationFilters) {
  const reservations = await getReservations(filters);
  return reservations.filter((reservation) => reservation.restaurantId === restaurantId);
}

export async function updateReservationStatus(reservationId: string, status: ReservationStatus) {
  const db = mutateDB((draft) => {
    const reservation = draft.reservations.find((item) => item.id === reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    reservation.status = status;
  });

  const updated = db.reservations.find((item) => item.id === reservationId);
  if (!updated) {
    throw new Error("Reservation not found");
  }

  return withLatency(updated);
}

export async function getAdminRestaurant(restaurantId = ADMIN_RESTAURANT_ID) {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return restaurant;
}

type RestaurantSettingsInput = Pick<
  Restaurant,
  "name" | "address" | "city" | "neighborhood" | "cuisine" | "phone" | "email" | "description"
> & {
  openingHoursText: string;
};

export async function updateRestaurantSettings(
  restaurantId: string,
  input: RestaurantSettingsInput
): Promise<Restaurant> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    restaurant.name = input.name;
    restaurant.address = input.address;
    restaurant.city = input.city;
    restaurant.neighborhood = input.neighborhood;
    restaurant.cuisine = input.cuisine;
    restaurant.phone = input.phone;
    restaurant.email = input.email;
    restaurant.description = input.description;

    const rows = input.openingHoursText
      .split("\n")
      .map((row) => row.trim())
      .filter(Boolean);

    if (rows.length > 0) {
      restaurant.openingHours = rows
        .map((row) => {
          const [dayPart, timePart] = row.split(":");
          if (!dayPart || !timePart) {
            return null;
          }
          const [open, close] = timePart.split("-").map((t) => t.trim());
          if (!open || !close) {
            return null;
          }
          return { day: dayPart.trim(), open, close };
        })
        .filter((entry): entry is { day: string; open: string; close: string } => Boolean(entry));
    }
  });

  const updated = db.restaurants.find((item) => item.id === restaurantId);
  if (!updated) {
    throw new Error("Restaurant not found");
  }

  return withLatency(updated);
}

export async function addMenuCategory(restaurantId: string, name: string): Promise<MenuCategory> {
  let category: MenuCategory | null = null;

  mutateDB((db) => {
    const restaurant = db.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const maxOrder = Math.max(0, ...restaurant.menu.map((item) => item.order));
    category = {
      id: generateId("cat"),
      name,
      order: maxOrder + 1,
      dishes: []
    };

    restaurant.menu.push(category);
  });

  if (!category) {
    throw new Error("Could not create category");
  }

  return withLatency(category);
}

export async function updateMenuCategory(
  restaurantId: string,
  categoryId: string,
  name: string
): Promise<MenuCategory> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const category = restaurant.menu.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    category.name = name;
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  const category = restaurant?.menu.find((item) => item.id === categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  return withLatency(category);
}

export async function reorderMenuCategory(
  restaurantId: string,
  categoryId: string,
  direction: "up" | "down"
): Promise<MenuCategory[]> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const sorted = [...restaurant.menu].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item.id === categoryId);
    if (index === -1) {
      throw new Error("Category not found");
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) {
      return;
    }

    const current = sorted[index];
    const target = sorted[swapIndex];
    const temp = current.order;
    current.order = target.order;
    target.order = temp;

    restaurant.menu = sorted;
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return withLatency([...restaurant.menu].sort((a, b) => a.order - b.order));
}

type DishInput = Omit<Dish, "id">;

export async function createDish(
  restaurantId: string,
  categoryId: string,
  input: DishInput
): Promise<Dish> {
  let dish: Dish | null = null;

  mutateDB((db) => {
    const restaurant = db.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const category = restaurant.menu.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    dish = {
      id: generateId("dish"),
      ...input
    };

    category.dishes.push(dish);
  });

  if (!dish) {
    throw new Error("Could not create dish");
  }

  return withLatency(dish);
}

export async function updateDish(
  restaurantId: string,
  categoryId: string,
  dishId: string,
  input: DishInput
): Promise<Dish> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const category = restaurant.menu.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const dish = category.dishes.find((item) => item.id === dishId);
    if (!dish) {
      throw new Error("Dish not found");
    }

    dish.name = input.name;
    dish.description = input.description;
    dish.price = input.price;
    dish.tags = input.tags;
    dish.photoUrl = input.photoUrl;
    dish.available = input.available;
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  const category = restaurant?.menu.find((item) => item.id === categoryId);
  const dish = category?.dishes.find((item) => item.id === dishId);

  if (!dish) {
    throw new Error("Dish not found");
  }

  return withLatency(dish);
}

export async function deleteDish(
  restaurantId: string,
  categoryId: string,
  dishId: string
): Promise<boolean> {
  mutateDB((db) => {
    const restaurant = db.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const category = restaurant.menu.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    category.dishes = category.dishes.filter((item) => item.id !== dishId);
  });

  return withLatency(true);
}

export async function toggleDishAvailability(
  restaurantId: string,
  categoryId: string,
  dishId: string
): Promise<Dish> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const category = restaurant.menu.find((item) => item.id === categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const dish = category.dishes.find((item) => item.id === dishId);
    if (!dish) {
      throw new Error("Dish not found");
    }

    dish.available = !dish.available;
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  const category = restaurant?.menu.find((item) => item.id === categoryId);
  const dish = category?.dishes.find((item) => item.id === dishId);

  if (!dish) {
    throw new Error("Dish not found");
  }

  return withLatency(dish);
}

export async function addGalleryPhoto(restaurantId: string, photoUrl: string): Promise<Restaurant> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.galleryImages.unshift(photoUrl);
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return withLatency(restaurant);
}

export async function removeGalleryPhoto(restaurantId: string, photoUrl: string): Promise<Restaurant> {
  const db = mutateDB((draft) => {
    const restaurant = draft.restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.galleryImages = restaurant.galleryImages.filter((item) => item !== photoUrl);
  });

  const restaurant = db.restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return withLatency(restaurant);
}
