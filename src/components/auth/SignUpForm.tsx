
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface SignUpFormProps {
  onToggle: () => void;
}

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the Terms & Conditions.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // You might want to save the first and last name to the user's profile here
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center text-white">
      <h2 className="text-3xl font-bold mb-2">Create an account</h2>
      <p className="text-zinc-400 mb-8">
        Already have an account?{" "}
        <Button variant="link" onClick={onToggle} className="p-0 h-auto text-primary">
          Log in
        </Button>
      </p>

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
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
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
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
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
            className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
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
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
            />
             <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full px-3 text-zinc-400 hover:text-white"
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
                className="text-sm text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
