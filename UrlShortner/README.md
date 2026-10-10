# LinkShortner — Links, made lighter

A full-stack URL shortener built with the latest Next.js 16 App Router, React 19, and TypeScript — **developed end-to-end with GitHub Copilot as an AI pair programmer**.

This repository doubles as a demonstration of an **AI-ready engineering workflow**: repo-level agent instructions (`AGENTS.md`), scoped rule files (`.github/instructions/`), spec-driven prompts, and verification loops (type-checking, lint, and local Next.js version docs) were used to keep AI-generated code correct, consistent, and production-shaped.

---

## ✨ Features

- **🔗 URL shortening** — auto-generated 7-character short codes with collision retry (up to 5 attempts against the unique constraint).
- **✏️ Custom short codes** — user-chosen slugs (3–30 chars; letters, numbers, hyphens, underscores), validated server-side.
- **📊 Click analytics** — every visit to a short link increments a click counter. Redirects use HTTP **307 (temporary)** so no browser/proxy caching skips the counter.
- **📈 Dashboard stats** — total links and total clicks per user, plus a paginated link list (7 per page) with live refresh.
- **🛠️ Full link management** — create, edit, and delete dialogs built on shadcn/ui primitives.
- **🔐 Authentication** — sign-in/sign-up and session handling via Clerk middleware; the dashboard is protected with `auth.protect()`.
- **👤 Per-user data isolation** — every query and mutation is scoped by the Clerk `userId` at the data-access layer, so users can only see and modify their own links.
- **✅ Server-side validation** — all mutations validated with Zod schemas inside Next.js Server Actions, with friendly error messages returned to the UI.
- **🎨 Modern UI** — shadcn/ui components, Tailwind CSS 4, gradient accents, and Lucide icons; server components by default, client components only where interactivity requires them.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions, Route Handlers) |
| Language | TypeScript 5, React 19 |
| Authentication | Clerk (`@clerk/nextjs`) via `proxy.ts` middleware |
| Database | Neon Serverless Postgres (HTTP driver) |
| ORM / Migrations | Drizzle ORM + drizzle-kit |
| Validation | Zod 4 |
| UI | shadcn/ui, Tailwind CSS 4, tw-animate-css, Base UI, Lucide icons |
| AI Tooling | GitHub Copilot (chat, inline completions, agent mode) + repo instruction files |

---

## 🔄 Application Flow

```mermaid
flowchart LR
    A[Visitor hits /:shortCode] --> B[Route Handler]
    B --> C{Short code found?}
    C -- No --> D[404 JSON response]
    C -- Yes --> E[Increment click count]
    E --> F[307 Temporary Redirect to original URL]

    G[Signed-in user] --> H[Clerk middleware + auth.protect]
    H --> I[Dashboard: paginated links + stats]
    I --> J[Server Actions: create / edit / delete]
    J --> K[Zod validation]
    K --> L[Drizzle queries scoped to userId]
    L --> M[revalidatePath /dashboard]
```

**Request lifecycle:**

1. `proxy.ts` installs Clerk middleware for all non-static routes.
2. The root layout provides `ClerkProvider` and the signed-in/signed-out header controls.
3. The dashboard (a server component) fetches the user's link page and stats in parallel with `Promise.all`.
4. Dialogs call Server Actions (`app/dashboard/actions.ts`), which authenticate, validate with Zod, mutate via `data/urls.ts`, and revalidate the dashboard.
5. `app/[shortCode]/route.ts` resolves a short code, atomically increments `clickCount`, and issues a 307 redirect.

---

## 📁 Project Structure

```text
app/
  page.tsx               # Landing page
  layout.tsx             # Root layout (ClerkProvider, header)
  [shortCode]/route.ts   # Redirect handler + click counting
  dashboard/
    page.tsx             # Dashboard (stats + paginated links)
    actions.ts           # Server Actions (create/update/delete)
    *-link-dialog.tsx    # shadcn/ui dialogs
    live-refresh.tsx     # Periodic dashboard refresh
components/ui/           # shadcn/ui primitives
data/urls.ts             # Data-access layer (all DB queries, ownership checks)
db/
  index.ts               # Drizzle + Neon HTTP client (requires DATABASE_URL)
  schema.ts              # `urls` table definition
drizzle/                 # Generated SQL migrations
proxy.ts                 # Clerk middleware
.github/instructions/    # Scoped AI/agent rules (auth, data-fetching, server actions, UI)
AGENTS.md                # Repo-level agent instructions
```

---

## 🚀 Getting Started (from GitHub)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/UrlShortner.git
cd UrlShortner
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (never commit it):

```env
# Neon Postgres connection string (https://neon.tech)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Clerk keys (https://dashboard.clerk.com -> your app -> API keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string used by Drizzle (runtime and migrations) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser-side key |
| `CLERK_SECRET_KEY` | Clerk server-side key |

### 3. Set up the database

```bash
# Push the schema directly to your Neon database
npm run db:push

# (Alternative) generate a new migration after changing db/schema.ts
npm run db:generate
```

### 4. Run the app

```bash
npm run dev      # start the dev server
# or
npm run build && npm start   # production build
```

Open [http://localhost:3000](http://localhost:3000), sign up with Clerk, create a short link from the dashboard, then visit `http://localhost:3000/<shortCode>` to watch the click counter increment.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate a Drizzle migration from schema changes |
| `npm run db:push` | Push the current schema to the database |

---

## 🤖 AI-First Development (GitHub Copilot)

This project was built as a **GitHub Copilot–focused workflow showcase**:

- **Repo-level guidance** — `AGENTS.md` tells the AI exactly which stack, patterns, and constraints apply (server components first, shadcn/ui only, secrets in env vars).
- **Scoped instruction files** — `.github/instructions/` contains focused rule sets for authentication, data fetching, server actions, and UI standards, so Copilot loads only the context relevant to the task.
- **Version-accurate code** — the project follows the *installed* Next.js 16 docs under `node_modules/next/dist/docs/` instead of outdated training-data patterns.
- **Layered architecture for AI safety** — mutations live in Server Actions, queries in a single data-access layer (`data/urls.ts`), and ownership checks at the database query level, making AI-generated changes easy to verify.
- **Verification loops** — every AI-generated change was validated with TypeScript, ESLint, and runtime testing before acceptance.

**Resume snapshot:** *"Built a full-stack URL shortener (Next.js 16, React 19, Clerk, Neon Postgres, Drizzle ORM) using an AI-assisted workflow with GitHub Copilot — authored repository-level agent instructions and scoped prompt rules to drive consistent, type-safe, production-ready code generation."*

---

## ☁️ Deployment

1. Push this repository to GitHub.
2. Create a Neon project and copy its `DATABASE_URL`.
3. Create a Clerk application and copy the publishable/secret keys.
4. Import the repo into [Vercel](https://vercel.com/new) and add the three environment variables above.
5. Deploy — Vercel builds with `npm run build`; no additional configuration is needed.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.
