'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { Volume2, BrainCircuit, HeartPulse, CheckCircle2 } from 'lucide-react';

export function ProblemSection() {
  const { t, locale } = useLanguage();

  const problemCards = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-violet-600" />,
      titleEn: 'The Sudden Blank Mind',
      titleBn: 'হঠাৎ মাথা ফাঁকা হয়ে যাওয়া',
      descEn: 'You studied the technical topics for hours, but under sudden board pressure, structured thoughts scatter.',
      descBn: 'সব জানা প্রশ্ন, কিন্তু প্যানেল সদস্যদের গম্ভীর চাহনির সামনে সাজিয়ে কথা বলা অসম্ভব মনে হয়।',
    },
    {
      icon: <Volume2 className="w-6 h-6 text-amber-500" />,
      titleEn: 'The Shaky, Hesitant Voice',
      titleBn: 'গলা কাঁপা ও নার্ভাস সুর',
      descEn: 'Anxiety makes answers sound uncertain, rushed, or cluttered with repetitive filler words.',
      descBn: 'ভেতরের নার্ভাসনেসের কারণে কণ্ঠ নিচু হয়ে যায় এবং অনর্থক ফিলার শব্দ বারবার চলে আসে।',
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-violet-600" />,
      titleEn: 'The Pressure of the First Mistake',
      titleBn: 'প্রথম ভুলের পরেই আত্মবিশ্বাস হারানো',
      descEn: 'One awkward answer throws off the entire rest of the viva, even when you know subsequent answers.',
      descBn: 'একটি সম্পূরক প্রশ্নের উত্তর আটকে গেলেই পুরো ভাইভা খারাপ হয়ে যাওয়ার ভয় কাজ করে।',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-paper text-ink-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-bold text-xs uppercase tracking-wider mb-4">
            {t('problem.badge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-ink-900 mb-6">
            {t('problem.title')}
          </h2>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal">
            {t('problem.body')}
          </p>
        </div>

        {/* 3 Relatable Pain-Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {problemCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-card hover:shadow-lifted hover:border-violet-600/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-3">
                  {locale === 'bn' ? card.titleBn : card.titleEn}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {locale === 'bn' ? card.descBn : card.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Solution Banner */}
        <div className="rounded-2xl bg-ink-900 text-paper p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-volt-400 text-ink-900 flex items-center justify-center shrink-0 font-black">
              <CheckCircle2 className="w-6 h-6 text-ink-900" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-paper">
                {locale === 'bn'
                  ? 'সমাধান: বারবার নিভৃতে অনুশীলন ও ভুল সংশোধন'
                  : 'The proven antidote is low-stakes, repeatable practice.'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-300">
                {locale === 'bn'
                  ? 'কোনো লজ্জা নেই, কোনো বিচার নেই। যতবার ইচ্ছা বলুন, এআই আপনার প্রতিটি ভুল চিহ্নিত করে দেবে।'
                  : 'Zero judgment, zero cost for mistakes. Speak until the panic completely fades away.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
