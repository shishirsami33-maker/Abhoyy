'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Gift,
  HelpCircle,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import {
  INDIVIDUAL_MOCK_PLANS,
  MINUTE_PACKAGES,
  FREE_MOCK_CONFIG,
  PURCHASED_MINUTES_EXPIRY_DAYS,
  RECORDING_RETENTION_DAYS,
  BRAND_NAME,
} from '@/config';
import { formatPrice, toBanglaDigits } from '@/lib/utils';
import { FaqSection } from '@/components/sections/FaqSection';

export function PricingClient() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'packages' | 'individual'>('packages');

  return (
    <div className="flex-1 bg-paper text-ink-900">
      {/* Hero Header */}
      <section className="bg-ink-900 text-paper py-16 md:py-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('pricing.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4 leading-tight">
            {t('pricing.title')}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('pricing.sub')}
          </p>

          {/* Pricing Category Switcher */}
          <div className="inline-flex items-center bg-ink-800 p-1.5 rounded-full border border-gray-700/80 shadow-md">
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-volt-400 text-ink-900 shadow-volt-glow'
                  : 'text-gray-300 hover:text-paper'
              }`}
            >
              {t('pricing.tabPackages')} (30–100 mins)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-volt-400 text-ink-900 shadow-volt-glow'
                  : 'text-gray-300 hover:text-paper'
              }`}
            >
              {t('pricing.tabIndividual')} (10–20 mins)
            </button>
          </div>
        </div>
      </section>

      {/* Free Welcome Mock Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-ink-900 text-paper p-5 sm:p-6 border border-violet-500/40 shadow-lifted flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-volt-400 text-ink-900 flex items-center justify-center shrink-0 font-black shadow-md">
              <Gift className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-volt-400 bg-ink-900/60 px-2.5 py-0.5 rounded-full">
                  {t('pricing.freeMock.badge')}
                </span>
                <span className="text-xs text-gray-300">5 Mins • ৳0</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-paper mt-0.5">
                {t('pricing.freeMock.title')}
              </h3>
              <p className="text-xs text-gray-300">
                {t('pricing.freeMock.desc')}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link href="/signup">
              <Button variant="volt" size="sm" className="w-full sm:w-auto font-black text-xs px-5">
                <span>{t('pricing.getStarted')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pricing Grids */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: Minute Packages */}
          {activeTab === 'packages' && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 mb-2">
                  {t('pricing.tabPackages')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                  {locale === 'bn'
                    ? 'মিনিট ওয়ালেট ব্যালেন্স কিনুন। আপনার সুবিধা অনুযায়ী ৫, ১০, ১৫ বা ২০ মিনিটের সেশনে ব্যবহার করুন।'
                    : 'Add practice minutes to your wallet. Spend across flexible 5, 10, 15, or 20-minute sessions.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
                {MINUTE_PACKAGES.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className={`rounded-3xl p-7 flex flex-col justify-between relative transition-all ${
                      pkg.isBestValue
                        ? 'bg-ink-900 text-paper border-2 border-volt-400 shadow-volt-glow'
                        : 'bg-white text-ink-900 border border-gray-200 shadow-card hover:shadow-lifted'
                    }`}
                  >
                    {pkg.isBestValue && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('pricing.popular')}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className={`text-2xl font-black ${pkg.isBestValue ? 'text-paper' : 'text-ink-900'}`}>
                          {t(pkg.nameKey)}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            pkg.isBestValue ? 'bg-ink-800 text-volt-400 border border-gray-700' : 'bg-violet-100 text-violet-700'
                          }`}
                        >
                          {locale === 'bn' ? toBanglaDigits(pkg.includedMinutes) : pkg.includedMinutes} Mins
                        </span>
                      </div>

                      <p className={`text-xs mb-6 leading-relaxed ${pkg.isBestValue ? 'text-gray-300' : 'text-gray-600'}`}>
                        {pkg.id === 'starter'
                          ? t('pricing.packages.starterDesc')
                          : pkg.id === 'practice'
                          ? t('pricing.packages.practiceDesc')
                          : t('pricing.packages.careerBuilderDesc')}
                      </p>

                      <div
                        className={`flex items-baseline gap-1.5 mb-6 pb-6 border-b ${
                          pkg.isBestValue ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <span className={`text-4xl sm:text-5xl font-black ${pkg.isBestValue ? 'text-paper' : 'text-ink-900'}`}>
                          {formatPrice(pkg.price, locale)}
                        </span>
                        <span className={`text-xs font-semibold ${pkg.isBestValue ? 'text-gray-400' : 'text-gray-500'}`}>
                          / {locale === 'bn' ? toBanglaDigits(pkg.includedMinutes) : pkg.includedMinutes} {t('pricing.creditsCount')}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                        <li className={`flex items-start gap-2.5 ${pkg.isBestValue ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? `${toBanglaDigits(pkg.includedMinutes)} মিনিট লাইভ এআই ভাইভা অনুশীলন`
                              : `${pkg.includedMinutes} minutes of spoken AI viva practice`}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${pkg.isBestValue ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'মিনিটের মেয়াদ ৯০ দিন (কোনো অটো-রিনিউয়াল নেই)'
                              : 'Valid for 90 days. No recurring subscriptions'}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${pkg.isBestValue ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'প্রতিটি সেশনের পর সম্পূর্ণ এআই বিশ্লেষণ ও রিপোর্ট'
                              : 'Full AI diagnostic feedback report after every mock'}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${pkg.isBestValue ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'রেকর্ডিং ঐচ্ছিক ও ডাউনলোডের পর স্থায়ীভাবে মুছে যায়'
                              : 'Optional recording (purged immediately upon download)'}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <Link href={`/checkout?plan=${pkg.id}&type=package`}>
                        <Button
                          variant={pkg.isBestValue ? 'volt' : 'primary'}
                          size="md"
                          className="w-full gap-2 font-black"
                        >
                          <span>{t('pricing.buyPlan')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Individual Mock Interviews */}
          {activeTab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 mb-2">
                  {t('pricing.individual.title')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                  {t('pricing.individual.sub')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
                {INDIVIDUAL_MOCK_PLANS.map((plan) => (
                  <div
                    key={plan.durationMinutes}
                    className={`rounded-3xl p-7 flex flex-col justify-between relative transition-all ${
                      plan.isRecommended
                        ? 'bg-ink-900 text-paper border-2 border-volt-400 shadow-volt-glow'
                        : 'bg-white text-ink-900 border border-gray-200 shadow-card hover:shadow-lifted'
                    }`}
                  >
                    {plan.isRecommended && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('pricing.recommended')}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className={`text-2xl font-black ${plan.isRecommended ? 'text-paper' : 'text-ink-900'}`}>
                          {plan.durationMinutes} Mins Mock
                        </h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            plan.isRecommended ? 'bg-ink-800 text-volt-400 border border-gray-700' : 'bg-violet-100 text-violet-700'
                          }`}
                        >
                          Single Mock
                        </span>
                      </div>

                      <p className={`text-xs mb-6 leading-relaxed ${plan.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                        {plan.durationMinutes === 10
                          ? t('pricing.individual.10Desc')
                          : plan.durationMinutes === 15
                          ? t('pricing.individual.15Desc')
                          : t('pricing.individual.20Desc')}
                      </p>

                      <div
                        className={`flex items-baseline gap-1.5 mb-6 pb-6 border-b ${
                          plan.isRecommended ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <span className={`text-4xl sm:text-5xl font-black ${plan.isRecommended ? 'text-paper' : 'text-ink-900'}`}>
                          {formatPrice(plan.price, locale)}
                        </span>
                        <span className={`text-xs font-semibold ${plan.isRecommended ? 'text-gray-400' : 'text-gray-500'}`}>
                          / {locale === 'bn' ? toBanglaDigits(plan.durationMinutes) : plan.durationMinutes} {t('pricing.creditsCount')}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                        <li className={`flex items-start gap-2.5 ${plan.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? `১টি পূর্ণাঙ্গ ${toBanglaDigits(plan.durationMinutes)} মিনিটের লাইভ মক সেশন`
                              : `1 full ${plan.durationMinutes}-minute live mock viva session`}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${plan.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'সিভি ও নির্দিষ্ট চাকরির সার্কুলার বিশ্লেষণ'
                              : 'CV & targeted job circular analysis'}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${plan.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'STAR মেথড অনুসরণ করে এআই ফিডব্যাক রিপোর্ট'
                              : 'STAR method AI diagnostic feedback report'}
                          </span>
                        </li>
                        <li className={`flex items-start gap-2.5 ${plan.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Check className="w-4 h-4 text-volt-500 shrink-0 mt-0.5" />
                          <span>
                            {locale === 'bn'
                              ? 'বিকাশের মাধ্যমে সরাসরি ইনস্ট্যান্ট পেমেন্ট'
                              : 'Instant direct checkout via bKash'}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <Link href={`/checkout?plan=individual_${plan.durationMinutes}&type=individual`}>
                        <Button
                          variant={plan.isRecommended ? 'volt' : 'primary'}
                          size="md"
                          className="w-full gap-2 font-black"
                        >
                          <span>{t('pricing.buyPlan')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Value Reassurance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 mb-1">90-Day Minute Validity</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t('pricing.validityNotice')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 mb-1">Zero Deductions on Open</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Minutes are deducted only when you enter the live interview room.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink-900 mb-1">Private by Design</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t('pricing.recordingNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* Coaching Comparison Banner */}
        <div className="mt-12 rounded-3xl bg-ink-900 text-paper p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lifted">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-volt-400 text-ink-900 flex items-center justify-center shrink-0 font-black">
              <Smartphone className="w-6 h-6 text-ink-900" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-paper mb-1">bKash Instant Verification</h4>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                {t('pricing.bkashNote')}
              </p>
            </div>
          </div>

          <Link href="/checkout?plan=career_builder&type=package" className="shrink-0 w-full sm:w-auto">
            <Button variant="volt" size="md" className="w-full sm:w-auto font-black text-xs sm:text-sm">
              Top up minutes with bKash
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
