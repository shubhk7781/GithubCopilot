import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Link2, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserUrlsPage, getUserUrlStats } from '@/data/urls';
import { CreateLinkDialog } from './create-link-dialog';
import { DeleteLinkDialog } from './delete-link-dialog';
import { EditLinkDialog } from './edit-link-dialog';
import { LiveRefresh } from './live-refresh';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth.protect();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ urls, totalCount, totalPages }, stats] = await Promise.all([
    getUserUrlsPage(userId, page),
    getUserUrlStats(userId),
  ]);

  return (
    <main className="relative isolate mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <LiveRefresh />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-gradient-to-r from-primary/25 via-chart-2/20 to-chart-3/25 blur-3xl"
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-3 text-primary-foreground shadow-lg shadow-primary/25">
            <Link2 aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-2xl font-semibold text-transparent">
              Your links
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'link' : 'links'} total
            </p>
          </div>
        </div>
        <CreateLinkDialog />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-border bg-card/60 p-4 shadow-lg shadow-black/10 backdrop-blur">
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Link2 aria-hidden="true" className="size-3.5 text-primary" />
            Total links
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-foreground">{stats.totalLinks}</dd>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-4 shadow-lg shadow-black/10 backdrop-blur">
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MousePointerClick aria-hidden="true" className="size-3.5 text-chart-2" />
            Total clicks
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-foreground">{stats.totalClicks}</dd>
        </div>
      </dl>

      {urls.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-card/40 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-chart-3/25 ring-1 ring-inset ring-primary/30">
            <Link2 aria-hidden="true" className="size-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No links yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first short link to get started.</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/50 shadow-xl shadow-black/20 backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Short code</th>
                <th scope="col" className="px-4 py-3 font-medium">Original URL</th>
                <th scope="col" className="px-4 py-3 font-medium">Clicks</th>
                <th scope="col" className="px-4 py-3 font-medium">Created</th>
                <th scope="col" className="px-4 py-3 font-medium">Updated</th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {urls.map((url) => (
                <tr key={url.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    <a
                      href={`/${url.shortCode}`}
                      className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-medium text-primary ring-1 ring-inset ring-primary/25 transition-colors hover:bg-primary/25"
                    >
                      {url.shortCode}
                    </a>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                    >
                      {url.originalUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <MousePointerClick aria-hidden="true" className="size-3.5 text-chart-2" />
                      {url.clickCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(url.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(url.updatedAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <EditLinkDialog id={url.id} shortCode={url.shortCode} originalUrl={url.originalUrl} />
                      <DeleteLinkDialog id={url.id} shortCode={url.shortCode} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            nativeButton={false}
            render={<Link href={`/dashboard?page=${page - 1}`} aria-disabled={page <= 1} />}
          >
            <ArrowLeft aria-hidden="true" /> Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            nativeButton={false}
            render={<Link href={`/dashboard?page=${page + 1}`} aria-disabled={page >= totalPages} />}
          >
            Next <ArrowRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </main>
  );
}