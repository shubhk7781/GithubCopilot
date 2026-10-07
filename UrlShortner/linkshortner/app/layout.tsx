import type { Metadata } from 'next'
import Link from 'next/link'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LinkShortner | Links, made lighter',
  description: 'A focused link workspace with account-based access and a dependable foundation.',
}

const clerkDarkAppearance = {
  variables: {
    colorBackground: 'var(--card)',
    colorInputBackground: 'var(--input)',
    colorInputText: 'var(--foreground)',
    colorText: 'var(--foreground)',
    colorTextSecondary: 'var(--muted-foreground)',
  },
  captcha: {
    theme: 'dark' as const,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="dark min-h-full flex flex-col">
        <ClerkProvider appearance={clerkDarkAppearance}>
          <header className="border-b border-foreground/10 bg-background">
            <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
              <Link href="/" className="flex items-center gap-2.5 font-semibold" aria-label="LinkShortner home">
                <span className="flex size-9 items-center justify-center rounded-md bg-lime-300 text-zinc-950">
                  <Link2 aria-hidden="true" className="size-5" />
                </span>
                <span>linkshortner</span>
              </Link>
              <div className="flex items-center gap-2">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="lg">Sign in</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="h-10 px-4">Get started</Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}