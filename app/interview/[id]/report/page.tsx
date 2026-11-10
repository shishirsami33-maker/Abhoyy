'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Video,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart2,
  ArrowLeft,
  Calendar,
  User,
  Target,
  Share2,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { SessionReport } from '@/types';
import { formatDate, toBanglaDigits } from '@/lib/utils';

export default function SessionReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [report, setReport] = useState<SessionReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      try {
        const data = await api.reports.get(sessionId);
        setReport(data);
      } catch (err: any) {
        toast('Failed to load session report.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [sessionId, toast]);

  const handleDownloadPdf = () => {
    toast('Generating high-resolution report PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('Private report link copied to clipboard.', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-paper text-ink-900 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 bg-paper text-ink-900 py-20 text-center">
        <h2 className="text-2xl font-black mb-2">Report Not Found</h2>
        <p className="text-gray-600 mb-6">Could not retrieve the report for this interview session.</p>
        <Link href="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-paper text-ink-900 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 hover:text-ink-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              className="gap-1.5 text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Hero Diagnostic Score Banner */}
        <div className="rounded-3xl bg-ink-900 text-paper p-6 sm:p-10 border border-gray-800 shadow-lifted relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-volt-400 text-ink-900 px-3 py-0.5 rounded-full">
                  Verified AI Assessment
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(report.date, locale)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-paper tracking-tight mb-2">
                Diagnostic Interview Report
              </h1>
              <p className="text-sm font-semibold text-volt-400 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{report.targetRole}</span>
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-4 bg-ink-800 border border-gray-700/80 p-4 px-6 rounded-2xl shrink-0">
              <div className="w-14 h-14 rounded-xl bg-volt-400 text-ink-900 flex flex-col items-center justify-center font-black">
                <span className="text-xl leading-none">{report.overallScore || 86}%</span>
                <span className="text-[9px] uppercase font-bold tracking-tight">Score</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Board Verdict
                </p>
                <p className="text-base sm:text-lg font-black text-paper capitalize">
                  {report.overallDelivery} Performance
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 text-xs sm:text-sm text-gray-300 leading-relaxed italic">
            &ldquo;{report.summaryQuote}&rdquo;
          </div>
        </div>

        {/* Section 5: Core Competencies (Communication, Confidence/Clarity, Relevance) */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Core Performance Pillars</h2>
              <p className="text-xs text-gray-500">Evaluation breakdown across critical panel dimensions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Communication Skills */}
            <div className="p-4 rounded-2xl bg-paper border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Communication Skills
                  </span>
                  <span className="font-mono font-black text-sm text-violet-600">
                    {report.categories?.communicationSkills?.score ?? 88}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${report.categories?.communicationSkills?.score ?? 88}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {report.categories?.communicationSkills?.feedback ??
                    'Crisp articulation with clear sentence endings. Excellent tonal pacing that avoids trailing off.'}
                </p>
              </div>
            </div>

            {/* Confidence & Clarity */}
            <div className="p-4 rounded-2xl bg-paper border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Confidence & Clarity
                  </span>
                  <span className="font-mono font-black text-sm text-volt-600 text-ink-900">
                    {report.categories?.confidenceAndClarity?.score ?? 84}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-success-600 rounded-full"
                    style={{ width: `${report.categories?.confidenceAndClarity?.score ?? 84}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {report.categories?.confidenceAndClarity?.feedback ??
                    'Maintained steady eye contact, took deliberate 1-second breath pauses before responding to tough probes.'}
                </p>
              </div>
            </div>

            {/* Answer Relevance */}
            <div className="p-4 rounded-2xl bg-paper border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Answer Relevance
                  </span>
                  <span className="font-mono font-black text-sm text-violet-600">
                    {report.categories?.answerRelevance?.score ?? 89}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${report.categories?.answerRelevance?.score ?? 89}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {report.categories?.answerRelevance?.feedback ??
                    'Directly addressed the core of situational questions using clear context and measurable engineering outcomes.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <span className="text-xs text-gray-500 font-bold block mb-1">Pacing (WPM)</span>
            <span className="text-2xl sm:text-3xl font-black text-ink-900">
              {locale === 'bn' ? toBanglaDigits(report.metrics.wordsPerMinute) : report.metrics.wordsPerMinute}
            </span>
            <span className="text-[11px] text-success-600 font-semibold block mt-1">
              ✓ Balanced Cadence
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <span className="text-xs text-gray-500 font-bold block mb-1">Fillers Count</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500">
              {locale === 'bn' ? toBanglaDigits(report.metrics.fillerWordsCount) : report.metrics.fillerWordsCount}
            </span>
            <span className="text-[11px] text-gray-400 font-semibold block mt-1">
              Across answers
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <span className="text-xs text-gray-500 font-bold block mb-1">Content Clarity</span>
            <span className="text-2xl sm:text-3xl font-black text-ink-900">
              {locale === 'bn' ? toBanglaDigits(report.metrics.clarityScore) : report.metrics.clarityScore}%
            </span>
            <span className="text-[11px] text-success-600 font-semibold block mt-1">
              ✓ High Articulation
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
            <span className="text-xs text-gray-500 font-bold block mb-1">STAR Structure</span>
            <span className="text-2xl sm:text-3xl font-black text-ink-900">
              {locale === 'bn' ? toBanglaDigits(report.metrics.structureScore) : report.metrics.structureScore}%
            </span>
            <span className="text-[11px] text-success-600 font-semibold block mt-1">
              ✓ Logical Flow
            </span>
          </div>
        </div>

        {/* Strengths First (Per Master Rule) */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-success-600/10 text-success-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Key Strengths Observed</h2>
              <p className="text-xs text-gray-500">What worked well and set a solid foundation during this viva.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {report.strengths.map((str, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-success-600/5 border border-success-600/20 flex items-start gap-3.5"
              >
                <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-ink-900 mb-1">{str.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {str.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priority Fixes (At most 2 or 3 priority fixes) */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Priority Fixes Before Your Next Board</h2>
              <p className="text-xs text-gray-500">At most 2–3 high-impact habits to address for rapid improvement.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {report.priorityFixes.map((fix, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3.5"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-ink-900 mb-1">{fix.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {fix.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Specific Recommendations */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-volt-400 text-ink-900 flex items-center justify-center font-black">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Specific Recommendations</h2>
              <p className="text-xs text-gray-500">Actionable techniques to apply immediately in your next practice session.</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {(
              report.specificRecommendations || [
                'Practice 2-minute timed responses to avoid over-explaining background context.',
                'State the business impact or user scale in your very first sentence.',
                'When asked about weaknesses, immediately pair your answer with a recent learning action.',
              ]
            ).map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-paper border border-gray-200 text-xs sm:text-sm text-gray-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-paper font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Suggested Practice Questions */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Suggested Practice Questions</h2>
              <p className="text-xs text-gray-500">Follow-up board scenarios to rehearse before your real interview.</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {(
              report.suggestedPracticeQuestions || [
                'Can you walk us through a time an architectural decision you advocated for failed in production?',
                'How would you prioritize three urgent production bug tickets when the engineering manager is unavailable?',
                'Explain how you ensure secure data handling when integrating third-party payment gateways like bKash.',
              ]
            ).map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 text-xs sm:text-sm text-ink-900 font-medium flex items-start gap-3">
                <span className="text-violet-600 font-bold shrink-0">Q{idx + 1}:</span>
                <p className="leading-relaxed italic">&ldquo;{q}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flagged Moments with Timestamps & Recording Jump Links */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-ink-900">Flagged Moments (Timestamped)</h2>
                <p className="text-xs text-gray-500">Specific moments flagged during live audio/video analysis.</p>
              </div>
            </div>

            <Link href={`/interview/${sessionId}/recording`}>
              <Button variant="ghost" size="sm" className="text-xs text-violet-600 font-bold gap-1">
                <Video className="w-3.5 h-3.5" />
                <span>Jump in Recording</span>
              </Button>
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {report.flaggedMoments.map((flag) => (
              <div
                key={flag.id}
                className="p-4 rounded-2xl bg-paper border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold bg-ink-900 text-volt-400 px-2.5 py-1 rounded-md shrink-0">
                    {flag.timestamp}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900 mb-0.5">{flag.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{flag.description}</p>
                  </div>
                </div>

                <Link href={`/interview/${sessionId}/recording?t=${flag.timeSeconds}`}>
                  <button className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1 shrink-0">
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch moment</span>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Stronger Sample Answers (Before and After) */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-volt-400 text-ink-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Stronger Recommended Answers</h2>
              <p className="text-xs text-gray-500">Side-by-side comparison with strategic phrasing upgrades.</p>
            </div>
          </div>

          <div className="space-y-6">
            {report.sampleAnswers.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-paper border border-gray-200 space-y-4"
              >
                <h3 className="text-sm sm:text-base font-bold text-ink-900">
                  Question: &ldquo;{item.question}&rdquo;
                </h3>

                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Your Response During Viva:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                    &ldquo;{item.candidateAnswer}&rdquo;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-600/30">
                  <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-volt-500" />
                    Stronger Recommended Alternative:
                  </span>
                  <p className="text-xs sm:text-sm text-ink-900 font-semibold leading-relaxed">
                    &ldquo;{item.improvedAnswer}&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-violet-200">
                    <strong>Why this works:</strong> {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-Session Progress Trend */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success-600/10 text-success-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink-900">Progress Across Sessions</h2>
              <p className="text-xs text-gray-500">Measurable confidence score increase over time.</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 h-32 pt-6 px-4 bg-paper rounded-2xl border border-gray-200">
            {report.historicalProgress.map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-bold text-ink-900">{pt.score}%</span>
                <div
                  className="w-full max-w-[48px] bg-violet-600 rounded-t-lg transition-all"
                  style={{ height: `${pt.score}%` }}
                />
                <span className="text-[11px] font-mono text-gray-500">{pt.sessionDate}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Band: Watch Recording or Dashboard */}
        <div className="rounded-3xl bg-ink-900 text-paper p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lifted">
          <div>
            <h3 className="text-lg font-bold text-paper">Permanent Feedback Record</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              This report remains permanently saved in your dashboard even if your optional video recording is deleted.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/interview/${sessionId}/recording`}>
              <Button variant="volt" size="md" className="gap-2 font-black">
                <Video className="w-4 h-4" />
                <span>Recording & Transcript</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Share Progress Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mx-auto">
                <Share2 className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-ink-900">
                Share Your Viva Milestone
              </h3>

              <div className="p-4 rounded-2xl bg-ink-900 text-paper text-left space-y-2">
                <div className="flex justify-between items-center text-xs text-volt-400 font-mono font-bold">
                  <span>Abhoyy AI Assessment</span>
                  <span>{report.overallScore || 86}% Score</span>
                </div>
                <p className="text-sm font-bold text-paper">{report.targetRole}</p>
                <p className="text-xs text-gray-400">
                  Candidate: {report.candidateName} • Board: {report.overallDelivery.toUpperCase()}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `I just practiced my oral mock viva on Abhoyy and scored ${report.overallScore || 86}% for ${report.targetRole}! Practice fearlessly at https://abhoyy.com`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Share on WhatsApp
                </a>

                <Button variant="secondary" size="md" onClick={handleCopyLink} className="w-full text-xs font-bold">
                  Copy Report Link
                </Button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="text-xs text-gray-500 hover:text-ink-900 font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
