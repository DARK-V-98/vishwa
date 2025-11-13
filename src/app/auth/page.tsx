
import { Suspense } from 'react';
import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';

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

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
       <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-card rounded-2xl shadow-strong overflow-hidden">
          {/* Left Panel */}
          <div className="hidden md:block relative w-full h-full">
             <Image 
                src="/lgn.png"
                alt="Brand Logo"
                fill
                className="object-cover"
                sizes="50vw"
             />
          </div>
          
          {/* Right Panel */}
          <div className="flex items-center justify-center p-8 md:p-12">
             <Suspense fallback={<AuthPageSkeleton />}>
                <AuthForms />
             </Suspense>
          </div>
       </div>
    </div>
  );
}
