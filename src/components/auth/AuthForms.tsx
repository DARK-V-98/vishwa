
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

export default function AuthForms() {
  const searchParams = useSearchParams();
  const formParam = searchParams.get('form');
  const [isSignIn, setIsSignIn] = useState(formParam !== 'signup');

  useEffect(() => {
    setIsSignIn(formParam !== 'signup');
  }, [formParam]);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return isSignIn ? <SignInForm onToggle={toggleForm} /> : <SignUpForm onToggle={toggleForm} />;
}
