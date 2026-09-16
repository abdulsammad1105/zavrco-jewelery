# ZAVR.CO

Premium unisex fashion jewellery — e-commerce site.

## Project Structure

```
zavrco/
├── frontend/         Next.js app — all customer-facing + admin UI, no database access
│   ├── src/app/          pages (Home, Shop, Product, Cart, Checkout, Account, Admin...)
│   ├── src/components/   Navbar, Footer, ProductCard, CartProvider, WishlistButton...
│   ├── src/lib/api.ts    talks to the backend over HTTP — the only way the frontend
│   │                     gets or sends data
│   ├── src/types.ts      plain TypeScript types mirroring the backend's DB schema
│   └── public/           product images, hero image
│
├── backend/          Express + TypeScript API server — all business logic
│   ├── src/routes/       one file per resource (auth, products, orders, wishlist...)
│   ├── src/controllers/  request handling + validation
│   ├── src/middleware/   session/auth guards
│   ├── src/lib/           password hashing, session cookies, the 15% discount logic
│   └── src/db/            database connection (the ONLY place with a Postgres pool)
│
├── database/         Drizzle ORM schema + seed data (used by the backend)
│
├── package.json      npm workspace root (see "Running Both Apps" below)
├── .env.example       reference summary — real env files live in each app
└── .gitignore
```

This is a genuine two-server setup: the frontend is pure UI and never touches
PostgreSQL — every read/write goes through the backend's HTTP API
(`http://localhost:4000` by default). The backend owns the database, sessions,
pricing, stock, and the 15% discount calculation.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend:** Express, TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** bcryptjs password hashing + signed HttpOnly session cookies (shared
  across both apps on `localhost` for local dev — see note in `backend/src/lib/auth.ts`)

## Requirements

- Node.js 20+
- A PostgreSQL database (local or hosted)

## Installation

This is an npm workspace — one install at the root sets up both apps:

```
npm install
```

## Environment Variables

Each app has its own env file:

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Then fill in `backend/.env`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Always | PostgreSQL connection string |
| `SESSION_SECRET` | Production | Signs session cookies. Dev has an insecure fallback. Generate with `openssl rand -base64 32` |
| `FRONTEND_URL` | Always | The frontend's origin, for CORS. Default `http://localhost:3000` |
| `PORT` | No | Backend port, default `4000` |

And `frontend/.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Always | Where the frontend sends API requests. Default `http://localhost:4000` |
| `NEXT_PUBLIC_BASE_URL` | No | Used only for sitemap.xml/robots.txt |

## Database Setup

No migration files — this project pushes the schema directly (see `database/README.md`):

```
npm run db:push
npm run db:seed
```

(These are root-level convenience scripts that run inside `backend/`.)

## Local Development

Run both apps, each in its own terminal:

```
npm run dev:backend
```
```
npm run dev:frontend
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000`

## Production Build

```
npm run build:backend
npm run build:frontend
```

## Production Start

```
npm run start:backend
npm run start:frontend
```

## Admin Account Setup

There's a single, fixed admin login — completely separate from customer
accounts. No admin table, no signup, no promotion:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.
2. Go to `/admin/login` and sign in with those credentials.

That's it — one shared admin login for whoever manages the store.

## Replacing Product Images

All product images live in `frontend/public/products/`.

1. Add your photo there, named like the category, e.g. `rings-04.jpg`.
2. Update that product's image path via the admin panel (`/admin` → edit
   product → image path field), or directly in the database.
3. Recommended aspect ratio: **4:5**, matching the current placeholder tiles.

No code changes needed.

## Deployment Notes

Deploy `backend/` and `frontend/` as two separate services. Set each app's
environment variables (above) in your hosting provider — never commit `.env`
files.

**Cross-origin cookies in production:** the session cookie sharing that works
automatically on `localhost` (same host, different port) requires the two
apps to share a real top-level domain in production — e.g. `zavr.co` (frontend)
and `api.zavr.co` (backend), with an explicit `Domain=.zavr.co` attribute added
in `backend/src/lib/auth.ts`. If frontend and backend end up on unrelated
domains, switch the session cookie for a `SameSite=None; Secure` cookie or a
bearer-token scheme instead.

## Business Logic Notes

- The 15% `ZAVR15` launch discount is applied automatically to every product
  (`backend/src/lib/discount.ts`) and is always recalculated server-side —
  the frontend never controls price.
- Order pricing, stock validation, and stock decrement happen server-side in a
  single database transaction with an atomic conditional stock update
  (`backend/src/controllers/orders.controller.ts`), preventing overselling
  under concurrent orders. The frontend only ever sends product IDs and quantities.
