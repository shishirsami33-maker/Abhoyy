export type InterviewType = 'university_viva' | 'job' | 'bcs_viva' | 'bank_mnc';

export type Language = 'en' | 'bn' | 'mixed';

export type PanelStyle = 'friendly' | 'standard' | 'tough';

export type SessionStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'ready'
  | 'prepared'
  | 'live'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  minutesBalance: number; // Minute-based balance
  credits?: number; // Backward-compatible alias
  freeMockEligible: boolean; // True for new phone-verified accounts
  freeMockUsed: boolean;
  minutesExpiresAt?: string; // 90-day expiry for purchased minutes
  locale: 'en' | 'bn';
}

export interface JobDetails {
  jobTitle: string;
  company: string;
  jobDescription: string;
  companyDetails?: string;
}

export interface VivaDetails {
  course: string;
  subject: string;
  topics: string[];
  level?: string;
}

export interface BcsDetails {
  cadre?: string;
  strongSubjects: string[];
  notes?: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  cvFileName: string;
  details: JobDetails | VivaDetails | BcsDetails;
  language: Language;
  panelStyle: PanelStyle;
  lengthMinutes: 5 | 10 | 15 | 20; // 5 min for free mock, 10/15/20 for standard
  isFreeMock?: boolean;
  minutesDeducted?: number; // Exact minutes deducted when entered live
  deductedAt?: string;
  consent: {
    terms: boolean;
    recording: boolean; // Explicit recording consent
    acceptedAt: string;
  };
  recordingRequested: boolean; // Optional: user chooses whether to record (default: false)
  recordingDownloadCount: number;
  recordingDeleted?: boolean;
  recordingExpiresAt?: string; // 30 days retention
  status: SessionStatus;
  createdAt: string;
}

export interface MinuteLedgerEntry {
  id: string;
  userId: string;
  type:
    | 'free_grant'
    | 'package_purchase'
    | 'individual_purchase'
    | 'session_deduction'
    | 'refund_restoration'
    | 'expiry';
  minutesChange: number; // e.g. +30, -15, +15
  balanceAfter: number;
  sessionId?: string;
  paymentId?: string;
  reason: string;
  expiresAt?: string; // 90 days for purchased minutes
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  itemType: 'package' | 'individual';
  itemId: string; // 'starter' | 'practice' | 'career_builder' | 'single_10' | 'single_15' | 'single_20'
  itemName: string;
  minutesCredited: number;
  amount: number;
  method: 'bkash';
  senderNumber: string;
  trxId: string;
  status: 'processing' | 'pending' | 'success' | 'failed';
  verifiedAt?: string;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  nameKey: string;
  includedMinutes: number;
  price: number;
  popular?: boolean;
  isRecommended?: boolean;
  type: 'package' | 'individual' | 'free';
}

export interface InterviewQuestion {
  id: number;
  en: string;
  bn: string;
  expectedDurationSeconds?: number;
}

export interface FlaggedMoment {
  id: string;
  timestamp: string; // e.g. "02:14"
  timeSeconds: number;
  title: string;
  description: string;
  type: 'filler' | 'pacing' | 'hesitation' | 'vague';
}

export interface SampleAnswerRecommendation {
  question: string;
  candidateAnswer: string;
  improvedAnswer: string;
  reason: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  candidateName: string;
  targetRole: string;
  date: string;
  durationMinutes: number;
  overallScore: number; // 0 - 100
  overallDelivery: 'strong' | 'good' | 'needs_work';
  summaryQuote: string;
  categories: {
    communicationSkills: { score: number; feedback: string };
    confidenceAndClarity: { score: number; feedback: string };
    answerRelevance: { score: number; feedback: string };
  };
  strengths: { title: string; description: string }[];
  priorityFixes: { title: string; description: string }[];
  specificRecommendations: string[];
  suggestedPracticeQuestions: string[];
  flaggedMoments: FlaggedMoment[];
  metrics: {
    wordsPerMinute: number;
    fillerWordsCount: number;
    topFillerWords: { word: string; count: number }[];
    clarityScore: number;
    structureScore: number;
  };
  sampleAnswers: SampleAnswerRecommendation[];
  historicalProgress: { sessionDate: string; score: number }[];
}

export interface TranscriptEntry {
  timeSeconds: number;
  timestamp: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
  flagged?: boolean;
  flagTitle?: string;
}

export interface SessionRecording {
  id: string;
  sessionId: string;
  durationSeconds: number;
  videoUrl?: string;
  audioUrl?: string;
  transcript: TranscriptEntry[];
  downloadCount: number;
  downloadedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedReason?: 'downloaded_once' | 'retention_expired' | 'user_requested';
  retentionExpiryDate: string; // 30-day retention
}
