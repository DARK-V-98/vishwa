
'use client';

import Image from 'next/image';
import AuthForms from '@/components/auth/AuthForms';

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
          <AuthForms />
        </div>
      </div>
    </div>
  );
}
