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
  credits: number;
  freeMockUsed: boolean;
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
  lengthMinutes: 10 | 15 | 20;
  consent: {
    terms: boolean;
    recording: boolean;
    acceptedAt: string;
  };
  status: SessionStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  planId: string;
  amount: number;
  method: 'bkash';
  senderNumber: string;
  trxId: string;
  status: 'processing' | 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface PricingPlan {
  id: 'free' | 'single' | 'pack';
  nameKey: string;
  credits: number;
  price: number | null;
  popular?: boolean;
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
  overallDelivery: 'strong' | 'good' | 'needs_work';
  summaryQuote: string;
  strengths: { title: string; description: string }[];
  priorityFixes: { title: string; description: string }[];
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
  transcript: TranscriptEntry[];
}
