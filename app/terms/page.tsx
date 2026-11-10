'use client';

import React from 'react';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { BRAND_NAME } from '@/config';

export default function TermsPage() {
  const sections = [
    { id: 'about', title: '1. About Abhoyy' },
    { id: 'practice-only', title: '2. Practice Tool Only (No Guarantee)' },
    { id: 'ai-accuracy', title: '3. AI Capabilities & Errors' },
    { id: 'eligibility', title: '4. Accounts & Age Policy' },
    { id: 'acceptable-use', title: '5. Acceptable Use' },
    { id: 'recording-consent', title: '6. Recording & Voice Consent' },
    { id: 'payments-credits', title: '7. Payments & Mock Credits' },
    { id: 'refunds', title: '8. Refunds & Cancellations' },
    { id: 'ip', title: '9. Intellectual Property' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'contact', title: '11. Contact & Legal Notices' },
  ];

  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="Please review these terms carefully before creating an account or conducting mock interviews."
      sections={sections}
    >
      <section id="about" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">1. About Abhoyy</h2>
        <p className="text-gray-600">
          {BRAND_NAME} (&ldquo;Abhoyy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides an artificial intelligence-assisted oral interview and viva preparation web application tailored for students, job candidates, and civil service aspirants in Bangladesh. By accessing or using Abhoyy, you agree to be bound by these Terms and Conditions.
        </p>
      </section>

      <section id="practice-only" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">
          2. Practice Tool Only — No Guarantee of Employment or Selection
        </h2>
        <p className="text-gray-600">
          <strong>Important Notice:</strong> Abhoyy is strictly an independent preparation and personal practice tool. Abhoyy is not affiliated with, endorsed by, or connected to any employer, university, recruitment board, or the Bangladesh Public Service Commission (BPSC).
        </p>
        <p className="text-gray-600 mt-2">
          Use of Abhoyy does not guarantee passing any examination, securing any job offer, or achieving any specific score or outcome in any real-world viva, interview, or selection process.
        </p>
      </section>

      <section id="ai-accuracy" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">3. AI Capabilities & Inherent Errors</h2>
        <p className="text-gray-600">
          Our interviewers and diagnostic evaluations are powered by synthetic machine learning and large language models. While we continuously refine our questions and scoring algorithms, AI feedback, transcripts, and evaluation ratings may occasionally contain inaccuracies, hallucinations, speech transcription errors, or misinterpretations of regional accents. AI output should be treated as guidance and suggestions, not legal or definitive professional advice.
        </p>
      </section>

      <section id="eligibility" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">4. Accounts & Age Policy</h2>
        <p className="text-gray-600">
          You must create an account using a valid Bangladeshi mobile number or verified email address. You are responsible for maintaining the confidentiality of your verification codes and credentials.
        </p>
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 text-xs sm:text-sm text-violet-950 mt-3">
          <strong>Product Decision / Policy Note:</strong> Abhoyy is intended for users who are at least 16 years of age (e.g. college or university students). Users under 18 years of age represent that they have received parental or guardian consent to use this service and submit CV documents for practice.
        </div>
      </section>

      <section id="acceptable-use" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">5. Acceptable Use</h2>
        <p className="text-gray-600">
          You agree to use Abhoyy solely for lawful personal self-improvement and interview preparation. You agree not to:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm">
          <li>Upload abusive, defamatory, obscene, or fraudulent resumes or materials.</li>
          <li>Attempt to reverse engineer, scrape, or extract our mock interview datasets or models.</li>
          <li>Impersonate another individual or misrepresent credentials on public boards.</li>
          <li>Interfere with our server infrastructure or security perimeters.</li>
        </ul>
      </section>

      <section id="recording-consent" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">6. Audio & Video Recording Consent</h2>
        <p className="text-gray-600">
          To provide speech diagnostics, filler-word tracking, and private video playback, Abhoyy requests camera and microphone access. By entering the live practice room, you provide explicit, revocable consent to capture audio and video of your mock session. In this preview phase, data is maintained strictly for your private review within your dashboard.
        </p>
      </section>

      <section id="payments-credits" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">7. Payments & Mock Credits</h2>
        <p className="text-gray-600">
          Mock sessions are accessed via mock credits. Every new user receives one (1) free initial mock session upon account creation. Additional single mocks or multi-packs may be purchased via bKash. All prices are listed in Bangladeshi Taka (BDT) and are subject to change with advance notice.
        </p>
      </section>

      <section id="refunds" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">8. Refunds & Cancellations</h2>
        <p className="text-gray-600">
          Please refer to our dedicated <Link href="/refunds" className="text-violet-600 font-bold underline">Refund Policy</Link> for detailed criteria governing technical failures, unspent credits, and manual verification resolutions.
        </p>
      </section>

      <section id="ip" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">9. Intellectual Property</h2>
        <p className="text-gray-600">
          The Abhoyy name, logo, UI designs, code, evaluation algorithms, and question banks are the exclusive intellectual property of Abhoyy. You retain all ownership rights in your uploaded resume and original interview recordings.
        </p>
      </section>

      <section id="liability" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">10. Limitation of Liability</h2>
        <p className="text-gray-600">
          To the maximum extent permitted by applicable laws of Bangladesh, Abhoyy and its founders shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this platform.
        </p>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">11. Contact & Legal Notices</h2>
        <p className="text-gray-600">
          If you have questions regarding these terms, contact our team at{' '}
          <span className="font-mono text-violet-600">legal@abhoyy.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
