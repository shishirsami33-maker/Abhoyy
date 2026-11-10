'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function CtaBandSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-ink-900 text-paper relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Risk • Practice Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-paper mb-6">
          {t('ctaBand.title')}
        </h2>

        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('ctaBand.sub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button variant="volt" size="lg" className="w-full sm:w-auto gap-2 group">
              <span>{t('ctaBand.button')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {t('cta.secondary')}
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-success-500" />
          <span>No credit card required. First mock is 100% free.</span>
        </div>
      </div>
    </section>
  );
}
