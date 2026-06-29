import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { PRODUCT_URLS } from '@/lib/products';
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

> BraneIQ is an AI-powered digital intelligence platform for comms, PR, marketing, and enterprise teams. Monitor brand mentions, analyze sentiment, moderate social comments, and respond to reputation risks across social channels, news, and forums.

## Summary

BraneIQ helps agencies and enterprise teams track keywords, brands, and competitors on X (Twitter), Reddit, Facebook, YouTube, and news sources. The platform includes multi-client workspaces, real-time alerts, AI-powered sentiment analysis, and automated comment moderation.

## Products

| Product | URL | Description |
|---------|-----|-------------|
| BraneIQ Listen | ${PRODUCT_URLS.listen} | Social listening and brand intelligence — monitor mentions, track sentiment, and act on insights |
| BraneIQ Moderator | ${PRODUCT_URLS.moderator} | AI-powered comment moderation for Facebook and Instagram ads and organic posts |
| BraneIQ Dashboard | ${appUrl}/login | Product app for authenticated users |

## Key pages (English)

${pages}

## Supported languages

${locales}

## AI & crawler documentation

- Full site guide for AI systems: ${siteUrl}/llms-full.txt
- Machine-readable sitemap: ${siteUrl}/sitemap.xml
- Robots policy: ${siteUrl}/robots.txt
- Privacy policy: ${siteUrl}/en/privacy-policy
- Terms of service: ${siteUrl}/en/terms-of-service

## Contact

- Email: hello@braneiq.com
- Support: support@braneiq.com
- Demo: ${siteUrl}/en/request-demo

## Company

BraneIQ is operated by Cozmot Inc. Canonical domain: ${siteUrl} (no www).

## Optional

For API access, enterprise pricing, and platform documentation, request a demo at ${siteUrl}/en/request-demo.
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      Link: `<${siteUrl}/llms-full.txt>; rel="describedby"`,
    },
  });
}
