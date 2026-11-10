import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Abhoyy — Walk in fearless | Bangladesh-first AI Mock Interview & Viva',
    short_name: 'Abhoyy',
    description:
      'Practice oral mock interviews and vivas with an AI panel tuned for Bangladesh universities, companies, and BCS boards.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0B14',
    theme_color: '#0B0B14',
    icons: [
      {
        src: '/brand/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

