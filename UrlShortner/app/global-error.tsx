'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

// global-error replaces the root layout, so it must render its own <html> and
// <body>. Global styles are not loaded here, so styling is inline and the
// shadcn/ui primitives (which depend on those styles) are intentionally not
// used. Colors mirror the app's dark theme tokens.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Log the full error for developers; never surface it in the UI.
    console.error(error)
  }, [error])

  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'oklch(0.155 0.018 285)',
          color: 'oklch(0.93 0.01 285)',
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: '28rem', padding: '0 1.25rem', textAlign: 'center' }}>
          <title>Something went wrong</title>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'oklch(0.72 0.03 285)',
            }}
          >
            Unexpected error
          </p>
          <h1 style={{ margin: '0.75rem 0 0', fontSize: '1.875rem', fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p
            style={{
              margin: '1rem 0 0',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'oklch(0.72 0.03 285)',
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={
              // Attempt to recover by re-fetching and re-rendering the segment
              () => retry()
            }
            style={{
              marginTop: '2rem',
              height: '2.5rem',
              padding: '0 1.25rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#dff27a',
              color: '#09090b',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
