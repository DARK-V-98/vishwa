
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/user-management";
import { ListingManagement } from "@/components/admin/listing-management";
import { OrderManagement } from "@/components/admin/order-management";

export default function AdminPage() {
  return (
    <div className="container py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage users, marketplace listings, and design orders from this central hub.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
          <TabsTrigger value="orders">Design Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <UserManagement />
        </TabsContent>
        <TabsContent value="listings">
            <ListingManagement />
        </TabsContent>
        <TabsContent value="orders">
            <OrderManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
