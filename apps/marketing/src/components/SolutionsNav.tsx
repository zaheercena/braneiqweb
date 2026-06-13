'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PRODUCT_URLS } from '@/lib/products';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type SolutionsNavProps = {
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
};

const productLinks = [
  { key: 'listen' as const, href: PRODUCT_URLS.listen },
  { key: 'moderator' as const, href: PRODUCT_URLS.moderator },
];

export function SolutionsNav({ onNavigate, variant = 'desktop' }: SolutionsNavProps) {
  const t = useTranslations('nav.solutionsMenu');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function close() {
    setOpen(false);
    onNavigate?.();
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('label')}</p>
        {productLinks.map(({ key, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-slate-700"
            onClick={close}
          >
            {t(key)}
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        ))}
        <Link href="/#solutions" className="block text-sm font-medium text-slate-700" onClick={close}>
          {t('overview')}
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t('label')}
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 min-w-[15rem] rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
        >
          {productLinks.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              onClick={close}
            >
              <span>{t(key)}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </a>
          ))}
          <div className="my-1 border-t border-slate-100" />
          <Link
            href="/#solutions"
            role="menuitem"
            className="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
            onClick={close}
          >
            {t('overview')}
          </Link>
        </div>
      )}
    </div>
  );
}
