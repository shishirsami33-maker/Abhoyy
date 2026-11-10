'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Landmark,
  Building2,
  FileUp,
  FileText,
  X,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  Languages,
  UserCheck,
  CheckCircle2,
  Lock,
  Gift,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import {
  InterviewType,
  Language as InterviewLang,
  PanelStyle,
  User,
} from '@/types';
import {
  MAX_CV_SIZE_MB,
  FREE_FIRST_MOCK,
  INDIVIDUAL_MOCK_PRICES,
} from '@/config';
import { toBanglaDigits } from '@/lib/utils';

const DRAFT_STORAGE_KEY = 'abhoyy:draft';

interface WizardDraft {
  step: number;
  type: InterviewType | '';
  cvFileName: string;
  cvFileSize?: number;
  jobTitle: string;
  company: string;
  jobDescription: string;
  companyDetails: string;
  course: string;
  subject: string;
  topics: string[];
  cadre: string;
  strongSubjects: string[];
  notes: string;
  language: InterviewLang;
  panelStyle: PanelStyle;
  lengthMinutes: 5 | 10 | 15 | 20;
  termsConsent: boolean;
  recordingRequested: boolean;
}

const defaultDraft: WizardDraft = {
  step: 1,
  type: '',
  cvFileName: '',
  cvFileSize: undefined,
  jobTitle: '',
  company: '',
  jobDescription: '',
  companyDetails: '',
  course: '',
  subject: '',
  topics: ['Algorithms', 'System Design'],
  cadre: '',
  strongSubjects: ['Bangladesh Affairs', 'Constitution'],
  notes: '',
  language: 'mixed',
  panelStyle: 'standard',
  lengthMinutes: 15, // 15 minutes is recommended default
  termsConsent: false,
  recordingRequested: false, // Recording disabled by default
};

export default function NewInterviewWizard() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [draft, setDraft] = useState<WizardDraft>(defaultDraft);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvError, setCvError] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [direction, setDirection] = useState<1 | -1>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Load user and saved draft on mount
  useEffect(() => {
    api.auth.getCurrentUser().then(setCurrentUser);

    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraft(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  const updateField = (field: keyof WizardDraft, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  // Step Validation
  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!draft.type) {
          toast('Please select an interview format.', 'warning');
          return false;
        }
        return true;
      case 2:
        if (!draft.cvFileName) {
          toast('Please upload your CV (PDF or DOCX format).', 'warning');
          return false;
        }
        return true;
      case 3:
        if (draft.type === 'job' || draft.type === 'bank_mnc') {
          if (!draft.jobTitle.trim() || !draft.company.trim()) {
            toast('Please enter both the Job Title and Company.', 'warning');
            return false;
          }
        } else if (draft.type === 'university_viva') {
          if (!draft.subject.trim()) {
            toast('Please enter your department or viva subject.', 'warning');
            return false;
          }
        }
        return true;
      case 4:
        return true;
      case 5:
        if (!draft.termsConsent) {
          toast('Please accept the Terms of Service to proceed.', 'warning');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(draft.step)) {
      setDirection(1);
      const nextStep = draft.step + 1;
      setDraft((prev) => ({ ...prev, step: nextStep }));
      setTimeout(() => headingRef.current?.focus(), 150);
    }
  };

  const handleBack = () => {
    if (draft.step > 1) {
      setDirection(-1);
      const prevStep = draft.step - 1;
      setDraft((prev) => ({ ...prev, step: prevStep }));
      setTimeout(() => headingRef.current?.focus(), 150);
    }
  };

  // CV File Upload Handler
  const handleFileUpload = async (file: File) => {
    setCvError('');
    try {
      const res = await api.uploads.uploadCv(file);
      setDraft((prev) => ({
        ...prev,
        cvFileName: res.fileName,
        cvFileSize: res.size,
      }));
      toast('CV uploaded and parsed successfully.', 'success');
    } catch (err: any) {
      setCvError(err.message || 'File upload failed.');
      toast(err.message, 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Tag inputs for Viva topics
  const handleAddTopic = () => {
    if (topicInput.trim() && !draft.topics.includes(topicInput.trim())) {
      updateField('topics', [...draft.topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    updateField('topics', draft.topics.filter((_, i) => i !== index));
  };

  const duration = draft.lengthMinutes;
  const isFreeMockSelected = duration === 5;
  const isFreeEligible = currentUser?.freeMockEligible ?? false;
  const minuteBalance = currentUser?.minutesBalance ?? 0;
  const hasSufficientMinutes = isFreeMockSelected ? (isFreeEligible || minuteBalance >= 5) : minuteBalance >= duration;

  // Final Submit
  const handleFinish = async () => {
    if (!draft.termsConsent) {
      toast('Please accept the Terms of Service and Privacy Policy to proceed.', 'warning');
      return;
    }

    if (!hasSufficientMinutes) {
      toast(`You need at least ${duration} minutes in your wallet. Directing to bKash checkout...`, 'info');
      router.push(`/checkout?plan=individual_${duration}&type=individual`);
      return;
    }

    setIsSubmitting(true);
    try {
      const details =
        draft.type === 'job' || draft.type === 'bank_mnc'
          ? {
              jobTitle: draft.jobTitle,
              company: draft.company,
              jobDescription: draft.jobDescription,
              companyDetails: draft.companyDetails,
            }
          : draft.type === 'bcs_viva'
          ? {
              cadre: draft.cadre,
              strongSubjects: draft.strongSubjects,
              notes: draft.notes,
            }
          : {
              course: draft.course,
              subject: draft.subject,
              topics: draft.topics,
            };

      const session = await api.sessions.create({
        type: draft.type as InterviewType,
        cvFileName: draft.cvFileName || 'Uploaded_Resume.pdf',
        details,
        language: draft.language,
        panelStyle: draft.panelStyle,
        lengthMinutes: draft.lengthMinutes,
        isFreeMock: isFreeMockSelected && isFreeEligible,
        consent: {
          terms: true,
          recording: draft.recordingRequested,
          acceptedAt: new Date().toISOString(),
        },
        recordingRequested: draft.recordingRequested,
        recordingDownloadCount: 0,
        status: 'ready',
      });

      // Clear draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      toast('Interview setup ready! Preparing room...', 'success');
      router.push(`/interview/${session.id}/prepare`);
    } catch (err: any) {
      toast(err.message || 'Failed to initialize session.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    t('wizard.step1'),
    t('wizard.step2'),
    t('wizard.step3'),
    t('wizard.step4'),
    t('wizard.step5'),
  ];

  return (
    <div className="flex-1 bg-paper text-ink-900 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Progress Bar for Mobile */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span>
              Step {draft.step} of 5: {stepLabels[draft.step - 1]}
            </span>
            <span>{Math.round((draft.step / 5) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-300"
              style={{ width: `${(draft.step / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Vertical Stepper (Desktop, 3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-card sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-6">
              {t('wizard.stepperTitle')}
            </h3>

            <div className="space-y-6 relative">
              {/* Stepper track */}
              <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-gray-200 -z-0" />

              {stepLabels.map((lbl, idx) => {
                const sNum = idx + 1;
                const isCurrent = draft.step === sNum;
                const isPassed = draft.step > sNum;

                return (
                  <div key={idx} className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-violet-600 text-paper ring-4 ring-violet-100 shadow-sm'
                          : isPassed
                          ? 'bg-success-600 text-paper'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : sNum}
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-ink-900 font-bold'
                          : isPassed
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4 text-volt-500" />
              <span>{t('wizard.draftNotice')}</span>
            </div>
          </aside>

          {/* Center Form Area (6 cols) */}
          <main className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card min-h-[500px] flex flex-col justify-between">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={draft.step}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 20 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Step 1: Type Selection */}
                  {draft.step === 1 && (
                    <div>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-black text-ink-900 mb-1 outline-none"
                      >
                        {t('wizard.typeTitle')}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">{t('wizard.typeSub')}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            id: 'university_viva',
                            title: t('wizard.typeUni'),
                            desc: t('wizard.typeUniDesc'),
                            icon: GraduationCap,
                          },
                          {
                            id: 'job',
                            title: t('wizard.typeJob'),
                            desc: t('wizard.typeJobDesc'),
                            icon: Briefcase,
                          },
                          {
                            id: 'bcs_viva',
                            title: t('wizard.typeBcs'),
                            desc: t('wizard.typeBcsDesc'),
                            icon: Landmark,
                          },
                          {
                            id: 'bank_mnc',
                            title: t('wizard.typeBank'),
                            desc: t('wizard.typeBankDesc'),
                            icon: Building2,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isSelected = draft.type === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateField('type', item.id)}
                              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                  isSelected
                                    ? 'bg-violet-600 text-paper'
                                    : 'bg-violet-50 text-violet-600'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <h3 className="text-base font-bold text-ink-900 mb-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {item.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: CV Upload */}
                  {draft.step === 2 && (
                    <div>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-black text-ink-900 mb-1 outline-none"
                      >
                        {t('wizard.cvTitle')}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">{t('wizard.cvSub')}</p>

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                          draft.cvFileName
                            ? 'border-success-600 bg-success-600/5'
                            : cvError
                            ? 'border-amber-500 bg-amber-500/5'
                            : 'border-gray-300 hover:border-violet-600 bg-paper'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.doc"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files && handleFileUpload(e.target.files[0])
                          }
                        />

                        {draft.cvFileName ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-xl bg-success-600 text-paper flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-ink-900 mb-1">
                              {t('wizard.cvSelected')}
                            </h4>
                            <p className="text-xs text-gray-600 font-mono mb-4">
                              {draft.cvFileName}{' '}
                              {draft.cvFileSize
                                ? `(${(draft.cvFileSize / (1024 * 1024)).toFixed(2)} MB)`
                                : ''}
                            </p>
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateField('cvFileName', '');
                                updateField('cvFileSize', undefined);
                              }}
                              variant="secondary"
                              size="sm"
                              className="text-xs"
                            >
                              {t('wizard.removeCv')}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
                              <FileUp className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-ink-900 mb-1">
                              {t('wizard.dropzoneText')}
                            </h4>
                            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                              {t('wizard.dropzoneHint')}
                            </p>
                          </div>
                        )}
                      </div>

                      {cvError && (
                        <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{cvError}</span>
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft((p) => ({
                              ...p,
                              cvFileName: 'Tanvir_Resume_2026.pdf',
                              cvFileSize: 1.4 * 1024 * 1024,
                            }));
                            toast('Using cached CV from last session.', 'info');
                          }}
                          className="text-xs text-violet-600 font-bold hover:underline inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t('wizard.useLastCv')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Target Details */}
                  {draft.step === 3 && (
                    <div>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-black text-ink-900 mb-1 outline-none"
                      >
                        {t('wizard.detailsTitle')}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">{t('wizard.detailsSub')}</p>

                      {draft.type === 'job' || draft.type === 'bank_mnc' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.jobTitleLabel')} *
                            </label>
                            <input
                              type="text"
                              value={draft.jobTitle}
                              onChange={(e) => updateField('jobTitle', e.target.value)}
                              placeholder={t('wizard.jobTitlePlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.companyLabel')} *
                            </label>
                            <input
                              type="text"
                              value={draft.company}
                              onChange={(e) => updateField('company', e.target.value)}
                              placeholder={t('wizard.companyPlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.jobDescLabel')}
                            </label>
                            <textarea
                              rows={4}
                              value={draft.jobDescription}
                              onChange={(e) => updateField('jobDescription', e.target.value)}
                              placeholder={t('wizard.jobDescPlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                            <p className="text-[11px] text-gray-500 mt-1">{t('wizard.jobDescHint')}</p>
                          </div>
                        </div>
                      ) : draft.type === 'bcs_viva' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.cadreLabel')}
                            </label>
                            <input
                              type="text"
                              value={draft.cadre}
                              onChange={(e) => updateField('cadre', e.target.value)}
                              placeholder={t('wizard.cadrePlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.notesLabel')}
                            </label>
                            <textarea
                              rows={4}
                              value={draft.notes}
                              onChange={(e) => updateField('notes', e.target.value)}
                              placeholder={t('wizard.notesPlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>
                        </div>
                      ) : (
                        // University Viva
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.courseLabel')}
                            </label>
                            <input
                              type="text"
                              value={draft.course}
                              onChange={(e) => updateField('course', e.target.value)}
                              placeholder={t('wizard.coursePlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.subjectLabel')} *
                            </label>
                            <input
                              type="text"
                              value={draft.subject}
                              onChange={(e) => updateField('subject', e.target.value)}
                              placeholder={t('wizard.subjectPlaceholder')}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                              {t('wizard.topicsLabel')}
                            </label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                                placeholder={t('wizard.topicsPlaceholder')}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:outline-none text-sm text-ink-900"
                              />
                              <Button type="button" onClick={handleAddTopic} variant="secondary" size="sm">
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {draft.topics.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold"
                                >
                                  {t}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTopic(idx)}
                                    className="hover:text-red-600"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Preferences (Language, Panel Demeanor, Duration) */}
                  {draft.step === 4 && (
                    <div>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-black text-ink-900 mb-1 outline-none"
                      >
                        {t('wizard.prefTitle')}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">{t('wizard.prefSub')}</p>

                      {/* Language Mode */}
                      <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                          {t('wizard.langLabel')}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'en', title: t('wizard.langEn'), desc: t('wizard.langEnDesc') },
                            { id: 'bn', title: t('wizard.langBn'), desc: t('wizard.langBnDesc') },
                            { id: 'mixed', title: t('wizard.langMixed'), desc: t('wizard.langMixedDesc') },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateField('language', item.id)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                draft.language === item.id
                                  ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <p className="text-sm font-bold text-ink-900 mb-1">{item.title}</p>
                              <p className="text-[11px] text-gray-500 leading-snug">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Panel Demeanor */}
                      <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                          {t('wizard.panelStyleLabel')}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'friendly', title: t('wizard.styleFriendly'), desc: t('wizard.styleFriendlyDesc') },
                            { id: 'standard', title: t('wizard.styleStandard'), desc: t('wizard.styleStandardDesc') },
                            { id: 'tough', title: t('wizard.styleTough'), desc: t('wizard.styleToughDesc') },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateField('panelStyle', item.id)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                draft.panelStyle === item.id
                                  ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <p className="text-sm font-bold text-ink-900 mb-1">{item.title}</p>
                              <p className="text-[11px] text-gray-500 leading-snug">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interview Length (5 mins [if eligible], 10 mins, 15 mins [recommended default], 20 mins) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                            {t('wizard.lengthLabel')}
                          </label>
                          <span className="text-[11px] text-violet-600 font-semibold">
                            15 min is recommended default
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {/* 5 mins option */}
                          <button
                            type="button"
                            onClick={() => updateField('lengthMinutes', 5)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all relative ${
                              draft.lengthMinutes === 5
                                ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-600 font-bold text-ink-900'
                                : 'border-gray-200 bg-white text-ink-900 hover:border-gray-300'
                            }`}
                          >
                            {isFreeEligible && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow-sm">
                                Free Mock
                              </span>
                            )}
                            <p className="text-sm font-black">5 Mins</p>
                            <p className="text-[10px] text-gray-500">
                              {isFreeEligible ? 'Free' : '5 mins'}
                            </p>
                          </button>

                          {/* 10 mins */}
                          <button
                            type="button"
                            onClick={() => updateField('lengthMinutes', 10)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              draft.lengthMinutes === 10
                                ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-600 font-bold text-ink-900'
                                : 'border-gray-200 bg-white text-ink-900 hover:border-gray-300'
                            }`}
                          >
                            <p className="text-sm font-black">10 Mins</p>
                            <p className="text-[10px] text-gray-500">৳79</p>
                          </button>

                          {/* 15 mins (Recommended Default) */}
                          <button
                            type="button"
                            onClick={() => updateField('lengthMinutes', 15)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all relative ${
                              draft.lengthMinutes === 15
                                ? 'border-violet-600 bg-violet-600 text-paper font-bold shadow-md'
                                : 'border-gray-200 bg-white text-ink-900 hover:border-gray-300'
                            }`}
                          >
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-900 text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow-sm">
                              Default
                            </span>
                            <p className="text-sm font-black">15 Mins</p>
                            <p className={`text-[10px] ${draft.lengthMinutes === 15 ? 'text-gray-200' : 'text-gray-500'}`}>৳109</p>
                          </button>

                          {/* 20 mins */}
                          <button
                            type="button"
                            onClick={() => updateField('lengthMinutes', 20)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              draft.lengthMinutes === 20
                                ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-600 font-bold text-ink-900'
                                : 'border-gray-200 bg-white text-ink-900 hover:border-gray-300'
                            }`}
                          >
                            <p className="text-sm font-black">20 Mins</p>
                            <p className="text-[10px] text-gray-500">৳139</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Consent */}
                  {draft.step === 5 && (
                    <div>
                      <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-black text-ink-900 mb-1 outline-none"
                      >
                        {t('wizard.reviewTitle')}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">{t('wizard.reviewSub')}</p>

                      {/* Summary list */}
                      <div className="rounded-2xl bg-paper border border-gray-200 p-5 space-y-3 mb-6 text-xs sm:text-sm">
                        <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                          <span className="text-gray-500">{t('wizard.summaryType')}:</span>
                          <span className="font-bold text-ink-900 capitalize">
                            {draft.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                          <span className="text-gray-500">{t('wizard.summaryCv')}:</span>
                          <span className="font-bold text-ink-900">{draft.cvFileName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                          <span className="text-gray-500">Target:</span>
                          <span className="font-bold text-ink-900">
                            {draft.jobTitle || draft.cadre || draft.subject || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                          <span className="text-gray-500">Mode & Duration:</span>
                          <span className="font-bold text-ink-900 capitalize">
                            {draft.language} • {draft.panelStyle} • {draft.lengthMinutes} mins
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-500">Recording Status:</span>
                          <span className="font-bold text-ink-900">
                            {draft.recordingRequested ? 'Enabled (Optional)' : 'Disabled (Default)'}
                          </span>
                        </div>
                      </div>

                      {/* Minute Deduction Reassurance Notice */}
                      <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-900 mb-5 flex items-start gap-2.5">
                        <Shield className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-0.5">Minute Deduction Policy</p>
                          <p className="text-violet-800 leading-relaxed">
                            No minutes are deducted now. Exactly{' '}
                            <strong>{draft.lengthMinutes} minutes</strong> will be deducted from your wallet
                            only when you enter the live interview room.
                          </p>
                        </div>
                      </div>

                      {/* Recording Policy Section (Optional, Disabled by default) */}
                      <div className="mb-5 p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Video className="w-4 h-4 text-violet-600" />
                          <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                            {t('wizard.recordingSectionTitle')}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                          {t('wizard.recordingSectionDesc')}
                        </p>
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink-900">
                          <input
                            type="checkbox"
                            checked={draft.recordingRequested}
                            onChange={(e) => updateField('recordingRequested', e.target.checked)}
                            className="w-4 h-4 rounded text-violet-600 focus:ring-violet-600"
                          />
                          <span>{t('wizard.recordingEnableOption')}</span>
                        </label>
                      </div>

                      {/* Required Terms Consent */}
                      <div className="space-y-3 mb-4">
                        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-violet-600/40 transition-colors">
                          <input
                            type="checkbox"
                            checked={draft.termsConsent}
                            onChange={(e) => updateField('termsConsent', e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-600 shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-ink-900 font-medium">
                            {t('wizard.consentTerms')}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4 mt-8">
              {draft.step > 1 ? (
                <Button type="button" onClick={handleBack} variant="secondary" size="md">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('cta.back')}
                </Button>
              ) : (
                <div />
              )}

              {draft.step < 5 ? (
                <Button type="button" onClick={handleNext} variant="primary" size="md">
                  <span>{t('cta.continue')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleFinish}
                  variant={hasSufficientMinutes ? 'volt' : 'primary'}
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={!draft.termsConsent}
                  className="gap-2 font-black"
                >
                  <span>
                    {isFreeMockSelected && isFreeEligible
                      ? t('wizard.submitFree')
                      : hasSufficientMinutes
                      ? `Proceed (${draft.lengthMinutes} mins)`
                      : t('wizard.submitPay')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </main>

          {/* Right Live Summary Card (Desktop, 3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-ink-900 text-paper border border-gray-800 rounded-2xl p-6 shadow-lifted sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-volt-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Setup Summary</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-gray-400 font-semibold mb-0.5">Format:</p>
                <p className="font-bold text-paper capitalize">
                  {draft.type ? draft.type.replace('_', ' ') : 'Not selected yet'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold mb-0.5">Resume File:</p>
                <p className="font-bold text-paper truncate">
                  {draft.cvFileName || 'Pending upload'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold mb-0.5">Target Scope:</p>
                <p className="font-bold text-paper">
                  {draft.jobTitle || draft.cadre || draft.subject || 'Pending details'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold mb-0.5">Duration:</p>
                <p className="font-bold text-paper">
                  {draft.lengthMinutes} Minutes
                  {draft.lengthMinutes === 15 && ' (Recommended Default)'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold mb-0.5">Recording:</p>
                <p className="font-bold text-paper">
                  {draft.recordingRequested ? 'Enabled (Optional)' : 'Disabled (Default)'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 mb-1">Your Minute Balance:</p>
                <p className="text-base font-black text-volt-400">
                  {minuteBalance} Minutes Available
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Deducted only upon entering the live room.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
