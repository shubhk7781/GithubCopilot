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
