'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, ShieldAlert, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { PRICES, BRAND_NAME } from '@/config';
import { formatPrice, toBanglaDigits } from '@/lib/utils';
import { FaqSection } from '@/components/sections/FaqSection';

export default function PricingPage() {
  const { t, locale } = useLanguage();

  const plans = [
    {
      id: 'free',
      name: t('pricing.freePlan'),
      priceDisplay: formatPrice(PRICES.free, locale),
      credits: 1,
      desc: t('pricing.firstFreeDesc'),
      features: [
        locale === 'bn' ? '১টি পূর্ণাঙ্গ এআই মক সেশন (২০ মিনিট পর্যন্ত)' : '1 full AI mock session (up to 20 min)',
        locale === 'bn' ? 'সিভি বিশ্লেষণ ও কাস্টম প্রশ্ন' : 'CV analysis & custom questions',
        locale === 'bn' ? 'সম্পূর্ণ স্পিচ ও কন্টেন্ট ডায়াগনস্টিক রিপোর্ট' : 'Full speech & content diagnostic report',
        locale === 'bn' ? 'ইংরেজি, বাংলা বা মিশ্র ভাষা মোড' : 'English, Bangla or Mixed mode',
        locale === 'bn' ? 'পেমেন্ট তথ্যের কোনো প্রয়োজন নেই' : 'No credit card or bKash needed',
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
        locale === 'bn' ? 'সুনির্দিষ্ট সার্কুলার ও পদের ওপর ভিত্তি করে প্রস্তুতি' : 'Targeted circular & job viva practice',
        locale === 'bn' ? 'টাইমস্ট্যাম্পড দুর্বলতা ও ফিলার ওয়ার্ড চিহ্নিতকরণ' : 'Timestamped filler word & pacing stats',
        locale === 'bn' ? '৭ দিন পর্যন্ত ড্রাফট ও সেশন অ্যাক্সেস' : '7-day session validity',
        locale === 'bn' ? 'প্রাইভেট ভিডিও রেকর্ডিং প্লেব্যাক' : 'Private video recording playback',
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
        locale === 'bn' ? '৪টি পূর্ণাঙ্গ মক ক্রেডিট (সেরা সাশ্রয়)' : '4 full mock interview credits (best value)',
        locale === 'bn' ? 'সকল ইন্টারভিউ মোড (বিসিএস, করপোরেট, ভাইভা) আনলক' : 'All viva & interview modes unlocked',
        locale === 'bn' ? 'সেশনভিত্তিক প্রগ্রেস ট্র্যাকিং ও তুলনা' : 'Progress improvement across sessions',
        locale === 'bn' ? 'অগ্রাধিকার ভিত্তিতে ফিডব্যাক ও সহায়তা' : 'Priority feedback analysis & support',
        locale === 'bn' ? 'বিকাশের মাধ্যমে দ্রুত যাচাই' : 'Instant bKash payment verification',
      ],
      popular: true,
      ctaText: t('pricing.buyPlan'),
      ctaLink: '/checkout?plan=pack',
      variant: 'volt' as const,
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
            <span>{t('pricing.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('pricing.sub')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-ink-900 text-paper border-2 border-volt-400 shadow-volt-glow'
                  : 'bg-white text-ink-900 border border-gray-200 shadow-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {t('pricing.popular')}
                </div>
              )}

              <div>
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-paper' : 'text-ink-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mb-6 leading-relaxed ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.desc}
                </p>

                <div
                  className={`flex items-baseline gap-1.5 mb-6 pb-6 border-b ${
                    plan.popular ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <span className={`text-4xl sm:text-5xl font-black ${plan.popular ? 'text-paper' : 'text-ink-900'}`}>
                    {plan.priceDisplay}
                  </span>
                  <span className={`text-xs ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    / {locale === 'bn' ? toBanglaDigits(plan.credits) : plan.credits} {t('pricing.creditsCount')}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                        plan.popular ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link href={plan.ctaLink} className="w-full">
                  <Button
                    variant={plan.popular ? 'volt' : 'primary'}
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

        {/* Clear Policy Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-card text-xs sm:text-sm text-gray-600 mb-16">
          <div>
            <h4 className="font-bold text-ink-900 mb-1">What is 1 Mock Credit?</h4>
            <p className="leading-relaxed">
              One full practice interview session up to 20 minutes with real-time AI panel questions and a full diagnostic feedback report.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink-900 mb-1">Credit Expiry</h4>
            <p className="leading-relaxed">
              Unused credits remain valid for 90 days from purchase date. Practice anytime from any device.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink-900 mb-1">Fair Refund Policy</h4>
            <p className="leading-relaxed">
              If a session fails due to a technical error on our side, your credit is automatically restored. Read our{' '}
              <Link href="/refunds" className="text-violet-600 font-bold underline">
                Refund Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* Coaching Comparison Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-ink-900 text-paper flex flex-col md:flex-row items-center justify-between gap-6 shadow-lifted">
          <div className="max-w-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-paper mb-1">
              {locale === 'bn' ? 'কোচিং সেন্টারের তুলনায় সাশ্রয়ী ও শান্ত পরিবেশ' : 'Calm, private practice without coaching center costs'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {t('pricing.coachingComparison')}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 font-bold text-volt-400 bg-ink-800 px-4 py-2.5 rounded-xl border border-gray-700 text-sm">
            <span>{t('pricing.bkashNote')}</span>
          </div>
        </div>
      </section>

      {/* FAQ on pricing */}
      <FaqSection />
    </div>
  );
}
