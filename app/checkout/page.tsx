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
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import {
  BKASH_MERCHANT_NUMBER,
  INDIVIDUAL_MOCK_PLANS,
  INDIVIDUAL_MOCK_PRICES,
  MINUTE_PACKAGES,
  PURCHASED_MINUTES_EXPIRY_DAYS,
  BRAND_NAME,
} from '@/config';
import { Payment } from '@/types';
import { formatPrice, toBanglaDigits, formatDate } from '@/lib/utils';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const typeParam = (searchParams.get('type') || 'package') as 'package' | 'individual';
  const planParam = searchParams.get('plan') || (typeParam === 'individual' ? 'individual_15' : 'career_builder');

  const [purchaseType, setPurchaseType] = useState<'package' | 'individual'>(typeParam);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(planParam);

  const [senderPhone, setSenderPhone] = useState('01712345678');
  const [trxId, setTrxId] = useState('');
  const [flowState, setFlowState] = useState<
    'form' | 'processing' | 'pending' | 'success' | 'failed'
  >('form');
  const [paymentResult, setPaymentResult] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate selected details
  const getSelectedDetails = () => {
    if (purchaseType === 'package') {
      const pkg = MINUTE_PACKAGES.find((p) => p.id === selectedPlanId) || MINUTE_PACKAGES[2];
      return {
        id: pkg.id,
        name: t(pkg.nameKey),
        minutes: pkg.includedMinutes,
        price: pkg.price,
        isBestValue: pkg.isBestValue,
      };
    } else {
      const duration = (parseInt(selectedPlanId.replace('individual_', ''), 10) || 15) as 10 | 15 | 20;
      return {
        id: selectedPlanId,
        name: `${duration}-Minute Mock Interview`,
        minutes: duration,
        price: INDIVIDUAL_MOCK_PRICES[duration] || 109,
        isRecommended: duration === 15,
      };
    }
  };

  const selectedItem = getSelectedDetails();

  const handleCopyMerchant = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(BKASH_MERCHANT_NUMBER);
      toast(t('checkout.copySuccess'), 'success');
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!senderPhone || !trxId.trim()) {
      toast('Please enter both your bKash account number and the Transaction ID.', 'warning');
      return;
    }

    setFlowState('processing');

    try {
      const payment = await api.payments.createPayment(
        purchaseType,
        selectedPlanId,
        senderPhone,
        trxId.trim()
      );
      setPaymentResult(payment);

      if (payment.status === 'success') {
        setFlowState('success');
        toast(`Payment verified! ${payment.minutesCredited} minutes credited to your wallet.`, 'success');
      } else if (payment.status === 'pending') {
        setFlowState('pending');
      } else {
        setFlowState('failed');
      }
    } catch (err: any) {
      setFlowState('failed');
      setErrorMessage(err.message || 'Payment verification failed.');
      toast(err.message || 'Payment verification failed.', 'error');
    }
  };

  return (
    <div className="flex-1 bg-paper text-ink-900 py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
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
                  {/* Category Toggle: Minute Packages vs Individual Mocks */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Select Purchase Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-paper rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setPurchaseType('package');
                          setSelectedPlanId('career_builder');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          purchaseType === 'package'
                            ? 'bg-violet-600 text-paper shadow-sm'
                            : 'text-gray-600 hover:text-ink-900'
                        }`}
                      >
                        Minute Packages (Best Value)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPurchaseType('individual');
                          setSelectedPlanId('individual_15');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          purchaseType === 'individual'
                            ? 'bg-violet-600 text-paper shadow-sm'
                            : 'text-gray-600 hover:text-ink-900'
                        }`}
                      >
                        Individual Mocks (Direct)
                      </button>
                    </div>
                  </div>

                  {/* Plan Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      {purchaseType === 'package' ? 'Choose Minute Package' : 'Choose Interview Duration'}
                    </label>

                    {purchaseType === 'package' ? (
                      <div className="grid grid-cols-3 gap-2.5">
                        {MINUTE_PACKAGES.map((pkg) => (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setSelectedPlanId(pkg.id)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                              selectedPlanId === pkg.id
                                ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600 font-bold text-ink-900'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {pkg.isBestValue && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                                Best Value
                              </span>
                            )}
                            <p className="text-xs font-bold">{t(pkg.nameKey)}</p>
                            <p className="text-sm font-black text-ink-900">{formatPrice(pkg.price, locale)}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">
                              {locale === 'bn' ? toBanglaDigits(pkg.includedMinutes) : pkg.includedMinutes} mins
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2.5">
                        {INDIVIDUAL_MOCK_PLANS.map((plan) => (
                          <button
                            key={plan.durationMinutes}
                            type="button"
                            onClick={() => setSelectedPlanId(`individual_${plan.durationMinutes}`)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                              selectedPlanId === `individual_${plan.durationMinutes}`
                                ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600 font-bold text-ink-900'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {plan.isRecommended && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet-600 text-paper text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                                Default
                              </span>
                            )}
                            <p className="text-xs font-bold">{plan.durationMinutes} Mins</p>
                            <p className="text-sm font-black text-ink-900">{formatPrice(plan.price, locale)}</p>
                            <p className="text-[10px] text-gray-500">1 mock</p>
                          </button>
                        ))}
                      </div>
                    )}
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
                        {formatPrice(selectedItem.price, locale)}
                      </strong>
                    </p>
                    <p>4. {t('checkout.step4')}</p>
                  </div>

                  {/* Verification Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        {t('checkout.senderPhone')} *
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
                        {t('checkout.trxId')} *
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
                    💡 Testing note: Each TrxID can only be credited once to prevent duplicate crediting. Use &apos;pend&apos; to test pending status or &apos;fail&apos; for rejection.
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
                    Communicating with the bKash payment verification service to audit your transaction.
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
                    <h3 className="text-2xl font-black text-ink-900 mb-1">
                      Payment Verified & Minutes Credited!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Transaction verified successfully. Minutes have been added to your wallet.
                    </p>
                  </div>

                  {/* Printable Receipt Card */}
                  <div className="p-5 rounded-2xl bg-paper border border-gray-200 space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptOrder')}</span>
                      <span className="font-mono font-bold text-ink-900">{paymentResult.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Purchased Item</span>
                      <span className="font-bold text-ink-900">{paymentResult.itemName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Minutes Added</span>
                      <span className="font-black text-violet-600 font-mono text-base">
                        +{paymentResult.minutesCredited} Minutes
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptAmount')}</span>
                      <span className="font-bold text-ink-900">
                        {formatPrice(paymentResult.amount, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">{t('checkout.receiptDate')}</span>
                      <span className="text-ink-900">{formatDate(paymentResult.createdAt, locale)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">{t('checkout.receiptTrx')}</span>
                      <span className="font-mono font-bold text-ink-900">{paymentResult.trxId}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Link href="/interview/new" className="w-full">
                      <Button variant="volt" size="lg" className="w-full gap-2 font-black">
                        <span>Setup Interview Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('checkout.downloadReceipt')}</span>
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Pending State */}
              {flowState === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">Payment Pending Verification</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {t('checkout.pending')}
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Link href="/dashboard">
                      <Button variant="secondary" size="md">Go to Dashboard</Button>
                    </Link>
                    <Button variant="primary" size="md" onClick={() => setFlowState('form')}>
                      Try another TrxID
                    </Button>
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
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">Verification Unsuccessful</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {errorMessage || t('checkout.failed')}
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Button variant="primary" size="md" onClick={() => setFlowState('form')}>
                      Retry Verification
                    </Button>
                    <Link href="/pricing">
                      <Button variant="secondary" size="md">Choose Another Plan</Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right Summary Sidebar (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-ink-900 text-paper border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-lifted">
              <h3 className="text-xs font-black uppercase tracking-wider text-volt-400 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order Summary</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Selected Item:</span>
                  <span className="font-bold text-paper text-sm">{selectedItem.name}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Included Minutes:</span>
                  <span className="font-extrabold text-volt-400 text-sm">
                    {locale === 'bn' ? toBanglaDigits(selectedItem.minutes) : selectedItem.minutes} Minutes
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <span className="text-gray-400">Validity:</span>
                  <span className="text-gray-200">
                    {PURCHASED_MINUTES_EXPIRY_DAYS} Days (No auto-renewals)
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-paper">Total Payable:</span>
                  <span className="text-2xl font-black text-volt-400">
                    {formatPrice(selectedItem.price, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-2 text-ink-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-success-600" />
                <span>Secure & Audited Wallet</span>
              </div>
              <p className="leading-relaxed">
                Purchased minutes are safely stored in your minute wallet. Minutes are deducted only when you enter a live interview room.
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
        <div className="flex-1 bg-paper text-ink-900 py-16 text-center">
          <p className="text-gray-500 font-semibold">Loading checkout details...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
