
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthForms from '@/components/auth/AuthForms';

function AuthPageSkeleton() {
    return (
        <div className="w-full h-full flex flex-col justify-center text-foreground">
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
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 p-0">
       <div className="hidden lg:flex flex-col items-center justify-center bg-muted p-10 relative">
          <div className="absolute inset-0">
             <Image
                src="/lgn.png"
                alt="ESystemLK Logo"
                fill
                className="object-contain p-20"
             />
          </div>
          <div className="relative z-10 text-center mt-auto">
             <h1 className="text-3xl font-bold text-foreground">ESystemLK</h1>
             <p className="text-muted-foreground mt-2">The best and the most professional service provider</p>
             <p className="text-xs text-muted-foreground mt-20">© ESystemLK. All rights reserved</p>
          </div>
       </div>

       <div className="flex items-center justify-center p-4 md:p-8 bg-background">
         <div className="mx-auto w-full max-w-sm p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-lg shadow-strong">
             <div className="grid gap-2 text-center mb-6">
               <Link href="/" className="flex justify-center items-center gap-2">
                   <Image src="/lg.png" alt="Logo" width={48} height={48} className="h-12 w-12" />
               </Link>
           </div>
            <Suspense fallback={<AuthPageSkeleton />}>
             <AuthForms />
           </Suspense>
         </div>
       </div>
    </div>
  );
}
