import { NextResponse } from 'next/server';
import { getUrlByShortCode, incrementClickCount } from '@/data/urls';

export async function GET(_request: Request, { params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params;

  try {
    const url = await getUrlByShortCode(shortCode);

    if (!url) {
      return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
    }

    await incrementClickCount(url.id);

    // 307 (temporary) so every visit hits this handler and click counts stay accurate.
    return NextResponse.redirect(url.originalUrl, 307);
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
