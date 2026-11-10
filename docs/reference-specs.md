# Abhoyy Reference Specs (Parts 3 to 8)

## Part 3: Product requirements

### Product summary
Abhoyy is a web app where a user uploads a CV, adds the job or course details, and practices a spoken mock interview or viva with an AI panel that understands Bangladesh: its universities, public service exams, companies and the way panels here actually behave. The promise is confidence. Practice as often as you need, in private, for the price of a tea instead of a coaching course.

### Goals for the front-end phase
1. Ship every screen from first visit to the moment the interview begins, in English and Bangla, on mobile and desktop.
2. Make the first impression confident and energetic, so a nervous student feels the product is for them.
3. Make guidance, consent and payment so clear that no user is surprised later by recording, cost or rules.
4. Build on a mock service layer, so the real AI, payment and storage can be connected without redesigning any screen.

### Non-goals for this phase
- No real AI interviewer, scoring, speech recognition or text-to-speech
- No real bKash confirmation and no server-side storage of CVs or recordings
- No admin panel and no dashboards for coaching centers or institutions
- No native mobile app; the site must work like a good mobile web app

### Personas
| Persona | Situation | What the interface must give them |
| :--- | :--- | :--- |
| **Nervous university student** | Preparing for a viva, internship or club interview; mid-range Android, limited data, pays with bKash | Reassurance, simple steps, a Bangla option, a clearly shown low price |
| **Fresh graduate** | Has a job interview within days; uses a laptop and a phone | Fast setup, questions based on their CV and the job, a useful report |
| **BCS viva candidate** | Serious and short of time; has already cleared the written exam | A formal and credible tone, BCS-specific setup, trust in how data is handled |
| **Bangla-first user** | More comfortable in Bangla than English | A full Bangla interface, Bangla interview mode, readable Bangla typography |

### Key user journeys
1. **First visit to first mock**: landing page, Start free mock, sign up with phone and OTP, dashboard, 5-step setup wizard, free credit applied, prepare room (checklist and device check), waiting room, interview room.
2. **Returning user with no credits**: log in, dashboard, Start new mock, setup wizard, bKash checkout, receipt, prepare room, interview room.
3. **Returning user with credits**: log in, dashboard, Start new mock, setup wizard with the CV and last preferences prefilled, prepare room, interview room.
4. **Visitor who is not ready to sign up**: landing page, How it works, interactive sample report, Pricing, FAQ, then sign up.

### Requirements by priority
| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-01 | Responsive pages for every route in Part 4, usable from 360px to 1440px+ | P0 |
| FR-02 | English and Bangla toggle in the header, remembered between visits | P0 |
| FR-03 | 5-step setup wizard with validation on every step | P0 |
| FR-04 | Preparation checklist that must be completed before the Start button is active | P0 |
| FR-05 | Device check with a real camera preview and a live microphone level meter | P0 |
| FR-06 | Explicit consent checkboxes for Terms and for recording | P0 |
| FR-07 | bKash checkout UI with processing, pending, success and failure states and a receipt | P0 |
| FR-08 | Interview room shell with a scripted mock interviewer | P0 |
| FR-09 | Terms, Privacy and Refund pages with a sticky table of contents | P0 |
| FR-10 | Autosave of the setup wizard draft in the browser | P1 |
| FR-11 | Animated hero and interactive sample report on the landing page | P1 |
| FR-12 | Skeleton loaders, offline banner, and full reduced-motion support | P1 |
| FR-13 | Dark mode for the dashboard | P2 |
| FR-14 | PWA install prompt and a share-your-progress card | P2 |

---

## Part 4: Page-by-page specifications

### 4.1 Landing page (`/`)
- **Mobile layout**: one column, sticky bottom CTA bar, hero fills the first screen, 64px vertical padding per section.
- **Desktop layout**: 12-column grid, max width 1200px; hero is split with headline on the left and animated interview mockup on the right.
- **Section order**: hero, interview-types marquee, problem, how it works (4 steps), features (6 cards), sample report preview, who it is for, pricing teaser, placeholder testimonials, FAQ, final CTA.
- **Hero**: headline, subline, two buttons, and a small line under them (*First mock free. No card needed.*) shown only when `FREE_FIRST_MOCK` is true. The mockup shows a pulsing orb, a typing question and reactive waveform bars inside a device frame.
- **How it works**: 4 steps joined by a line that draws as the user scrolls, each step icon animates in.
- **Sample report preview**: tabs for Strengths, Flags and Better answer; the Flags tab shows 3 sample flagged moments with timestamps, clearly labelled Sample.
- **Acceptance**: hero visible and interactive within 2 seconds on throttled 4G; every CTA reaches the right route; language toggle changes all copy without reload; no layout shift while animating.

### 4.2 How it works and guidelines (`/how-it-works`)
- Short hero, then six preparation points as large interactive cards. Each card expands to a one-line reason: earphones prevent echo, good light keeps face & recording clear, quiet room helps AI hear correctly, tripod keeps video steady, speaking louder gives cleaner transcript, treating it as practice means mistakes cost nothing.
- "What you get" block (report of flagged moments, full recording) and closing CTA.
- **Acceptance**: cards work by keyboard and touch; six points read from the same locale keys as prepare room checklist.

### 4.3 Pricing (`/pricing`)
- Three cards: Free first mock, Single mock, Pack (highlighted as best value). Amounts come from `PRICES` config and show as ৳ XX until set. In Bangla mode, use Bangla digits.
- Below cards: what counts as one mock, credit-expiry placeholder, link to `/refunds`, Pay with bKash note.
- **Acceptance**: each card button goes to `/checkout` with plan in query string.

### 4.4 Legal pages (`/terms`, `/privacy`, `/refunds`)
- Desktop: sticky table of contents on left highlighting current section while scrolling. Mobile: collapsible table of contents at top.
- Last updated date chip, and a visible *Draft: pending legal review* banner controlled by a config flag.
- **Terms outline**: about Abhoyy, practice tool only, no guarantee of results, AI can be wrong, accounts, acceptable use, recording consent, payments and credits, refunds, intellectual property, changes to terms, contact.
- **Privacy outline**: what is collected (CV, job details, audio/video recording, transcript, payment reference), why, retention (placeholder), how to delete, who can see it, security, children/age, contact.
- **Refunds outline**: when a refund applies, how to request, resolution timeline.

### 4.5 Sign up and log in (`/signup`, `/login`)
- Desktop: centered card beside brand panel. Mobile: full screen.
- Primary flow: phone number (+880 prefilled, validates 11-digit `01XXXXXXXXX`), then 6-digit OTP screen with auto-advancing boxes, paste support, autocomplete `one-time-code`, numeric keypad on mobile, 30-second resend timer. Mock OTP code is `123456`.
- Alternatives: email & password, optional Google button.
- States: invalid number, wrong code, too many attempts (locked for 5 min in mock), success redirect.

### 4.6 Dashboard (`/dashboard`)
- Greeting by name, credit balance chip with Buy more link.
- Big *Start new mock* card as primary action.
- Past sessions list: interview type, role or topic, date, status chip (Draft, Ready, Completed). Completed links show "Coming soon" tooltip for report/recording.
- Empty state for new users with "Your first mock is free" CTA, and rotating tips card from guidance content.

### 4.7 Interview setup wizard (`/interview/new`)
- Layout: mobile shows "Step 2 of 5" with progress bar; desktop shows vertical stepper on left, form in middle, live summary card on right.
- Step 1 (Type): 4 selectable cards (University viva, Job interview, BCS viva, Bank and MNC).
- Step 2 (CV): dropzone for PDF/DOCX up to 5MB, file chip (name, size, remove), inline errors, "Use my last CV" option when exists. Clear note that CV is used only for practice.
- Step 3 (Details):
  - Job & Bank/MNC: job title (required), company (required), job description (textarea with min-length hint), company details (optional).
  - University viva: course, subject, topics as chips, level.
  - BCS viva: preferred cadre (optional), strongest subjects, optional notes.
- Step 4 (Preferences): language cards (English, Bangla, Mixed), panel style (Friendly, Standard, Tough), length (10, 15, 20 min) with credit cost.
- Step 5 (Review): summary with Edit links, two required plain-language checkboxes (Terms/Privacy; Recording consent). Final CTA adapts: "Use free mock", "Use 1 credit", or "Pay and continue".
- Autosaves draft in `localStorage` under `abhoyy:draft`. Back button preserves state.

### 4.8 Checkout (`/checkout`)
- Order summary card (sticky on desktop).
- bKash flow UI: choose plan, Send money instructions with merchant number & exact amount, copy button with toast, input sender bKash number and TrxID, "Verifying" animation, Success/Pending/Failed states.
- Receipt: Order ID, plan, amount, date, masked TrxID, Download receipt button (mocked), "Continue to prepare room" CTA.

### 4.9 Prepare room (`/interview/[id]/prepare`)
- Layout: desktop checklist on left, device check on right. Mobile: two tabs (Checklist, Device check) with progress ring.
- Checklist: 6 points, all must be checked.
- Device check: camera preview with lighting hint ("Face a window or lamp so your face is bright" when dark), microphone permission & live level meter (amber for too quiet/loud, green for good), "Say your name out loud" prompt, nudge after 3s of low volume, speaker test sound, connection indicator.
- Screen Wake Lock API where supported.
- Calming 10-second breathing circle (inhale 4s, hold 2s, exhale 4s), then "I am ready".
- Gating: Start unlocks only when checklist is complete, mic permission granted & voice detected, camera granted (if `REQUIRE_CAMERA` is true).
- Denied permission: friendly step-by-step help for Chrome Android, iOS Safari, desktop Chrome.

### 4.10 Waiting room and interview room shell (`/interview/[id]/live`)
- Waiting room: 3 animated steps (Your panel is joining, Reading your CV and the role, Ready), ~1.2s each, orb animating, countdown 3-2-1 with "Take a breath. You are ready."
- Interview room desktop: large stage with AI orb & current question; side column with camera tile & live captions; control bar with mic, pause, end, language toggle, timer.
- Interview room mobile: orb top, question middle, floating camera tile, thumb-reachable controls bottom.
- Mock behaviour: 8 scripted questions. Waveform reacts to mic level. "Done answering" button -> 1.5s thinking state -> next question. After question 8, End of Phase 1 preview screen.
- Controls: Pause blurs question and stops timer; End opens confirmation; Help opens quick tips sheet. Persistent "Recording" dot with consent tooltip.
- Back-button confirmation to prevent accidental leave.

### 4.11 System pages
- 404 & error pages: orb, friendly message, dashboard/landing links.

---

## Part 5: Design system and motion

### Color tokens
| Token | Hex | Use |
| :--- | :--- | :--- |
| `ink-900` | `#0B0B14` | Main text, dark sections, hero |
| `ink-700` | `#1B1B2E` | Dark cards and surfaces |
| `violet-600` | `#5B2EFF` | Primary buttons and brand moments |
| `violet-700` | `#4520D6` | Primary hover and pressed |
| `violet-100` | `#ECE8FF` | Soft highlights on light sections |
| `paper` | `#F7F6FF` | Page background |
| `volt-400` | `#D7FF3F` | Energy accents, highlights on dark, focus ring on dark |
| `success-600` | `#1F9D6B` | Good mic level, strengths, success states |
| `amber-500` | `#F59E0B` | Needs work, warnings, mic too quiet or too loud |
| `gray-200` | `#E4E3F0` | Borders and dividers |
| `gray-600` | `#5B5B70` | Secondary text |

### Typography
| Style | Mobile size / line | Desktop size / line | Weight |
| :--- | :--- | :--- | :--- |
| Display | 40 / 44 | 72 / 76 | 800 |
| H1 | 32 / 38 | 52 / 58 | 800 |
| H2 | 26 / 32 | 40 / 46 | 700 |
| H3 | 20 / 28 | 28 / 36 | 700 |
| Body | 16 / 26 | 17 / 28 | 400 |
| Small | 14 / 22 | 14 / 22 | 500 |
| Caption | 12 / 18 | 12 / 18 | 500 |

*Note for Bangla*: +10% to 15% line-height, no negative letter spacing, no uppercase transforms.

### Motion specifications
Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Animate only `transform` and `opacity`.
- Hero reveal: 700ms, words stagger 60ms
- Swoosh draw: 900ms stroke draw
- Waveform loop: looping bars; reacts to mic level in room
- Scroll reveal: 500ms fade & rise 24px
- Count-up: 1200ms
- Magnetic button: spring (stiffness 300, damping 24), desktop only
- Step transition: 300ms slide in travel direction
- Drawer/sheet: 280ms slide
- Checklist tick: 250ms spring with small burst
- Breathing circle: 10s (inhale 4s, hold 2s, exhale 4s)
- Panel joining: 3 steps (~1.2s each) + 3-2-1 countdown
- `prefers-reduced-motion`: fade <= 150ms, stop loops (except mic meter)

---

## Part 6: Routes, data model and session lifecycle

### Routes
| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Landing page |
| `/how-it-works` | Public | Guidelines and how the product works |
| `/pricing` | Public | Plans and prices |
| `/terms`, `/privacy`, `/refunds` | Public | Legal pages |
| `/signup`, `/login` | Public (redirect to `/dashboard` when signed in) | Account access |
| `/dashboard` | Signed in | Credits and past sessions |
| `/interview/new` | Signed in | Setup wizard |
| `/checkout` | Signed in | bKash payment flow |
| `/interview/[id]/prepare` | Signed in, session ready | Checklist and device check |
| `/interview/[id]/live` | Signed in, session prepared | Waiting room and interview room |
| `/interview/[id]/report` | Signed in, session completed | Later phase |

### Data Model Types
```typescript
type InterviewType = 'university_viva' | 'job' | 'bcs_viva' | 'bank_mnc';
type Language = 'en' | 'bn' | 'mixed';
type PanelStyle = 'friendly' | 'standard' | 'tough';
type SessionStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'ready'
  | 'prepared'
  | 'live'
  | 'completed'
  | 'cancelled';

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  credits: number;
  freeMockUsed: boolean;
  locale: 'en' | 'bn';
}

interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  cvFileName: string;
  details: JobDetails | VivaDetails | BcsDetails;
  language: Language;
  panelStyle: PanelStyle;
  lengthMinutes: 10 | 15 | 20;
  consent: { terms: boolean; recording: boolean; acceptedAt: string };
  status: SessionStatus;
  createdAt: string;
}

interface JobDetails {
  jobTitle: string;
  company: string;
  jobDescription: string;
  companyDetails?: string;
}

interface VivaDetails {
  course: string;
  subject: string;
  topics: string[];
  level?: string;
}

interface BcsDetails {
  cadre?: string;
  strongSubjects: string[];
  notes?: string;
}

interface Payment {
  id: string;
  planId: string;
  amount: number;
  method: 'bkash';
  senderNumber: string;
  trxId: string;
  status: 'processing' | 'pending' | 'success' | 'failed';
  createdAt: string;
}

interface PricingPlan {
  id: 'free' | 'single' | 'pack';
  credits: number;
  price: number | null;
}
```

---

## Part 7: Copy deck in English and Bangla

See `locales/en.json` and `locales/bn.json` for full implementation matching the specifications in Part 7.

---

## Part 8: Acceptance criteria and QA checklist

### Quality targets
- Landing page performance: Mobile Lighthouse >= 80 on throttled 4G
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- JS weight: Landing page < ~200 KB gzipped
- Accessibility: Lighthouse >= 95, no critical axe violations
- Build health: No console errors, 0 hydration warnings, type check, lint & production build pass
