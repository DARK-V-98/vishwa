
'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Tournament } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TournamentManager from '@/components/games/tournament-manager';

function ManageTournamentPageSkeleton() {
    return (
         <div className="container py-12 pt-24">
             <Skeleton className="h-8 w-1/4 mb-8" />
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8"><Skeleton className="h-96 w-full" /></div>
                <div className="lg:col-span-2"><Skeleton className="h-[500px] w-full" /></div>
             </div>
        </div>
    )
}

export default function ManageTournamentPage() {
    const { id } = useParams();
    const firestore = useFirestore();
    const tournamentId = Array.isArray(id) ? id[0] : id;

    const tournamentDocRef = useMemoFirebase(() => {
        if (!firestore || !tournamentId) return null;
        return doc(firestore, 'tournaments', tournamentId);
    }, [firestore, tournamentId]);

    const { data: tournament, isLoading, error } = useDoc<Tournament>(tournamentDocRef);

    if (isLoading) return <ManageTournamentPageSkeleton />;
    if (error) return <div className="container py-12 pt-24 text-destructive">Error loading tournament: {error.message}</div>;
    
    if (!tournament) {
        return (
             <div className="container py-12 pt-24 max-w-4xl mx-auto">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tournament Not Found</AlertTitle>
                    <AlertDescription>Could not load tournament data. It might have been deleted or you don't have permission to view it.</AlertDescription>
                </Alert>
             </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-subtle">
             <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4">
                     <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/my-tournaments">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to My Tournaments
                            </Link>
                        </Button>
                    </div>
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                     <h1 className="text-4xl md:text-6xl font-bold">
                      <span className="bg-gradient-hero bg-clip-text text-transparent">
                        Manage Tournament
                      </span>
                    </h1>
                    <p className="text-2xl text-muted-foreground">
                        {tournament.tournamentName}
                    </p>
                  </div>
                </div>
            </section>
             <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <TournamentManager tournament={tournament} />
                </div>
            </section>
        </div>
    )
}
