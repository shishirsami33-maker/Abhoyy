'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { PRICES, BRAND_NAME } from '@/config';
import { formatPrice, toBanglaDigits } from '@/lib/utils';

export function PricingTeaserSection() {
  const { t, locale } = useLanguage();

  const plans = [
    {
      id: 'free',
      name: t('pricing.freePlan'),
      priceDisplay: formatPrice(PRICES.free, locale),
      credits: 1,
      desc: t('pricing.firstFreeDesc'),
      features: [
        locale === 'bn' ? '১টি পূর্ণাঙ্গ এআই মক সেশন' : '1 full AI mock session (up to 20 min)',
        locale === 'bn' ? 'সম্পূর্ণ স্পিচ ও কন্টেন্ট রিপোর্ট' : 'Full speech & content report',
        locale === 'bn' ? 'ইংরেজি, বাংলা বা মিশ্র ভাষা' : 'English, Bangla or Mixed mode',
        locale === 'bn' ? 'কার্ড বা পেমেন্ট তথ্য লাগবে না' : 'No credit card or bKash needed',
      ],
      popular: false,
      ctaText: t('pricing.getStarted'),
      ctaLink: '/signup',
      variant: 'secondary' as const,
    },
    {
      id: 'single',
      name: t('pricing.singlePlan'),
      priceDisplay: formatPrice(PRICES.single, locale),
      credits: 1,
      desc: t('pricing.singleDesc'),
      features: [
        locale === 'bn' ? '১টি অতিরিক্ত মক ক্রেডিট' : '1 additional mock credit',
        locale === 'bn' ? 'সিভি ও সার্কুলারভিত্তিক প্রশ্ন' : 'Targeted circular & CV questions',
        locale === 'bn' ? 'টাইমস্ট্যাম্পড দুর্বলতা চিহ্নিতকরণ' : 'Timestamped filler word & pacing stats',
        locale === 'bn' ? '৭ দিন পর্যন্ত ড্রাফট ও রিপোর্ট রিভ্যু' : '7-day session validity',
      ],
      popular: false,
      ctaText: t('pricing.buyPlan'),
      ctaLink: '/checkout?plan=single',
      variant: 'secondary' as const,
    },
    {
      id: 'pack',
      name: t('pricing.packPlan'),
      priceDisplay: formatPrice(PRICES.pack, locale),
      credits: 4,
      desc: t('pricing.packDesc'),
      features: [
        locale === 'bn' ? '৪টি পূর্ণাঙ্গ মক ক্রেডিট' : '4 full mock interview credits',
        locale === 'bn' ? 'সকল ইন্টারভিউ মোড আনলক' : 'All viva & interview modes unlocked',
        locale === 'bn' ? 'সেশনভিত্তিক প্রগ্রেস ট্র্যাকিং' : 'Progress improvement across sessions',
        locale === 'bn' ? 'অগ্রাধিকার ভিত্তিতে সাপোর্ট' : 'Priority support & feedback analysis',
      ],
      popular: true,
      ctaText: t('pricing.buyPlan'),
      ctaLink: '/checkout?plan=pack',
      variant: 'volt' as const,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-ink-900 text-paper border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4">
            {t('pricing.badge')}
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
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-ink-800 border-2 border-volt-400 shadow-volt-glow'
                  : 'bg-ink-800/80 border border-gray-700 shadow-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {t('pricing.popular')}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-paper mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-300 mb-6 leading-relaxed">{plan.desc}</p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-gray-700">
                  <span className="text-4xl sm:text-5xl font-black text-paper">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-xs text-gray-400">
                    / {locale === 'bn' ? toBanglaDigits(plan.credits) : plan.credits} {t('pricing.creditsCount')}
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
                <Link href={plan.ctaLink} className="w-full">
                  <Button
                    variant={plan.popular ? 'volt' : 'secondary'}
                    size="md"
                    className="w-full gap-2"
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison against coaching & bKash Note */}
        <div className="p-6 sm:p-8 rounded-2xl bg-ink-800/60 border border-gray-700/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-300">
          <p className="max-w-2xl leading-relaxed">
            <span className="font-bold text-paper">
              {locale === 'bn' ? 'কোচিং সেন্টারের সাথে তুলনা: ' : 'Comparison with Physical Coaching: '}
            </span>
            {t('pricing.coachingComparison')}
          </p>
          <div className="shrink-0 flex items-center gap-2 font-bold text-volt-400 bg-ink-900 px-4 py-2.5 rounded-xl border border-gray-700">
            <span>{t('pricing.bkashNote')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
