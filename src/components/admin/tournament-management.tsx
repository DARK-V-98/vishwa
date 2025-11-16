
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MoreHorizontal, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tournament } from '@/lib/types';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '../ui/dropdown-menu';

export default function TournamentManagement() {
  const firestore = useFirestore();
  const tournamentsCollection = useMemoFirebase(() => collection(firestore, 'tournaments'), [firestore]);
  const tournamentsQuery = useMemoFirebase(() => query(tournamentsCollection, orderBy('createdAt', 'desc')), [tournamentsCollection]);
  const { data: tournaments, isLoading, error } = useCollection<Omit<Tournament, 'id'>>(tournamentsQuery);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (tournamentId: string, newStatus: Tournament['status']) => {
    setUpdatingId(tournamentId);
    const tournamentDoc = doc(firestore, 'tournaments', tournamentId);
    try {
      await updateDoc(tournamentDoc, { status: newStatus });
      toast.success(`Tournament status updated to ${newStatus}.`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
        setUpdatingId(null);
    }
  };

  const getStatusVariant = (status: Tournament['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'published': return 'default';
      case 'pending-approval': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Approvals</CardTitle>
        <CardDescription>
          Review and manage user-submitted e-sports tournaments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )}
        {error && <p className="text-destructive">Error loading tournaments: {error.message}. Ensure you have admin permissions.</p>}
        {!isLoading && tournaments && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Tournament Name</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{format(new Date(tournament.createdAt.seconds * 1000), 'PP')}</TableCell>
                  <TableCell className="font-medium">{tournament.tournamentName}</TableCell>
                  <TableCell>{tournament.gameType}</TableCell>
                  <TableCell>{tournament.organizerEmail}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tournament.status)} className="capitalize">{tournament.status.replace('-', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          disabled={updatingId === tournament.id}
                        >
                          {updatingId === tournament.id ? <Skeleton className="h-4 w-4 animate-spin rounded-full" /> : <MoreHorizontal className="h-4 w-4" />}
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/tournaments/${tournament.id}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" /> View Public Page
                            </Link>
                        </DropdownMenuItem>
                        {tournament.status !== 'published' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(tournament.id, 'published')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />Approve
                          </DropdownMenuItem>
                        )}
                        {tournament.status !== 'rejected' && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(tournament.id, 'rejected')}>
                            <XCircle className="mr-2 h-4 w-4" />Reject
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
