
"use client";

import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Crown, Code, ShoppingCart, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const { data: adminRole, isLoading: adminLoading } = useDoc(useMemoFirebase(() => user ? doc(firestore, 'roles_admin', user.uid) : null, [user, firestore]));
  const { data: devRole, isLoading: devLoading } = useDoc(useMemoFirebase(() => user ? doc(firestore, 'roles_developer', user.uid) : null, [user, firestore]));
  const { data: customerRole, isLoading: customerLoading } = useDoc(useMemoFirebase(() => user ? doc(firestore, 'roles_customer', user.uid) : null, [user, firestore]));
  
  const isLoading = isUserLoading || adminLoading || devLoading || customerLoading;
  
  const roles = useMemo(() => {
    const userRoles = [];
    if (adminRole) userRoles.push({ name: 'Admin', icon: Crown });
    if (devRole) userRoles.push({ name: 'Developer', icon: Code });
    if (customerRole) userRoles.push({ name: 'Customer', icon: ShoppingCart });
    return userRoles;
  }, [adminRole, devRole, customerRole]);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push("/");
    });
  };

  if (isLoading || !user) {
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
          <CardDescription>You are signed in as {user.email}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Your Roles</h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary"><UserIcon className="h-4 w-4 mr-1" /> User</Badge>
                    {roles.map(role => (
                        <Badge key={role.name}>
                            <role.icon className="h-4 w-4 mr-1" /> {role.name}
                        </Badge>
                    ))}
                    {roles.length === 0 && <p className="text-sm text-muted-foreground">You have no additional roles.</p>}
                </div>
            </div>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
