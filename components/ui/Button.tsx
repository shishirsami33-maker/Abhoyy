'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'volt' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-bold transition-all select-none min-h-[44px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      primary:
        'bg-violet-600 text-paper hover:bg-violet-700 active:scale-[0.98] shadow-card hover:shadow-violet-glow focus-visible:ring-violet-600',
      secondary:
        'bg-ink-700 text-paper hover:bg-ink-900 border border-gray-600 active:scale-[0.98] focus-visible:ring-gray-400',
      volt:
        'bg-volt-400 text-ink-900 hover:bg-volt-500 active:scale-[0.98] shadow-card hover:shadow-volt-glow font-extrabold focus-visible:ring-volt-400',
      ghost:
        'bg-transparent text-current hover:bg-violet-100/20 active:scale-[0.98] focus-visible:ring-violet-600',
      outline:
        'bg-transparent border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-paper active:scale-[0.98] focus-visible:ring-violet-600',
    };

    const sizes = {
      sm: 'text-xs sm:text-sm px-4 py-2 min-h-[40px]',
      md: 'text-sm sm:text-base px-6 py-2.5 min-h-[44px]',
      lg: 'text-base sm:text-lg px-8 py-3.5 min-h-[52px]',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" aria-hidden="true" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
