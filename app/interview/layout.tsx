import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Session',
  description: 'Practice spoken mock interview and viva with an AI board.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

