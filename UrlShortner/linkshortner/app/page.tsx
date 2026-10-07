import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, Database, LayoutDashboard, ShieldCheck } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const foundations = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Your account comes first",
    description:
      "Clerk handles sign-in, so your workspace starts with a verified account and a clear sense of ownership.",
  },
  {
    number: "02",
    icon: LayoutDashboard,
    title: "A private place to work",
    description:
      "Dashboard access is checked on the server. Your workspace is available to you after you sign in.",
  },
  {
    number: "03",
    icon: Database,
    title: "A dependable data foundation",
    description:
      "Neon Postgres and Drizzle are configured for the data layer as LinkShortner takes shape.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex-1">
      <section aria-labelledby="hero-title" className="bg-[#dff27a] text-zinc-950">
        <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase">
              <span className="size-2 rounded-full bg-zinc-950" />
              A considered home for your links
            </p>
            <h1 id="hero-title" className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Links, made a little <span className="font-serif font-normal italic">lighter.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
              A focused workspace for the links you share, built around your account and a foundation that can grow with you.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <Button size="lg" className="h-11 gap-2 bg-zinc-950 px-5 text-white hover:bg-zinc-800">
                  Create your account <ArrowRight aria-hidden="true" />
                </Button>
              </SignUpButton>
              <a href="#features" className="text-sm font-medium underline decoration-zinc-950/40 underline-offset-4 transition-colors hover:decoration-zinc-950">
                See what&apos;s in place
              </a>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl pb-14 sm:mt-16 sm:pb-16">
            <div className="overflow-hidden rounded-md border border-zinc-950/15 bg-[#fafaf5] shadow-[0_18px_60px_-34px_rgba(24,24,20,0.4)]">
              <div className="flex h-10 items-center gap-2 border-b border-zinc-950/10 px-4">
                <span className="size-2 rounded-full bg-zinc-300" />
                <span className="size-2 rounded-full bg-zinc-300" />
                <span className="size-2 rounded-full bg-zinc-300" />
                <span className="ml-3 font-mono text-[10px] uppercase text-zinc-500">linkshortner / access</span>
              </div>
              <div className="grid gap-8 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-9 sm:py-8">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase text-zinc-500">Your workspace</p>
                  <h2 className="mt-2 text-2xl font-medium text-zinc-950 sm:text-3xl">A space that stays yours.</h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-600">
                    Your account is verified before the private dashboard opens.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:min-w-72">
                  <div className="border-l-2 border-lime-500 pl-3">
                    <p className="font-mono text-[10px] uppercase text-zinc-500">Identity</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">Account based</p>
                  </div>
                  <div className="border-l-2 border-zinc-300 pl-3">
                    <p className="font-mono text-[10px] uppercase text-zinc-500">Dashboard</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">Protected access</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-right font-mono text-[10px] uppercase text-zinc-700/70">Built around your account</p>
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-title" className="bg-[#f8f8f3]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase text-zinc-500">The foundations</p>
            <h2 id="features-title" className="mt-4 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
              The essentials for a workspace you can trust.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 border-t border-zinc-950/15 pt-7 md:grid-cols-3 md:gap-7">
            {foundations.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">{number}</span>
                  <Icon aria-hidden="true" className="size-5 text-zinc-700" strokeWidth={1.7} />
                </div>
                <h3 className="mt-7 text-lg font-semibold text-zinc-950">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="closing-title" className="bg-zinc-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase text-lime-300">LinkShortner</p>
            <h2 id="closing-title" className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Start with a space of your own.</h2>
          </div>
          <SignUpButton mode="modal">
            <Button size="lg" className="h-11 w-fit gap-2 bg-lime-300 px-5 text-zinc-950 hover:bg-lime-200">
              Get started <ArrowRight aria-hidden="true" />
            </Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
