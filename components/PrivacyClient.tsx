'use client';

import React from 'react';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { BRAND_NAME } from '@/config';

export function PrivacyClient() {
  const sections = [
    { id: 'overview', title: '1. Privacy Commitment' },
    { id: 'data-collected', title: '2. Information We Collect' },
    { id: 'purpose', title: '3. Why We Collect Your Data' },
    { id: 'retention', title: '4. Data Retention (Policy Placeholder)' },
    { id: 'deletion', title: '5. How to Delete Your Data' },
    { id: 'access', title: '6. Who Can Access Your Data' },
    { id: 'security', title: '7. Data Security Measures' },
    { id: 'children', title: '8. Age & Minors Policy' },
    { id: 'contact', title: '9. Contact Privacy Officer' },
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How Abhoyy collects, protects, and respects your resume, recordings, and personal data."
      sections={sections}
    >
      <section id="overview" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">1. Privacy Commitment</h2>
        <p className="text-gray-600">
          At {BRAND_NAME}, we understand that interview preparation involves vulnerable moments and sensitive personal information. We are committed to maintaining the highest privacy standards for candidates across Bangladesh. We will never sell, lease, or publicly share your resume or mock interview recordings.
        </p>
      </section>

      <section id="data-collected" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">2. Information We Collect</h2>
        <p className="text-gray-600 mb-2">
          When you use Abhoyy, we may collect the following categories of data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-sm">
          <li><strong>Contact Information:</strong> Bangladeshi mobile phone number and optional email address.</li>
          <li><strong>Curriculum Vitae (CV) & Resume:</strong> Text, education history, projects, and work experience extracted from uploaded PDF/DOCX files.</li>
          <li><strong>Target Role & Circular Details:</strong> Job titles, target companies, job circular descriptions, and academic topics.</li>
          <li><strong>Audio & Video Recordings:</strong> Spoken responses and camera feed recorded during live mock interviews.</li>
          <li><strong>Transcripts & Diagnostic Metrics:</strong> Text transcription of your answers, pacing stats (WPM), filler-word counts, and AI-generated suggestions.</li>
          <li><strong>Payment References:</strong> bKash sender account number and bKash Transaction ID (TrxID) for verification. We never process or store your personal bKash PIN.</li>
        </ul>
      </section>

      <section id="purpose" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">3. Why We Collect Your Data</h2>
        <p className="text-gray-600">
          We collect and process this data solely to:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm">
          <li>Generate tailored interview questions matching your specific resume and target job.</li>
          <li>Provide real-time speech analytics and construct your post-session diagnostic report.</li>
          <li>Enable you to privately playback your interview recording and view timestamped flagged moments.</li>
          <li>Verify bKash credit purchases and prevent fraud.</li>
        </ul>
      </section>

      <section id="retention" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">
          4. Data Retention (Policy Placeholder)
        </h2>
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 text-xs sm:text-sm text-violet-950 mb-3">
          <strong>Retention Placeholder:</strong> Under our current v1 architecture, uploaded CV files and video recordings are stored locally in the browser memory for immediate review. Once persistent cloud storage is deployed, interview recordings will be retained for thirty (30) days by default, allowing candidates ample time to review before automatic purge.
        </div>
      </section>

      <section id="deletion" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">5. How to Delete Your Data</h2>
        <p className="text-gray-600">
          You have full control over your data. You may delete any past mock session, uploaded resume, or recording at any time directly from your user dashboard. To permanently remove your entire account and associated transaction history, you can email{' '}
          <span className="font-mono text-violet-600">privacy@abhoyy.com</span> and our team will purge all records within 48 hours.
        </p>
      </section>

      <section id="access" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">6. Who Can Access Your Data</h2>
        <p className="text-gray-600">
          Only you have access to your mock recordings and reports through your authenticated account. Our automated evaluation pipeline analyzes text without human review. We do not license or sell your practice recordings to employers or third-party recruiters.
        </p>
      </section>

      <section id="security" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">7. Data Security Measures</h2>
        <p className="text-gray-600">
          All data in transit is encrypted using modern TLS (HTTPS) protocols. Access to internal databases is restricted through role-based access control and encrypted object storage.
        </p>
      </section>

      <section id="children" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">8. Age & Minors Policy</h2>
        <p className="text-gray-600">
          Abhoyy is not designed for children under 16 years of age. If we learn that we have collected personal data from a child under 16 without parental authorization, we will promptly delete that data.
        </p>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">9. Contact Privacy Officer</h2>
        <p className="text-gray-600">
          For any data protection inquiries or requests, contact our Privacy Officer at{' '}
          <span className="font-mono text-violet-600">privacy@abhoyy.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}

