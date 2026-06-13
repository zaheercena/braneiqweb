import { getTranslations } from 'next-intl/server';

export async function StatsBar() {
  const t = await getTranslations('home.stats');

  const items = [
    { value: t('sources.value'), label: t('sources.label') },
    { value: t('languages.value'), label: t('languages.label') },
    { value: t('latency.value'), label: t('latency.label') },
    { value: t('uptime.value'), label: t('uptime.label') },
  ];

  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {items.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
