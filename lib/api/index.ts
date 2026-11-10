import {
  User,
  InterviewSession,
  Payment,
  SessionStatus,
  PricingPlan,
  SessionReport,
  SessionRecording,
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

  reports: {
    async get(sessionId: string): Promise<SessionReport> {
      await delay(400);
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
        overallDelivery: 'strong',
        summaryQuote:
          'Demonstrated calm articulation, structured STAR reasoning, and strong domain grounding. With 2 specific adjustments in metric quantification and filler pauses, you will stand out on any top panel.',
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
    async get(sessionId: string): Promise<SessionRecording> {
      await delay(400);
      return {
        id: `rec_${sessionId}`,
        sessionId,
        durationSeconds: 520,
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
  },
};

