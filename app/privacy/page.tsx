import type { Metadata } from 'next';
import { PrivacyClient } from '@/components/PrivacyClient';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Abhoyy safeguards your resume, voice recordings, and mock interview transcripts. Zero data sharing with recruiters.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Abhoyy',
    description:
      'Strict candidate confidentiality. Your mock interview recordings and resume are for your eyes only.',
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
