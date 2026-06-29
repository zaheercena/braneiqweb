import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@/components/analytics/GoogleTagManager';
import { SeoHeadLinks } from '@/components/seo/SeoHeadLinks';
import { buildRootMetadata } from '@/lib/metadata';
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

  return buildRootMetadata(locale);
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
        <SeoHeadLinks />
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
