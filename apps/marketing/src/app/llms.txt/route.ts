import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { PUBLIC_PATHS, resolveAppUrl, resolveSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const siteUrl = resolveSiteUrl(request);
  const appUrl = resolveAppUrl(request);

  const pages = PUBLIC_PATHS.map((path) => {
    const suffix = path || '/';
    return `- [${suffix}](${siteUrl}/en${path})`;
  }).join('\n');

  const locales = routing.locales.map((l) => `- ${l}: ${siteUrl}/${l}`).join('\n');

  const body = `# BraneIQ

> BraneIQ is a social listening and brand intelligence platform for comms, PR, and marketing teams. Monitor brand mentions, analyze sentiment, and respond to reputation risks across social channels.

## Summary

BraneIQ helps agencies and enterprise teams track keywords, brands, and competitors on X (Twitter), Reddit, Facebook, YouTube, and news sources. Multi-client workspaces, real-time alerts, and AI-powered sentiment analysis are core capabilities.

## Product app

- Dashboard (login): ${appUrl}/login
- Register: ${appUrl}/register

## Key pages (English)

${pages}

## Supported languages

${locales}

## Extended documentation

- Full site guide for AI systems: ${siteUrl}/llms-full.txt
- Sitemap: ${siteUrl}/sitemap.xml
- Privacy policy: ${siteUrl}/en/privacy-policy
- Terms of service: ${siteUrl}/en/terms-of-service

## Contact

- Email: hello@braneiq.com
- Privacy: privacy@braneiq.com
- Demo: ${siteUrl}/en/request-demo

## Optional

BraneIQ is operated by Cozmot Inc. For API and platform documentation, request a demo at ${siteUrl}/en/request-demo.
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
