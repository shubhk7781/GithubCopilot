# Authentication Instructions

These rules govern every authentication-related change in this application.

## Authority

- Clerk is the only authentication provider and identity/session authority.
- Use the installed `@clerk/nextjs` package and its App Router/server APIs.
- Do not add or use NextAuth/Auth.js, custom cookies, custom sessions, password storage, OAuth handlers, hand-rolled JWT verification, or any other authentication method.
- Do not duplicate Clerk user or session state in application-managed auth tables. Application data may reference Clerk's user ID when needed.
- Keep Clerk configuration and secrets in environment variables. Never commit Clerk keys or credentials.

## Route Rules

### Protected dashboard

- `/dashboard` and all nested paths under `/dashboard` are protected routes.
- An unauthenticated request must not render dashboard UI or data. Enforce protection at the Clerk middleware/server boundary, not only with a client-side guard.
- Keep the dashboard protection in `proxy.ts` using Clerk middleware route matching, or use Clerk's server-side `auth().protect()` at the route boundary when that is the more local ownership point. Follow the installed Next.js and Clerk APIs.
- Server-side dashboard data access must use the authenticated Clerk identity. Never trust a user ID supplied by query parameters, form fields, or client state when selecting private data.
- Preserve the intended destination when Clerk redirects an unauthenticated user to sign in, so the user can return to the dashboard after authentication when Clerk supports that flow.

### Homepage

- The homepage `/` is the public entry route only for signed-out users.
- If a user is already signed in and requests `/`, redirect on the server to `/dashboard` before rendering the homepage.
- Do not implement this as a client-only redirect or briefly render signed-out homepage content first.
- The redirect must use Clerk's server-side auth state, not a browser-maintained flag or custom cookie.

## Sign-In and Sign-Up UX

- Every sign-in entry point must use Clerk's sign-in flow with modal presentation.
- Every sign-up entry point must use Clerk's sign-up flow with modal presentation.
- Use Clerk's `SignInButton` and `SignUpButton` with `mode="modal"` (or the equivalent supported by the installed Clerk version).
- Do not link these actions to standalone `/sign-in` or `/sign-up` pages unless a future requirement explicitly changes this policy.
- Do not build custom sign-in/sign-up forms, credential handlers, validation flows, or modal implementations.
- Preserve the existing signed-in/signed-out conditional UI pattern in `app/layout.tsx` unless the design requires a local entry point.
- Signed-in users should see Clerk's `UserButton` or another Clerk-provided account control; do not replace it with a custom session menu.

## Implementation Boundaries

- `proxy.ts` owns request-level Clerk middleware and route protection.
- `app/layout.tsx` owns `ClerkProvider` and shared authentication controls.
- `app/page.tsx` owns the signed-in homepage redirect.
- `app/dashboard/**` owns dashboard rendering and may add a local server-side `auth().protect()` check when needed for defense in depth or route-local data access.
- Client components may use Clerk hooks only for interactive UI. They must not be the sole enforcement mechanism for authorization.
- Prefer server components and server-side redirects for auth decisions.

## Change Checklist

Before considering an auth-related change complete, verify:

- Only Clerk APIs are used for authentication and authorization.
- Direct navigation to `/dashboard` while signed out is blocked before private content renders.
- Direct navigation to `/dashboard` while signed in succeeds.
- A signed-in request to `/` redirects to `/dashboard` without a homepage flash.
- A signed-out request to `/` can render the public homepage.
- Sign-in opens a Clerk modal.
- Sign-up opens a Clerk modal.
- No custom auth cookies, credentials, session storage, or competing auth provider were introduced.
- `npm run lint` passes, and run `npm run build` when route, middleware, or production behavior changes.
