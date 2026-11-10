'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-ink-900 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-[100] shadow-md overflow-hidden"
          role="alert"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t('system.offlineTitle')} — {t('system.offlineDesc')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
