import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const LLM_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'Googlebot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'FacebookBot',
  'meta-externalagent',
] as const;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const llmRules = LLM_AGENTS.map((userAgent) => ({
    userAgent,
    allow: ['/', '/llms.txt', '/llms-full.txt', '/sitemap.xml'],
    disallow: ['/api/'],
  }));

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      ...llmRules,
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
