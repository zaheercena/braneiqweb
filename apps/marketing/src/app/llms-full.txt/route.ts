import { type NextRequest, NextResponse } from 'next/server';
import { resolveAppUrl, resolveSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const siteUrl = resolveSiteUrl(request);
  const appUrl = resolveAppUrl(request);

  const body = `# BraneIQ — Full reference for AI assistants

## What is BraneIQ?

BraneIQ is a B2B SaaS social listening and brand intelligence platform. It is designed for:

- Public relations and communications teams
- Marketing and brand teams
- Social media agencies managing multiple clients
- Enterprise reputation and crisis monitoring

Core capabilities include real-time mention monitoring, keyword and boolean query tracking, sentiment analysis, smart alerts, multi-tenant workspaces, role-based access control, and export-ready reporting.

## Data sources

BraneIQ ingests publicly available content from:

- X (Twitter)
- Reddit
- Facebook (Page content, subject to API permissions)
- YouTube
- News and RSS feeds

Additional connectors may be added over time.

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
| Product login | ${appUrl}/login |
| Product register | ${appUrl}/register |
| Sitemap | ${siteUrl}/sitemap.xml |
| LLM summary | ${siteUrl}/llms.txt |

## Solutions

### Social listening
Track brand mentions, keywords, and competitors with configurable queries and unified timelines across sources.

### Sentiment and analytics
AI-powered sentiment scoring, volume trends, share of voice, and executive-ready dashboards.

### Crisis and reputation
Threshold alerts, anomaly detection, case assignment, and audit trails for compliance teams.

## Industries

- Agencies and consultancies (multi-client workspaces)
- Enterprise comms and PR
- Retail and consumer brands
- Sports and entertainment

## FAQ

**What is BraneIQ?**
A social listening platform for monitoring mentions, analyzing sentiment, and managing reputation across social channels.

**Which data sources are supported?**
X, Reddit, Facebook, YouTube, and news/RSS — with more connectors planned.

**Can agencies manage multiple clients?**
Yes — isolated workspaces per client with role-based access.

**How does pricing work?**
Flexible plans based on workspace size and volume. Contact via demo request.

**How to get started?**
Request a demo at ${siteUrl}/en/request-demo

## Company

- Product name: BraneIQ
- Operator: Cozmot Inc
- Contact: support@braneiq.com
- Privacy: support@braneiq.com

## Technical notes for crawlers

- All public marketing content is available at \`/{locale}/\` paths where locale is en, de, fr, ja, or zh.
- Locale-less paths (e.g. /privacy-policy) redirect to /en/privacy-policy.
- Canonical site URL is **https://braneiq.com** (no www). Public pages live under \`/{locale}/\`.
- Structured data: Organization, WebSite, FAQPage, SoftwareApplication JSON-LD on homepage.
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
