---
name: weekly-links-chart
description: Generate a PNG bar chart of how many short links were created per day during the current week (Monday–Sunday) in the LinkShortner app, exported to a media/ folder at the project root. Use this skill whenever the user asks for a chart, graph, or plot of links created/generated per day, daily link creation counts, weekly link activity, or a visual weekly report of link creation — even if they don't explicitly mention a PNG file or the media folder.
---

# Weekly links chart

Produce a bar chart of links generated per day for the current week (x-axis: days Mon–Sun, y-axis: number of links created) and export it as a PNG to `media/` at the project root.

## Why this workflow

This project has firm conventions (see AGENTS.md and .github/instructions/data-fetching.instructions.md): all database access goes through helper functions in the `data/` directory using Drizzle ORM — never ad-hoc queries in scripts or components. Respect that even though this is a one-off export, because the helper stays reusable for future dashboard work.

The chart is rendered with Python + matplotlib because the project has no npm charting dependency, and adding one just for an export script is unjustified. matplotlib's Agg backend renders PNGs headlessly, so no display is needed.

## Prerequisites

- `DATABASE_URL` set in `.env` or `.env.local` at the project root (Neon Postgres connection string).
- Python 3 with matplotlib (`pip install matplotlib` if missing). On Windows the command may be `py` instead of `python`.
- `tsx` is already a devDependency — run TypeScript scripts with `npx tsx`.

## Steps

### 1. Add the data helper (skip if it already exists)

Project rules require DB access to live in `data/` helpers using Drizzle. Add this to `data/urls.ts`:

```ts
export type DailyLinkCount = { day: string; count: number };

/**
 * Links created per calendar day for the current week.
 * `date_trunc('week', ...)` uses ISO weeks, so the week starts on Monday;
 * boundaries follow the database session timezone.
 */
export async function getDailyLinkCountsForCurrentWeek(): Promise<DailyLinkCount[]> {
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${urls.createdAt}), 'YYYY-MM-DD')`,
      count: count(),
    })
    .from(urls)
    .where(sql`${urls.createdAt} >= date_trunc('week', now())`)
    .groupBy(sql`date_trunc('day', ${urls.createdAt})`)
    .orderBy(sql`date_trunc('day', ${urls.createdAt})`);

  return rows.map((row) => ({ day: row.day, count: Number(row.count) }));
}
```

If the helper already exists, reuse it rather than adding a duplicate.

### 2. Create the runner script

Next.js auto-loads env files, but standalone scripts don't — the runner must load dotenv itself, before importing anything that touches `db/index.ts` (which throws if `DATABASE_URL` is unset). Load `.env.local` first, then `.env`, matching Next.js precedence.

Two tsx/esbuild constraints shape the script (this project's package.json has no `"type": "module"`, so tsx emits CJS): top-level `await` is invalid in CJS output, so the body must live inside an async `main()`; and static imports are hoisted above the `config()` call, so the data helper must be loaded with a dynamic `import()` after dotenv runs.

Create `scripts/export-weekly-links.ts`:

```ts
import { config } from 'dotenv';
import { writeFile } from 'node:fs/promises';

// dotenv must run before db/index.ts evaluates (it throws when DATABASE_URL is
// unset). tsx compiles to CJS here, where top-level await is invalid and static
// imports are hoisted above config() — so pull the helper in dynamically.
config({ path: ['.env.local', '.env'] });

async function main() {
  const outputPath = process.argv[2] ?? 'media/weekly-links.json';

  const { getDailyLinkCountsForCurrentWeek } = await import('../data/urls');
  const days = await getDailyLinkCountsForCurrentWeek();
  await writeFile(outputPath, JSON.stringify({ days }, null, 2));
  console.log(`Exported ${days.length} day(s) of link counts to ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
```

### 3. Export the data

Run from the project root (tsx picks up tsconfig paths from here, so the `@/db` import inside `data/urls.ts` resolves):

```bash
npx tsx scripts/export-weekly-links.ts media/weekly-links.json
```

### 4. Render the PNG

```bash
python .agents/skills/weekly-links-chart/scripts/plot_links_per_day.py media/weekly-links.json media/links-per-day-this-week.png
```

The bundled script fills days that have no links with zero-height bars, so the x-axis always shows the full Monday–Sunday week. It creates the `media/` directory if needed.
