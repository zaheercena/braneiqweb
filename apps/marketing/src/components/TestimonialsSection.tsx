import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Quote } from 'lucide-react';

export async function TestimonialsSection() {
  const t = await getTranslations('home.testimonials');

  const items = ['one', 'two', 'three'] as const;

  return (
    <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
          dark
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((key) => (
            <blockquote
              key={key}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-indigo-400" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-200">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-2xl font-bold text-indigo-300">{t(`${key}.metric`)}</p>
                <p className="mt-1 text-xs text-slate-400">{t(`${key}.metricLabel`)}</p>
                <p className="mt-4 text-sm font-semibold text-white">{t(`${key}.name`)}</p>
                <p className="text-xs text-slate-400">{t(`${key}.role`)}</p>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
