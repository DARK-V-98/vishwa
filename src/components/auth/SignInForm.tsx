
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onToggle: () => void;
}

export default function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center text-white">
      <h2 className="text-3xl font-bold mb-2">Sign in to your account</h2>
      <p className="text-zinc-400 mb-8">
        Don't have an account?{" "}
        <Button variant="link" onClick={onToggle} className="p-0 h-auto text-primary">
          Sign up
        </Button>
      </p>

      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email-signin">Email</Label>
          <Input
            id="email-signin"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signin">Password</Label>
          <div className="relative">
            <Input
              id="password-signin"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
              placeholder="Enter your password"
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

        <Button type="submit" className="w-full !mt-10 bg-primary hover:bg-primary/90 text-primary-foreground text-md py-6">
          Sign In
        </Button>
      </form>
    </div>
  );
}
