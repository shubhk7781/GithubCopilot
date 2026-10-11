'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
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
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="font-mono text-xs font-medium uppercase text-muted-foreground">
        Unexpected error
      </p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <Button
        size="lg"
        className="mt-8 h-10 px-5"
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => retry()
        }
      >
        Try again
      </Button>
    </main>
  )
}
