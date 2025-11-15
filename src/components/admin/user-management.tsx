
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Users, Search, Edit } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  roles?: string[];
}

const ALL_ROLES = ['admin', 'developer', 'customer'];

export default function UserManagement() {
  const firestore = useFirestore();
  const usersCollection = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const usersQuery = useMemoFirebase(() => query(usersCollection), [usersCollection]);
  const { data: users, isLoading, error } = useCollection<Omit<UserProfile, 'id'>>(usersQuery);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editedRoles, setEditedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || (user.roles && user.roles.includes(roleFilter));
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setEditedRoles(user.roles || []);
    setIsDialogOpen(true);
  };
  
  const handleRoleChange = (role: string, isChecked: boolean | 'indeterminate') => {
    setEditedRoles(prev => 
      isChecked ? [...prev, role] : prev.filter(r => r !== role)
    );
  };
  
  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    const userDocRef = doc(firestore, 'users', selectedUser.id);
    
    try {
      await updateDoc(userDocRef, { roles: editedRoles });
      toast.success(`Roles updated for ${selectedUser.email}.`);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(`Failed to update roles: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'developer': return 'default';
      case 'customer':
      default: return 'secondary';
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users />
            User Management
          </CardTitle>
          <CardDescription>
            View, search, and manage user roles across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {ALL_ROLES.map(role => (
                        <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))}
                {error && <TableRow><TableCell colSpan={3} className="text-center text-destructive">Failed to load users.</TableCell></TableRow>}
                {!isLoading && filteredUsers.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No users found.</TableCell></TableRow>}
                {!isLoading && filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 
                          ? user.roles.map(role => <Badge key={role} variant={getRoleVariant(role)} className="capitalize">{role}</Badge>)
                          : <Badge variant="outline">No Roles</Badge>
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Roles for {selectedUser?.email}</DialogTitle>
            <DialogDescription>
                Select the roles you want to assign to this user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {ALL_ROLES.map(role => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={role}
                  checked={editedRoles.includes(role)}
                  onCheckedChange={(checked) => handleRoleChange(role, checked)}
                />
                <Label htmlFor={role} className="capitalize font-medium">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={handleSaveChanges} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
