import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Log In to Your Abhoyy Account',
  description:
    'Sign in with your mobile number and one-time verification code to view your interview reports, credits, and active practice sessions.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
