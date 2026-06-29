import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Check, X } from 'lucide-react';

export async function ComparisonSection() {
  const t = await getTranslations('home.comparison');

  const featureKeys = [
    'ai', 'realtime', 'moderation', 'interface',
    'multiplatform', 'executive', 'crisis', 'deployment', 'security',
  ] as const;

  const traditionalSupport: Record<string, boolean> = {
    ai: false, realtime: true, moderation: false, interface: false,
    multiplatform: false, executive: false, crisis: false, deployment: false, security: true,
  };

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
        />

        <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm" role="table" aria-label="Feature comparison">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 pl-6 pr-4 text-left font-semibold text-slate-700 w-1/2">{t('featureCol')}</th>
                <th className="py-4 px-4 text-center font-semibold text-slate-500">{t('traditionalCol')}</th>
                <th className="py-4 px-4 text-center font-semibold text-indigo-700 bg-indigo-50/60">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {t('braneiqCol')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key, i) => (
                <tr
                  key={key}
                  className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                >
                  <td className="py-3.5 pl-6 pr-4 font-medium text-slate-700">{t(`features.${key}`)}</td>
                  <td className="py-3.5 px-4 text-center">
                    {traditionalSupport[key] ? (
                      <Check className="mx-auto h-4 w-4 text-slate-400" aria-label="Supported" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-slate-300" aria-label="Not supported" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center bg-indigo-50/30">
                    <Check className="mx-auto h-4 w-4 text-indigo-600" aria-label="Supported" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
