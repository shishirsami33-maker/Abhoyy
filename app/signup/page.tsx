import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Sign Up — Practice Your First AI Mock Interview Free',
  description:
    'Create your free Abhoyy account using your Bangladeshi mobile number. Your first 20-minute mock viva is completely free with zero credit card required.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/signup',
  },
};

export default function SignupPage() {
  return <AuthCard mode="signup" />;
}
