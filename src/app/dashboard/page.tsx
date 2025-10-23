
"use client";

import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAuth, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Code,
  ShoppingCart,
  User as UserIcon,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Calendar,
  Sparkles,
  Shield,
  LogOut,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  
  const hasAdminAccess = !!(adminRole || devRole);

  const menuItems = [
      { id: 'projects', label: 'My Projects', icon: FolderKanban, href: '/projects', description: 'Track your ongoing projects' },
      { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments', description: 'Manage your meetings' },
      { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', description: 'View your conversations' },
      { id: 'vip', label: 'VIP Area', icon: Sparkles, href: '/vip-area', description: 'Access exclusive content' },
      ...(hasAdminAccess ? [{ id: 'admin', label: 'Admin Panel', icon: Shield, href: '/admin', description: 'Manage users and site data' }] : []),
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-24 pb-12">
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Welcome, {user.displayName || user.email}!</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    This is your central hub. Manage projects, appointments, and more.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary"><UserIcon className="h-4 w-4 mr-1" /> User</Badge>
                    {roles.map(role => (
                        <Badge key={role.name}>
                            <role.icon className="h-4 w-4 mr-1" /> {role.name}
                        </Badge>
                    ))}
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
