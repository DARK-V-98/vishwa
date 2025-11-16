
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Trophy, Calendar, Eye, Settings, PlusCircle, Gamepad2, AlertCircle } from 'lucide-react';
import type { Tournament } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function MyTournamentsPageSkeleton() {
    return (
        <div className="container py-12 pt-24">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-2/5" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function MyTournamentsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const tournamentsQuery = useMemoFirebase(() => {
        if (!user) return null;
        const tourneysCollection = collection(firestore, 'tournaments');
        return query(tourneysCollection, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: tournaments, isLoading: tournamentsLoading, error } = useCollection<Omit<Tournament, 'id'>>(tournamentsQuery);
    
    if (isUserLoading || !user) {
        // This will redirect to login if not authenticated, which is handled in the effect
        return <MyTournamentsPageSkeleton />;
    }
    
    // Redirect logic should be inside an effect to avoid issues with server rendering
    if (!isUserLoading && !user) {
        router.push('/auth');
        return null;
    }
    
    const getStatusVariant = (status: Tournament['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'published': return 'default';
          case 'pending-approval': return 'secondary';
          case 'rejected': return 'destructive';
          default: return 'outline';
        }
    }

    return (
        <div className="container py-12 pt-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3"><Trophy />My Tournaments</h1>
                    <p className="text-muted-foreground">Manage, edit, and track your submitted e-sports events.</p>
                </div>
                <Button asChild>
                    <Link href="/tournaments/submit">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Tournament
                    </Link>
                </Button>
            </div>
            

            <Card>
                <CardHeader>
                    <CardTitle>Your Submitted Tournaments</CardTitle>
                    <CardDescription>
                        Here is a list of all the tournaments you have created.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tournamentsLoading && (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    )}
                    {error && 
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Could not load your tournaments. Please try again later.</AlertDescription>
                        </Alert>
                    }
                    {!tournamentsLoading && tournaments && tournaments.length === 0 && (
                        <div className="text-center py-16">
                            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Tournaments Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">You haven't created any tournaments yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/tournaments/submit">Create Your First Tournament</Link>
                            </Button>
                        </div>
                    )}
                    {!tournamentsLoading && tournaments && tournaments.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tournament</TableHead>
                                    <TableHead><Gamepad2 className="inline-block h-4 w-4 mr-2" />Game</TableHead>
                                    <TableHead><Calendar className="inline-block h-4 w-4 mr-2" />Start Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tournaments.map((tournament) => (
                                    <TableRow key={tournament.id}>
                                        <TableCell className="font-medium">{tournament.tournamentName}</TableCell>
                                        <TableCell>{tournament.gameType}</TableCell>
                                        <TableCell>{format(new Date(tournament.startDate.seconds * 1000), 'PP')}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(tournament.status)} className="capitalize">{tournament.status.replace('-', ' ')}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/tournaments/${tournament.id}`} target="_blank">
                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                </Link>
                                            </Button>
                                            <Button variant="secondary" size="sm" disabled>
                                                <Settings className="mr-2 h-4 w-4" /> Manage
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
