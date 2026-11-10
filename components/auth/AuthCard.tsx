'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Phone, ArrowRight, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';

interface AuthCardProps {
  mode: 'login' | 'signup';
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Normalize phone number (must be 11 digits starting with 01)
    const cleaned = phoneNumber.replace(/[\s-]/g, '').replace(/^(\+?88)/, '');
    if (!/^01[3-9]\d{8}$/.test(cleaned)) {
      setErrorMsg(t('auth.invalidPhone'));
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.sendOtp(cleaned);
      setPhoneNumber(cleaned);
      setStep('otp');
      setResendTimer(30);
      toast(locale === 'bn' ? 'ওটিপি কোড পাঠানো হয়েছে (ব্যবহার করুন 123456)' : 'OTP sent (use 123456 for preview)', 'info');
    } catch (err: any) {
      setErrorMsg(err.message || t('error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const next = [...otpValues];
    next[index] = val.slice(-1);
    setOtpValues(next);

    // Auto-advance
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const next = [...otpValues];
      pasted.split('').forEach((char, idx) => {
        if (idx < 6) next[idx] = char;
      });
      setOtpValues(next);
      if (next.length === 6) {
        otpInputsRef.current[5]?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const code = otpValues.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await api.auth.verifyOtp(phoneNumber, code);
      toast(locale === 'bn' ? 'যাচাই সফল হয়েছে! স্বাগতম।' : 'Verification successful! Welcome.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 4) {
        setIsLocked(true);
        setErrorMsg(t('auth.lockedNotice'));
      } else {
        setErrorMsg(err.message || t('auth.invalidOtp'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.auth.sendOtp(phoneNumber);
      setResendTimer(30);
      toast(locale === 'bn' ? 'নতুন ওটিপি কোড পাঠানো হয়েছে' : 'New OTP code resent', 'info');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-paper">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-gray-200 shadow-lifted overflow-hidden">
        {/* Brand Side Panel (Desktop only, 5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-ink-900 text-paper p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <Logo variant="full" size="md" className="text-paper mb-12" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-700 border border-gray-700 text-volt-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bangladesh First</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-3 text-paper">
              {locale === 'bn' ? 'ভয় কাটিয়ে ভাইভায় সাফল্য পান।' : 'Step into the board room fearless.'}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {locale === 'bn'
                ? 'সিভি আপলোড করুন, কাঙ্ক্ষিত পদের বিস্তারিত দিন এবং বাস্তব অভিজ্ঞ এআই বোর্ডের সাথে মুখোমুখি কথা বলুন।'
                : 'Upload your CV, target your circular, and speak naturally to an AI board tuned for Bangladeshi standards.'}
            </p>
          </div>

          <div className="pt-8 border-t border-gray-800 flex items-center gap-2.5 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-success-500" />
            <span>Private & confidential practice session</span>
          </div>
        </div>

        {/* Form Panel (7 cols on desktop, full width on mobile) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="lg:hidden mb-6">
              <Logo variant="full" size="sm" className="text-ink-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 mb-2">
              {mode === 'signup' ? t('auth.signupTitle') : t('auth.loginTitle')}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'signup' ? t('auth.signupSub') : t('auth.loginSub')}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-2.5 mb-6"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    {t('auth.phoneLabel')}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-gray-500 select-none">
                      +88
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="01712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm font-medium text-ink-900"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Format: 01XXXXXXXXX (11 digits, Grameenphone, Banglalink, Robi, Teletalk)
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full gap-2 font-bold"
                >
                  <span>{t('auth.sendOtp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Mock Note */}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center text-xs text-gray-500 font-mono">
                  💡 {t('auth.mockOtpNote')}
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="otp-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {t('auth.otpTitle')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-xs text-violet-600 font-bold hover:underline"
                    >
                      Change number
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {t('auth.otpSub')} <span className="font-bold text-ink-900">+88 {phoneNumber}</span>
                  </p>

                  {/* 6 OTP boxes */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={isLocked}
                        className="w-11 sm:w-13 h-13 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-ink-900 bg-paper"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLocked}
                  className="w-full gap-2 font-bold"
                >
                  <span>{t('auth.verifyOtp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Resend Timer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {resendTimer > 0 ? (
                    <span>
                      {t('auth.resendTimer')} <strong className="text-ink-900">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-violet-600 font-bold hover:underline"
                    >
                      {t('auth.resendNow')}
                    </button>
                  )}
                  <span className="font-mono text-gray-400">Mock: 123456</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social or Alt Login */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              {mode === 'signup' ? (
                <>
                  Already practicing on Abhoyy?{' '}
                  <Link href="/login" className="text-violet-600 font-bold hover:underline">
                    Log in here
                  </Link>
                </>
              ) : (
                <>
                  New to Abhoyy?{' '}
                  <Link href="/signup" className="text-violet-600 font-bold hover:underline">
                    Create free account
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
