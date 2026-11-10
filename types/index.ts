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
