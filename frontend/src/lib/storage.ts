import { AppDB } from "@/lib/types";
import { seedDB } from "@/lib/seed";

const STORAGE_KEY = "reservation-db-v1";

function cloneDB(db: AppDB): AppDB {
  return JSON.parse(JSON.stringify(db)) as AppDB;
}

let serverMemoryDB: AppDB = cloneDB(seedDB);

export function readDB(): AppDB {
  if (typeof window === "undefined") {
    return cloneDB(serverMemoryDB);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const initial = cloneDB(seedDB);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as AppDB;
    if (!parsed.restaurants || !parsed.reservations) {
      throw new Error("Malformed DB");
    }
    return cloneDB(parsed);
  } catch {
    const fallback = cloneDB(seedDB);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function writeDB(db: AppDB) {
  const safeDB = cloneDB(db);

  if (typeof window === "undefined") {
    serverMemoryDB = safeDB;
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDB));
}

export function resetDB() {
  writeDB(seedDB);
}
