'use client';

import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/SectionHeading';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqKeys = ['what', 'sources', 'teams', 'crisis', 'moderation', 'pricing', 'demo'] as const;

export function FaqSection() {
  const t = useTranslations('home.faq');
  const [open, setOpen] = useState<string | null>(faqKeys[0]);

  return (
    <section id="faq" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} align="center" />

        <div className="mt-12 space-y-3">
          {faqKeys.map((key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : key)}
                >
                  <span className="font-semibold text-slate-900">{t(`items.${key}.q`)}</span>
                  <ChevronDown
                    className={clsx(
                      'h-5 w-5 shrink-0 text-slate-400 transition',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-6 pb-4 pt-2 text-sm leading-relaxed text-slate-600">
                    {t(`items.${key}.a`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
