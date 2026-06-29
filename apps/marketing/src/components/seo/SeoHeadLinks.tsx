import { LLM_DISCOVERY_LINKS } from '@/lib/site-seo';
import { getSiteUrl } from '@/lib/seo';

export function SeoHeadLinks() {
  const siteUrl = getSiteUrl();

  return (
    <>
      {LLM_DISCOVERY_LINKS.map((link) => (
        <link
          key={`${link.rel}-${link.href}`}
          rel={link.rel}
          href={`${siteUrl}${link.href}`}
          type={link.type}
          {...('title' in link ? { title: link.title } : {})}
        />
      ))}
      <link rel="alternate" type="application/rss+xml" title="BraneIQ Sitemap" href={`${siteUrl}/sitemap.xml`} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    </>
  );
}
