
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import type { Tournament, Team, MatchScore } from '@/lib/types';
import PointCalculator from './point-calculator';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Frown } from 'lucide-react';

interface TournamentManagerProps {
    tournament: Tournament | null;
}

export default function TournamentManager({ tournament }: TournamentManagerProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const isLocalMode = tournament === null;

    const [teams, setTeams] = useState<Team[]>([]);
    const [matchCount, setMatchCount] = useState(1);
    const [isLoading, setIsLoading] = useState(!isLocalMode);
    const [error, setError] = useState<string | null>(null);
    
    // Firestore hooks
    const teamsCollectionRef = useMemoFirebase(() => {
        if (isLocalMode || !firestore || !tournament) return null;
        return collection(firestore, 'tournaments', tournament.id, 'teams');
    }, [firestore, tournament, isLocalMode]);

    const { data: fetchedTeams, isLoading: teamsLoading, error: teamsError } = useCollection<Team>(teamsCollectionRef);

    // Effect to sync remote data to local state
    useEffect(() => {
        if (!isLocalMode) {
            if (fetchedTeams) {
                const updatedTeams = fetchedTeams.map(t => ({
                    ...t,
                    matchScores: t.matchScores.length < (tournament?.matchCount || 1)
                        ? [
                            ...t.matchScores, 
                            ...Array((tournament?.matchCount || 1) - t.matchScores.length).fill({ kills: 0, placement: 25, bonus: 0})
                          ]
                        : t.matchScores.slice(0, tournament?.matchCount || 1)
                }));
                setTeams(updatedTeams);
            }
            if (tournament?.matchCount) {
                setMatchCount(tournament.matchCount);
            }
            setIsLoading(teamsLoading);
            if (teamsError) setError(teamsError.message);
        }
    }, [fetchedTeams, teamsLoading, teamsError, isLocalMode, tournament]);

    // Effect for local storage management
    useEffect(() => {
        if (isLocalMode) {
            try {
                const savedTeams = localStorage.getItem('local_esportsTeams');
                const savedMatchCount = localStorage.getItem('local_esportsMatchCount');
                if (savedTeams) setTeams(JSON.parse(savedTeams));
                if (savedMatchCount) setMatchCount(JSON.parse(savedMatchCount));
            } catch (e) {
                console.error("Failed to load from localStorage", e);
            }
        }
    }, [isLocalMode]);

    useEffect(() => {
        if (isLocalMode) {
            try {
                localStorage.setItem('local_esportsTeams', JSON.stringify(teams));
                localStorage.setItem('local_esportsMatchCount', JSON.stringify(matchCount));
            } catch (e) {
                console.error("Failed to save to localStorage", e);
            }
        }
    }, [teams, matchCount, isLocalMode]);

    const handleAddTeam = async (newTeamData: Omit<Team, 'id' | 'matchScores'>) => {
        const teamToAdd = {
            ...newTeamData,
            matchScores: Array(matchCount).fill({ kills: 0, placement: 25, bonus: 0 }),
        };

        if (isLocalMode) {
            setTeams(prev => [...prev, { ...teamToAdd, id: Date.now().toString() }]);
        } else if (teamsCollectionRef) {
            try {
                await addDoc(teamsCollectionRef, teamToAdd);
                toast.success(`Team "${newTeamData.name}" added.`);
            } catch (e: any) {
                toast.error(`Failed to add team: ${e.message}`);
            }
        }
    };

    const handleUpdateScore = async (teamId: string, matchIndex: number, field: keyof MatchScore, value: number) => {
        const teamIndex = teams.findIndex(t => t.id === teamId);
        if (teamIndex === -1) return;

        const updatedTeams = [...teams];
        const updatedScores = [...updatedTeams[teamIndex].matchScores];
        updatedScores[matchIndex] = { ...updatedScores[matchIndex], [field]: value };
        updatedTeams[teamIndex] = { ...updatedTeams[teamIndex], matchScores: updatedScores };
        
        setTeams(updatedTeams); // Optimistic update

        if (!isLocalMode && tournament) {
            const teamDocRef = doc(firestore, 'tournaments', tournament.id, 'teams', teamId);
            try {
                await updateDoc(teamDocRef, { matchScores: updatedScores });
            } catch (e: any) {
                toast.error(`Failed to update score for ${updatedTeams[teamIndex].name}.`);
                // Revert optimistic update on error if needed
            }
        }
    };
    
    const handleDeleteTeam = async (teamId: string) => {
        if (isLocalMode) {
            setTeams(prev => prev.filter(t => t.id !== teamId));
        } else if (tournament) {
             try {
                await deleteDoc(doc(firestore, 'tournaments', tournament.id, 'teams', teamId));
                toast.success("Team deleted.");
            } catch (e: any) {
                toast.error(`Failed to delete team: ${e.message}`);
            }
        }
    };
    
    const handleMatchCountChange = async (newCount: number) => {
        const tournamentDocRef = tournament ? doc(firestore, 'tournaments', tournament.id) : null;
        if (!isLocalMode && tournamentDocRef) {
            try {
                await updateDoc(tournamentDocRef, { matchCount: newCount });
                toast.success(`Match count set to ${newCount}.`);
            } catch (e: any) {
                toast.error(`Failed to update match count: ${e.message}`);
            }
        } else {
             setMatchCount(newCount);
        }
    }

    const handleAddMatch = () => {
        handleMatchCountChange(matchCount + 1);
    };

    const handleRemoveMatch = () => {
        if (matchCount > 1) {
            handleMatchCountChange(matchCount - 1);
        }
    };

    const handleClear = async () => {
        if (isLocalMode) {
            setTeams([]);
            setMatchCount(1);
        } else {
            // This is a destructive operation, be careful.
            const confirmation = window.confirm("Are you sure you want to delete ALL teams for this tournament? This cannot be undone.");
            if (confirmation && teams) {
                try {
                    await Promise.all(teams.map(team => deleteDoc(doc(firestore, 'tournaments', tournament.id, 'teams', team.id))));
                    await handleMatchCountChange(1);
                    toast.success("All teams have been cleared.");
                } catch(e: any) {
                    toast.error(`Failed to clear teams: ${e.message}`);
                }
            }
        }
    };

    if (isLoading) {
        return (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8"><Skeleton className="h-96 w-full" /></div>
                <div className="lg:col-span-2"><Skeleton className="h-[500px] w-full" /></div>
            </div>
        )
    }

     if (error) {
        return (
            <Alert variant="destructive">
                <Frown className="h-4 w-4" />
                <AlertTitle>Error Loading Tournament Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <PointCalculator
            teams={teams}
            matchCount={matchCount}
            onAddTeam={handleAddTeam}
            onUpdateScore={handleUpdateScore}
            onDeleteTeam={handleDeleteTeam}
            onAddMatch={handleAddMatch}
            onRemoveMatch={handleRemoveMatch}
            onClear={handleClear}
        />
    );
}
