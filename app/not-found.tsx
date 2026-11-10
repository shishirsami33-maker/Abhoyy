'use client';

import React from 'react';
import Link from 'next/link';
import { Orb } from '@/components/ui/Orb';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-paper">
      <div className="mb-6">
        <Orb state="idle" size={160} />
      </div>

      <span className="text-volt-500 font-black text-sm tracking-widest uppercase bg-ink-900 px-3 py-1 rounded-full mb-3">
        404
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-ink-900 mb-3 tracking-tight">
        {t('system.notFoundTitle')}
      </h1>

      <p className="text-base sm:text-lg text-gray-600 max-w-md mb-8">
        {t('system.notFoundDesc')}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            {t('system.backHome')}
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary" size="md">
            <LayoutDashboard className="w-4 h-4 mr-2 text-volt-400" />
            {t('system.goToDashboard')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
