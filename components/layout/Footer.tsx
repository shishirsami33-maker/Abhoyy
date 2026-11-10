'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { BRAND_NAME, BRAND_NAME_BN } from '@/config';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-ink-900 border-t border-gray-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="inline-block text-paper" aria-label="Abhoyy">
              <Logo variant="full" size="md" className="text-paper" />
            </Link>
            <p className="text-gray-400 max-w-md text-sm sm:text-base leading-relaxed">
              {t('brand.tagline')}
            </p>

            {/* bKash Payment Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ink-700 border border-gray-700 text-xs text-gray-300 w-fit mt-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="font-semibold text-paper">bKash Verified Merchant</span>
              <span className="text-gray-500">|</span>
              <span>Instant Verification</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-paper font-bold text-sm tracking-wide uppercase">
              {t('footer.product')}
            </h4>
            <Link href="/how-it-works" className="hover:text-volt-400 transition-colors">
              {t('nav.howItWorks')}
            </Link>
            <Link href="/#interview-types" className="hover:text-volt-400 transition-colors">
              {t('nav.types')}
            </Link>
            <Link href="/pricing" className="hover:text-volt-400 transition-colors">
              {t('nav.pricing')}
            </Link>
            <Link href="/#faq" className="hover:text-volt-400 transition-colors">
              {t('nav.faq')}
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-paper font-bold text-sm tracking-wide uppercase">
              {t('footer.legal')}
            </h4>
            <Link href="/terms" className="hover:text-volt-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-volt-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refunds" className="hover:text-volt-400 transition-colors">
              Refund Policy
            </Link>
            <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-volt-400" />
              Private Practice Guaranteed
            </span>
          </div>
        </div>

        {/* Disclaimer Band */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 text-center md:text-left">
          <p className="max-w-2xl leading-relaxed">
            {t('footer.disclaimer')}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <span>{t('footer.madeInBd')}</span>
            <span className="hidden sm:inline text-gray-700">•</span>
            <span>&copy; {new Date().getFullYear()} {BRAND_NAME}.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
