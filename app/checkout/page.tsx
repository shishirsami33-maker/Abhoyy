'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Download,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { BKASH_MERCHANT_NUMBER, BRAND_NAME } from '@/config';
import { Payment, PricingPlan } from '@/types';
import { formatPrice, toBanglaDigits, formatDate } from '@/lib/utils';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const planParam = searchParams.get('plan') || 'pack';
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'single' | 'pack'>(
    planParam === 'single' ? 'single' : planParam === 'free' ? 'free' : 'pack'
  );

  const [senderPhone, setSenderPhone] = useState('01712345678');
  const [trxId, setTrxId] = useState('');
  const [flowState, setFlowState] = useState<
    'form' | 'processing' | 'pending' | 'success' | 'failed'
  >('form');
  const [paymentResult, setPaymentResult] = useState<Payment | null>(null);

  const plans = api.plans.getPlans();
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];

  const handleCopyMerchant = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(BKASH_MERCHANT_NUMBER);
      toast(t('checkout.copySuccess'), 'success');
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone || !trxId.trim()) {
      toast('Please enter both your bKash account number and the Transaction ID.', 'warning');
      return;
    }

    setFlowState('processing');

    try {
      const payment = await api.payments.createPayment(
        selectedPlanId,
        senderPhone,
        trxId.trim().toUpperCase()
      );
      setPaymentResult(payment);

      if (payment.status === 'success') {
        setFlowState('success');
        toast('Payment verified! Credits added.', 'success');
      } else if (payment.status === 'pending') {
        setFlowState('pending');
      } else {
        setFlowState('failed');
      }
    } catch (err: any) {
      setFlowState('failed');
      toast(err.message || 'Payment verification failed.', 'error');
    }
  };

  return (
    <div className="flex-1 bg-paper text-ink-900 py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>bKash Secure Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink-900 mb-2">
            {t('checkout.title')}
          </h1>
          <p className="text-sm text-gray-600">{t('checkout.sub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Payment Stage (7 cols) */}
          <main className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <AnimatePresence mode="wait">
              {/* Form State */}
              {flowState === 'form' && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handlePaySubmit}
                  className="space-y-6"
                >
                  {/* Plan Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Choose Credit Pack
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {plans.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlanId(p.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selectedPlanId === p.id
                              ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600 font-bold text-ink-900'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <p className="text-xs uppercase">{p.id}</p>
                          <p className="text-sm font-black">{formatPrice(p.price, locale)}</p>
                          <p className="text-[10px] text-gray-500">
                            {locale === 'bn' ? toBanglaDigits(p.credits) : p.credits} mock
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Payment Instructions */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-paper border border-gray-200 text-xs text-gray-700 space-y-2.5">
                    <h4 className="font-bold text-ink-900 flex items-center gap-1.5 text-sm">
                      <CreditCard className="w-4 h-4 text-pink-600" />
                      <span>{t('checkout.instructionsTitle')}</span>
                    </h4>
                    <p>1. {t('checkout.step1')}</p>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">
                          {t('checkout.merchantNumber')}
                        </span>
                        <span className="font-mono font-bold text-sm text-ink-900">
                          {BKASH_MERCHANT_NUMBER}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyMerchant}
                        className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-bold text-ink-900 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                    <p>
                      3. {t('checkout.step3')}{' '}
                      <strong className="text-ink-900 text-sm">
                        {formatPrice(selectedPlan.price, locale)}
                      </strong>
                    </p>
                    <p>4. {t('checkout.step4')}</p>
                  </div>

                  {/* Verification Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t('checkout.senderPhone')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t('checkout.trxId')}
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={t('checkout.trxIdPlaceholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm font-mono text-ink-900 uppercase"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full gap-2 font-bold">
                    <span>{t('checkout.verifyBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-center text-[11px] text-gray-400">
                    💡 Testing note: To test failed verification, include &apos;fail&apos; in TrxID; for pending, include &apos;pend&apos;.
                  </p>
                </motion.form>
              )}

              {/* Processing State */}
              {flowState === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-4 animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900 mb-2">
                    {t('checkout.processing')}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Communicating with the bKash payment gateway to confirm your transaction ID.
                  </p>
                </motion.div>
              )}

              {/* Success Receipt State */}
              {flowState === 'success' && paymentResult && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-success-600/15 text-success-600 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-ink-900">{t('checkout.receiptTitle')}</h3>
                    <p className="text-xs text-success-600 font-bold">{t('checkout.success')}</p>
                  </div>

                  {/* Receipt Card */}
                  <div className="p-5 rounded-2xl bg-paper border border-gray-200 space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptOrder')}:</span>
                      <span className="font-mono font-bold text-ink-900">{paymentResult.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptPlan')}:</span>
                      <span className="font-bold text-ink-900 capitalize">{paymentResult.planId} Pack</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptAmount')}:</span>
                      <span className="font-bold text-ink-900">৳ {paymentResult.amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptDate')}:</span>
                      <span className="text-ink-900">{formatDate(paymentResult.createdAt, locale)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">{t('checkout.receiptTrx')}:</span>
                      <span className="font-mono font-bold text-ink-900">{paymentResult.trxId}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => toast('Receipt downloaded (PDF).', 'info')}
                      className="w-full sm:w-auto flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('checkout.downloadReceipt')}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="volt"
                      size="md"
                      onClick={() => router.push('/interview/new')}
                      className="w-full sm:w-auto flex-1 gap-2 font-black"
                    >
                      <span>{t('checkout.continueToPrepare')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Pending Verification State */}
              {flowState === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">Payment Pending Verification</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {t('checkout.pending')}
                  </p>
                  <div className="pt-4 flex justify-center">
                    <Link href="/dashboard">
                      <Button variant="secondary" size="md">
                        Return to Dashboard
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Failed State */}
              {flowState === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">Verification Unsuccessful</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {t('checkout.failed')}
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Button variant="primary" size="md" onClick={() => setFlowState('form')}>
                      Retry Payment
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="secondary" size="md">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sticky Order Summary Card (Desktop, 5 cols) */}
          <aside className="lg:col-span-5 bg-ink-900 text-paper border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-lifted sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-volt-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-4 pb-6 border-b border-gray-800 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Selected Plan:</span>
                <span className="font-bold text-paper capitalize">{selectedPlan.id} Mock Pack</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Interview Credits:</span>
                <span className="font-bold text-paper">
                  {locale === 'bn' ? toBanglaDigits(selectedPlan.credits) : selectedPlan.credits} credits
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Channel:</span>
                <span className="font-bold text-pink-400">bKash Send Money</span>
              </div>
            </div>

            <div className="py-6 border-b border-gray-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-300">Total Payable:</span>
              <span className="text-3xl font-black text-paper">
                {formatPrice(selectedPlan.price, locale)}
              </span>
            </div>

            <div className="pt-6 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success-500 shrink-0" />
                <span>Instant automated credit crediting upon TrxID check.</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Need help with your bKash payment? WhatsApp support is available 24/7.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center p-8 text-center text-gray-500 font-bold">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
