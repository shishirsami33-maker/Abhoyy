'use client';

import React from 'react';
import { GraduationCap, Briefcase, Landmark, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function InterviewTypesMarquee() {
  const { locale } = useLanguage();

  const types = [
    {
      icon: <GraduationCap className="w-5 h-5 text-volt-400" />,
      en: 'University Viva & Defense',
      bn: 'বিশ্ববিদ্যালয় ভাইভা ও থিসিস ডিফেন্স',
      subEn: 'Semester vivas, graduation defense, club elections',
      subBn: 'সেমিস্টার ভাইভা, থিসিস উপস্থাপনা',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-violet-600" />,
      en: 'Corporate Job Interviews',
      bn: 'করপোরেট চাকরি ও স্টার্টআপ',
      subEn: 'Software, marketing, management, operations',
      subBn: 'আইটি, মার্কেটিং ও ম্যানেজমেন্ট ইন্টারভিউ',
    },
    {
      icon: <Landmark className="w-5 h-5 text-volt-400" />,
      en: 'BCS Viva & Govt Boards',
      bn: 'বিসিএস ভাইভা ও সরকারি চাকরি',
      subEn: 'Administration, Police, Foreign Affairs, Education',
      subBn: 'প্রশাসন, পুলিশ, পররাষ্ট্র ও শিক্ষা ক্যাডার',
    },
    {
      icon: <Building2 className="w-5 h-5 text-violet-600" />,
      en: 'Bank & MNC Panels',
      bn: 'ব্যাংক ও বহুজাতিক প্রতিষ্ঠান (MNC)',
      subEn: 'MTO assessment, case studies, situational vivas',
      subBn: 'এমটিও পরীক্ষা, কেস স্টাডি ও কম্পিটেন্সি প্যানেল',
    },
  ];

  // Duplicate for seamless infinite marquee loop
  const duplicated = [...types, ...types];

  return (
    <section id="interview-types" className="py-8 bg-ink-900 border-b border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest font-extrabold text-gray-400">
          {locale === 'bn' ? 'যেকোনো ভাইভা ও ইন্টারভিউয়ের জন্য প্রস্তুত থাকুন' : 'Tailored Practice Modes Available'}
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Left & Right gradient fade masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 sm:gap-6 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {duplicated.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3.5 px-5 py-3 rounded-xl bg-ink-800/90 border border-gray-700/80 text-paper shrink-0 shadow-sm hover:border-gray-500 transition-colors"
            >
              <div className="p-2 rounded-lg bg-ink-700">{item.icon}</div>
              <div className="text-left">
                <p className="text-sm font-bold tracking-tight text-paper">
                  {locale === 'bn' ? item.bn : item.en}
                </p>
                <p className="text-xs text-gray-400">
                  {locale === 'bn' ? item.subBn : item.subEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
