'use client';

import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';

export default function AuthPage() {
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
