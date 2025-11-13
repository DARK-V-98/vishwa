'use client';

import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AuthPageContent() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl shadow-strong overflow-hidden bg-background">
        <div className="hidden lg:flex relative">
          <Image
            src="/lgn.png"
            alt="Vishwa Vidarshana Branding"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-sm gap-6">
                <AuthForms />
            </div>
        </div>
      </div>
    </div>
  );
}

function AuthSkeleton() {
    return (
        <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
            <div className="space-y-4">
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-10 w-full" />
            </div>
             <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
    )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl shadow-strong overflow-hidden bg-background">
                 <div className="hidden lg:flex relative bg-muted">
                    <Skeleton className="h-full w-full" />
                 </div>
                 <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <AuthSkeleton />
                 </div>
            </div>
        </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
