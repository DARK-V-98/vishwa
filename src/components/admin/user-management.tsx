
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, query, writeBatch, orderBy, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
import { useMemo } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: { toDate: () => Date };
  roles: string[];
}

export function UserManagement() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<User>(usersQuery);
  
  const handleRoleChange = async (userId: string, role: 'admin' | 'developer' | 'customer', grant: boolean) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", userId);
    
    try {
        await updateDoc(userDocRef, {
            roles: grant ? arrayUnion(role) : arrayRemove(role)
        });

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

  if (error) return <p>Error loading users: {error.message}</p>;

  const roleIcons: { [key: string]: React.ElementType } = {
    admin: Crown,
    developer: Code,
    customer: ShoppingCart,
  };

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
                <TableCell className="flex flex-wrap gap-1">
                  <Badge variant="secondary"><User className="h-3 w-3 mr-1" /> User</Badge>
                  {user.roles?.map(role => {
                    const Icon = roleIcons[role];
                    return (
                        <Badge key={role} variant={role === 'admin' ? 'default' : 'outline'}>
                            {Icon && <Icon className="h-3 w-3 mr-1" />} {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Badge>
                    )
                  })}
                </TableCell>
                <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin', !user.roles.includes('admin'))}>
                                {user.roles.includes('admin') ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.includes('admin') ? "Revoke Admin" : "Grant Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'developer', !user.roles.includes('developer'))}>
                                {user.roles.includes('developer') ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.includes('developer') ? "Revoke Developer" : "Grant Developer"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'customer', !user.roles.includes('customer'))}>
                                {user.roles.includes('customer') ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {user.roles.includes('customer') ? "Revoke Customer" : "Grant Customer"}
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

    