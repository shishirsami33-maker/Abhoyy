'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { ArrowRight } from 'lucide-react';

export function MobileStickyCta() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only when scrolled past 350px
      const scrolledPastHero = window.scrollY > 350;
      setIsVisible(scrolledPastHero);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-ink-900/95 backdrop-blur-md border-t border-gray-800 md:hidden flex items-center justify-between gap-3 shadow-lifted"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-volt-400">First mock free</span>
            <span className="text-[11px] text-gray-300">No card required</span>
          </div>

          <Link href="/signup" className="flex-1 max-w-[200px]">
            <Button variant="volt" size="sm" className="w-full gap-1.5 font-black text-xs py-2 min-h-[42px]">
              <span>{t('cta.primary')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

