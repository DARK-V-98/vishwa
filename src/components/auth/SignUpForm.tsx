
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "../ui/separator";

interface SignUpFormProps {
  onToggle: () => void;
}

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the Terms & Conditions.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      
      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`.trim(), // simple username generation
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          username: null,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        });
        toast.success("Welcome! Please complete your profile.");
        router.push("/auth/complete-profile");
      } else {
        toast.success("Signed in with Google successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center text-foreground">
      <h2 className="text-3xl font-bold mb-2">Create an account</h2>
      <p className="text-muted-foreground mb-8">
        Already have an account?{" "}
        <Button variant="link" onClick={onToggle} className="p-0 h-auto text-primary">
          Log in
        </Button>
      </p>

       <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <GoogleIcon />
        Sign up with Google
      </Button>

      <div className="flex items-center my-6">
        <Separator className="flex-grow" />
        <span className="mx-4 text-xs text-muted-foreground">OR</span>
        <Separator className="flex-grow" />
      </div>


      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="flex gap-4">
          <div className="space-y-2 w-1/2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2 w-1/2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <Input
            id="email-signup"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signup">Password</Label>
          <div className="relative">
            <Input
              id="password-signup"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-background border-border"
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

        <div className="flex items-center space-x-2">
            <Checkbox id="terms" onCheckedChange={(checked) => setAgreed(!!checked)} />
            <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>
            </label>
        </div>

        <Button type="submit" className="w-full !mt-10 bg-primary hover:bg-primary/90 text-primary-foreground text-md py-6">
          Create account
        </Button>
      </form>
    </div>
  );
}
