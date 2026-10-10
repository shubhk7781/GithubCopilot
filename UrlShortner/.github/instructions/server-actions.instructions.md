---
name: Server Actions
description: This file describes the rules for data mutations using server actions. Read this before creating or modifying any server action or data mutation logic.
---

# Server Action Instructions

These rules govern every data mutation in this application. All writes, updates, and deletes must follow this pattern — no exceptions.

## Core Rules

- ALL data mutations in this app must be done via Next.js server actions. Do not mutate data through route handlers, client-side fetches to API endpoints, or direct database calls from components.
- Server actions must be called from client components. Do not invoke server actions directly from server components.
- Server action files MUST be named `actions.ts` and be colocated in the directory of the component that calls the server action (e.g., `app/dashboard/actions.ts` for `app/dashboard/page.tsx` or a component in that directory).
- Mark every server action file with the `'use server'` directive at the top of the file.

## Typing and Validation

- ALL data passed to server actions must have appropriate TypeScript types. Define explicit input types or interfaces for each action's parameters.
- DO NOT use the `FormData` type for server action inputs. Pass typed objects instead of raw form data.
- ALL data MUST be validated inside the server action via zod before any processing or database operation. Define a zod schema for every action's input and parse the input at the top of the action.

## Error Handling

- Server actions MUST NOT throw errors. Wrap risky operations in try/catch and handle every failure path explicitly — no exception should ever escape a server action.
- Every server action must return a result object with a `success` property: `{ success: true, data: ... }` on success or `{ success: false, error: 'message' }` on failure, so the calling client component can handle both outcomes without try/catch.

## Authentication

- ALL server actions MUST first check for a logged-in user before continuing with any database operations. Use Clerk's server-side `auth()` helper and immediately return an unauthorized result object (`{ success: false, error: 'Unauthorized' }`) when no user is authenticated — do not throw.
- Never trust a user ID supplied by the client. Always derive the user identity from Clerk's server-side auth state.

## Database Access

- Database operations must be done via helper functions that wrap drizzle queries. These helper functions are located in the `/data` directory.
- Server actions should NOT directly use drizzle queries within them. The server action orchestrates (auth check → zod validation → helper call → result); the `/data` helper owns the actual query.
- If a required helper does not exist, create it in the appropriate file under `/data` following the existing pattern in [data/urls.ts](data/urls.ts).

## Change Checklist

Before considering a server-action-related change complete, verify:

- The mutation is implemented as a server action in a colocated `actions.ts` file with `'use server'`.
- The action is called from a client component, not a server component.
- Inputs use explicit TypeScript types — no `FormData`.
- Input is validated with a zod schema before any other logic runs.
- The action never throws — every failure path returns a result object with a `success: false` property and an error message.
- The action checks for a logged-in user via Clerk before any database operation.
- All database work goes through helper functions in `/data`; the action contains no direct drizzle queries.
- `npm run lint` passes.
