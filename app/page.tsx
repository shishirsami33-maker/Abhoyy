import type { Metadata } from 'next';
import { LandingPageClient } from '@/components/LandingPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFaqSchema, SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Abhoyy — Walk in fearless | Bangladesh-first AI Mock Interview & Viva',
  description:
    'Practice spoken mock interviews & vivas with an AI panel tailored for Bangladesh. Upload your CV, target any job circular or BCS cadre, and build fearless confidence.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abhoyy — Walk in fearless | AI Mock Interview for Bangladesh',
    description:
      'Overcome viva anxiety with real-time AI boards. Practice in English, Bangla, or mixed Banglish with timestamped diagnostic reports.',
    url: SITE_URL,
    images: [
      {
        url: '/brand/logo.png',
        width: 1200,
        height: 630,
        alt: 'Abhoyy AI Interview Landing',
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd schema={getFaqSchema()} />
      <LandingPageClient />
    </>
  );
}
