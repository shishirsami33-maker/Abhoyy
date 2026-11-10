'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    {
      textKey: 'testimonials.card1Text',
      authorKey: 'testimonials.card1Author',
      orgKey: 'testimonials.card1Org',
    },
    {
      textKey: 'testimonials.card2Text',
      authorKey: 'testimonials.card2Author',
      orgKey: 'testimonials.card2Org',
    },
    {
      textKey: 'testimonials.card3Text',
      authorKey: 'testimonials.card3Author',
      orgKey: 'testimonials.card3Org',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-paper text-ink-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-bold text-xs uppercase tracking-wider mb-4">
            {t('testimonials.badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-ink-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            {t('testimonials.sub')}
          </p>

          {/* Prominent rule-compliant placeholder banner */}
          <div className="inline-flex items-center gap-2 p-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('testimonials.placeholderNote')}</span>
          </div>
        </div>

        {/* 3 Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 shadow-card flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-violet-100 mb-4" />
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;{t(card.textKey)}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-ink-900">{t(card.authorKey)}</p>
                <p className="text-xs text-gray-500">{t(card.orgKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

