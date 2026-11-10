export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhoyy.com';

export const SEO_CONFIG = {
  siteName: 'Abhoyy',
  siteNameBn: 'অভয়',
  defaultTitle: 'Abhoyy — Walk in fearless | Bangladesh-first AI Mock Interview & Viva',
  titleTemplate: '%s | Abhoyy (অভয়)',
  defaultDescription:
    'Abhoyy (অভয়) is Bangladesh’s first AI mock interview and viva preparation platform. Upload your CV, target any job circular or university viva, and speak directly to an AI board tuned for Bangladeshi standards.',
  defaultDescriptionBn:
    'অভয় (Abhoyy) বাংলাদেশের প্রথম এআই মক ইন্টারভিউ ও ভাইভা প্ল্যাটফর্ম। সিভি দিন, চাকরির সার্কুলার দিন এবং বাস্তব অভিজ্ঞ এআই বোর্ডের সাথে মুখোমুখি কথা বলে জড়তা দূর করুন।',
  keywords: [
    'Abhoyy',
    'অভয়',
    'AI mock interview Bangladesh',
    'viva preparation Bangladesh',
    'BCS viva preparation',
    'বিসিএস ভাইভা প্রস্তুতি',
    'mock viva practice',
    'job interview practice Dhaka',
    'fresh graduate interview preparation',
    'university viva defense',
    'bank viva MTO',
    'Bangla AI interview',
    'CV based interview questions',
    'bKash payment mock interview',
  ],
  author: 'Abhoyy Technologies',
  twitterHandle: '@AbhoyyAI',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-placeholder-code',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || 'msvalidate-placeholder-code',
  },
};

// JSON-LD Structured Data Generators for SEO
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Abhoyy',
    alternateName: 'অভয়',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    description: SEO_CONFIG.defaultDescription,
    sameAs: [
      'https://www.facebook.com/abhoyy.bd',
      'https://www.linkedin.com/company/abhoyy',
      'https://twitter.com/AbhoyyAI',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1800-ABHOYY',
      contactType: 'customer support',
      areaServed: 'BD',
      availableLanguage: ['Bengali', 'English'],
    },
  };
}

export function getWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Abhoyy AI Mock Interview & Viva',
    alternateName: 'অভয় এআই মক ভাইভা',
    url: SITE_URL,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All modern web browsers (Chrome, Safari, Edge, Android, iOS)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BDT',
      category: 'Free First Mock Available',
    },
    description: SEO_CONFIG.defaultDescription,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
  };
}

export function getFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the Abhoyy AI mock interview work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload your CV and select your target job or university viva syllabus. Our AI evaluates your credentials, generates tailored questions, listens to your spoken answers in real-time, asks contextual follow-ups, and delivers a diagnostic report with timestamped feedback.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I speak in Bangla or a mix of Bangla and English (Banglish)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Abhoyy is tuned specifically for Bangladesh. You can speak in full formal English, full standard Bangla, or conversational mixed Bengali-English (Banglish) code-switching.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the first mock interview completely free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every candidate receives their first full AI mock interview session up to 20 minutes with a diagnostic feedback report completely free. No credit card or payment info required.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I pay with bKash for extra mock packs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At checkout, select your pack, send money to our verified bKash merchant number, and enter your transaction ID (TrxID) for instant credit verification.',
        },
      },
    ],
  };
}

