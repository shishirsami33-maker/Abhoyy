import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'volt' | 'violet' | 'amber' | 'success' | 'outline';
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-ink-900',
    volt: 'bg-volt-400 text-ink-900 font-extrabold',
    violet: 'bg-violet-100 text-violet-700 font-bold',
    amber: 'bg-amber-500/15 text-amber-600 border border-amber-500/30 font-semibold',
    success: 'bg-success-600/15 text-success-600 border border-success-600/30 font-semibold',
    outline: 'border border-gray-200 text-gray-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
