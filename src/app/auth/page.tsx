
'use client';

import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl shadow-strong overflow-hidden bg-background">
        <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-hero text-primary-foreground relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center gap-3">
                <Image
                    src="/lg.png"
                    alt="Vishwa Vidarshana Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                <span className="text-xl font-bold">Vishwa Vidarshana</span>
            </div>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold">Welcome to the Platform</h1>
                <p className="text-primary-foreground/80 mt-2">Your one-stop solution for digital excellence.</p>
            </div>
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
