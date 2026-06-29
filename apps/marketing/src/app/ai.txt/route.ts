import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/** Alias for llms.txt — some AI crawlers look for /ai.txt */
export function GET() {
  const siteUrl = getSiteUrl();

  return NextResponse.redirect(`${siteUrl}/llms.txt`, {
    status: 308,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
