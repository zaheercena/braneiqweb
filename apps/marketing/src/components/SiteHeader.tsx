'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/routing';
import { getAppUrl } from '@/lib/env';
import clsx from 'clsx';
import { SolutionsNav } from '@/components/SolutionsNav';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  zh: '中文',
};

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const appUrl = getAppUrl();

  const pageLinks = [
    { href: '/platform' as const, label: t('platform') },
    { href: '/request-demo' as const, label: t('demo') },
  ];

  const sectionLinks = [
    { hash: 'industries', label: t('industries') },
    { hash: 'faq', label: t('faq') },
  ];

  const localeSelect = (
    <select
      aria-label={t('language')}
      value={locale}
      onChange={(event) => {
        router.replace(pathname, { locale: event.target.value as Locale });
      }}
      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"
    >
      {locales.map((code) => (
        <option key={code} value={code}>
          {localeLabels[code]}
        </option>
      ))}
    </select>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/braneiq.png" alt="BraneIQ" width={36} height={36} className="object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Brane<span className="text-indigo-600">IQ</span></span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <SolutionsNav />
          {sectionLinks.map(({ hash, label }) => (
            <Link
              key={hash}
              href={`/#${hash}`}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              {label}
            </Link>
          ))}
          {pageLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'text-sm font-medium transition hover:text-indigo-600',
                pathname === href ? 'text-indigo-600' : 'text-slate-600',
              )}
            >
              {label}
            </Link>
          ))}
          {localeSelect}
          <a
            href={`${appUrl}/login`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {t('login')}
          </a>
        </nav>

        <button
          type="button"
          className="lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            <SolutionsNav variant="mobile" onNavigate={() => setOpen(false)} />
            {sectionLinks.map(({ hash, label }) => (
              <Link
                key={hash}
                href={`/#${hash}`}
                className="text-sm font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            {pageLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            {localeSelect}
            <a
              href={`${appUrl}/login`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {t('login')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
