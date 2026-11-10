'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Mic, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Orb } from '@/components/ui/Orb';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { FREE_FIRST_MOCK } from '@/config';

export function HeroSection() {
  const { t, locale } = useLanguage();
  const [orbState, setOrbState] = useState<'speaking' | 'listening'>('speaking');

  // Cycle orb state every 4 seconds to simulate active interview dialogue
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbState((prev) => (prev === 'speaking' ? 'listening' : 'speaking'));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const headlineWords = t('hero.title').split(' ');

  return (
    <section className="relative overflow-hidden bg-ink-900 text-paper pt-8 pb-16 md:py-24 border-b border-gray-800">
      {/* Background ambient violet and volt glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[240px] h-[240px] bg-volt-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative angular grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column: Copy & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink-700/80 border border-gray-700/80 text-xs font-bold text-volt-400 mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-volt-400" />
              <span>{locale === 'bn' ? 'বাংলাদেশের নিজস্ব এআই মক প্ল্যাটফর্ম' : 'Engineered for Bangladesh viva & interviews'}</span>
            </motion.div>

            {/* Headline with staggered word reveal */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="inline-block mr-3"
                >
                  {word.includes('অভয়') || word.includes('fearless') ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt-400 via-paper to-violet-100 underline decoration-volt-400/40 decoration-wavy decoration-2">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-xl text-gray-300 max-w-xl mb-8 leading-relaxed"
            >
              {t('hero.sub')}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/signup">
                <Button variant="volt" size="lg" className="w-full sm:w-auto gap-2 group">
                  <span>{t('cta.primary')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <Play className="w-4 h-4 text-volt-400 fill-volt-400/20" />
                  <span>{t('cta.secondary')}</span>
                </Button>
              </Link>
            </motion.div>

            {/* Free first mock note */}
            {FREE_FIRST_MOCK && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-gray-400 font-medium"
              >
                <Shield className="w-3.5 h-3.5 text-success-500" />
                <span>{t('hero.note')}</span>
              </motion.div>
            )}
          </div>

          {/* Right Column: Animated Interview Screen Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-md bg-ink-800 rounded-2xl border border-gray-700/80 shadow-2xl p-4 sm:p-6 relative overflow-hidden backdrop-blur-md"
            >
              {/* Device Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-700/60 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-300">Live Practice Room</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-volt-400 bg-ink-900 px-2.5 py-1 rounded-md border border-gray-700">
                  <span>04:32</span>
                </div>
              </div>

              {/* AI Interviewer Stage */}
              <div className="flex flex-col items-center justify-center py-4 bg-ink-900/90 rounded-xl border border-gray-800 p-4 mb-4 relative">
                <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-ink-700 px-2 py-0.5 rounded">
                  {orbState === 'speaking' ? 'AI Panelist Speaking' : 'Listening to You'}
                </div>
                <Orb state={orbState} size={150} micLevel={orbState === 'listening' ? 65 : 10} />

                {/* Animated Sound-wave Bars */}
                <div className="flex items-center gap-1.5 h-6 mt-3">
                  {[40, 75, 95, 60, 85, 45, 90, 65, 35, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: orbState === 'speaking' ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] : ['20%', '30%', '20%'],
                      }}
                      transition={{
                        duration: 0.8 + (i % 3) * 0.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`w-1 rounded-full ${
                        orbState === 'speaking' ? 'bg-volt-400' : 'bg-violet-600'
                      }`}
                      style={{ height: '30%' }}
                    />
                  ))}
                </div>
              </div>

              {/* Current Question Tile */}
              <div className="bg-ink-700/60 border border-gray-700/60 rounded-xl p-3.5 mb-3">
                <div className="text-[11px] font-bold text-volt-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Question 2 of 8</span>
                  <span className="text-gray-400 font-normal">BCS & Tech Circular</span>
                </div>
                <p className="text-sm font-semibold text-paper leading-snug">
                  {locale === 'bn'
                    ? '"আপনার সিভির ফাইনাল ইয়ার প্রজেক্টে সবচেয়ে বড় চ্যালেঞ্জ কী ছিল এবং কীভাবে তা সমাধান করেছিলেন?"'
                    : '"What was the most challenging technical roadblock in your graduation project, and how did you resolve it?"'}
                </p>
              </div>

              {/* Simulated Live User Transcript Preview */}
              <div className="bg-ink-900/60 border border-gray-800 rounded-lg p-2.5 flex items-start gap-2.5 text-xs text-gray-300">
                <div className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center text-volt-400 shrink-0 mt-0.5">
                  <Mic className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-400">Candidate: </span>
                  <span className="italic">
                    {locale === 'bn'
                      ? '"আমরা যখন ডাটাবেস অপ্টিমাইজ করছিলাম, কুয়েরি টাইম অনেক বেশি আসছিল..."'
                      : '"When we optimized the real-time cache, initial response latency dropped by 40%..."'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
