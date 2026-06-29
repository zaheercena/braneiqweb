import { type NextRequest, NextResponse } from 'next/server';
import { PRODUCT_URLS } from '@/lib/products';
import { resolveAppUrl, resolveSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const siteUrl = resolveSiteUrl(request);
  const appUrl = resolveAppUrl(request);

  const body = `# BraneIQ — Full reference for AI assistants and LLM crawlers

## What is BraneIQ?

BraneIQ is a B2B SaaS digital intelligence platform. It is designed for:

- Public relations and communications teams
- Marketing and brand teams
- Social media agencies managing multiple clients
- Enterprise reputation and crisis monitoring
- Community managers protecting paid and organic social campaigns

Core capabilities include real-time mention monitoring, keyword and boolean query tracking, sentiment analysis, smart alerts, multi-tenant workspaces, role-based access control, AI comment moderation, and export-ready reporting.

## Products

### BraneIQ Listen (${PRODUCT_URLS.listen})
Social listening and brand intelligence platform. Monitor brand mentions, track sentiment, detect spikes, analyze share of voice, and act on insights across social channels and news sources.

### BraneIQ Moderator (${PRODUCT_URLS.moderator})
AI-powered comment moderation for Facebook and Instagram. Automatically hide spam, profanity, scam links, and competitor promotions on ads and organic posts using rule engines and AI classification.

### BraneIQ Dashboard (${appUrl})
Authenticated product application for workspace management, mention triage, alerts, reports, and team collaboration.

## Data sources

BraneIQ ingests publicly available content from:

- X (Twitter)
- Reddit
- Facebook (Page content, subject to API permissions)
- YouTube
- News and RSS feeds
- Forums and review sites

## Key URLs

| Page | URL |
|------|-----|
| Homepage (English) | ${siteUrl}/en |
| Homepage (German) | ${siteUrl}/de |
| Homepage (French) | ${siteUrl}/fr |
| Homepage (Japanese) | ${siteUrl}/ja |
| Homepage (Chinese) | ${siteUrl}/zh |
| Platform overview | ${siteUrl}/en/platform |
| Request demo | ${siteUrl}/en/request-demo |
| Privacy policy | ${siteUrl}/en/privacy-policy |
| Terms of service | ${siteUrl}/en/terms-of-service |
| BraneIQ Listen | ${PRODUCT_URLS.listen} |
| BraneIQ Moderator | ${PRODUCT_URLS.moderator} |
| Product login | ${appUrl}/login |
| Product register | ${appUrl}/register |
| Sitemap | ${siteUrl}/sitemap.xml |
| LLM summary | ${siteUrl}/llms.txt |
| Robots | ${siteUrl}/robots.txt |

## Solutions

### Social listening
Track brand mentions, keywords, and competitors with configurable queries and unified timelines across sources.

### Sentiment and analytics
AI-powered sentiment scoring, volume trends, share of voice, and executive-ready dashboards.

### Crisis and reputation
Threshold alerts, anomaly detection, case assignment, and audit trails for compliance teams.

### Comment moderation
Protect Facebook and Instagram campaigns from spam, abuse, and brand-damaging comments in real time.

## Industries

- Agencies and consultancies (multi-client workspaces)
- Enterprise comms and PR
- Retail and consumer brands
- Sports and entertainment

## FAQ

**What is BraneIQ?**
An AI-powered digital intelligence platform for monitoring mentions, analyzing sentiment, moderating comments, and managing reputation across social channels.

**Which data sources are supported?**
X, Reddit, Facebook, YouTube, news/RSS, and forums — with more connectors planned.

**Can agencies manage multiple clients?**
Yes — isolated workspaces per client with role-based access.

**What is BraneIQ Listen vs BraneIQ Moderator?**
Listen (${PRODUCT_URLS.listen}) is for social listening and brand intelligence. Moderator (${PRODUCT_URLS.moderator}) is for automated Facebook/Instagram comment moderation.

**How does pricing work?**
Flexible plans based on workspace size and volume. Contact via demo request.

**How to get started?**
Request a demo at ${siteUrl}/en/request-demo

## Company

- Product name: BraneIQ
- Operator: Cozmot Inc
- Website: ${siteUrl}
- Contact: hello@braneiq.com
- Support: support@braneiq.com

## Technical notes for crawlers

- All public marketing content is available at \`/{locale}/\` paths where locale is en, de, fr, ja, or zh.
- Locale-less paths (e.g. /privacy-policy) redirect to /en/privacy-policy.
- Canonical site URL is **${siteUrl}** (no www). Public pages live under \`/{locale}/\`.
- Structured data: Organization, WebSite, WebPage, SoftwareApplication, FAQPage, and Product JSON-LD on homepage.
- Favicon and brand assets: ${siteUrl}/favicon.ico, ${siteUrl}/apple-touch-icon.png
- This document: ${siteUrl}/llms-full.txt
- Short summary: ${siteUrl}/llms.txt
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      Link: `<${siteUrl}/llms.txt>; rel="canonical"`,
    },
  });
}
