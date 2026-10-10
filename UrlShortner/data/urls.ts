import { and, count, desc, eq, sql, sum } from 'drizzle-orm';
import db from '@/db';
import { urls, type Url } from '@/db/schema';

const PAGE_SIZE = 7;
const SHORT_CODE_LENGTH = 7;
const SHORT_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const MAX_GENERATION_ATTEMPTS = 5;

export class ShortCodeTakenError extends Error {
  constructor() {
    super('Short code is already taken');
    this.name = 'ShortCodeTakenError';
  }
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '23505',
  );
}

function generateShortCode(): string {
  let code = '';
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    code += SHORT_CODE_ALPHABET[Math.floor(Math.random() * SHORT_CODE_ALPHABET.length)];
  }
  return code;
}

async function insertUrl(shortCode: string, originalUrl: string, userId: string): Promise<Url> {
  try {
    const [created] = await db.insert(urls).values({ shortCode, originalUrl, userId }).returning();
    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ShortCodeTakenError();
    }
    throw error;
  }
}

export async function createUrl({
  userId,
  originalUrl,
  customCode,
}: {
  userId: string;
  originalUrl: string;
  customCode?: string;
}): Promise<Url> {
  if (customCode) {
    return insertUrl(customCode, originalUrl, userId);
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      return await insertUrl(generateShortCode(), originalUrl, userId);
    } catch (error) {
      const isLastAttempt = attempt === MAX_GENERATION_ATTEMPTS - 1;
      if (error instanceof ShortCodeTakenError && !isLastAttempt) {
        continue;
      }
      throw error;
    }
  }

  // Unreachable: the loop above always returns or throws.
  throw new Error('Unable to generate a unique short code');
}

export async function updateUrl({
  id,
  userId,
  originalUrl,
  shortCode,
}: {
  id: number;
  userId: string;
  originalUrl: string;
  shortCode: string;
}): Promise<Url | null> {
  try {
    const [updated] = await db
      .update(urls)
      .set({ originalUrl, shortCode, updatedAt: new Date() })
      .where(and(eq(urls.id, id), eq(urls.userId, userId)))
      .returning();

    return updated ?? null;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ShortCodeTakenError();
    }
    throw error;
  }
}

export async function deleteUrl({ id, userId }: { id: number; userId: string }): Promise<boolean> {
  const deleted = await db
    .delete(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, userId)))
    .returning({ id: urls.id });

  return deleted.length > 0;
}

export async function getUrlByShortCode(shortCode: string): Promise<Url | null> {
  const [url] = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);

  return url ?? null;
}

export async function incrementClickCount(id: number): Promise<void> {
  await db
    .update(urls)
    .set({ clickCount: sql`${urls.clickCount} + 1` })
    .where(eq(urls.id, id));
}

export async function getUserUrlStats(userId: string): Promise<{ totalLinks: number; totalClicks: number }> {
  const [stats] = await db
    .select({ totalLinks: count(), totalClicks: sum(urls.clickCount) })
    .from(urls)
    .where(eq(urls.userId, userId));

  return {
    totalLinks: stats?.totalLinks ?? 0,
    totalClicks: Number(stats?.totalClicks ?? 0),
  };
}

export async function getUserUrlsPage(userId: string, page: number) {
  const offset = (page - 1) * PAGE_SIZE;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(urls)
      .where(eq(urls.userId, userId))
      .orderBy(desc(urls.updatedAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ total: count() }).from(urls).where(eq(urls.userId, userId)),
  ]);

  return {
    urls: rows,
    totalCount: total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    pageSize: PAGE_SIZE,
  };
}
