import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Candidate Dashboard — Your Mock Sessions & Reports',
  description: 'View your credit balance, past mock interview performance, and access diagnostic reports.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

