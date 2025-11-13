
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

export default function AuthForms() {
  const searchParams = useSearchParams();
  const formParam = searchParams.get('form');
  const [isSignIn, setIsSignIn] = useState(formParam !== 'signup');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    setIsSignIn(formParam !== 'signup');
  }, [formParam]);

  // Handle Google Sign-In redirect result
  useEffect(() => {
    const processRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // New user, create their profile
            const batch = writeBatch(firestore);
            const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
            const lastName = lastNameParts.join(' ');
            
            batch.set(userDocRef, {
              id: user.uid,
              firstName: firstName || '',
              lastName: lastName || '',
              username: user.email, // default to email
              email: user.email,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              roles: ['customer']
            });

            const customerRoleRef = doc(firestore, "roles_customer", user.uid);
            batch.set(customerRoleRef, {
              id: user.uid,
              firstPurchaseAt: serverTimestamp(),
            });

            await batch.commit();
            toast.success("Welcome! Your account has been created.");
          } else {
            toast.success("Welcome back!");
          }
          router.push('/dashboard');
        }
      } catch (error: any) {
        // Avoid showing an error if the user just landed on the page without a redirect attempt
        if (error.code !== 'auth/no-auth-event') {
            toast.error(`Sign-in failed: ${error.message}`);
        }
      }
    };
    
    processRedirectResult();
  }, [auth, firestore, router]);


  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return isSignIn ? <SignInForm onToggle={toggleForm} /> : <SignUpForm onToggle={toggleForm} />;
}
