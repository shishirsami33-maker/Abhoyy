'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import bn from '@/locales/bn.json';

type Locale = 'en' | 'bn';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, Record<string, any>> = {
  en,
  bn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'abhoyy:locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = 'en';
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const toggleLanguage = () => {
    const next = locale === 'en' ? 'bn' : 'en';
    setLocale(next);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let fallbackValue: any = translations.en;
        for (const fbK of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fbK in fallbackValue) {
            fallbackValue = fallbackValue[fbK];
          } else {
            fallbackValue = undefined;
            break;
          }
        }
        value = fallbackValue !== undefined ? fallbackValue : key;
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        value = (value as string).replace(new RegExp(`{${pKey}}`, 'g'), String(pVal));
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

