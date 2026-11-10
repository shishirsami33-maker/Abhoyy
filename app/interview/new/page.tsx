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
import { MAX_CV_SIZE_MB, FREE_FIRST_MOCK } from '@/config';

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
  lengthMinutes: 10 | 15 | 20;
  termsConsent: boolean;
  recordingConsent: boolean;
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
  lengthMinutes: 15,
  termsConsent: false,
  recordingConsent: false,
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

  // Focus step heading on change
  useEffect(() => {
    headingRef.current?.focus();
  }, [draft.step]);

  const updateField = (field: keyof WizardDraft, val: any) => {
    setDraft((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    // Validate current step
    if (draft.step === 1 && !draft.type) {
      toast('Please select an interview format to continue.', 'warning');
      return;
    }
    if (draft.step === 2 && !draft.cvFileName) {
      toast('Please upload your CV or resume.', 'warning');
      return;
    }
    if (draft.step === 3) {
      if (draft.type === 'job' || draft.type === 'bank_mnc') {
        if (!draft.jobTitle.trim() || !draft.company.trim()) {
          toast('Please enter both the Job Title and Hiring Company.', 'warning');
          return;
        }
      } else if (draft.type === 'university_viva') {
        if (!draft.subject.trim()) {
          toast('Please enter your subject or department.', 'warning');
          return;
        }
      }
    }

    setDirection(1);
    setDraft((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    if (draft.step > 1) {
      setDirection(-1);
      setDraft((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  // CV File Upload handler
  const handleFileUpload = async (file: File) => {
    setCvError('');
    if (file.size > MAX_CV_SIZE_MB * 1024 * 1024) {
      setCvError(`File size exceeds the ${MAX_CV_SIZE_MB} MB limit.`);
      return;
    }

    try {
      const res = await api.uploads.uploadCv(file);
      updateField('cvFileName', res.fileName);
      updateField('cvFileSize', res.size);
      toast('Resume attached successfully.', 'success');
    } catch (err: any) {
      setCvError(err.message || 'Failed to upload CV.');
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

  // Final Submit
  const handleFinish = async () => {
    if (!draft.termsConsent || !draft.recordingConsent) {
      toast('Please accept both the Terms and the Recording consent checkboxes.', 'warning');
      return;
    }

    // Check credits
    const balance = currentUser?.credits ?? 0;
    if (balance <= 0) {
      // Need to buy credits -> checkout
      router.push('/checkout?plan=single');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build session object
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
        consent: {
          terms: true,
          recording: true,
          acceptedAt: new Date().toISOString(),
        },
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

          {/* Center Form Stage (6 cols) */}
          <main className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card min-h-[520px] flex flex-col justify-between">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={draft.step}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.25 }}
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
                            type: 'job' as InterviewType,
                            title: t('wizard.typeJob'),
                            desc: t('wizard.typeJobDesc'),
                            icon: <Briefcase className="w-5 h-5 text-violet-600" />,
                          },
                          {
                            type: 'bank_mnc' as InterviewType,
                            title: t('wizard.typeBank'),
                            desc: t('wizard.typeBankDesc'),
                            icon: <Building2 className="w-5 h-5 text-volt-500" />,
                          },
                          {
                            type: 'bcs_viva' as InterviewType,
                            title: t('wizard.typeBcs'),
                            desc: t('wizard.typeBcsDesc'),
                            icon: <Landmark className="w-5 h-5 text-violet-600" />,
                          },
                          {
                            type: 'university_viva' as InterviewType,
                            title: t('wizard.typeUni'),
                            desc: t('wizard.typeUniDesc'),
                            icon: <GraduationCap className="w-5 h-5 text-volt-500" />,
                          },
                        ].map((item) => {
                          const isSelected = draft.type === item.type;
                          return (
                            <button
                              key={item.type}
                              type="button"
                              onClick={() => updateField('type', item.type)}
                              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-600 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-card'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 border border-gray-100">
                                {item.icon}
                              </div>
                              <h3 className="text-base font-bold text-ink-900 mb-1">{item.title}</h3>
                              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Upload CV */}
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

                      {draft.cvFileName ? (
                        <div className="p-6 rounded-2xl bg-violet-50/70 border border-violet-200 flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-violet-600 text-paper flex items-center justify-center font-bold">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-ink-900">{draft.cvFileName}</p>
                              <p className="text-xs text-gray-500">
                                {draft.cvFileSize
                                  ? `${(draft.cvFileSize / (1024 * 1024)).toFixed(2)} MB`
                                  : 'Document attached'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              updateField('cvFileName', '');
                              updateField('cvFileSize', undefined);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                            aria-label={t('wizard.removeCv')}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 hover:border-violet-600 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-paper/50 flex flex-col items-center justify-center group mb-4"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.doc"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0]);
                              }
                            }}
                          />
                          <div className="w-14 h-14 rounded-full bg-violet-100 group-hover:bg-violet-600 group-hover:text-paper text-violet-600 flex items-center justify-center mb-4 transition-colors">
                            <FileUp className="w-6 h-6" />
                          </div>
                          <h4 className="text-base font-bold text-ink-900 mb-1">
                            {t('wizard.dropzoneText')}
                          </h4>
                          <p className="text-xs text-gray-500 max-w-xs">{t('wizard.dropzoneHint')}</p>
                        </div>
                      )}

                      {/* Error */}
                      {cvError && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-800 flex items-center gap-2 mb-4">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{cvError}</span>
                        </div>
                      )}

                      {/* Use last CV chip */}
                      <button
                        type="button"
                        onClick={() => {
                          updateField('cvFileName', 'Tanvir_Ahmed_Resume_2026.pdf');
                          updateField('cvFileSize', 1024 * 350);
                          toast('Attached previously saved resume.', 'info');
                        }}
                        className="text-xs text-violet-600 font-bold hover:underline inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('wizard.useLastCv')}</span>
                      </button>
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

                  {/* Step 4: Preferences */}
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

                      {/* Interview Length */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                          {t('wizard.lengthLabel')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[10, 15, 20].map((mins) => (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => updateField('lengthMinutes', mins)}
                              className={`p-3 rounded-xl border text-center cursor-pointer font-bold text-sm transition-all ${
                                draft.lengthMinutes === mins
                                  ? 'border-violet-600 bg-violet-600 text-paper shadow-sm'
                                  : 'border-gray-200 bg-white text-ink-900 hover:border-gray-300'
                              }`}
                            >
                              {mins} mins
                            </button>
                          ))}
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
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-500">Mode & Duration:</span>
                          <span className="font-bold text-ink-900 capitalize">
                            {draft.language} • {draft.panelStyle} • {draft.lengthMinutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Required Plain-Language Consents */}
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

                        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-violet-600/40 transition-colors">
                          <input
                            type="checkbox"
                            checked={draft.recordingConsent}
                            onChange={(e) => updateField('recordingConsent', e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-600 shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-ink-900 font-medium">
                            {t('wizard.consentRecording')}
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
                  variant="volt"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={!draft.termsConsent || !draft.recordingConsent}
                  className="gap-2 font-black"
                >
                  <span>
                    {(currentUser?.credits ?? 0) > 0
                      ? t('wizard.submitCredit')
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
                <p className="text-gray-400 font-semibold mb-0.5">Language & Duration:</p>
                <p className="font-bold text-paper capitalize">
                  {draft.language} • {draft.lengthMinutes} mins
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 mb-1">Your Balance:</p>
                <p className="text-sm font-extrabold text-volt-400">
                  {currentUser?.credits ?? 0} Credits Available
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
