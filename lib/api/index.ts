import {
  User,
  InterviewSession,
  Payment,
  SessionStatus,
  PricingPlan,
} from '@/types';
import { MOCK_FAILURES, FREE_FIRST_MOCK } from '@/config';

const delay = (ms: number = Math.floor(Math.random() * 400 + 400)) =>
  new Promise((res) => setTimeout(res, ms));

const USER_STORAGE_KEY = 'abhoyy:user';
const SESSIONS_STORAGE_KEY = 'abhoyy:sessions';
const PAYMENTS_STORAGE_KEY = 'abhoyy:payments';

// Initial default user if not in storage
const defaultMockUser: User = {
  id: 'usr_mock_1',
  name: 'Tanvir Ahmed',
  phone: '01712345678',
  email: 'tanvir.ahmed@example.com',
  credits: 1, // 1 free credit initially
  freeMockUsed: false,
  locale: 'en',
};

// Initial mock sessions
const defaultMockSessions: InterviewSession[] = [
  {
    id: 'ses_mock_1',
    userId: 'usr_mock_1',
    type: 'job',
    cvFileName: 'Tanvir_Resume_2026.pdf',
    details: {
      jobTitle: 'Junior Software Engineer',
      company: 'Pathao Ltd.',
      jobDescription: 'Frontend focus with React, Next.js, and TypeScript skills.',
    },
    language: 'mixed',
    panelStyle: 'standard',
    lengthMinutes: 15,
    consent: {
      terms: true,
      recording: true,
      acceptedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ses_mock_2',
    userId: 'usr_mock_1',
    type: 'bcs_viva',
    cvFileName: 'Tanvir_Resume_2026.pdf',
    details: {
      cadre: 'BCS Administration',
      strongSubjects: ['Bangladesh Affairs', 'Public Administration'],
      notes: 'Focus on 7th March speech context and modern governance challenges.',
    },
    language: 'bn',
    panelStyle: 'tough',
    lengthMinutes: 20,
    consent: {
      terms: true,
      recording: true,
      acceptedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return defaultMockUser;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultMockUser));
    return defaultMockUser;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultMockUser;
  }
}

function setStoredUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

function getStoredSessions(): InterviewSession[] {
  if (typeof window === 'undefined') return defaultMockSessions;
  const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(defaultMockSessions));
    return defaultMockSessions;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultMockSessions;
  }
}

function setStoredSessions(sessions: InterviewSession[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

export const api = {
  auth: {
    async getCurrentUser(): Promise<User | null> {
      await delay(200);
      return getStoredUser();
    },

    async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
      await delay(600);
      if (MOCK_FAILURES && Math.random() < 0.3) {
        throw new Error('Failed to send OTP due to network delay. Please retry.');
      }
      return {
        success: true,
        message: 'OTP sent successfully to +880 ' + phone.replace(/^(\+?88)?0?/, ''),
      };
    },

    async verifyOtp(phone: string, code: string): Promise<{ user: User }> {
      await delay(800);
      if (code !== '123456') {
        throw new Error('Invalid OTP code. For this preview, use 123456.');
      }
      let user = getStoredUser();
      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: 'Practice Candidate',
          phone,
          credits: FREE_FIRST_MOCK ? 1 : 0,
          freeMockUsed: false,
          locale: 'en',
        };
      } else {
        user.phone = phone;
      }
      setStoredUser(user);
      return { user };
    },

    async logout(): Promise<void> {
      await delay(300);
      setStoredUser(null);
    },
  },

  credits: {
    async getBalance(): Promise<number> {
      await delay(300);
      const user = getStoredUser();
      return user ? user.credits : 0;
    },

    async deductCredit(): Promise<number> {
      await delay(400);
      const user = getStoredUser();
      if (!user || user.credits <= 0) {
        throw new Error('Insufficient interview credits.');
      }
      user.credits -= 1;
      setStoredUser(user);
      return user.credits;
    },
  },

  uploads: {
    async uploadCv(file: File): Promise<{ fileName: string; size: number; mimeType: string }> {
      await delay(900);
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('CV file size exceeds the 5 MB limit.');
      }
      const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
        throw new Error('Please upload a valid PDF or DOCX file.');
      }
      return {
        fileName: file.name,
        size: file.size,
        mimeType: file.type || 'application/pdf',
      };
    },
  },

  sessions: {
    async list(): Promise<InterviewSession[]> {
      await delay(400);
      return getStoredSessions();
    },

    async get(id: string): Promise<InterviewSession | null> {
      await delay(300);
      const sessions = getStoredSessions();
      return sessions.find((s) => s.id === id) || null;
    },

    async create(
      draft: Omit<InterviewSession, 'id' | 'userId' | 'createdAt'>
    ): Promise<InterviewSession> {
      await delay(700);
      const user = getStoredUser() || defaultMockUser;
      const newSession: InterviewSession = {
        ...draft,
        id: `ses_${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      const sessions = [newSession, ...getStoredSessions()];
      setStoredSessions(sessions);
      return newSession;
    },

    async updateStatus(id: string, status: SessionStatus): Promise<InterviewSession> {
      await delay(400);
      const sessions = getStoredSessions();
      const idx = sessions.findIndex((s) => s.id === id);
      if (idx === -1) {
        throw new Error(`Session with id ${id} not found.`);
      }
      sessions[idx] = { ...sessions[idx], status };
      setStoredSessions(sessions);
      return sessions[idx];
    },
  },

  payments: {
    async createPayment(
      planId: 'free' | 'single' | 'pack',
      senderNumber: string,
      trxId: string
    ): Promise<Payment> {
      await delay(1200);

      if (MOCK_FAILURES && trxId.toLowerCase().includes('fail')) {
        return {
          id: `pay_${Date.now()}`,
          planId,
          amount: planId === 'pack' ? 350 : planId === 'single' ? 120 : 0,
          method: 'bkash',
          senderNumber,
          trxId,
          status: 'failed',
          createdAt: new Date().toISOString(),
        };
      }

      if (trxId.toLowerCase().includes('pend')) {
        return {
          id: `pay_${Date.now()}`,
          planId,
          amount: planId === 'pack' ? 350 : planId === 'single' ? 120 : 0,
          method: 'bkash',
          senderNumber,
          trxId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
      }

      // Add credits on success
      const user = getStoredUser();
      if (user) {
        const addedCredits = planId === 'pack' ? 4 : planId === 'single' ? 1 : 1;
        user.credits += addedCredits;
        setStoredUser(user);
      }

      const payment: Payment = {
        id: `pay_${Date.now()}`,
        planId,
        amount: planId === 'pack' ? 350 : planId === 'single' ? 120 : 0,
        method: 'bkash',
        senderNumber,
        trxId,
        status: 'success',
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify([payment, ...existing]));

      return payment;
    },

    async getPayment(id: string): Promise<Payment | null> {
      await delay(300);
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (!raw) return null;
      const payments: Payment[] = JSON.parse(raw);
      return payments.find((p) => p.id === id) || null;
    },
  },

  plans: {
    getPlans(): PricingPlan[] {
      return [
        {
          id: 'free',
          nameKey: 'pricing.freePlan',
          credits: 1,
          price: 0,
        },
        {
          id: 'single',
          nameKey: 'pricing.singlePlan',
          credits: 1,
          price: null, // Shows as ৳ XX until configured
        },
        {
          id: 'pack',
          nameKey: 'pricing.packPlan',
          credits: 4,
          price: null, // Shows as ৳ XX until configured
          popular: true,
        },
      ];
    },
  },
};
