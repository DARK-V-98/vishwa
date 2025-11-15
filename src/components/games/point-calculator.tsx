
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, Crown, Medal, Trophy, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Team {
  id: number;
  name: string;
  points: number;
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />;
  return <span className="font-mono text-sm w-5 text-center">{rank}</span>;
};

export default function PointCalculator() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => b.points - a.points);
  }, [teams]);

  const addTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim() && !teams.some(t => t.name.toLowerCase() === newTeamName.trim().toLowerCase())) {
      setTeams(prev => [...prev, { id: Date.now(), name: newTeamName.trim(), points: 0 }]);
      setNewTeamName('');
    }
  };

  const removeTeam = (id: number) => {
    setTeams(prev => prev.filter(team => team.id !== id));
  };

  const updatePoints = (id: number, delta: number) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === id ? { ...team, points: Math.max(0, team.points + delta) } : team
      )
    );
  };
  
  const handlePointInputChange = (id: number, value: string) => {
    const points = parseInt(value, 10);
    setTeams(prev => 
        prev.map(team => 
            team.id === id ? { ...team, points: isNaN(points) ? 0 : Math.max(0, points) } : team
        )
    )
  }

  const resetTournament = () => {
    setTeams([]);
    setNewTeamName('');
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Add Team Panel */}
        <div className="lg:col-span-1 space-y-8 sticky top-24">
             <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Add New Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addTeam} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input
                                id="teamName"
                                placeholder="Enter team name"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!newTeamName.trim()}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Team
                        </Button>
                    </form>
                </CardContent>
             </Card>

             <Card className="border-destructive/50 bg-destructive/5">
                 <CardHeader>
                    <CardTitle className="text-destructive">Reset Tournament</CardTitle>
                    <CardDescription>This will clear all teams and points. This action cannot be undone.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4"/>
                                Reset Tournament
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently delete the current tournament data, including all teams and their scores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={resetTournament}>Yes, reset it</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </CardContent>
             </Card>
        </div>


      {/* Leaderboard */}
      <div className="lg:col-span-2">
        <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tournament Leaderboard</CardTitle>
            <CardDescription>
              Teams are ranked by points in real-time. Use the controls to adjust scores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="w-[120px] text-center">Points</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams.length > 0 ? (
                  sortedTeams.map((team, index) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-bold text-center">
                        <RankIcon rank={index + 1} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input 
                            type="number"
                            value={team.points}
                            onChange={(e) => handlePointInputChange(team.id, e.target.value)}
                            className="w-20 text-center font-bold text-lg h-10"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => updatePoints(team.id, 1)}>
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => updatePoints(team.id, -1)}>
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => removeTeam(team.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No teams added yet. Add a team to start the tournament!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
