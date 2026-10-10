'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createUrl, deleteUrl, ShortCodeTakenError, updateUrl, type Url } from '@/data/urls';

const createLinkSchema = z.object({
  originalUrl: z.string().trim().min(1, 'Enter a URL').url('Enter a valid URL').max(2048),
  customCode: z
    .string()
    .trim()
    .min(3, 'Custom code must be at least 3 characters')
    .max(30, 'Custom code must be at most 30 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores are allowed')
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

type CreateLinkResult = { success: true; data: Url } | { success: false; error: string };

export async function createLinkAction(input: CreateLinkInput): Promise<CreateLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = createLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const url = await createUrl({
      userId,
      originalUrl: parsed.data.originalUrl,
      customCode: parsed.data.customCode,
    });

    revalidatePath('/dashboard');
    return { success: true, data: url };
  } catch (error) {
    if (error instanceof ShortCodeTakenError) {
      return { success: false, error: 'That short code is already taken.' };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  originalUrl: z.string().trim().min(1, 'Enter a URL').url('Enter a valid URL').max(2048),
  shortCode: z
    .string()
    .trim()
    .min(3, 'Short code must be at least 3 characters')
    .max(30, 'Short code must be at most 30 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores are allowed'),
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

type UpdateLinkResult = { success: true; data: Url } | { success: false; error: string };

export async function updateLinkAction(input: UpdateLinkInput): Promise<UpdateLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = updateLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const url = await updateUrl({
      id: parsed.data.id,
      userId,
      originalUrl: parsed.data.originalUrl,
      shortCode: parsed.data.shortCode,
    });

    if (!url) {
      return { success: false, error: 'Link not found.' };
    }

    revalidatePath('/dashboard');
    return { success: true, data: url };
  } catch (error) {
    if (error instanceof ShortCodeTakenError) {
      return { success: false, error: 'That short code is already taken.' };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

type DeleteLinkResult = { success: true } | { success: false; error: string };

export async function deleteLinkAction(input: DeleteLinkInput): Promise<DeleteLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = deleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const deleted = await deleteUrl({ id: parsed.data.id, userId });

    if (!deleted) {
      return { success: false, error: 'Link not found.' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
