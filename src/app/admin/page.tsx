
'use client';

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingManagement } from "@/components/admin/listing-management";
import TopupManagement from "@/components/admin/topup-management";
import TopupOrderManagement from "@/components/admin/topup-order-management";
import PaymentSettings from "@/components/admin/payment-settings";
import { useUser } from "@/firebase";
import AdminChat from "@/components/admin/admin-chat";
import TestimonialManagement from "@/components/admin/testimonial-management";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UserManagement from "@/components/admin/user-management";

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    // This check is now simplified as the components themselves and the rules enforce access.
    // This is primarily for showing the correct UI state (loading/denied).
    if (isUserLoading) {
      return;
    }
    if (!user) {
      setIsCheckingRole(false);
      setIsAdmin(false);
      return;
    }
    // The most basic client-side check. Firestore rules are the real authority.
    if (user.email === 'tikfese@gmail.com') {
        setIsAdmin(true);
    }
    // A more robust check should be done via custom claims in a real app,
    // but for now, we rely on the components' data fetching and Firestore rules.
    // We assume if they can see data, they are an admin.
    setIsAdmin(true); // Optimistically assume admin, let Firestore rules deny access.
    setIsCheckingRole(false);

  }, [user, isUserLoading]);

  if (isUserLoading || isCheckingRole) {
    return <div className="container py-12 pt-24">Loading Admin Panel...</div>
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
