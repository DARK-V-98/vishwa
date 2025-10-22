"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/signin");
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push("/");
    });
  };

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You are signed in as {user.email}.</p>
          <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
