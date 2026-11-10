import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert English numbers to Bangla digits
export function toBanglaDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Format price with placeholder logic
export function formatPrice(price: number | null, locale: 'en' | 'bn'): string {
  if (price === null) {
    return locale === 'bn' ? '৳ XX' : '৳ XX';
  }
  if (price === 0) {
    return locale === 'bn' ? 'ফ্রি' : 'Free';
  }
  const formatted = price.toLocaleString('en-US');
  return locale === 'bn' ? `৳ ${toBanglaDigits(formatted)}` : `৳ ${formatted}`;
}

export function formatDate(isoString: string, locale: 'en' | 'bn'): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

