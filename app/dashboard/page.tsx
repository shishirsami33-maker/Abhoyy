'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CreditCard,
  PlusCircle,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  Lightbulb,
  Video,
  ArrowRight,
  Shield,
  CheckCircle2,
  History,
  X,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { User, InterviewSession, MinuteLedgerEntry } from '@/types';
import { formatDate, toBanglaDigits } from '@/lib/utils';
import { PURCHASED_MINUTES_EXPIRY_DAYS } from '@/config';

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [ledger, setLedger] = useState<MinuteLedgerEntry[]>([]);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile, sessions, and wallet ledger
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [u, s, l] = await Promise.all([
          api.auth.getCurrentUser(),
          api.sessions.list(),
          api.wallet.getLedger(),
        ]);
        setUser(u);
        setSessions(s);
        setLedger(l);
      } catch (err) {
        toast('Failed to load dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const getStatusBadge = (status: InterviewSession['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t('dashboard.statusCompleted')}</Badge>;
      case 'live':
        return <Badge variant="amber">Live Now</Badge>;
      case 'ready':
      case 'prepared':
        return <Badge variant="volt">{t('dashboard.statusReady')}</Badge>;
      case 'draft':
      default:
        return <Badge variant="amber">{t('dashboard.statusDraft')}</Badge>;
    }
  };

  const getTargetTitle = (session: InterviewSession) => {
    if ('jobTitle' in session.details) {
      return `${session.details.jobTitle} @ ${session.details.company}`;
    }
    if ('cadre' in session.details) {
      return session.details.cadre || 'BCS Viva';
    }
    if ('subject' in session.details) {
      return `${session.details.subject} (${session.details.course})`;
    }
    return 'Mock Viva Session';
  };

  const currentMinutes = user?.minutesBalance ?? 0;

  return (
    <div className="flex-1 bg-paper text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome & Minute Balance Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-ink-900 tracking-tight">
              {t('dashboard.greeting')}, {user?.name || 'Candidate'}
            </h1>
          </div>

          {/* Minute Balance Chip */}
          <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-volt-400 text-ink-900 flex items-center justify-center font-black">
              <Clock className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {t('dashboard.minutesBalance')}
              </p>
              <p className="text-base font-black text-ink-900">
                {locale === 'bn' ? toBanglaDigits(currentMinutes) : currentMinutes}{' '}
                <span className="text-xs font-semibold text-gray-500">
                  {locale === 'bn' ? 'মিনিট' : 'Minutes'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 ml-3 border-l border-gray-200 pl-3">
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="text-xs text-violet-600 font-bold hover:bg-violet-50 py-1 px-2.5 h-8">
                  + {t('dashboard.buyMore')}
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setShowLedgerModal(true)}
                title="View wallet transaction history"
                className="p-1.5 text-gray-400 hover:text-ink-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="View Minute Ledger"
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Free Mock Eligibility Banner (if eligible) */}
        {user?.freeMockEligible && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-ink-900 text-paper flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-volt-400 text-ink-900 flex items-center justify-center font-black text-sm">
                🎁
              </span>
              <div>
                <p className="text-sm font-bold">You have 1 Free Welcome Mock (5 Minutes)!</p>
                <p className="text-xs text-gray-300">
                  Claim your free spoken viva practice before your first purchased session.
                </p>
              </div>
            </div>
            <Link href="/interview/new">
              <Button variant="volt" size="sm" className="font-black text-xs shrink-0">
                Claim Free Mock
              </Button>
            </Link>
          </div>
        )}

        {/* Primary Action Hero Card: Start New Mock */}
        <div className="mb-12">
          <div className="rounded-3xl bg-ink-900 text-paper p-6 sm:p-10 border border-gray-800 shadow-lifted relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Practice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-paper mb-2">
                {t('dashboard.startNew')}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {t('dashboard.startNewSub')}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium flex-wrap">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-success-500" /> Private in-browser session
                </span>
                <span>•</span>
                <span>Minutes deducted only upon live entry</span>
                <span>•</span>
                <span>Takes 2 minutes to set up</span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/interview/new">
                <Button variant="volt" size="lg" className="w-full sm:w-auto gap-2 text-base font-black">
                  <PlusCircle className="w-5 h-5" />
                  <span>Start Mock Interview</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid: Past Sessions (8 cols) + Viva Tip & Wallet Info (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Past Sessions List */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ink-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                <span>{t('dashboard.pastSessions')}</span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                {locale === 'bn' ? toBanglaDigits(sessions.length) : sessions.length} sessions
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : sessions.length === 0 ? (
              <EmptyState
                title={t('dashboard.noSessions')}
                description={t('dashboard.firstMockFreeNotice')}
                actionText={t('nav.startFreeMock')}
                onAction={() => (window.location.href = '/interview/new')}
              />
            ) : (
              <div className="space-y-3.5">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-card hover:border-violet-600/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {getStatusBadge(ses.status)}
                        <span className="text-xs text-gray-400 capitalize">
                          {ses.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-ink-900 mb-1">
                        {getTargetTitle(ses)}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(ses.createdAt, locale)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {ses.lengthMinutes} mins
                        </span>
                        <span>•</span>
                        <span>CV: {ses.cvFileName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {ses.status === 'completed' ? (
                        <>
                          <Link href={`/interview/${ses.id}/report`}>
                            <Button variant="secondary" size="sm" className="text-xs gap-1.5 font-bold">
                              <FileText className="w-3.5 h-3.5 text-violet-600" />
                              <span>View Report</span>
                            </Button>
                          </Link>
                          <Link href={`/interview/${ses.id}/recording`}>
                            <Button variant="ghost" size="sm" className="text-xs gap-1.5 hover:bg-violet-50">
                              <Video className="w-3.5 h-3.5 text-gray-600" />
                              <span>Recording</span>
                            </Button>
                          </Link>
                        </>
                      ) : ses.status === 'ready' || ses.status === 'prepared' ? (
                        <Link href={`/interview/${ses.id}/prepare`}>
                          <Button variant="volt" size="sm" className="text-xs gap-1.5 font-black">
                            <span>Continue Setup</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/interview/new`}>
                          <Button variant="secondary" size="sm" className="text-xs">
                            Resume Draft
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (4 cols): Minute Wallet Info & Viva Tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Wallet Summary Card */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-ink-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-violet-600" />
                  <span>Minute Wallet</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowLedgerModal(true)}
                  className="text-xs font-bold text-violet-600 hover:underline"
                >
                  History
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Available Practice Balance</p>
                <p className="text-2xl font-black text-ink-900">
                  {currentMinutes} Minutes
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Valid for 90 days. Spend across 5, 10, 15, or 20-minute sessions.
                </p>
              </div>

              <Link href="/pricing" className="block">
                <Button variant="primary" size="md" className="w-full text-xs font-bold">
                  Top Up Minutes with bKash
                </Button>
              </Link>
            </div>

            {/* Rotating Viva Tip */}
            <div className="p-6 rounded-3xl bg-ink-900 text-paper border border-gray-800 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-ink-800 flex items-center justify-center text-volt-400">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-paper">
                  {t('dashboard.tipsCardTitle')}
                </h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t('dashboard.tipBody')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minute Wallet & Ledger Modal */}
      <AnimatePresence>
        {showLedgerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-black text-ink-900">Minute Wallet History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLedgerModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-ink-900 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-4 space-y-3 flex-1">
                {ledger.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No wallet transactions recorded yet.</p>
                ) : (
                  ledger.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-paper flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-ink-900">{entry.reason}</p>
                        <p className="text-[11px] text-gray-500">
                          {formatDate(entry.createdAt, locale)}
                          {entry.expiresAt && ` • Valid until ${formatDate(entry.expiresAt, locale)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-black font-mono text-sm ${
                            entry.minutesChange > 0 ? 'text-success-600' : 'text-amber-600'
                          }`}
                        >
                          {entry.minutesChange > 0 ? `+${entry.minutesChange}` : entry.minutesChange} Mins
                        </span>
                        <p className="text-[10px] text-gray-400">Bal: {entry.balanceAfter}m</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setShowLedgerModal(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
