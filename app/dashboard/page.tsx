'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { User, InterviewSession } from '@/types';
import { formatDate, toBanglaDigits } from '@/lib/utils';

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile and sessions
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [u, s] = await Promise.all([
          api.auth.getCurrentUser(),
          api.sessions.list(),
        ]);
        setUser(u);
        setSessions(s);
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

  const handleComingSoon = () => {
    toast(t('dashboard.comingSoon'), 'info');
  };

  return (
    <div className="flex-1 bg-paper text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome & Credit Bar */}
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

          {/* Credit balance chip */}
          <div className="flex items-center gap-3 bg-white p-2.5 sm:p-3 px-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-volt-400 text-ink-900 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {t('dashboard.creditBalance')}
              </p>
              <p className="text-base font-extrabold text-ink-900">
                {locale === 'bn' ? toBanglaDigits(user?.credits || 0) : user?.credits || 0}{' '}
                <span className="text-xs font-semibold text-gray-500">
                  {user?.credits === 1 ? t('dashboard.creditUnit') : t('dashboard.creditUnits')}
                </span>
              </p>
            </div>
            <Link href="/pricing" className="ml-2">
              <Button variant="ghost" size="sm" className="text-xs text-violet-600 font-bold hover:bg-violet-50">
                + {t('dashboard.buyMore')}
              </Button>
            </Link>
          </div>
        </div>

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
              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-success-500" /> Private in-browser session
                </span>
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

        {/* Dashboard Grid: Past Sessions (8 cols) + Viva Tip (4 cols) */}
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
                      <div className="flex items-center gap-3 text-xs text-gray-500">
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

                    <div className="flex items-center gap-2 shrink-0">
                      {ses.status === 'completed' ? (
                        <button
                          onClick={handleComingSoon}
                          className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:text-ink-900 hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Report viewer coming in next phase"
                        >
                          <FileText className="w-3.5 h-3.5 text-violet-600" />
                          <span>View Report</span>
                        </button>
                      ) : ses.status === 'ready' || ses.status === 'prepared' ? (
                        <Link href={`/interview/${ses.id}/prepare`}>
                          <Button variant="primary" size="sm">
                            Enter Room
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/interview/new">
                          <Button variant="secondary" size="sm">
                            Resume
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Viva Guidance Tips Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-card">
              <div className="flex items-center gap-2 text-volt-500 font-extrabold text-xs uppercase tracking-wider mb-3 bg-ink-900 px-3 py-1 rounded-full w-fit">
                <Lightbulb className="w-3.5 h-3.5 text-volt-400" />
                <span>{t('dashboard.tipsCardTitle')}</span>
              </div>
              <h4 className="text-base font-bold text-ink-900 mb-2">
                Handling Unfamiliar Questions
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {t('dashboard.tipBody')}
              </p>
              <Link href="/how-it-works" className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                <span>Read all 6 preparation guidelines</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick stats / summary */}
            <div className="p-5 rounded-2xl bg-violet-50/70 border border-violet-100 text-xs text-violet-950">
              <h5 className="font-bold mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-600" />
                Private Practice Assured
              </h5>
              <p className="leading-relaxed">
                Your uploaded resume and mock audio/video files are never stored permanently without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
