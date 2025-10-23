
"use client";

import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { MoreHorizontal, User, Crown, Code, ShoppingCart } from "lucide-react";
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
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface AppUser {
  id: string;
  username: string;
  email: string;
  createdAt: { toDate: () => Date };
}

interface UserWithRoles extends AppUser {
  roles: string[];
}

export function UserManagement() {
  const firestore = useFirestore();
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([]);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<AppUser>(usersQuery);

  useEffect(() => {
    // Note: In a real app, you would fetch ID tokens for all users from a secure backend.
    // This is a placeholder to show roles. For now, we will simulate this by assuming a default role.
    if (users) {
        const updatedUsers = users.map(user => ({
            ...user,
            roles: user.id ? ['customer'] : [], // Placeholder logic
        }));
        // In a real scenario, you'd fetch claims and populate roles here.
        setUsersWithRoles(updatedUsers);
    }
  }, [users]);


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
        <CardDescription>
            Manage all registered user accounts. To grant admin or developer roles, please use the Firebase console.
        </CardDescription>
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
            {usersWithRoles?.map((user) => (
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
                      <DropdownMenuItem className="text-destructive">Delete User (Not Implemented)</DropdownMenuItem>
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
