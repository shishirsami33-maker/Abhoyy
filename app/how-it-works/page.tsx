import type { Metadata } from 'next';
import { HowItWorksClient } from '@/components/HowItWorksClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/config/seo';

export const metadata: Metadata = {
  title: 'How It Works & Viva Preparation Guidelines',
  description:
    'Master your next viva and interview with Abhoyy. Essential preparation rules: lighting, audio checks, posture, and STAR answering techniques.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How It Works & Preparation Guidelines | Abhoyy',
    description:
      'Learn how to set up your device, practice with Bangladesh’s tailored AI interview board, and receive instant diagnostic reports.',
    url: `${SITE_URL}/how-it-works`,
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Practice Viva and Mock Interviews on Abhoyy',
  description:
    'Step-by-step instructions to set up your device, practice oral questions with an AI board, and review speech metrics.',
  totalTime: 'PT15M',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload Your CV / Resume',
      text: 'Upload your PDF or DOCX format resume. Abhoyy reads your specific projects, skills, and academic history.',
      url: `${SITE_URL}/interview/new`,
    },
    {
      '@type': 'HowToStep',
      name: 'Specify Target Role or Exam',
      text: 'Provide the job circular description, BCS cadre preference, or university viva syllabus topics.',
      url: `${SITE_URL}/interview/new`,
    },
    {
      '@type': 'HowToStep',
      name: 'Verify Camera and Microphone',
      text: 'Complete the pre-flight device inspection to ensure clear lighting and balanced voice input.',
    },
    {
      '@type': 'HowToStep',
      name: 'Speak to the AI Board',
      text: 'Answer realistic spoken questions in English, Bangla, or mixed code-switching.',
    },
    {
      '@type': 'HowToStep',
      name: 'Review Your Diagnostic Report',
      text: 'Receive timestamped feedback highlighting your strengths, filler-word counts, and stronger phrasing.',
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd schema={howToSchema} />
      <HowItWorksClient />
    </>
  );
}
