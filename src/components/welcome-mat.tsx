
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, ArrowRight } from "lucide-react";
import Image from "next/image";

const STORAGE_KEY = "vishwa-welcome-mat-dismissed";

const LoadingSpinner = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-primary">Loading...</p>
      </div>
    </div>
);


export default function WelcomeMat() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // Default to dismissed to avoid flash

  useEffect(() => {
    // Only run this logic on the client
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  useEffect(() => {
    if (isUserLoading || isDismissed || user) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [isUserLoading, isDismissed, user]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    setIsDismissed(true);
  };

  const handleRegister = () => {
    handleDismiss();
    router.push("/auth?form=signup");
  };

  if (isUserLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0" onEscapeKeyDown={handleDismiss}>
        <div className="relative h-40 w-full">
            <Image 
                src="https://picsum.photos/seed/welcome/600/200"
                alt="Welcome Banner"
                fill
                className="object-cover"
                data-ai-hint="abstract texture vibrant"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
             <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles />
                    Welcome!
                </h2>
             </div>
        </div>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Join Our Community</DialogTitle>
          <DialogDescription>
            Create an account to access your dashboard, manage projects, and get exclusive offers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 p-6 pt-0">
          <Button onClick={handleRegister} variant="hero" size="lg">
            <LogIn className="mr-2 h-4 w-4" /> Register Now
          </Button>
          <Button onClick={handleDismiss} variant="ghost">
            Skip for Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
