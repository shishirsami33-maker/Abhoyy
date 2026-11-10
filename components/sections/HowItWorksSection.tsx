'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, Target, Mic2, FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HowItWorksSection() {
  const { t, locale } = useLanguage();

  const steps = [
    {
      num: '01',
      titleKey: 'steps.step1',
      descKey: 'steps.step1Desc',
      icon: <FileUp className="w-6 h-6 text-paper" />,
      accent: 'bg-violet-600',
    },
    {
      num: '02',
      titleKey: 'steps.step2',
      descKey: 'steps.step2Desc',
      icon: <Target className="w-6 h-6 text-paper" />,
      accent: 'bg-violet-600',
    },
    {
      num: '03',
      titleKey: 'steps.step3',
      descKey: 'steps.step3Desc',
      icon: <Mic2 className="w-6 h-6 text-ink-900" />,
      accent: 'bg-volt-400',
    },
    {
      num: '04',
      titleKey: 'steps.step4',
      descKey: 'steps.step4Desc',
      icon: <FileText className="w-6 h-6 text-paper" />,
      accent: 'bg-violet-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-ink-900 text-paper border-b border-gray-800 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4">
            {t('steps.badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4">
            {t('steps.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            {t('steps.sub')}
          </p>
        </div>

        {/* 4 Steps Grid with connecting line on desktop */}
        <div className="relative mb-16">
          {/* Connecting Line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-violet-600 via-volt-400 to-violet-600 -translate-y-6 z-0 opacity-40" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="bg-ink-800/80 border border-gray-700/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-gray-500 hover:shadow-lifted transition-all backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-black text-gray-500">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-xl ${step.accent} flex items-center justify-center shadow-md`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-paper mb-2.5">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section bottom CTA */}
        <div className="flex justify-center">
          <Link href="/interview/new">
            <Button variant="volt" size="lg" className="gap-2">
              <span>{t('cta.primary')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

