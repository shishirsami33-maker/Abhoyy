'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Landmark, Building2, Check } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function AudienceSection() {
  const { t } = useLanguage();

  const personas = [
    {
      icon: <GraduationCap className="w-6 h-6 text-violet-600" />,
      titleKey: 'audience.students',
      descKey: 'audience.studentsDesc',
      tag: 'University Vivas & Defense',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-volt-500" />,
      titleKey: 'audience.graduates',
      descKey: 'audience.graduatesDesc',
      tag: 'Fresh Graduates & Entry Level',
    },
    {
      icon: <Landmark className="w-6 h-6 text-violet-600" />,
      titleKey: 'audience.bcs',
      descKey: 'audience.bcsDesc',
      tag: 'BCS & Public Service',
    },
    {
      icon: <Building2 className="w-6 h-6 text-volt-500" />,
      titleKey: 'audience.jobSeekers',
      descKey: 'audience.jobSeekersDesc',
      tag: 'Bank & Corporate MNCs',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-paper text-ink-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-bold text-xs uppercase tracking-wider mb-4">
            {t('audience.badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-ink-900 mb-4">
            {t('audience.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t('audience.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {personas.map((persona, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-card hover:shadow-lifted hover:border-violet-600/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
                  {persona.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full inline-block mb-3">
                  {persona.tag}
                </span>
                <h3 className="text-xl font-bold text-ink-900 mb-2">
                  {t(persona.titleKey)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(persona.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
