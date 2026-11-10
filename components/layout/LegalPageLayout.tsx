'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Calendar, ChevronDown, ShieldCheck } from 'lucide-react';
import { LEGAL_DRAFT_BANNER } from '@/config';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated = 'November 2026',
  sections,
  children,
}: LegalPageLayoutProps) {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');
  const [isTocMobileOpen, setIsTocMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      setIsTocMobileOpen(false);
    }
  };

  return (
    <div className="flex-1 bg-paper text-ink-900">
      {/* Draft Review Warning Banner */}
      {LEGAL_DRAFT_BANNER && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('legal.draftBanner')}</span>
        </div>
      )}

      {/* Header */}
      <section className="bg-ink-900 text-paper py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-volt-400 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last updated: {lastUpdated}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-paper mb-3">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Mobile Collapsible TOC */}
        <div className="lg:hidden mb-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setIsTocMobileOpen(!isTocMobileOpen)}
            className="w-full flex items-center justify-between font-bold text-sm text-ink-900"
          >
            <span>Table of Contents</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isTocMobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isTocMobileOpen && (
            <nav className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`text-left text-xs font-semibold py-1 transition-colors ${
                    activeId === s.id ? 'text-violet-600 font-bold' : 'text-gray-600 hover:text-ink-900'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Desktop Sticky Table of Contents (4 cols) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
              Table of Contents
            </h3>
            <nav className="flex flex-col space-y-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition-all ${
                    activeId === s.id
                      ? 'bg-violet-600 text-paper font-bold shadow-sm'
                      : 'text-gray-600 hover:text-ink-900 hover:bg-gray-50'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Legal Text Content (8 cols) */}
          <main className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-card space-y-10 prose prose-slate max-w-none text-ink-900 leading-relaxed">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

