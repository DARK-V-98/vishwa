
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
    <div className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <Link href="/" className="flex justify-center items-center gap-2">
                  <Image src="/lg.png" alt="Logo" width={48} height={48} className="h-12 w-12" />
              </Link>
          </div>
           <Suspense fallback={<AuthPageSkeleton />}>
            <AuthForms />
          </Suspense>
        </div>
    </div>
  );
}
