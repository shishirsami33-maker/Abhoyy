# AGENTS.md — Abhoyy Master Instructions

## Role and Goal
You are a senior front-end engineer and product designer. Build the complete front end of Abhoyy, a Bangladesh-first AI mock interview and viva platform. Users upload a CV, add job or course details, and practice a spoken interview with an AI panel. Abhoyy (অভয়) means fearless: the product exists to take the fear out of interviews and vivas for students, fresh graduates, BCS candidates and job seekers in Bangladesh.
This task is front end only. There is no real backend yet. Build every screen with realistic mock data behind a clean service layer, so a real backend can be plugged in later without touching the UI.

## Tech Stack
- **Next.js (App Router)** with TypeScript, deployed on Vercel
- **Tailwind CSS** with a custom design-token setup (colors, spacing, radius, type scale) in one config
- **Framer Motion** for animation (GSAP only if truly needed for the hero)
- **Lucide icons**; custom SVG for brand motifs
- **Simple i18n** with English and Bangla (বাংলা) JSON files and a language toggle; all copy must come from these files, nothing hardcoded in components
- **Fonts**: a bold geometric Latin font (Sora, Manrope or Plus Jakarta Sans) paired with a Bangla font (Anek Bangla or Hind Siliguri), loaded with `next/font` and proper fallbacks
- **Real browser APIs** where they make the experience real: `getUserMedia` (camera and mic permission), Web Audio `AnalyserNode` (live mic level), `MediaRecorder` (local preview recording). Everything the AI would do (questions, voice, scoring) is mocked.

## Brand
- **Name**: Abhoyy (অভয়), spelled exactly this way in the logo, page titles, metadata, copy and code comments. Keep it in one `BRAND_NAME` constant in a config file.
- **Logo**: The logo is a bold angular A with a microphone beneath it, a crimson swoosh and a small sparkle, next to a heavy sans wordmark whose 'o' holds a play button, with a crimson underline swoosh. Save the final Abhoyy logo as `/public/brand/logo.png`, then recreate it as an SVG React component (`Logo`) with variants: full lockup, mark only (A with mic), and white-on-dark. On the site always use the single-color versions (ink on light backgrounds, white on dark), so the logo's crimson never clashes with the violet.
- **Palette** (chosen for the product, not matched to the logo):
  - Electric violet (`#5B2EFF`) as the signature color
  - Volt lime accent (`#D7FF3F`) for energy
  - Near-black ink (`#0B0B14`)
  - Cool off-white (`#F7F6FF`)
  - Calm green for success (`#1F9D6B`)
  - Amber for needs work / warnings (`#F59E0B`)
  - No other brand colors.
  - *Rule*: violet is for brand moments and primary buttons; volt is for highlights and is never used as text on a light background. Never use red to show weak scores or errors; use amber for needs-work and a neutral tone for neutral states, because this audience is already anxious.
- **Personality**: Confident, energetic, bold. Not corporate-formal like premium coaching centers, and not a generic SaaS template.

## Design Language
- Oversized, heavy typography with tight headlines; high contrast between ink, off-white, violet and volt
- Sharp diagonals and angles that echo the A mark; the orbit swoosh and sparkle as recurring motifs (section dividers, hover effects, loaders)
- Sound-wave and microphone motifs used with restraint
- Alternate dark (ink) and light (off-white) sections for rhythm; the hero is dark ink with a violet glow and one volt highlight
- Cards with generous radius, strong shadows on hover, and clear focus states
- No stock-photo clutter. Prefer bold illustration, UI mockups and abstract shapes. Keep imagery light for mid-range Android phones on limited data.

## Motion (Cool but disciplined)
- Hero: animated sound-wave and orb that pulses as if listening; headline reveals word by word; the logo's orbit swoosh draws on load
- Scroll reveals, count-up numbers, and a marquee of interview types (University viva, Job interview, BCS viva, Bank and MNC)
- Magnetic buttons and hover effects on desktop only; tap feedback on mobile
- Page transitions between steps of the interview setup
- Animate only transform and opacity, target 60fps, lazy-load below the fold
- Respect `prefers-reduced-motion` by disabling or simplifying all animations

## Responsive Rules
- Mobile first, designed at 360px, then 768px, 1280px and a wide 1440px+ layout
- Header becomes a slide-in drawer on mobile; a sticky bottom CTA bar on mobile for the main action
- Touch targets at least 44px, safe-area padding for notched phones, no horizontal scroll at any width
- Performance budget: fast first paint on 4G, optimized images, no heavy video or 3D
- Accessibility: WCAG AA contrast, full keyboard navigation, visible focus rings, correct aria labels, lang attributes for English and Bangla, and a font stack that renders Bangla correctly

## Global Components
- **Header**: logo, nav (How it works, Interview types, Pricing, FAQ), language toggle (EN | বাংলা), Log in, and a prominent Start free mock button. Sticky, shrinks on scroll, drawer on mobile.
- **Footer**: logo and tagline, product links, legal links (Terms, Privacy, Refund policy), contact, social links, a bKash payment badge, a Made in Bangladesh line, and a disclaimer: *Abhoyy is a practice tool and is not affiliated with any employer, university or public service commission.*
- **Shared states**: loading skeletons, empty states, friendly error states, offline banner, custom 404 and error pages, toast notifications.

## Pages to Build
1. **Landing page (`/`)**
   - Hero with headline (Bangla option: ভয় নয়, অভয়।; English option: Walk in fearless.), short subline, primary CTA *Start free mock*, secondary CTA *See how it works*, animated interview-screen mockup
   - Problem section: the blank-mind, shaky-voice moment, relatable and respectful tone
   - How it works in 4 steps: Upload CV, Add the job or course details, Practice with the AI panel, Get your report
   - Features: questions based on your own CV, follow-ups like a real panel, English, Bangla and mixed language, report of what the AI flagged, full recorded interview, private by design
   - Interactive sample report preview (tabs or slider showing strengths, flags, stronger sample answer)
   - Who it is for: college and university students, fresh graduates, BCS candidates, job seekers
   - Pricing teaser with pay-per-mock and packs (placeholders ৳ XX)
   - Testimonials: clearly marked placeholder cards only
   - FAQ accordion and closing CTA band
2. **How it works and Guidelines (`/how-it-works`)**: preparation advice presented as an interactive page
3. **Pricing (`/pricing`)**: one free first mock, single mock, packs; physical coaching comparison; bKash payment note; FAQ
4. **Terms (`/terms`), Privacy (`/privacy`), Refund policy (`/refunds`)**: structured layout with sticky table of contents, draft text with banner
5. **Sign up and Log in (`/signup`, `/login`)**: phone number with OTP flow (mock code 123456), email alternative, Google sign-in button
6. **Dashboard (`/dashboard`)**: welcome, credit balance, Start new mock button, past sessions list with status, empty state
7. **Interview setup wizard (`/interview/new`)**:
   - Step 1: choose type (University viva, Job interview, BCS viva, Bank and MNC)
   - Step 2: upload CV (drag & drop, PDF/DOCX, 5MB limit, validation, preview card)
   - Step 3: job or course details
   - Step 4: preferences (language, panel style, length)
   - Step 5: review and consent (Terms & recording consent)
   - Autosave draft in `localStorage` under `abhoyy:draft`
8. **Checkout (`/checkout`)**: bKash payment flow UI (Send money instructions, bKash number, TrxID input, processing, pending, success, failed, receipt)
9. **Prepare room (`/interview/[id]/prepare`)**: pre-interview guidance checklist and real device check (camera, mic live meter, speaker test, lighting hint, breathing exercise)
10. **Waiting room and interview room shell (`/interview/[id]/live`)**: animated "Your panel is joining" sequence, breathing moment, interview room with animated AI orb, scripted questions, live mic reaction, done answering, pause/end modals, end preview screen
11. **Later Phase**: Report page (`/interview/[id]/report`) & Recording page (`/interview/[id]/recording`)

## Architecture
- Service layer in `/lib/api` with typed functions and mock implementations: `auth`, `credits`, `uploads`, `sessions`, `payments`, `reports`, `recordings`
- TypeScript types in `/types`
- Central config in `/config/index.ts`
- Locales in `/locales/en.json` and `/locales/bn.json`
- Design tokens in `tailwind.config.ts` and `globals.css`

## Rules
- Do not invent testimonials, user numbers, partnerships or claims of results
- Do not store uploaded CVs or recordings anywhere persistent in this phase; keep them in memory or local preview only
- Every screen must work at 360px width and at 1440px width
- Run type checks, lint and a production build after each phase and fix every error before continuing

