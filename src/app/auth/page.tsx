
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
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-full max-w-sm gap-6">
           <Suspense fallback={<AuthPageSkeleton />}>
            <AuthForms />
          </Suspense>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
         <div className="relative p-8 text-white h-full flex flex-col justify-between bg-primary">
          <div className="absolute inset-0">
            <Image
              src="/lgn.png"
              alt="Vishwa Vidarshana Logo Background"
              fill
              className="object-contain p-20 opacity-20"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/lgn.png"
                alt="Vishwa Vidarshana Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-primary-foreground">
                Vishwa Vidarshana
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-primary-foreground">Welcome to the Platform</h2>
            <p className="text-primary-foreground/80 mt-2">Your one-stop solution for digital excellence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
