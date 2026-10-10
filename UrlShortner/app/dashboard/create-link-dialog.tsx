'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createLinkAction } from './actions';

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setOriginalUrl('');
    setCustomCode('');
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLinkAction({
        originalUrl,
        customCode: customCode.trim() === '' ? undefined : customCode.trim(),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      handleOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus aria-hidden="true" /> Create link
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a short link</DialogTitle>
          <DialogDescription>Paste a destination URL and optionally choose a custom short code.</DialogDescription>
        </DialogHeader>

        <form id="create-link-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="originalUrl">Destination URL</FieldLabel>
              <FieldContent>
                <Input
                  id="originalUrl"
                  type="url"
                  placeholder="https://example.com/my-page"
                  value={originalUrl}
                  onChange={(event) => setOriginalUrl(event.target.value)}
                  required
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="customCode">Custom short code (optional)</FieldLabel>
              <FieldContent>
                <Input
                  id="customCode"
                  type="text"
                  placeholder="my-link"
                  value={customCode}
                  onChange={(event) => setCustomCode(event.target.value)}
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="create-link-form" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
