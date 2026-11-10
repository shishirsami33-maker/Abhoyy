'use client';

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { InterviewTypesMarquee } from '@/components/sections/InterviewTypesMarquee';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SampleReportSection } from '@/components/sections/SampleReportSection';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { PricingTeaserSection } from '@/components/sections/PricingTeaserSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaBandSection } from '@/components/sections/CtaBandSection';
import { MobileStickyCta } from '@/components/layout/MobileStickyCta';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <InterviewTypesMarquee />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SampleReportSection />
      <AudienceSection />
      <PricingTeaserSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBandSection />
      <MobileStickyCta />
    </div>
  );
}
