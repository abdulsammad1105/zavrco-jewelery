# Database

PostgreSQL schema and seed data for ZAVR.CO, managed with Drizzle ORM.

- `schema.ts` — table definitions (users, products, categories, collections, wishlist, orders)
- `seed.ts` — seeds categories, collections, and ~15 placeholder products (safe to re-run — skips if products already exist)
- `drizzle.config.ts` — used by `drizzle-kit push` to sync the schema to your database

This project is small enough that it uses `drizzle-kit push` directly against the
database instead of a generated migration history — there are no migration files.

## Commands

Run from the `backend/` folder (these are defined in `backend/package.json`):

```
npm run db:push    # push schema.ts to your database
npm run db:seed    # populate categories/collections/products
```

Both read `DATABASE_URL` from `backend/.env`.

The backend (`backend/src/db/index.ts`) is the only part of the system with a
database connection — the frontend never talks to PostgreSQL directly, only to
the backend's HTTP API.
