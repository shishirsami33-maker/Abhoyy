import {
  User,
  InterviewSession,
  Payment,
  SessionStatus,
  PricingPlan,
  SessionReport,
  SessionRecording,
  MinuteLedgerEntry,
} from '@/types';
import {
  MOCK_FAILURES,
  FREE_FIRST_MOCK,
  INDIVIDUAL_MOCK_PRICES,
  MINUTE_PACKAGES,
  PURCHASED_MINUTES_EXPIRY_DAYS,
  RECORDING_RETENTION_DAYS,
} from '@/config';

const delay = (ms: number = Math.floor(Math.random() * 300 + 300)) =>
  new Promise((res) => setTimeout(res, ms));

const USER_STORAGE_KEY = 'abhoyy:user';
const SESSIONS_STORAGE_KEY = 'abhoyy:sessions';
const PAYMENTS_STORAGE_KEY = 'abhoyy:payments';
const LEDGER_STORAGE_KEY = 'abhoyy:ledger';
const RECORDINGS_STORAGE_KEY = 'abhoyy:recordings';

// Initial default user with 30 minutes Starter pack
const defaultMockUser: User = {
  id: 'usr_mock_1',
  name: 'Tanvir Ahmed',
  phone: '01712345678',
  email: 'tanvir.ahmed@example.com',
  minutesBalance: 30, // 30 minutes in wallet
  credits: 30, // backward-compatible alias
  freeMockEligible: false, // first mock already used in history
  freeMockUsed: true,
  minutesExpiresAt: new Date(Date.now() + PURCHASED_MINUTES_EXPIRY_DAYS * 86400000).toISOString(),
  locale: 'en',
};

// Initial mock ledger
const defaultMockLedger: MinuteLedgerEntry[] = [
  {
    id: 'led_init_free',
    userId: 'usr_mock_1',
    type: 'free_grant',
    minutesChange: 5,
    balanceAfter: 5,
    reason: 'Welcome bonus: 5-minute free first mock viva',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'led_use_free',
    userId: 'usr_mock_1',
    type: 'session_deduction',
    minutesChange: -5,
    balanceAfter: 0,
    sessionId: 'ses_mock_free',
    reason: 'Live session deduction: 5-minute Free Mock',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'led_starter_pack',
    userId: 'usr_mock_1',
    type: 'package_purchase',
    minutesChange: 30,
    balanceAfter: 30,
    paymentId: 'pay_mock_starter',
    reason: 'Purchased Starter Package (30 minutes)',
    expiresAt: new Date(Date.now() + PURCHASED_MINUTES_EXPIRY_DAYS * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

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
    isFreeMock: false,
    minutesDeducted: 15,
    deductedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    consent: {
      terms: true,
      recording: true,
      acceptedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    recordingRequested: true,
    recordingDownloadCount: 0,
    recordingExpiresAt: new Date(Date.now() + RECORDING_RETENTION_DAYS * 86400000).toISOString(),
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
    isFreeMock: false,
    minutesDeducted: 20,
    deductedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    consent: {
      terms: true,
      recording: false,
      acceptedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    recordingRequested: false, // user opted out of recording
    recordingDownloadCount: 0,
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
    const u: User = JSON.parse(raw);
    // Ensure minute balance field exists
    if (typeof u.minutesBalance === 'undefined') {
      u.minutesBalance = (u.credits ?? 1) * 15; // migrate legacy credit to minutes
      u.credits = u.minutesBalance;
    }
    return u;
  } catch {
    return defaultMockUser;
  }
}

function setStoredUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    // Keep credits in sync for backward compatibility
    user.credits = user.minutesBalance;
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

function getStoredLedger(): MinuteLedgerEntry[] {
  if (typeof window === 'undefined') return defaultMockLedger;
  const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(defaultMockLedger));
    return defaultMockLedger;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultMockLedger;
  }
}

function setStoredLedger(ledger: MinuteLedgerEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
}

export const api = {
  auth: {
    async getCurrentUser(): Promise<User | null> {
      await delay(150);
      return getStoredUser();
    },

    async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
      await delay(400);
      if (MOCK_FAILURES && Math.random() < 0.2) {
        throw new Error('Failed to send OTP due to network delay. Please retry.');
      }
      return {
        success: true,
        message: 'OTP sent successfully to +880 ' + phone.replace(/^(\+?88)?0?/, ''),
      };
    },

    async verifyOtp(phone: string, code: string): Promise<{ user: User }> {
      await delay(500);
      if (code !== '123456') {
        throw new Error('Invalid OTP code. For this preview, use 123456.');
      }
      let user = getStoredUser();
      const cleanPhone = phone.replace(/\D/g, '');

      // Check if this phone has already claimed a free mock
      const claimedPhones: string[] = JSON.parse(
        (typeof window !== 'undefined' && localStorage.getItem('abhoyy:claimed_phones')) || '[]'
      );
      const isNewPhone = !claimedPhones.includes(cleanPhone);

      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: 'Practice Candidate',
          phone,
          minutesBalance: isNewPhone && FREE_FIRST_MOCK ? 5 : 0,
          credits: isNewPhone && FREE_FIRST_MOCK ? 5 : 0,
          freeMockEligible: isNewPhone && FREE_FIRST_MOCK,
          freeMockUsed: !isNewPhone,
          locale: 'en',
        };
        if (isNewPhone) {
          claimedPhones.push(cleanPhone);
          if (typeof window !== 'undefined') {
            localStorage.setItem('abhoyy:claimed_phones', JSON.stringify(claimedPhones));
          }
        }
      } else {
        user.phone = phone;
      }
      setStoredUser(user);
      return { user };
    },

    async logout(): Promise<void> {
      await delay(200);
      setStoredUser(null);
    },
  },

  // Minute-Based Wallet System & Auditable Ledger
  wallet: {
    async getBalance(): Promise<{
      minutesBalance: number;
      freeMockEligible: boolean;
      freeMockUsed: boolean;
      expiresAt?: string;
    }> {
      await delay(200);
      const user = getStoredUser();
      return {
        minutesBalance: user?.minutesBalance ?? 0,
        freeMockEligible: user?.freeMockEligible ?? false,
        freeMockUsed: user?.freeMockUsed ?? true,
        expiresAt: user?.minutesExpiresAt,
      };
    },

    /**
     * Deduct exact minutes only when entering live interview state.
     * Guaranteed idempotent: will not deduct twice for the same sessionId.
     */
    async deductForLiveSession(
      sessionId: string,
      durationMinutes: 5 | 10 | 15 | 20
    ): Promise<{ success: boolean; deducted: number; newBalance: number }> {
      await delay(350);
      const user = getStoredUser();
      if (!user) throw new Error('User not authenticated.');

      const ledger = getStoredLedger();

      // Idempotency check: verify if this session was already deducted
      const existingDeduction = ledger.find(
        (entry) => entry.sessionId === sessionId && entry.type === 'session_deduction'
      );
      if (existingDeduction) {
        return {
          success: true,
          deducted: Math.abs(existingDeduction.minutesChange),
          newBalance: user.minutesBalance,
        };
      }

      // Check free mock eligibility if 5 minutes
      if (durationMinutes === 5) {
        if (!user.freeMockEligible && user.minutesBalance < 5) {
          throw new Error('Free mock interview has already been used on this verified account.');
        }

        if (user.freeMockEligible) {
          user.freeMockEligible = false;
          user.freeMockUsed = true;
          // Free mock deduction
          const newLedgerEntry: MinuteLedgerEntry = {
            id: `led_ded_${Date.now()}`,
            userId: user.id,
            type: 'session_deduction',
            minutesChange: -5,
            balanceAfter: user.minutesBalance,
            sessionId,
            reason: 'Free 5-minute welcome mock viva session commenced',
            createdAt: new Date().toISOString(),
          };
          setStoredLedger([newLedgerEntry, ...ledger]);
          setStoredUser(user);

          // Update session status
          const sessions = getStoredSessions();
          const sIdx = sessions.findIndex((s) => s.id === sessionId);
          if (sIdx !== -1) {
            sessions[sIdx].minutesDeducted = 5;
            sessions[sIdx].deductedAt = new Date().toISOString();
            sessions[sIdx].status = 'live';
            setStoredSessions(sessions);
          }

          return { success: true, deducted: 5, newBalance: user.minutesBalance };
        }
      }

      // Standard minute balance deduction
      if (user.minutesBalance < durationMinutes) {
        throw new Error(
          `Insufficient minute balance. This session requires ${durationMinutes} minutes, but your balance has ${user.minutesBalance} minutes.`
        );
      }

      user.minutesBalance -= durationMinutes;
      user.credits = user.minutesBalance;

      const newLedgerEntry: MinuteLedgerEntry = {
        id: `led_ded_${Date.now()}`,
        userId: user.id,
        type: 'session_deduction',
        minutesChange: -durationMinutes,
        balanceAfter: user.minutesBalance,
        sessionId,
        reason: `Live session deduction: ${durationMinutes}-minute interview`,
        createdAt: new Date().toISOString(),
      };

      setStoredLedger([newLedgerEntry, ...ledger]);
      setStoredUser(user);

      // Update session record
      const sessions = getStoredSessions();
      const sIdx = sessions.findIndex((s) => s.id === sessionId);
      if (sIdx !== -1) {
        sessions[sIdx].minutesDeducted = durationMinutes;
        sessions[sIdx].deductedAt = new Date().toISOString();
        sessions[sIdx].status = 'live';
        setStoredSessions(sessions);
      }

      return {
        success: true,
        deducted: durationMinutes,
        newBalance: user.minutesBalance,
      };
    },

    /**
     * Restore deducted minutes after verified technical failure
     */
    async restoreMinutesForFailure(
      sessionId: string,
      reason: string
    ): Promise<{ success: boolean; restored: number; newBalance: number }> {
      await delay(300);
      const user = getStoredUser();
      if (!user) throw new Error('User not authenticated.');

      const sessions = getStoredSessions();
      const session = sessions.find((s) => s.id === sessionId);
      const minutesToRestore = session?.minutesDeducted || session?.lengthMinutes || 15;

      user.minutesBalance += minutesToRestore;
      user.credits = user.minutesBalance;

      const ledger = getStoredLedger();
      const refundEntry: MinuteLedgerEntry = {
        id: `led_ref_${Date.now()}`,
        userId: user.id,
        type: 'refund_restoration',
        minutesChange: minutesToRestore,
        balanceAfter: user.minutesBalance,
        sessionId,
        reason: `Technical failure restoration: ${reason}`,
        createdAt: new Date().toISOString(),
      };

      setStoredLedger([refundEntry, ...ledger]);
      setStoredUser(user);

      return {
        success: true,
        restored: minutesToRestore,
        newBalance: user.minutesBalance,
      };
    },

    async getLedger(): Promise<MinuteLedgerEntry[]> {
      await delay(250);
      return getStoredLedger();
    },
  },

  // Legacy credits alias for backwards compatibility
  credits: {
    async getBalance(): Promise<number> {
      const user = getStoredUser();
      return user ? user.minutesBalance : 0;
    },
    async deductCredit(): Promise<number> {
      const user = getStoredUser();
      if (!user || user.minutesBalance <= 0) {
        throw new Error('Insufficient interview minutes.');
      }
      user.minutesBalance = Math.max(0, user.minutesBalance - 15);
      user.credits = user.minutesBalance;
      setStoredUser(user);
      return user.minutesBalance;
    },
  },

  uploads: {
    async uploadCv(file: File): Promise<{ fileName: string; size: number; mimeType: string }> {
      await delay(700);
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
      await delay(300);
      return getStoredSessions();
    },

    async get(id: string): Promise<InterviewSession | null> {
      await delay(200);
      const sessions = getStoredSessions();
      return sessions.find((s) => s.id === id) || null;
    },

    async create(
      draft: Omit<InterviewSession, 'id' | 'userId' | 'createdAt'>
    ): Promise<InterviewSession> {
      await delay(500);
      const user = getStoredUser() || defaultMockUser;
      const newSession: InterviewSession = {
        ...draft,
        id: `ses_${Date.now()}`,
        userId: user.id,
        recordingDownloadCount: 0,
        recordingExpiresAt: new Date(Date.now() + RECORDING_RETENTION_DAYS * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      const sessions = [newSession, ...getStoredSessions()];
      setStoredSessions(sessions);
      return newSession;
    },

    async updateStatus(id: string, status: SessionStatus): Promise<InterviewSession> {
      await delay(300);
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
      purchaseType: 'package' | 'individual',
      itemId: string,
      senderNumber: string,
      trxId: string
    ): Promise<Payment> {
      await delay(1000);

      const cleanTrx = trxId.trim().toUpperCase();

      // Duplicate TrxID Prevention
      const existingPayments: Payment[] = JSON.parse(
        (typeof window !== 'undefined' && localStorage.getItem(PAYMENTS_STORAGE_KEY)) || '[]'
      );
      const duplicate = existingPayments.find(
        (p) => p.trxId === cleanTrx && (p.status === 'success' || p.status === 'processing')
      );
      if (duplicate) {
        throw new Error(
          `Transaction ID ${cleanTrx} has already been verified and credited. Duplicate submissions are not allowed.`
        );
      }

      // Calculate minutes and amount based on new pricing structure
      let minutes = 30;
      let amount = 219;
      let itemName = 'Starter Package (30 mins)';

      if (purchaseType === 'package') {
        const pkg = MINUTE_PACKAGES.find((p) => p.id === itemId) || MINUTE_PACKAGES[0];
        minutes = pkg.includedMinutes;
        amount = pkg.price;
        itemName = `${pkg.nameKey.replace('pricing.packages.', '')} Package (${minutes} mins)`;
      } else {
        // Individual mock
        const duration = (parseInt(itemId.replace('individual_', ''), 10) || 15) as 10 | 15 | 20;
        minutes = duration;
        amount = INDIVIDUAL_MOCK_PRICES[duration] || 109;
        itemName = `Individual Mock (${duration} mins)`;
      }

      if (MOCK_FAILURES && cleanTrx.includes('FAIL')) {
        return {
          id: `pay_${Date.now()}`,
          userId: 'usr_mock_1',
          itemType: purchaseType,
          itemId,
          itemName,
          minutesCredited: 0,
          amount,
          method: 'bkash',
          senderNumber,
          trxId: cleanTrx,
          status: 'failed',
          createdAt: new Date().toISOString(),
        };
      }

      if (cleanTrx.includes('PEND')) {
        return {
          id: `pay_${Date.now()}`,
          userId: 'usr_mock_1',
          itemType: purchaseType,
          itemId,
          itemName,
          minutesCredited: minutes,
          amount,
          method: 'bkash',
          senderNumber,
          trxId: cleanTrx,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
      }

      // Success: credit minutes to user wallet and ledger
      const user = getStoredUser();
      const expiryDate = new Date(
        Date.now() + PURCHASED_MINUTES_EXPIRY_DAYS * 86400000
      ).toISOString();

      if (user) {
        user.minutesBalance += minutes;
        user.credits = user.minutesBalance;
        user.minutesExpiresAt = expiryDate;
        setStoredUser(user);

        const ledger = getStoredLedger();
        const ledgerEntry: MinuteLedgerEntry = {
          id: `led_pay_${Date.now()}`,
          userId: user.id,
          type: purchaseType === 'package' ? 'package_purchase' : 'individual_purchase',
          minutesChange: minutes,
          balanceAfter: user.minutesBalance,
          paymentId: `pay_${Date.now()}`,
          reason: `Purchased ${itemName} for ৳${amount}`,
          expiresAt: expiryDate,
          createdAt: new Date().toISOString(),
        };
        setStoredLedger([ledgerEntry, ...ledger]);
      }

      const payment: Payment = {
        id: `pay_${Date.now()}`,
        userId: user?.id || 'usr_mock_1',
        itemType: purchaseType,
        itemId,
        itemName,
        minutesCredited: minutes,
        amount,
        method: 'bkash',
        senderNumber,
        trxId: cleanTrx,
        status: 'success',
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify([payment, ...existingPayments]));
      return payment;
    },

    async getPayment(id: string): Promise<Payment | null> {
      await delay(200);
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (!raw) return null;
      const payments: Payment[] = JSON.parse(raw);
      return payments.find((p) => p.id === id) || null;
    },

    async listPayments(): Promise<Payment[]> {
      await delay(200);
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
    },
  },

  plans: {
    // Packages
    getPackages(): PricingPlan[] {
      return MINUTE_PACKAGES.map((pkg) => ({
        id: pkg.id,
        nameKey: pkg.nameKey,
        includedMinutes: pkg.includedMinutes,
        price: pkg.price,
        popular: pkg.isBestValue,
        type: 'package',
      }));
    },

    // Individual session purchases
    getIndividualPlans(): PricingPlan[] {
      return [
        {
          id: 'individual_10',
          nameKey: 'pricing.individual.10',
          includedMinutes: 10,
          price: INDIVIDUAL_MOCK_PRICES[10], // ৳79
          type: 'individual',
        },
        {
          id: 'individual_15',
          nameKey: 'pricing.individual.15',
          includedMinutes: 15,
          price: INDIVIDUAL_MOCK_PRICES[15], // ৳109
          isRecommended: true, // Recommended default
          type: 'individual',
        },
        {
          id: 'individual_20',
          nameKey: 'pricing.individual.20',
          includedMinutes: 20,
          price: INDIVIDUAL_MOCK_PRICES[20], // ৳139
          type: 'individual',
        },
      ];
    },

    // Legacy plan list
    getPlans(): PricingPlan[] {
      return this.getPackages();
    },
  },

  reports: {
    async get(sessionId: string): Promise<SessionReport> {
      await delay(350);
      const session = await api.sessions.get(sessionId);
      let target = 'Junior Software Engineer @ Pathao Ltd.';
      if (session && 'jobTitle' in session.details) {
        target = `${session.details.jobTitle} @ ${session.details.company}`;
      } else if (session && 'cadre' in session.details) {
        target = session.details.cadre || 'BCS Viva Examination';
      } else if (session && 'subject' in session.details) {
        target = `${session.details.subject} (${session.details.course})`;
      }

      return {
        id: `rep_${sessionId}`,
        sessionId,
        candidateName: 'Tanvir Ahmed',
        targetRole: target,
        date: session?.createdAt || new Date().toISOString(),
        durationMinutes: session?.lengthMinutes || 15,
        overallScore: 86,
        overallDelivery: 'strong',
        summaryQuote:
          'Demonstrated calm articulation, structured STAR reasoning, and strong domain grounding. With specific adjustments in metric quantification and filler pauses, you will stand out on any top panel.',
        categories: {
          communicationSkills: {
            score: 88,
            feedback:
              'Crisp articulation with clear sentence endings. Excellent tonal pacing that avoids trailing off.',
          },
          confidenceAndClarity: {
            score: 84,
            feedback:
              'Maintained steady eye contact, took deliberate 1-second breath pauses before responding to tough probes.',
          },
          answerRelevance: {
            score: 89,
            feedback:
              'Directly addressed the core of situational questions using clear context and measurable engineering outcomes.',
          },
        },
        strengths: [
          {
            title: 'Structured STAR Framework Usage',
            description:
              'Seamlessly framed complex technical scenarios into Situation, Task, Action, and Result, making your problem-solving process transparent to the board.',
          },
          {
            title: 'Balanced Speech Tempo',
            description:
              'Averaged a calm 128 words per minute, avoiding both rushed anxiety and halting pauses. Your vocal tone remained steady under follow-up probes.',
          },
          {
            title: 'Courteous Board Presence',
            description:
              'Listened attentively to question stems without interrupting and took a deliberate 1-second pause to organize thoughts before answering.',
          },
        ],
        priorityFixes: [
          {
            title: 'Quantify Project Outcomes With Exact Metrics',
            description:
              'In Question 3, you mentioned "the app ran much faster." Panels strongly favor specific numbers, such as "reduced Redis cache latency by 35% across 20,000 daily requests."',
          },
          {
            title: 'Replace Verbal Fillers With Silent Breaths',
            description:
              'Under pressure in Question 4, you repeated "actually" and "mane" 7 times within 40 seconds. Embrace a silent 2-second pause instead of vocalizing hesitation.',
          },
        ],
        specificRecommendations: [
          'Practice 2-minute timed responses to avoid over-explaining background context.',
          'State the business impact or user scale in your very first sentence.',
          'When asked about weaknesses, immediately pair your answer with a recent learning action.',
        ],
        suggestedPracticeQuestions: [
          'Can you walk us through a time an architectural decision you advocated for failed in production?',
          'How would you prioritize three urgent production bug tickets when the engineering manager is unavailable?',
          'Explain how you ensure secure data handling when integrating third-party payment gateways like bKash.',
        ],
        flaggedMoments: [
          {
            id: 'flag_1',
            timestamp: '02:14',
            timeSeconds: 134,
            title: 'Vague Outcome Quantification',
            description:
              'Mentioned "improved response speed" without stating benchmarks, query time differences, or user impact.',
            type: 'vague',
          },
          {
            id: 'flag_2',
            timestamp: '05:40',
            timeSeconds: 340,
            title: 'High Filler-Word Density',
            description:
              'Used "actually" 4 times and "mane (মানে)" 3 times during the team conflict resolution response.',
            type: 'filler',
          },
          {
            id: 'flag_3',
            timestamp: '08:12',
            timeSeconds: 492,
            title: 'Trailing-Off Conclusion',
            description:
              'Dropped vocal projection significantly at the end of the salary discussion instead of concluding with a confident summary.',
            type: 'hesitation',
          },
        ],
        metrics: {
          wordsPerMinute: 128,
          fillerWordsCount: 9,
          topFillerWords: [
            { word: 'actually', count: 4 },
            { word: 'mane (মানে)', count: 3 },
            { word: 'you know', count: 2 },
          ],
          clarityScore: 86,
          structureScore: 89,
        },
        sampleAnswers: [
          {
            question: 'Tell me about a project on your CV that you are proud of.',
            candidateAnswer:
              'We had an app build with 4 people, it was really hard and we stayed up late and delivered.',
            improvedAnswer:
              'In my final year capstone project, our 4-person engineering team had 10 days to ship our React Native transport tracker. I designed the Redis caching architecture, instituted 15-minute daily standups, and delivered 24 hours ahead of schedule with 99.8% uptime across 50 simulated bus routes.',
            reason:
              'Highlights leadership, specific architecture role (Redis), timeline constraints, and concrete reliability metrics.',
          },
          {
            question: 'Where do you see yourself in five years?',
            candidateAnswer:
              'I just want to learn everything and become a senior developer in a good company.',
            improvedAnswer:
              'In five years, I envision having deepened my distributed systems and cloud architecture expertise, actively mentoring junior engineers, and owning business-critical services that serve thousands of daily users in Bangladesh.',
            reason:
              'Demonstrates strategic technical focus, team mentorship values, and commitment to organizational impact.',
          },
        ],
        historicalProgress: [
          { sessionDate: '05 Nov', score: 68 },
          { sessionDate: '08 Nov', score: 78 },
          { sessionDate: '11 Nov', score: 86 },
        ],
      };
    },
  },

  recordings: {
    async get(sessionId: string): Promise<SessionRecording | null> {
      await delay(300);
      const raw =
        typeof window !== 'undefined'
          ? localStorage.getItem(`${RECORDINGS_STORAGE_KEY}:${sessionId}`)
          : null;
      if (raw) {
        return JSON.parse(raw);
      }

      // Default sample recording
      return {
        id: `rec_${sessionId}`,
        sessionId,
        durationSeconds: 520,
        downloadCount: 0,
        isDeleted: false,
        retentionExpiryDate: new Date(Date.now() + RECORDING_RETENTION_DAYS * 86400000).toISOString(),
        transcript: [
          {
            timeSeconds: 0,
            timestamp: '00:00',
            speaker: 'interviewer',
            text: 'Welcome to your Abhoyy board session. Please introduce yourself in about a minute.',
          },
          {
            timeSeconds: 14,
            timestamp: '00:14',
            speaker: 'candidate',
            text: 'Thank you for having me. My name is Tanvir Ahmed. I recently graduated with a degree in Computer Science and Engineering. Over the past two years, I focused on high-performance web applications and backend systems...',
          },
          {
            timeSeconds: 65,
            timestamp: '01:05',
            speaker: 'interviewer',
            text: 'Why did you choose this specific software engineering track?',
          },
          {
            timeSeconds: 78,
            timestamp: '01:18',
            speaker: 'candidate',
            text: 'I have always enjoyed dissecting complex systems into modular services. Seeing real users in Bangladesh depend on reliable digital services inspires me to build resilient infrastructure.',
          },
          {
            timeSeconds: 134,
            timestamp: '02:14',
            speaker: 'candidate',
            text: 'When we optimized the transit application database, we put in caching, and the app ran much faster for everyone.',
            flagged: true,
            flagTitle: 'Unquantified Project Result (Vague metrics)',
          },
          {
            timeSeconds: 180,
            timestamp: '03:00',
            speaker: 'interviewer',
            text: 'Describe a time you faced a difficult technical roadblock and how you resolved it.',
          },
          {
            timeSeconds: 340,
            timestamp: '05:40',
            speaker: 'candidate',
            text: 'Actually, mane, we had a debate about SQL vs NoSQL. Basically, my teammate wanted MongoDB, but actually our data was relational, so mane we had to sit together and compare schemas...',
            flagged: true,
            flagTitle: 'High Filler-Word Density (7 repetitions)',
          },
          {
            timeSeconds: 420,
            timestamp: '07:00',
            speaker: 'interviewer',
            text: 'Where do you see yourself in five years?',
          },
          {
            timeSeconds: 492,
            timestamp: '08:12',
            speaker: 'candidate',
            text: 'I just want to learn everything and become a senior engineer in a good company, or whatever the team needs...',
            flagged: true,
            flagTitle: 'Trailing-Off Conclusion (Weak close)',
          },
        ],
      };
    },

    /**
     * Download recording and automatically delete from server after one successful download.
     * Note: Feedback report is permanently preserved!
     */
    async downloadAndPurge(
      sessionId: string
    ): Promise<{ success: boolean; deleted: boolean; message: string }> {
      await delay(600);
      const recording = await this.get(sessionId);
      if (!recording) throw new Error('Recording not found.');

      if (recording.isDeleted) {
        throw new Error(
          'This recording was already permanently deleted following its first download or retention policy.'
        );
      }

      recording.downloadCount += 1;
      recording.downloadedAt = new Date().toISOString();
      recording.isDeleted = true;
      recording.deletedAt = new Date().toISOString();
      recording.deletedReason = 'downloaded_once';
      delete recording.videoUrl;
      delete recording.audioUrl;

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `${RECORDINGS_STORAGE_KEY}:${sessionId}`,
          JSON.stringify(recording)
        );
      }

      return {
        success: true,
        deleted: true,
        message:
          'Recording downloaded and permanently purged from server. Your AI Feedback Report remains fully accessible.',
      };
    },
  },
};
