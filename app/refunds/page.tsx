import type { Metadata } from 'next';
import { RefundsClient } from '@/components/RefundsClient';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Refund & Credit Restoration Policy',
  description:
    'Transparent rules regarding technical disruption refunds, credit restoration, and bKash payment resolution for Abhoyy candidates.',
  alternates: {
    canonical: '/refunds',
  },
  openGraph: {
    title: 'Refund & Cancellation Policy | Abhoyy',
    description:
      'Fair, automated credit restoration and clear refund standards for candidates in Bangladesh.',
    url: `${SITE_URL}/refunds`,
  },
};

export default function RefundsPage() {
  return <RefundsClient />;
}
