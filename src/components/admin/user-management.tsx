
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, query, writeBatch, orderBy } from "firebase/firestore";
import { MoreHorizontal, CheckCircle, Shield, User, Crown, Code, ShoppingCart, UserPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: { toDate: () => Date };
  roles: {
    isAdmin: boolean;
    isDeveloper: boolean;
    isCustomer: boolean;
  };
}

export function UserManagement() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: usersData, isLoading: usersLoading, error: usersError } = useCollection<Omit<User, 'roles'>>(usersQuery);
  const { data: admins, isLoading: adminsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'roles_admin') : null, [firestore]));
  const { data: developers, isLoading: developersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'roles_developer') : null, [firestore]));
  const { data: customers, isLoading: customersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'roles_customer') : null, [firestore]));

  const isLoading = usersLoading || adminsLoading || developersLoading || customersLoading;

  const users: User[] | null = useMemoFirebase(() => {
    if (!usersData) return null;
    const adminIds = new Set(admins?.map(a => a.id));
    const developerIds = new Set(developers?.map(d => d.id));
    const customerIds = new Set(customers?.map(c => c.id));

    return usersData.map(user => ({
      ...user,
      roles: {
        isAdmin: adminIds.has(user.id),
        isDeveloper: developerIds.has(user.id),
        isCustomer: customerIds.has(user.id),
      }
    }));
  }, [usersData, admins, developers, customers]);
  
  const handleRoleChange = async (userId: string, role: 'admin' | 'developer' | 'customer', grant: boolean) => {
    if (!firestore) return;
    const roleCollectionName = `roles_${role}`;
    const userRoleRef = doc(firestore, roleCollectionName, userId);
    
    try {
        const batch = writeBatch(firestore);
        if(grant) {
            const roleData:any = { grantedAt: new Date().toISOString() };
            if(role === 'customer') roleData.firstPurchaseAt = new Date().toISOString();
            batch.set(userRoleRef, roleData);
        } else {
            batch.delete(userRoleRef);
        }
        await batch.commit();
        toast.success(`Role ${grant ? 'granted' : 'revoked'} successfully.`);
    } catch(e: any) {
        toast.error(`Failed to update role: ${e.message}`);
    }
  }


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage all registered user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        </CardContent>
      </Card>
    );
  }

  if (usersError) return <p>Error loading users: {usersError.message}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Accounts</CardTitle>
        <CardDescription>Manage all registered user accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex gap-1">
                  <Badge variant="secondary"><User className="h-3 w-3 mr-1" /> User</Badge>
                  {user.roles.isAdmin && <Badge variant="default"><Crown className="h-3 w-3 mr-1" />Admin</Badge>}
                  {user.roles.isDeveloper && <Badge variant="outline"><Code className="h-3 w-3 mr-1" />Developer</Badge>}
                  {user.roles.isCustomer && <Badge variant="secondary"><ShoppingCart className="h-3 w-3 mr-1" />Customer</Badge>}
                </TableCell>
                <TableCell>{format(user.createdAt.toDate(), 'PPP')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger><UserPlus className="mr-2 h-4 w-4" /> Manage Roles</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin', !user.roles.isAdmin)}>
                                {user.roles.isAdmin ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.isAdmin ? "Revoke Admin" : "Grant Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'developer', !user.roles.isDeveloper)}>
                                {user.roles.isDeveloper ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.isDeveloper ? "Revoke Developer" : "Grant Developer"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'customer', !user.roles.isCustomer)}>
                                {user.roles.isCustomer ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.isCustomer ? "Revoke Customer" : "Grant Customer"}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
