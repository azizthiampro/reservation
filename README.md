# Reservation

Modern, mobile-first restaurant discovery and reservation frontend built with Next.js App Router, TypeScript, and Tailwind CSS.

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Frontend-only mocked API + localStorage persistence

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Notes

- Mock API layer: `src/lib/api.ts`
- Seed data: `src/lib/seed.ts`
- Persistence key: `reservation-db-v1` in localStorage
- Admin panel assumes restaurant `r1` as the managed account in this demo
# reservation
