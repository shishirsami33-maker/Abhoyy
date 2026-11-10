'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Sun,
  Smartphone,
  Volume2,
  TrendingUp,
  Wifi,
  ChevronDown,
  FileCheck2,
  Video,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function HowItWorksPage() {
  const { t, locale } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const prepChecklist = [
    {
      num: 1,
      icon: <Headphones className="w-6 h-6 text-violet-600" />,
      textKey: 'prep.1',
      whyKey: 'prep.why1',
    },
    {
      num: 2,
      icon: <Sun className="w-6 h-6 text-volt-500" />,
      textKey: 'prep.2',
      whyKey: 'prep.why2',
    },
    {
      num: 3,
      icon: <Smartphone className="w-6 h-6 text-violet-600" />,
      textKey: 'prep.3',
      whyKey: 'prep.why3',
    },
    {
      num: 4,
      icon: <Volume2 className="w-6 h-6 text-amber-500" />,
      textKey: 'prep.4',
      whyKey: 'prep.why4',
    },
    {
      num: 5,
      icon: <TrendingUp className="w-6 h-6 text-success-600" />,
      textKey: 'prep.5',
      whyKey: 'prep.why5',
    },
    {
      num: 6,
      icon: <Wifi className="w-6 h-6 text-violet-600" />,
      textKey: 'prep.6',
      whyKey: 'prep.why6',
    },
  ];

  return (
    <div className="flex-1 bg-paper text-ink-900">
      {/* Hero Header */}
      <section className="bg-ink-900 text-paper py-16 md:py-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('guidelines.heroBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4">
            {t('guidelines.heroTitle')}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('guidelines.heroSub')}
          </p>
        </div>
      </section>

      {/* 6 Preparation Guidance Interactive Cards */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-ink-900 mb-2">
            {t('prep.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('prep.sub')}
          </p>
        </div>

        <div className="space-y-4">
          {prepChecklist.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-white border-violet-600 shadow-lifted ring-1 ring-violet-600/20'
                    : 'bg-white border-gray-200 shadow-card hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 rounded-2xl"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Rule 0{item.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink-900 leading-snug">
                        {t(item.textKey)}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 sm:mt-0 transition-transform duration-200 ${
                      isExpanded ? 'bg-violet-600 text-paper rotate-180' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-100 flex items-start gap-3">
                          <span className="text-xs font-bold uppercase text-violet-700 bg-white px-2 py-0.5 rounded shadow-sm shrink-0">
                            Why it matters
                          </span>
                          <p className="text-ink-900 font-medium text-xs sm:text-sm">
                            {t(item.whyKey)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* What You Get Block */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-ink-900 mb-3">
              {t('guidelines.whatYouGetTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Every practice session produces measurable, verifiable diagnostic feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-paper border border-gray-200 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-paper flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">Timestamped Flag Report</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('guidelines.whatYouGet1')}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-gray-200 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-volt-400 text-ink-900 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">Private Video Playback</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('guidelines.whatYouGet2')}
                </p>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link href="/interview/new">
              <Button variant="primary" size="lg" className="gap-2">
                <span>{t('cta.primary')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">
                {t('nav.pricing')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
