
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
          <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10 relative">
             <div className="absolute inset-0">
                <Image 
                    src="https://picsum.photos/seed/auth-bg/600/800"
                    alt="Gamers"
                    fill
                    className="object-cover"
                    data-ai-hint="people gaming vr"
                />
                <div className="absolute inset-0 bg-primary/80"></div>
             </div>
             <div className="relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <Image
                        src="/lg.png"
                        alt="Vishwa Vidarshana Logo"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <span className="text-lg font-bold">Vishwa Vidarshana</span>
                </div>
             </div>
             <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold">Welcome to the Platform</h2>
                <p className="text-primary-foreground/80 mt-2">Your one-stop solution for digital excellence.</p>
             </div>
             {/* This empty div helps with the justify-between */}
             <div className="relative z-10 w-full h-10"></div>
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
