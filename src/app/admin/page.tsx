
'use client';

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingManagement } from "@/components/admin/listing-management";
import TopupManagement from "@/components/admin/topup-management";
import TopupOrderManagement from "@/components/admin/topup-order-management";
import PaymentSettings from "@/components/admin/payment-settings";
import { useUser, useFirestore } from "@/firebase";
import AdminChat from "@/components/admin/admin-chat";
import TestimonialManagement from "@/components/admin/testimonial-management";
import { doc, getDoc } from "firebase/firestore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UserManagement from "@/components/admin/user-management";

interface UserProfile {
  roles?: string[];
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user || !firestore) {
        setIsCheckingRole(false);
        return;
      }

      // Check for primary admin email first
      if (user.email === 'tikfese@gmail.com') {
        setIsAdmin(true);
        setIsCheckingRole(false);
        return;
      }
      
      // Then, check Firestore for roles
      const userDocRef = doc(firestore, "users", user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userProfile = userDoc.data() as UserProfile;
          if (userProfile.roles && (userProfile.roles.includes('admin') || userProfile.roles.includes('developer'))) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
            setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingRole(false);
      }
    }

    if (!isUserLoading) {
        checkUserRole();
    }
  }, [user, isUserLoading, firestore]);

  if (isUserLoading || isCheckingRole) {
    return <div className="container py-12 pt-24">Loading...</div>
  }

  if (!user) {
    return <div className="container py-12 pt-24">You must be logged in to view this page.</div>
  }
  
  if (!isAdmin) {
      return <div className="container py-12 pt-24">You do not have permission to view this page.</div>
  }

  return (
    <div className="container py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your platform's content and settings from this central hub.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <ScrollArea className="w-full pb-2">
            <div className="overflow-x-auto whitespace-nowrap">
                <TabsList className="inline-flex">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="topup-orders">Top-up Orders</TabsTrigger>
                  <TabsTrigger value="topup-packages">Top-up Packages</TabsTrigger>
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                  <TabsTrigger value="user-management">User Management</TabsTrigger>
                  <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
                  <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
                </TabsList>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        <TabsContent value="chat" className="mt-6 h-[75vh]">
          <AdminChat />
        </TabsContent>
        <TabsContent value="topup-orders" className="mt-6">
          <TopupOrderManagement />
        </TabsContent>
        <TabsContent value="topup-packages" className="mt-6">
          <TopupManagement />
        </TabsContent>
        <TabsContent value="testimonials" className="mt-6">
          <TestimonialManagement />
        </TabsContent>
        <TabsContent value="user-management" className="mt-6">
            <UserManagement />
        </TabsContent>
        <TabsContent value="payment-settings" className="mt-6">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="listings" className="mt-6">
          <ListingManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
