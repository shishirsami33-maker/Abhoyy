import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure bKash Checkout',
  description: 'Complete your mock interview credit purchase securely with bKash.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

