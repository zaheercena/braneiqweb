import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CtaBanner } from '@/components/CtaBanner';
import { FaqSection } from '@/components/FaqSection';
import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { IndustriesSection } from '@/components/IndustriesSection';
import { IntegrationsSection } from '@/components/IntegrationsSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { StatsBar } from '@/components/StatsBar';
import { HomeJsonLd } from '@/components/seo/HomeJsonLd';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TrustedByStrip } from '@/components/TrustedByStrip';
import { TrustSection } from '@/components/TrustSection';
import { buildPageMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata({
    locale: params.locale,
    titleKey: 'home.title',
    descriptionKey: 'home.description',
  });
}

export default function HomePage({ params }: Props) {
  setRequestLocale(params.locale);

  return (
    <>
      <HomeJsonLd locale={params.locale} />
      <Hero />
      <TrustedByStrip />
      <StatsBar />
      <SolutionsSection />
      <HowItWorksSection />
      <FeatureGrid />
      <IndustriesSection />
      <TestimonialsSection />
      <IntegrationsSection />
      <TrustSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
