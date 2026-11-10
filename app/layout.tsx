import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/hooks/useLanguage';
import { ToastProvider } from '@/lib/hooks/useToast';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BRAND_NAME } from '@/config';
import {
  SITE_URL,
  SEO_CONFIG,
  getOrganizationSchema,
  getWebApplicationSchema,
} from '@/config/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: SEO_CONFIG.author, url: SITE_URL }],
  creator: SEO_CONFIG.author,
  publisher: SEO_CONFIG.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'bn-BD': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['bn_BD'],
    url: SITE_URL,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: '/brand/logo.png',
        width: 1200,
        height: 630,
        alt: 'Abhoyy — AI Mock Interview and Viva Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    site: SEO_CONFIG.twitterHandle,
    creator: SEO_CONFIG.twitterHandle,
    images: ['/brand/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: SEO_CONFIG.verification.google,
    other: {
      'msvalidate.01': [SEO_CONFIG.verification.bing],
    },
  },
  icons: {
    icon: '/brand/logo.png',
    shortcut: '/brand/logo.png',
    apple: '/brand/logo.png',
  },
  category: 'education',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B0B14',
  colorScheme: 'dark light',
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
        {/* Global JSON-LD Structured Data for Google & Bing */}
        <JsonLd schema={getOrganizationSchema()} />
        <JsonLd schema={getWebApplicationSchema()} />
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
