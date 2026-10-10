<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LinkShortner Agent Instructions

These instructions apply to all work in this repository. Read the relevant document in `docs/` before making changes in that area. The documents describe the current project and are intentionally split so agents can load only the context they need.

## Project Context

- This is a Next.js 16 App Router application using React 19 and TypeScript.
- Authentication is provided by Clerk. The root layout owns `ClerkProvider` and the signed-in/signed-out header controls; `proxy.ts` installs Clerk middleware.
- Database access uses Drizzle ORM with Neon HTTP and PostgreSQL. The shared client is in `db/index.ts`; the schema is in `db/schema.ts`.
- Styling uses Tailwind CSS 4, `tw-animate-css`, shadcn CSS variables, and the existing UI primitives under `components/ui/`.
- The application is currently scaffold-level. Do not describe or depend on URL-shortening workflows that have not been implemented.

## General Rules

- Preserve existing user changes and keep edits focused on the requested behavior.
- Follow the existing TypeScript, import, naming, and component patterns before introducing abstractions.
- Prefer server components and server-side data access by default. Add a client component only when browser state, event handlers, or a client-only library requires it.
- ALL UI elements in this app must use shadcn/ui. Do not create any custom UI components. Always use the existing shadcn component primitives under `components/ui/`.
- Tailwind may be used for layout and spacing, but not as a replacement for shadcn components.
- Keep secrets and connection strings in environment variables. Never commit `.env` files, credentials, Clerk keys, or database URLs.

## Next.js Version Note

This repository intentionally follows the installed Next.js version, not generic or outdated examples. Before changing Next.js-specific behavior, consult the matching local documentation under `node_modules/next/dist/docs/` as required by the generated rules above.
