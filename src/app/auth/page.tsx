
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-card shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Panel */}
        <div className="relative p-8 text-white hidden md:flex flex-col justify-between bg-primary">
          <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/auth-light/800/1200"
              alt="Abstract background"
              fill
              className="object-cover opacity-20"
              data-ai-hint="abstract texture light"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/lg.png"
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

        {/* Right Panel */}
        <div className="p-8 md:p-12 bg-background">
          <Suspense fallback={<AuthPageSkeleton />}>
            <AuthForms />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
