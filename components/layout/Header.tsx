'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { NAV_LINKS, BRAND_NAME } from '@/config';
import { api } from '@/lib/api';
import { User } from '@/types';

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check scroll position for shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current user mock
  useEffect(() => {
    api.auth.getCurrentUser().then(setCurrentUser);
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isDarkHero = pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-ink-900/90 backdrop-blur-md border-b border-gray-800 py-3 shadow-md'
          : 'bg-ink-900 border-b border-gray-800/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 rounded-sm"
          aria-label={`${BRAND_NAME} Home`}
        >
          <Logo variant="full" className="text-paper hover:opacity-95" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-paper transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 rounded-sm"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-700 bg-ink-700 text-gray-200 hover:text-paper hover:border-gray-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400"
            aria-label="Toggle language between English and Bangla"
          >
            <Globe className="w-3.5 h-3.5 text-volt-400" />
            <span className={locale === 'en' ? 'text-volt-400' : 'text-gray-400'}>EN</span>
            <span className="text-gray-600">|</span>
            <span className={locale === 'bn' ? 'text-volt-400' : 'text-gray-400'}>বাংলা</span>
          </button>

          {/* User state / Log in */}
          {currentUser ? (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="gap-2">
                <UserIcon className="w-3.5 h-3.5 text-volt-400" />
                <span>{t('nav.dashboard')}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-paper hover:text-volt-400">
                {t('nav.login')}
              </Button>
            </Link>
          )}

          {/* Primary CTA */}
          <Link href={currentUser ? '/interview/new' : '/signup'}>
            <Button variant="primary" size="sm">
              {t('nav.startFreeMock')}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger & Lang Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Lang toggle on mobile */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-ink-700 text-paper border border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400"
            aria-label="Toggle language"
          >
            <span className={locale === 'en' ? 'text-volt-400' : 'text-gray-400'}>EN</span>
            <span>/</span>
            <span className={locale === 'bn' ? 'text-volt-400' : 'text-gray-400'}>বাং</span>
          </button>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-300 hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 rounded-md"
            aria-expanded={isMobileOpen}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[60px] bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-[60px] right-0 bottom-0 w-[80%] max-w-sm bg-ink-900 border-l border-gray-800 p-6 z-50 flex flex-col justify-between overflow-y-auto md:hidden"
            >
              <div className="flex flex-col gap-5">
                <nav className="flex flex-col gap-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-semibold text-gray-200 hover:text-volt-400 transition-colors py-2 border-b border-gray-800/80"
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </nav>

                <div className="pt-2">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                    Language / ভাষা
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleLanguage()}
                      className={`py-2 px-3 rounded-md text-sm font-bold border ${
                        locale === 'en'
                          ? 'bg-volt-400 text-ink-900 border-volt-400'
                          : 'bg-ink-700 text-gray-300 border-gray-700'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => toggleLanguage()}
                      className={`py-2 px-3 rounded-md text-sm font-bold border ${
                        locale === 'bn'
                          ? 'bg-volt-400 text-ink-900 border-volt-400'
                          : 'bg-ink-700 text-gray-300 border-gray-700'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-gray-800 mt-6">
                {currentUser ? (
                  <Link href="/dashboard" className="w-full">
                    <Button variant="secondary" className="w-full">
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button variant="ghost" className="w-full text-paper border border-gray-700">
                      {t('nav.login')}
                    </Button>
                  </Link>
                )}

                <Link href={currentUser ? '/interview/new' : '/signup'} className="w-full">
                  <Button variant="primary" className="w-full">
                    {t('nav.startFreeMock')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
