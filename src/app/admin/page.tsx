
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingManagement } from "@/components/admin/listing-management";
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
          Manage marketplace listings from this central hub.
        </p>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="listings">
            <ListingManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
