import { getTranslations } from 'next-intl/server';

export async function StatsBar() {
  const t = await getTranslations('home.stats');

  const items = [
    { value: t('posts.value'), label: t('posts.label') },
    { value: t('sources.value'), label: t('sources.label') },
    { value: t('uptime.value'), label: t('uptime.label') },
    { value: t('monitoring.value'), label: t('monitoring.label') },
  ];

  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
        {items.map(({ value, label }, i) => (
          <div key={label} className={`text-center ${i > 0 ? 'border-l border-slate-200' : ''}`}>
            <p className="text-4xl font-bold tracking-tight text-indigo-600">{value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
