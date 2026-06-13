type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
}: Props) {
  const alignClass = align === 'center' ? 'mx-auto text-center max-w-3xl' : 'max-w-2xl';

  return (
    <div className={alignClass}>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-wider ${
            dark ? 'text-indigo-300' : 'text-indigo-600'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${
          dark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
