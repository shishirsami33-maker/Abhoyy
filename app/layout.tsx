import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/hooks/useLanguage';
import { ToastProvider } from '@/lib/hooks/useToast';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BRAND_NAME } from '@/config';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Walk in fearless | AI Mock Interview & Viva for Bangladesh`,
  description:
    'Bangladesh-first AI mock interview and viva platform. Upload your CV, add job or course details, and practice spoken interviews fearlessly.',
  keywords: [
    'Abhoyy',
    'AI mock interview',
    'viva practice',
    'BCS viva',
    'Bangladesh interview preparation',
    'job viva',
    'fresh graduate viva',
  ],
  authors: [{ name: 'Abhoyy Team' }],
  icons: {
    icon: '/brand/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B0B14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-paper text-ink-900 selection:bg-volt-400 selection:text-ink-900">
        <LanguageProvider>
          <ToastProvider>
            <OfflineBanner />
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
