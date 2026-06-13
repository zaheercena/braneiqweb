import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@/components/analytics/GoogleTagManager';
import { getSiteUrl } from '@/lib/seo';
import './globals.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;

  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('defaultDescription'),
    authors: [{ name: 'Cozmot Inc', url: siteUrl }],
    creator: 'BraneIQ',
    publisher: 'Cozmot Inc',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    other: {
      'link:llms': `${siteUrl}/llms.txt`,
      'link:llms-full': `${siteUrl}/llms-full.txt`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <GoogleTagManagerBody />
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
