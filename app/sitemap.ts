import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${SITE_URL}`,
          bn: `${SITE_URL}`,
          'x-default': `${SITE_URL}`,
        },
      },
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${SITE_URL}/how-it-works`,
          bn: `${SITE_URL}/how-it-works`,
        },
      },
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${SITE_URL}/pricing`,
          bn: `${SITE_URL}/pricing`,
        },
      },
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/refunds`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}

