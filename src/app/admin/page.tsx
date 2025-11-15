
'use client';

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingManagement } from "@/components/admin/listing-management";
import TopupManagement from "@/components/admin/topup-management";
import TopupOrderManagement from "@/components/admin/topup-order-management";
import PaymentSettings from "@/components/admin/payment-settings";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import AdminChat from "@/components/admin/admin-chat";
import TestimonialManagement from "@/components/admin/testimonial-management";
import { doc } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfile {
  roles?: string[];
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    // The primary admin email
    if (user.email === 'tikfese@gmail.com') return true;
    // Check for roles from the user's profile
    if (userProfile?.roles) {
      return userProfile.roles.includes('admin') || userProfile.roles.includes('developer');
    }
    return false;
  }, [userProfile, user]);

  if (isUserLoading || isProfileLoading) {
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
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="w-max">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="topup-orders">Top-up Orders</TabsTrigger>
              <TabsTrigger value="topup-packages">Top-up Packages</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
              <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
            </TabsList>
        </ScrollArea>
        <TabsContent value="chat">
            <AdminChat />
        </TabsContent>
        <TabsContent value="topup-orders">
            <TopupOrderManagement />
        </TabsContent>
        <TabsContent value="topup-packages">
            <TopupManagement />
        </TabsContent>
         <TabsContent value="testimonials">
            <TestimonialManagement />
        </TabsContent>
        <TabsContent value="payment-settings">
            <PaymentSettings />
        </TabsContent>
        <TabsContent value="listings">
            <ListingManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
