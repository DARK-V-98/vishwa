"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="container mx-auto px-4 py-12 pt-24 flex items-center justify-center min-h-screen">
      <div className={cn("flip-card w-full max-w-md h-[550px]")}>
        <div
          className={cn("flip-card-inner", {
            "[transform:rotateY(180deg)]": isFlipped,
          })}
        >
          <div className="flip-card-front">
            <SignInForm onFlip={handleFlip} />
          </div>
          <div className="flip-card-back">
            <SignUpForm onFlip={handleFlip} />
          </div>
        </div>
      </div>
    </div>
  );
}
