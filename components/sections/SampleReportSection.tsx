'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Lightbulb, PlayCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';

export function SampleReportSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'strengths' | 'flags' | 'betterAnswer'>('strengths');

  return (
    <section className="py-16 md:py-24 bg-ink-900 text-paper border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 font-bold text-xs uppercase tracking-wider mb-4">
            {t('report.previewBadge')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-4">
            {t('report.previewTitle')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            {t('report.previewSub')}
          </p>
        </div>

        {/* Diagnostic Report Container Card */}
        <div className="bg-ink-800 border border-gray-700 rounded-2xl shadow-lifted overflow-hidden">
          {/* Report Header */}
          <div className="p-5 sm:p-6 border-b border-gray-700/80 bg-ink-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-volt-400 text-ink-900 px-2.5 py-0.5 rounded-full font-mono">
                  {t('report.sampleBadge')}
                </span>
                <span className="text-xs text-gray-400">Mock Session: Software Engineer Viva</span>
              </div>
              <h3 className="text-lg font-bold text-paper">Diagnostic Speech & Content Analysis</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-volt-400" />
                14:20 duration
              </span>
              <span>•</span>
              <span className="text-success-500 font-semibold">Overall Delivery: Strong</span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-gray-700 bg-ink-900/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab('strengths')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'strengths'
                  ? 'bg-violet-600 text-paper shadow-sm'
                  : 'text-gray-400 hover:text-paper hover:bg-ink-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-success-500" />
              <span>{t('report.tabStrengths')}</span>
            </button>

            <button
              onClick={() => setActiveTab('flags')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'flags'
                  ? 'bg-violet-600 text-paper shadow-sm'
                  : 'text-gray-400 hover:text-paper hover:bg-ink-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{t('report.tabFlags')}</span>
            </button>

            <button
              onClick={() => setActiveTab('betterAnswer')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'betterAnswer'
                  ? 'bg-violet-600 text-paper shadow-sm'
                  : 'text-gray-400 hover:text-paper hover:bg-ink-700'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-volt-400" />
              <span>{t('report.tabBetterAnswer')}</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 min-h-[280px]">
            <AnimatePresence mode="wait">
              {activeTab === 'strengths' && (
                <motion.div
                  key="strengths"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-success-600/10 border border-success-600/20 flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-paper mb-1">
                        {t('report.strength1Title')}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {t('report.strength1Desc')}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-success-600/10 border border-success-600/20 flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-paper mb-1">
                        {t('report.strength2Title')}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {t('report.strength2Desc')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'flags' && (
                <motion.div
                  key="flags"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5"
                >
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">
                            {t('report.flag1Time')}
                          </span>
                          <h4 className="text-sm font-bold text-paper">{t('report.flag1Title')}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {t('report.flag1Desc')}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-volt-400 hover:underline shrink-0 hidden sm:flex items-center gap-1 font-semibold">
                      <PlayCircle className="w-3.5 h-3.5" /> Jump to clip
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">
                            {t('report.flag2Time')}
                          </span>
                          <h4 className="text-sm font-bold text-paper">{t('report.flag2Title')}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {t('report.flag2Desc')}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-volt-400 hover:underline shrink-0 hidden sm:flex items-center gap-1 font-semibold">
                      <PlayCircle className="w-3.5 h-3.5" /> Jump to clip
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">
                            {t('report.flag3Time')}
                          </span>
                          <h4 className="text-sm font-bold text-paper">{t('report.flag3Title')}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {t('report.flag3Desc')}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-volt-400 hover:underline shrink-0 hidden sm:flex items-center gap-1 font-semibold">
                      <PlayCircle className="w-3.5 h-3.5" /> Jump to clip
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'betterAnswer' && (
                <motion.div
                  key="betterAnswer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-3.5 rounded-lg bg-ink-900 border border-gray-700 text-xs sm:text-sm font-semibold text-volt-400">
                    {t('report.questionSample')}
                  </div>

                  <div className="p-4 rounded-xl bg-ink-700/60 border border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Original Attempt (Flagged as vague):
                    </p>
                    <p className="text-sm text-gray-300 italic">
                      {t('report.yourAnswerSample')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-violet-600/15 border border-violet-600/40">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-volt-400 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-volt-400" />
                      Recommended High-Impact Phrasing:
                    </div>
                    <p className="text-sm text-paper font-medium leading-relaxed">
                      {t('report.betterAnswerSample')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
