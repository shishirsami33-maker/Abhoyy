'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-gray-200 rounded-lg bg-paper/50',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-4 shadow-sm">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>
      <h3 className="text-xl font-bold text-ink-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
}

