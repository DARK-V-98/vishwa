

"use client";

import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
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
  LogOut
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');

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
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      ...(hasAdminAccess ? [{ id: 'admin', label: 'Admin Panel', icon: Shield, href: '/admin' }] : []),
      { id: 'projects', label: 'My Projects', icon: FolderKanban, href: '/projects' },
      { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
      { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' },
      { id: 'vip', label: 'VIP Area', icon: Sparkles, href: '/vip-area' },
  ]

  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
            <Sidebar collapsible="icon">
                <SidebarHeader>
                     <Link href="/" className="flex items-center space-x-2 group">
                        <Image
                        src="/lg.png"
                        alt="Vishwa Vidarshana Logo"
                        width={30}
                        height={30}
                        className="rounded-lg group-hover:shadow-glow transition-all"
                        />
                        <span className="text-md font-bold bg-gradient-hero bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
                            Dashboard
                        </span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                             <SidebarMenuItem key={item.id}>
                                <Link href={item.href}>
                                    <SidebarMenuButton tooltip={item.label} isActive={item.href === router.pathname}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                 <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                                <LogOut />
                                <span>Sign Out</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <main className="flex-1 p-4 md:p-8 pt-20">
                <div className="flex items-center gap-4 mb-8">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                </div>
                 <Card>
                    <CardHeader>
                    <CardTitle>Welcome, {user.displayName || user.email}!</CardTitle>
                    <CardDescription>This is your central hub for managing all your activities on the platform.</CardDescription>
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
                    </CardContent>
                </Card>
            </main>
        </div>
    </SidebarProvider>
  );
}
