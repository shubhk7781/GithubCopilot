import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const urls = pgTable(
  'urls',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    shortCode: text('short_code').notNull().unique(),
    originalUrl: text('original_url').notNull(),
    // Clerk user ID (plain text column; no FK / user table per docs/authentication.md)
    userId: text('user_id').notNull(),
    clickCount: integer('click_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('urls_user_id_idx').on(table.userId)],
);

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
