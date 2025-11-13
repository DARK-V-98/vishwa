
'use client';

import { Suspense, useEffect } from 'react';
import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';
import { useAuth, useFirestore } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function AuthPageSkeleton() {
    return (
        <div className="w-full h-full flex flex-col justify-center text-foreground p-8">
            <div className="h-10 bg-muted rounded w-1/2 mb-2 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-8 animate-pulse"></div>
            <div className="space-y-6">
                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
            </div>
        </div>
    )
}

function AuthRedirectHandler() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  // Handle Google Sign-In redirect result
  useEffect(() => {
    const processRedirectResult = async () => {
      try {
        if (!auth || !firestore) return;

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

            await batch.commit();
            toast.success("Welcome! Your account has been created.");
          } else {
            toast.success("Welcome back!");
          }
          router.push('/dashboard');
        }
      } catch (error: any) {
        // Avoid showing an error if the user just landed on the page without a redirect attempt
        if (error.code !== 'auth/no-auth-event' && error.code !== 'auth/popup-closed-by-user') {
            toast.error(`Sign-in failed: ${error.message}`);
        }
      }
    };
    
    processRedirectResult();
  }, [auth, firestore, router]);

  return null; // This component doesn't render anything
}


export default function AuthPage() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="/lgn.png"
          alt="Image"
          fill
          className="object-contain p-12"
          sizes="50vw"
        />
      </div>
      <div className="flex items-center justify-center py-12 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto grid w-[350px] gap-6">
            <Suspense fallback={<AuthPageSkeleton />}>
                <AuthRedirectHandler />
                <AuthForms />
            </Suspense>
        </div>
      </div>
    </div>
  );
}
