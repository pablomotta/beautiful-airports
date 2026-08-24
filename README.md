# Beautiful Airports

A trip-planning game for people who like airports. Sign in, pick a runway size,
and the app deals you a random airport you haven't been to yet — 1,488 of them
across 339 countries. Mark it visited and it never comes back.

Built with Next.js 15 (App Router), React 19, Prisma + PostgreSQL, and NextAuth.

## How it works

Each user has a set of `Visit` records. The `/api/airport/random` route excludes
every airport you've already visited, then picks one at random from the size you
asked for. If that size is exhausted it falls back through the other sizes and
reports that it did, so you never hit a dead end.

`/api/airport/stats` returns visited/unvisited counts per size, which drives the
progress display on the home page.

| Route | Method | Purpose |
|---|---|---|
| `/api/airport/random` | GET | Random unvisited airport, `?size=Small\|Medium\|Large` |
| `/api/airport/visit` | POST | Mark an airport visited |
| `/api/airport/visited` | GET | List the current user's visited airports |
| `/api/airport/stats` | GET | Visited/unvisited totals per size |
| `/api/airport/clear` | DELETE | Reset the current user's history |
| `/api/auth/signup` | POST | Create an account |
| `/api/auth/[...nextauth]` | — | NextAuth credentials handler |

Every airport route is session-guarded and returns 401 without one.

## Data model

Three tables — `User`, `Airport`, and `Visit` as the join. `Visit` is uniquely
constrained on `[userId, airportId]`, so marking the same airport twice is a
no-op rather than a duplicate row. Both sides cascade on delete.

Airport sizes are derived from runway length; Large is ≥ 1800m.

## Running it

Requires Node 20+ and a PostgreSQL database.

```bash
npm install
```

Create `.env` in the project root:

```
DATABASE_URL="postgresql://user:password@localhost:5432/beautiful_airports"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
```

Then set up the database and start:

```bash
npx prisma migrate dev     # apply the three migrations
npm run prisma:seed        # load prisma/airports.json
npm run dev
```

The seed also creates a test account — `test@example.com` / `changeme`.
Change or remove it before deploying anywhere real.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` then `next build` |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run prisma:seed` | Seed airports and the test user |

## Notes

The Prisma client is generated to `src/generated/prisma` rather than
`node_modules`, so imports look like `@/generated/prisma`. Run
`npx prisma generate` after changing the schema.

Client state lives in a Zustand store (`src/store/airport-store.ts`) that
persists the selected size to `localStorage`; the visited list is fetched with
SWR so it revalidates after mutations.
