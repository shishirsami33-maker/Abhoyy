'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { BRAND_NAME, CONTACT_INFO } from '@/config';
import { Phone, Mail, ArrowUpRight, GraduationCap } from 'lucide-react';

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-ink-900 border-t border-gray-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Safety/Practice Disclaimer (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link href="/" className="inline-block text-paper mb-1" aria-label="Abhoyy Home">
              <Logo variant="full" size="md" className="text-paper" />
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {t('footer.mission')}
            </p>

            {/* Subtle Divider */}
            <div className="my-2 border-b border-gray-800/80 border-dashed" />

            {/* Safety/Practice Disclaimer */}
            <div className="space-y-1 text-xs text-gray-500 leading-relaxed">
              <p>
                <span className="text-amber-500 font-bold mr-1">
                  ⚠️ {locale === 'bn' ? 'অনুশীলনী সতর্কতা:' : 'Practice Disclaimer:'}
                </span>
                {t('footer.safetyDisclaimer')}
              </p>
            </div>
          </div>

          {/* Column 2: Support & Contact (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-paper font-bold text-sm sm:text-base tracking-tight mb-1">
              {t('footer.supportContact')}
            </h4>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-gray-400 hover:text-volt-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{CONTACT_INFO.phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-gray-400 hover:text-volt-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-emerald-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>{t('footer.whatsappSupport')}</span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2.5 text-gray-400 hover:text-volt-400 transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{CONTACT_INFO.email}</span>
                </a>
              </li>

              <li>
                <a
                  href={CONTACT_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-gray-400 hover:text-volt-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>{t('footer.facebookPage')}</span>
                </a>
              </li>
            </ul>

            {/* bKash Badge in Contact Column */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-gray-700/80 text-[11px] text-gray-300 w-fit">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="font-semibold text-paper">bKash Verified Merchant</span>
            </div>
          </div>

          {/* Column 3: Parent Company (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-paper font-bold text-sm sm:text-base tracking-tight mb-1">
              {t('footer.parentCompany')}
            </h4>

            {/* Styled Parent Company Card */}
            <div className="bg-ink-800/90 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-volt-400 p-[1.5px] shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-ink-900 rounded-[6px] flex items-center justify-center font-black text-xs text-paper">
                      S
                    </div>
                  </div>
                  <span className="text-paper font-bold text-sm sm:text-base tracking-tight">
                    {t('footer.parentCompanyName')}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {t('footer.parentCompanyDesc')}
                </p>

                {/* AIUB University Affiliation */}
                <div className="flex items-start gap-1.5 text-[11px] text-gray-400 mb-4 bg-ink-900/60 p-2 rounded-lg border border-gray-800">
                  <GraduationCap className="w-3.5 h-3.5 text-volt-400 shrink-0 mt-0.5" />
                  <span>{t('footer.institution')}</span>
                </div>
              </div>

              <a
                href={CONTACT_INFO.parentCompanyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-ink-900 border border-gray-700 hover:border-volt-400 hover:text-volt-400 text-xs font-semibold text-paper transition-all text-center"
              >
                <span>{t('footer.visitParentCompany')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 4: Talk to Founder (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-paper font-bold text-sm sm:text-base tracking-tight mb-1">
              {t('footer.talkToFounder')}
            </h4>

            <p className="text-xs text-gray-400 leading-relaxed">
              {t('footer.founderSub')}
            </p>

            {/* Founder Portfolio Link */}
            <a
              href={CONTACT_INFO.founderPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-volt-400 hover:underline mb-1"
            >
              <span>{t('footer.founderName')}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {/* LinkedIn */}
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-full bg-ink-800 border border-gray-700/80 hover:border-volt-400 hover:text-volt-400 hover:bg-ink-700 flex items-center justify-center text-gray-300 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="w-9 h-9 rounded-full bg-ink-800 border border-gray-700/80 hover:border-volt-400 hover:text-volt-400 hover:bg-ink-700 flex items-center justify-center text-gray-300 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-9 h-9 rounded-full bg-ink-800 border border-gray-700/80 hover:border-volt-400 hover:text-volt-400 hover:bg-ink-700 flex items-center justify-center text-gray-300 transition-all shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={CONTACT_INFO.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) Profile"
                className="w-9 h-9 rounded-full bg-ink-800 border border-gray-700/80 hover:border-volt-400 hover:text-volt-400 hover:bg-ink-700 flex items-center justify-center text-gray-300 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {BRAND_NAME} – {t('footer.copyrightInitiative')}
          </p>

          <div className="flex items-center gap-4 text-gray-400 font-medium">
            <Link href="/privacy" className="hover:text-volt-400 transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-volt-400 transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/refunds" className="hover:text-volt-400 transition-colors">
              {t('footer.refundPolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
