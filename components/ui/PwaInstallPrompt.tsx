'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('abhoyy:pwa_dismissed');
    if (isDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('abhoyy:pwa_dismissed', 'true');
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50"
        aria-label="Install Abhoyy Application"
      >
        <div className="bg-ink-900/95 border border-gray-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md text-paper relative flex items-start gap-3.5">
          {/* App Icon */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-volt-400 p-[1.5px] shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-ink-900 rounded-[10px] flex items-center justify-center text-volt-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <h4 className="font-bold text-sm text-paper">{t('pwa.installTitle')}</h4>
              <Sparkles className="w-3.5 h-3.5 text-volt-400" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              {t('pwa.installDesc')}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="volt"
                size="sm"
                onClick={handleInstall}
                className="gap-1.5 font-bold text-xs py-1.5 h-8"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('pwa.installBtn')}</span>
              </Button>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs text-gray-400 hover:text-paper font-medium px-2 py-1 transition-colors"
              >
                {t('pwa.dismiss')}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            className="absolute top-3 right-3 text-gray-400 hover:text-paper p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
