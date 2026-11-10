import type { Metadata } from 'next';
import { PricingClient } from '@/components/PricingClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Pricing & Packages — Free First Mock Available',
  description:
    'Simple, transparent pricing for AI mock interviews in Bangladesh. First mock is 100% free. Pay per session or save with credit packs via bKash.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Transparent Pricing & Free First Mock | Abhoyy',
    description:
      'Practice mock viva sessions at a fraction of coaching center fees. Instant bKash payment verification.',
    url: `${SITE_URL}/pricing`,
  },
};

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Abhoyy Mock Interview Credits',
  description:
    'AI-powered viva and interview simulation sessions tailored for Bangladesh candidates.',
  brand: {
    '@type': 'Brand',
    name: 'Abhoyy',
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BDT',
    lowPrice: '0',
    highPrice: '500',
    offerCount: '3',
    offers: [
      {
        '@type': 'Offer',
        name: 'Welcome Mock',
        price: '0',
        priceCurrency: 'BDT',
        category: 'Free First Session',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/signup`,
      },
      {
        '@type': 'Offer',
        name: 'Single Mock',
        price: '120',
        priceCurrency: 'BDT',
        category: 'Pay Per Mock',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/checkout?plan=single`,
      },
      {
        '@type': 'Offer',
        name: 'Success Pack (4 Sessions)',
        price: '350',
        priceCurrency: 'BDT',
        category: 'Credit Pack',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/checkout?plan=pack`,
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd schema={pricingSchema} />
      <PricingClient />
    </>
  );
}
