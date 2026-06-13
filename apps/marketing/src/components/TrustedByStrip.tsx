import { getTranslations } from 'next-intl/server';

const brands = ['Northline PR', 'Cozmot Inc', 'Meridian Comms', 'Atlas Agency', 'Signal Group'];

export async function TrustedByStrip() {
  const t = await getTranslations('home.trustedBy');

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
          {t('title')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-semibold tracking-wide text-slate-400 transition hover:text-slate-600"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
