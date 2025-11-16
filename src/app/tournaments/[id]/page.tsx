
'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Ticket, Trophy, Gamepad2, Info, Users, Link as LinkIcon, Share2, ListOrdered, BarChart } from 'lucide-react';
import type { Tournament, Team } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankIcon } from '@/components/games/point-calculator';

function TournamentPageSkeleton() {
    return (
        <div className="container py-12 pt-24">
            <Skeleton className="h-64 w-full mb-8 rounded-lg" />
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    )
}

function PublicLeaderboard({ tournamentId }: { tournamentId: string }) {
    const firestore = useFirestore();

    const teamsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'tournaments', tournamentId, 'teams'));
    }, [firestore, tournamentId]);

    const { data: teams, isLoading, error } = useCollection<Team>(teamsQuery);
    
    // This is a simplified calculation, ideally should share logic with point calculator
    const calculatedLeaderboard = useMemo(() => {
        if (!teams) return [];
        return teams.map(team => {
            const totalPoints = team.matchScores.reduce((sum, score) => sum + score.kills + score.bonus, 0); // Simplified
            const totalKills = team.matchScores.reduce((sum, score) => sum + score.kills, 0);
            return { ...team, totalPoints, totalKills };
        }).sort((a, b) => b.totalPoints - a.totalPoints || b.totalKills - a.totalKills);
    }, [teams]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        );
    }
    
    if (error) return <p className="text-destructive text-sm">Could not load leaderboard.</p>;
    if (!teams || teams.length === 0) return <p className="text-muted-foreground text-center py-4">Leaderboard is not available yet.</p>;

    return (
         <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">Total Kills</TableHead>
                <TableHead className="text-center">Total Pts</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {calculatedLeaderboard.map((team, index) => (
                    <TableRow key={team.id}>
                    <TableCell className="font-bold text-center"><RankIcon rank={index + 1} /></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src={team.logoUrl} /><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <span className="font-medium">{team.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{team.totalKills}</TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary">{team.totalPoints}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function TournamentPage() {
    const { id } = useParams();
    const firestore = useFirestore();
    const tournamentId = Array.isArray(id) ? id[0] : id;


    const tournamentDocRef = useMemoFirebase(() => {
        if (!firestore || !tournamentId) return null;
        return doc(firestore, 'tournaments', tournamentId);
    }, [firestore, tournamentId]);

    const { data: tournament, isLoading, error } = useDoc<Tournament>(tournamentDocRef);

    if (isLoading) return <TournamentPageSkeleton />;
    if (error) return <div className="container py-12 pt-24 text-destructive">Error loading tournament: {error.message}</div>;
    if (!tournament) return <div className="container py-12 pt-24">Tournament not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="relative h-64 md:h-80 bg-muted">
                {tournament.posterUrl && (
                    <Image src={tournament.posterUrl} alt={`${tournament.tournamentName} Banner`} layout="fill" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="container relative h-full flex flex-col justify-end pb-8">
                    <Badge variant="secondary" className="w-fit mb-2">{tournament.gameType}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground shadow-lg">{tournament.tournamentName}</h1>
                    <p className="text-muted-foreground mt-2">Organized by {tournament.organizerName}</p>
                </div>
            </div>
            
            <div className="container py-12">
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><ListOrdered />Live Leaderboard</CardTitle></CardHeader>
                            <CardContent>
                                <PublicLeaderboard tournamentId={tournamentId}/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Info />Description</CardTitle></CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-full">
                                <p>{tournament.description}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart />Rules & Instructions</CardTitle></CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-full">
                                <p>{tournament.rules}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-24">
                        <Card className="shadow-strong">
                            <CardHeader>
                                <CardTitle>Tournament Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-3"><Trophy className="h-5 w-5 text-primary" /><p><strong className="text-foreground">Prize Pool:</strong> {tournament.prizePool}</p></div>
                                <div className="flex items-center gap-3"><Ticket className="h-5 w-5 text-primary" /><p><strong className="text-foreground">Entry Fee:</strong> {tournament.entryFee}</p></div>
                                <div className="flex items-center gap-3"><Gamepad2 className="h-5 w-5 text-primary" /><p><strong className="text-foreground">Game:</strong> {tournament.gameType}</p></div>
                                <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><p><strong className="text-foreground">Dates:</strong> {format(tournament.startDate.seconds * 1000, 'MMM d')} - {format(tournament.endDate.seconds * 1000, 'MMM d, yyyy')}</p></div>
                                <div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><p><strong className="text-foreground">Organizer:</strong> {tournament.organizerName}</p></div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <Link href={tournament.registrationLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button size="lg" className="w-full" variant="hero"><LinkIcon className="mr-2" />Register Now</Button>
                            </Link>
                             <Button size="lg" className="w-full" variant="outline"><Share2 className="mr-2" />Share Tournament</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
