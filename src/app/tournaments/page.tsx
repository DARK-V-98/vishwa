
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tournament } from '@/lib/types';
import { format } from 'date-fns';
import { ArrowRight, Trophy } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Upcoming E-Sports Tournaments in Sri Lanka',
    description: 'Find and join upcoming e-sports tournaments in Sri Lanka. Browse events for games like Free Fire, PUBG, and Valorant submitted by tournament organizers.',
};


function TournamentCard({ tournament }: { tournament: Tournament }) {
    return (
        <Link href={`/tournaments/${tournament.id}`}>
            <Card className="group h-full flex flex-col overflow-hidden hover:shadow-strong transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="relative h-48 w-full">
                    <Image src={tournament.posterUrl} alt={`${tournament.tournamentName} Poster`} layout="fill" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{tournament.gameType}</Badge>
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="truncate group-hover:text-primary transition-colors">{tournament.tournamentName}</CardTitle>
                    <CardDescription>
                        Starts: {format(tournament.startDate.seconds * 1000, 'PPP')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-lg font-bold text-primary">{tournament.prizePool}</p>
                </CardContent>
                <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full">
                        View Tournament <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </Card>
        </Link>
    );
}

function TournamentGridSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-8 w-1/4" /></CardContent>
                    <div className="p-4 pt-0"><Skeleton className="h-10 w-full" /></div>
                </Card>
            ))}
        </div>
    );
}

export default function TournamentsPage() {
    const firestore = useFirestore();
    const tournamentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'tournaments'),
            where('status', '==', 'published'), // This will be used for admin approval
            orderBy('startDate', 'desc')
        );
    }, [firestore]);

    // For now, let's show all tournaments since admin approval isn't implemented
     const allTournamentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'tournaments'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore]);

    const { data: tournaments, isLoading, error } = useCollection<Omit<Tournament, 'id'>>(allTournamentsQuery);

    return (
        <div className="container py-12 pt-24">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-2">Upcoming Tournaments</h1>
                <p className="text-muted-foreground">Find the next big e-sports event. Browse tournaments submitted by the community.</p>
            </div>

            {isLoading && <TournamentGridSkeleton />}
            {error && <p className="text-center text-destructive">Could not load tournaments. Please try again later.</p>}
            {!isLoading && tournaments && tournaments.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No upcoming tournaments found. Check back soon!</p>
            )}
            {!isLoading && tournaments && tournaments.length > 0 && (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            )}
        </div>
    );
}
