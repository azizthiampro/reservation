export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type DietaryTag = "vegan" | "vegetarian" | "spicy" | "gluten-free" | "chef-pick";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: DietaryTag[];
  photoUrl: string;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  dishes: Dish[];
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  isOpenNow: boolean;
  nextAvailableSlots: string[];
  heroImages: string[];
  galleryImages: string[];
  openingHours: OpeningHours[];
  menu: MenuCategory[];
}

export interface Reservation {
  id: string;
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ReservationInput {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface RestaurantFilters {
  query?: string;
  cuisine?: string;
  priceRange?: PriceRange;
  ratingAtLeast?: number;
  openNow?: boolean;
}

export interface ReservationFilters {
  date?: string;
  status?: ReservationStatus | "all";
}

export interface AppDB {
  restaurants: Restaurant[];
  reservations: Reservation[];
}
