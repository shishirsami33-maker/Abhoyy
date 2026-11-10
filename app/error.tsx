'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Orb } from '@/components/ui/Orb';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log error internally if needed
    console.error('Captured by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-paper">
      <div className="mb-6">
        <Orb state="paused" size={150} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 mb-2">
        {t('system.errorTitle')}
      </h1>

      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-8">
        {error.message || t('system.errorDesc')}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={() => reset()} variant="primary" size="md">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary" size="md">
            <Home className="w-4 h-4 mr-2" />
            {t('system.backHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
