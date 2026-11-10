import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/how-it-works',
          '/pricing',
          '/terms',
          '/privacy',
          '/refunds',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/interview/',
          '/checkout',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/how-it-works',
          '/pricing',
          '/terms',
          '/privacy',
          '/refunds',
        ],
        disallow: [
          '/dashboard',
          '/interview/',
          '/checkout',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/how-it-works',
          '/pricing',
          '/terms',
          '/privacy',
          '/refunds',
        ],
        disallow: [
          '/dashboard',
          '/interview/',
          '/checkout',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

