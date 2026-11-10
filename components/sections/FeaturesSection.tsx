'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  GitBranch,
  Languages,
  Activity,
  Video,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-violet-600" />,
      titleKey: 'features.cvTitle',
      descKey: 'features.cvDesc',
    },
    {
      icon: <GitBranch className="w-6 h-6 text-volt-500" />,
      titleKey: 'features.followupTitle',
      descKey: 'features.followupDesc',
    },
    {
      icon: <Languages className="w-6 h-6 text-violet-600" />,
      titleKey: 'features.languageTitle',
      descKey: 'features.languageDesc',
    },
    {
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      titleKey: 'features.flagsTitle',
      descKey: 'features.flagsDesc',
    },
    {
      icon: <Video className="w-6 h-6 text-violet-600" />,
      titleKey: 'features.recordingTitle',
      descKey: 'features.recordingDesc',
    },
    {
      icon: <Lock className="w-6 h-6 text-success-600" />,
      titleKey: 'features.privacyTitle',
      descKey: 'features.privacyDesc',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-paper text-ink-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-bold text-xs uppercase tracking-wider mb-4">
            {t('features.badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-ink-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t('features.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-card hover:shadow-lifted hover:border-violet-600/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-2.5">
                  {t(feat.titleKey)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(feat.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
