'use client';

import React from 'react';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { BRAND_NAME } from '@/config';

export function RefundsClient() {
  const sections = [
    { id: 'overview', title: '1. Refund Philosophy' },
    { id: 'eligibility', title: '2. When Refunds Apply' },
    { id: 'non-refundable', title: '3. Non-Refundable Scenarios' },
    { id: 'credit-restore', title: '4. Automatic Credit Restoration' },
    { id: 'process', title: '5. How to Request a Refund' },
    { id: 'timeline', title: '6. Resolution & Disbursement Timeline' },
    { id: 'contact', title: '7. Payment Support' },
  ];

  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair rules regarding credit restorations, technical disruptions, and payment reversals."
      sections={sections}
    >
      <section id="overview" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">1. Refund Philosophy</h2>
        <p className="text-gray-600">
          At {BRAND_NAME}, we believe candidates should only pay for mock interviews that deliver genuine diagnostic value. If technical faults on our platform disrupt your practice session, we are committed to making it right through automatic credit restoration or full payment refund.
        </p>
      </section>

      <section id="eligibility" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">2. When Refunds Apply</h2>
        <p className="text-gray-600 mb-2">
          You are eligible for a mock credit restoration or financial refund via bKash in the following events:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-sm">
          <li><strong>System Outage:</strong> Our AI interviewer service encounters a crash or server timeout during an active mock interview.</li>
          <li><strong>Failed Report Generation:</strong> You completed your spoken answers, but our evaluation engine failed to generate your diagnostic report.</li>
          <li><strong>Duplicate Billing:</strong> You were billed more than once due to a duplicate transaction submission on bKash.</li>
          <li><strong>Unused Credit Pack Cancellation:</strong> You purchased a multi-pack but request cancellation within 48 hours without using any credits.</li>
        </ul>
      </section>

      <section id="non-refundable" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">3. Non-Refundable Scenarios</h2>
        <p className="text-gray-600 mb-2">
          Refunds cannot be issued for:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
          <li>Sessions that were fully completed and delivered a complete feedback report.</li>
          <li>Dissatisfaction with evaluation scores or AI observations (as scores reflect practice performance, not guaranteed outcomes).</li>
          <li>Disruptions caused by local hardware faults (e.g. your device battery drained or local mobile operator dropped signal).</li>
        </ul>
      </section>

      <section id="credit-restore" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">
          4. Automatic Credit Restoration
        </h2>
        <p className="text-gray-600">
          In line with our architecture, credits are only consumed when a session transitions to the <code>live</code> state. If you exit the setup wizard or device check before entering the live interview room, your credit balance remains completely untouched.
        </p>
      </section>

      <section id="process" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">5. How to Request a Refund</h2>
        <p className="text-gray-600">
          To initiate a refund request, send an email to <span className="font-mono text-violet-600">support@abhoyy.com</span> or WhatsApp our verified support line with:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm">
          <li>Your registered Bangladeshi mobile number.</li>
          <li>The bKash Transaction ID (TrxID) for the purchase.</li>
          <li>A brief description of the technical issue encountered.</li>
        </ul>
      </section>

      <section id="timeline" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">
          6. Resolution & Disbursement Timeline
        </h2>
        <p className="text-gray-600">
          Our support team reviews refund requests within <strong>24 hours</strong>. Once verified, refunds are disbursed directly back to the original sender bKash number within <strong>3 to 5 business days</strong>.
        </p>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2 className="text-2xl font-black text-ink-900 mb-3">7. Payment Support</h2>
        <p className="text-gray-600">
          Need immediate assistance with a payment or pending transaction? Reach out anytime at{' '}
          <span className="font-mono text-violet-600">billing@abhoyy.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}

