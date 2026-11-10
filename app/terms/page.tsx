import type { Metadata } from 'next';
import { TermsClient } from '@/components/TermsClient';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Review the terms of service, candidate practice scope, AI capabilities disclaimer, and user agreement for Abhoyy.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms and Conditions | Abhoyy',
    description:
      'Clear terms of use, privacy protection, and service expectations for Abhoyy mock interview platform.',
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
