
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAuth, signOut } from "firebase/auth";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  MessageSquare,
  Calendar,
  Sparkles,
  Shield,
  LogOut,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  roles?: string[];
  username?: string;
  email?: string;
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

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
  
  const isAdminOrDeveloper = useMemo(() => {
    if (!userProfile?.roles) return false;
    return userProfile.roles.includes('admin') || userProfile.roles.includes('developer');
  }, [userProfile]);

  const menuItems = useMemo(() => {
    const items = [
      { id: 'orders', label: 'My Orders', icon: ShoppingBag, href: '/my-orders', description: 'View your top-up history' },
      { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', description: 'Chat with support' },
      { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments', description: 'Manage your meetings' },
      { id: 'vip', label: 'VIP Area', icon: Sparkles, href: '/vip-area', description: 'Access exclusive content' },
    ];
    
    if (isAdminOrDeveloper) {
        items.push({ id: 'admin', label: 'Admin Panel', icon: Shield, href: '/admin', description: 'Manage users and site data' });
    }

    return items;
  }, [isAdminOrDeveloper]);

  if (isUserLoading || isProfileLoading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-24 pb-12">
            <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                 </div>
            </main>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-24 pb-12">
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Welcome, {user.displayName || userProfile?.username || user.email}!</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    This is your central hub. Manage projects, appointments, and more.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {userProfile?.roles?.map(role => (
                        <Badge key={role} variant="secondary" className="capitalize"><UserIcon className="h-4 w-4 mr-1" /> {role}</Badge>
                    ))}
                    {isAdminOrDeveloper && <Badge variant="destructive">Admin Access</Badge>}
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {menuItems.map(item => (
                     <Link key={item.id} href={item.href} className="group">
                        <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary transition-colors">
                                        <item.icon className="h-6 w-6" />
                                        {item.label}
                                    </CardTitle>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
             </div>

             <div className="text-center mt-12">
                <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
             </div>
        </main>
    </div>
  );
}
