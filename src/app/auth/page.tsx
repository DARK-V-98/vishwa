
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-[#1e1e2f] shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Panel */}
        <div className="relative p-8 text-white hidden md:flex flex-col justify-between">
          <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/auth-bg/800/1200"
              alt="Desert landscape"
              fill
              className="object-cover opacity-30"
              data-ai-hint="desert dune night"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2f] via-transparent"></div>
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
              <span className="text-xl font-bold">
                Vishwa Vidarshana
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold">Capturing Moments, Creating Memories</h2>
            <div className="flex items-center gap-2 mt-4">
              <span className="h-1.5 w-4 rounded-full bg-white/30"></span>
              <span className="h-1.5 w-4 rounded-full bg-white/30"></span>
              <span className="h-1.5 w-8 rounded-full bg-white"></span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12 bg-[#2c2c3e]">
            {isSignIn ? <SignInForm onToggle={toggleForm} /> : <SignUpForm onToggle={toggleForm} />}
        </div>
      </div>
    </div>
  );
}
