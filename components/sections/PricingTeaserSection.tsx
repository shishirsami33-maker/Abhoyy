'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Clock, ShieldCheck, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import {
  INDIVIDUAL_MOCK_PRICES,
  MINUTE_PACKAGES,
  FREE_MOCK_CONFIG,
  BRAND_NAME,
} from '@/config';
import { formatPrice, toBanglaDigits } from '@/lib/utils';

export function PricingTeaserSection() {
  const { t, locale } = useLanguage();

  const previewPlans = [
    {
      id: 'free',
      name: locale === 'bn' ? '৫ মিনিটের ফ্রি মক' : '5-Min Free Viva',
      priceDisplay: formatPrice(0, locale),
      minutes: 5,
      desc: locale === 'bn' ? 'যাচাইকৃত নতুন একাউন্টের জন্য একবার প্রযোজ্য।' : 'For newly verified accounts. Zero card needed.',
      features: [
        locale === 'bn' ? '৫ মিনিট লাইভ স্পোকেন ভাইভা' : '5-minute live spoken AI viva',
        locale === 'bn' ? 'প্রাথমিক এআই ডায়াগনস্টিক রিপোর্ট' : 'Basic AI diagnostic performance report',
        locale === 'bn' ? 'সিভি আপলোড ও সার্কুলার লিংক' : 'CV upload & targeted topic context',
        locale === 'bn' ? 'কোনো পেমেন্ট তথ্য লাগবে না' : 'No payment info required',
      ],
      popular: false,
      ctaText: t('pricing.getStarted'),
      ctaLink: '/signup',
      variant: 'secondary' as const,
    },
    {
      id: 'single_15',
      name: locale === 'bn' ? '১৫ মিনিটের সিঙ্গেল মক' : '15-Min Single Mock',
      priceDisplay: formatPrice(INDIVIDUAL_MOCK_PRICES[15], locale),
      minutes: 15,
      desc: locale === 'bn' ? 'প্রস্তাবিত ডিফল্ট অপশন। পূর্ণাঙ্গ ভাইভা সিমুলেশন।' : 'Recommended default option. Complete viva simulation.',
      features: [
        locale === 'bn' ? '১৫ মিনিট লাইভ স্পোকেন ইন্টারভিউ' : '15 minutes live spoken interview',
        locale === 'bn' ? 'STAR মেথডে ফলো-আপ ও গভীর প্রশ্ন' : 'STAR framework follow-up probing',
        locale === 'bn' ? 'টাইমস্ট্যাম্পড দুর্বলতা ও ফিলার অ্যানালাইসিস' : 'Timestamped pacing & filler breakdown',
        locale === 'bn' ? 'সরাসরি বিকাশ পেমেন্ট' : 'Instant direct checkout via bKash',
      ],
      popular: false,
      isRecommended: true,
      ctaText: locale === 'bn' ? 'মক শুরু করুন' : 'Start 15-min mock',
      ctaLink: '/checkout?plan=individual_15&type=individual',
      variant: 'secondary' as const,
    },
    {
      id: 'career_builder',
      name: locale === 'bn' ? 'ক্যারিয়ার বিল্ডার প্যাক' : 'Career Builder Pack',
      priceDisplay: formatPrice(599, locale),
      minutes: 100,
      desc: locale === 'bn' ? '১০০ মিনিট ব্যালেন্স। বিসিএস ও চাকরির জন্য সেরা সাশ্রয়ী।' : '100 minutes wallet balance. Best value for multi-round preparation.',
      features: [
        locale === 'bn' ? '১০০ মিনিট লাইভ এআই ভাইভা ব্যালেন্স' : '100 minutes live AI interview balance',
        locale === 'bn' ? 'মিনিটের মেয়াদ ৯০ দিন পর্যন্ত' : 'Purchased minutes valid for 90 days',
        locale === 'bn' ? 'সেশনভিত্তিক উন্নতি তুলনা ও গ্রাফ' : 'Cross-session improvement analytics',
        locale === 'bn' ? 'ঐচ্ছিক রেকর্ডিং (ডাউনলোডে মুছে যায়)' : 'Optional recording (purged on download)',
      ],
      popular: true,
      ctaText: locale === 'bn' ? 'প্যাকেজ কিনুন' : 'Get Career Builder',
      ctaLink: '/checkout?plan=career_builder&type=package',
      variant: 'volt' as const,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-ink-900 text-paper border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('pricing.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            {t('pricing.sub')}
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {previewPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-7 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-ink-800 border-2 border-volt-400 shadow-volt-glow'
                  : 'bg-ink-800/80 border border-gray-700 shadow-card hover:border-gray-500'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('pricing.popular')}</span>
                </div>
              )}

              {plan.isRecommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-paper text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {t('pricing.recommended')}
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold text-paper">{plan.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-ink-900 border border-gray-700 text-volt-400">
                    {locale === 'bn' ? toBanglaDigits(plan.minutes) : plan.minutes} Mins
                  </span>
                </div>

                <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-gray-700">
                  <span className="text-4xl sm:text-5xl font-black text-paper">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    / {locale === 'bn' ? toBanglaDigits(plan.minutes) : plan.minutes} {t('pricing.creditsCount')}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <Check className="w-4 h-4 text-volt-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link href={plan.ctaLink}>
                  <Button
                    variant={plan.popular ? 'volt' : 'secondary'}
                    size="md"
                    className="w-full gap-2 font-bold"
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Pricing Details Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-ink-800/60 border border-gray-800 text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-volt-400 shrink-0" />
            <span>Purchased minutes expire after 90 days. No recurring subscriptions or automatic renewals.</span>
          </div>

          <Link href="/pricing" className="text-volt-400 font-bold hover:underline shrink-0">
            View full pricing breakdown & individual options &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
