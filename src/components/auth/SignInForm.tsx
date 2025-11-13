
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onToggle: () => void;
}

export default function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        toast.error("Firebase is not initialized. Please try again later.");
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const batch = writeBatch(firestore);
        
        batch.set(userDocRef, {
          id: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          username: user.email,
          firstName: '',
          lastName: '',
          roles: ['customer']
        });

        await batch.commit();
        toast.success("Welcome! Your profile has been initialized.");
      } else {
        const userData = userDoc.data();
        if (!userData.roles || userData.roles.length === 0) {
            await updateDoc(userDocRef, {
              roles: ['customer'],
              updatedAt: serverTimestamp()
            });
            toast.info("Your profile has been updated with default roles.");
        }
        toast.success("Signed in successfully!");
      }

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-4">
        <form onSubmit={handleSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email-signin">Email</Label>
            <Input
              id="email-signin"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password-signin">Password</Label>
            <div className="relative">
              <Input
                id="password-signin"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" onClick={onToggle} className="p-0 h-auto">
            Sign up
          </Button>
        </div>
      </div>
    </>
  );
}
