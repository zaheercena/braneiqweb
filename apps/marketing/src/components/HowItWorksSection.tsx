import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';

export async function HowItWorksSection() {
  const t = await getTranslations('home.howItWorks');

  const steps = ['connect', 'monitor', 'act'] as const;

  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
        />

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-cyan-400 md:block"
          />
          {steps.map((step, index) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
                {index + 1}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">{t(`${step}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(`${step}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
