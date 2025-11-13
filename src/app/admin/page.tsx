
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingManagement } from "@/components/admin/listing-management";
import TopupManagement from "@/components/admin/topup-management";
import TopupOrderManagement from "@/components/admin/topup-order-management";
import PaymentSettings from "@/components/admin/payment-settings";
import { useUser } from "@/firebase";

export default function AdminPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <div className="container py-12 pt-24">Loading...</div>
  }

  if (!user) {
    return <div className="container py-12 pt-24">You must be logged in to view this page.</div>
  }

  // A simple role check - in a real app, you'd use custom claims.
  const isAdmin = user.email === 'tikfese@gmail.com';

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

      <Tabs defaultValue="topup-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="topup-orders">Top-up Orders</TabsTrigger>
          <TabsTrigger value="topup-packages">Top-up Packages</TabsTrigger>
          <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
          <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="topup-orders">
            <TopupOrderManagement />
        </TabsContent>
        <TabsContent value="topup-packages">
            <TopupManagement />
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

    