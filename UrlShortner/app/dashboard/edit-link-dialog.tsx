'use client';

import { useId, useState, useTransition } from 'react';
import { Pencil } from 'lucide-react';
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
import { updateLinkAction } from './actions';

export function EditLinkDialog({
  id,
  shortCode: initialShortCode,
  originalUrl: initialOriginalUrl,
}: {
  id: number;
  shortCode: string;
  originalUrl: string;
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(initialOriginalUrl);
  const [shortCode, setShortCode] = useState(initialShortCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      // Reset the form to the link's current values each time the dialog opens.
      setOriginalUrl(initialOriginalUrl);
      setShortCode(initialShortCode);
      setError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateLinkAction({
        id,
        originalUrl,
        shortCode: shortCode.trim(),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`Edit link ${initialShortCode}`} />}
      >
        <Pencil aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>Update the destination URL or short code for this link.</DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-originalUrl`}>Destination URL</FieldLabel>
              <FieldContent>
                <Input
                  id={`${formId}-originalUrl`}
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
              <FieldLabel htmlFor={`${formId}-shortCode`}>Short code</FieldLabel>
              <FieldContent>
                <Input
                  id={`${formId}-shortCode`}
                  type="text"
                  placeholder="my-link"
                  value={shortCode}
                  onChange={(event) => setShortCode(event.target.value)}
                  required
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
