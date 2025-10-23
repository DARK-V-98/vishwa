
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/user-management";
import { ListingManagement } from "@/components/admin/listing-management";
import { OrderManagement } from "@/components/admin/order-management";
import ProjectManagement from "@/components/admin/project-management";
import PricingManagement from "@/components/admin/pricing-management";
import DesignPricingManagement from "@/components/admin/design-pricing-management";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useMemo } from "react";
import { doc } from "firebase/firestore";

interface UserProfile {
    roles?: string[];
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  const isLoading = isUserLoading || isProfileLoading;

  const canManagePricing = useMemo(() => {
    if (isLoading || !userProfile) return false;
    return userProfile.roles?.includes('admin') || userProfile.roles?.includes('developer');
  }, [isLoading, userProfile]);

  if (isLoading) {
    return <div className="container py-12 pt-24">Loading...</div>
  }

  if (!user) {
    return <div className="container py-12 pt-24">You must be logged in to view this page.</div>
  }

  return (
    <div className="container py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage users, projects, marketplace listings, and design orders from this central hub.
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className={`grid w-full ${canManagePricing ? 'grid-cols-6' : 'grid-cols-4'}`}>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
          <TabsTrigger value="orders">Design Orders</TabsTrigger>
          {canManagePricing && <TabsTrigger value="pricing">Web Pricing</TabsTrigger>}
          {canManagePricing && <TabsTrigger value="design-pricing">Design Pricing</TabsTrigger>}
        </TabsList>
        <TabsContent value="projects">
            <ProjectManagement />
        </TabsContent>
        <TabsContent value="users">
            <UserManagement />
        </TabsContent>
        <TabsContent value="listings">
            <ListingManagement />
        </TabsContent>
        <TabsContent value="orders">
            <OrderManagement />
        </TabsContent>
        {canManagePricing && (
          <TabsContent value="pricing">
              <PricingManagement />
          </TabsContent>
        )}
         {canManagePricing && (
          <TabsContent value="design-pricing">
              <DesignPricingManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
