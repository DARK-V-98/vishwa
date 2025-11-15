'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Crown, Medal, Trophy, RefreshCw, Edit, Save, X, Settings, Download, Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';

interface Team {
  id: number;
  name: string;
  kills: number;
  placement: number;
  bonus: number;
  killPoints: number;
  placePoints: number;
  totalPoints: number;
}

const DEFAULT_PLACEMENT_POINTS = [15, 12, 10, 8, 6, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />;
  return <span className="font-mono text-sm w-5 text-center">{rank}</span>;
};

export default function PointCalculator() {
  // Scoring Settings
  const [killPointValue, setKillPointValue] = useState(1);
  const [useDefaultPlacement, setUseDefaultPlacement] = useState(true);
  const [manualPlacementPoints, setManualPlacementPoints] = useState<number[]>(DEFAULT_PLACEMENT_POINTS);

  // Team Input
  const [teamName, setTeamName] = useState('');
  const [kills, setKills] = useState(0);
  const [placement, setPlacement] = useState(1);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Result
  const [calculatedResult, setCalculatedResult] = useState<Team | null>(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<Team[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Refs
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedLeaderboard = localStorage.getItem('esportsLeaderboard');
      if (savedLeaderboard) {
        setLeaderboard(JSON.parse(savedLeaderboard));
      }
    } catch (error) {
      console.error("Failed to load leaderboard from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('esportsLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
        console.error("Failed to save leaderboard to localStorage", error);
    }
  }, [leaderboard]);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints || b.kills - a.kills);
  }, [leaderboard]);

  const handleManualPlacementPointChange = (index: number, value: string) => {
    const newPoints = [...manualPlacementPoints];
    newPoints[index] = parseInt(value, 10) || 0;
    setManualPlacementPoints(newPoints);
  };

  const calculatePoints = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!teamName.trim()) return;

    const placePoints = useDefaultPlacement
      ? DEFAULT_PLACEMENT_POINTS[placement - 1] ?? 0
      : manualPlacementPoints[placement - 1] ?? 0;
      
    const killPointsTotal = kills * killPointValue;
    const totalPoints = killPointsTotal + placePoints + bonusPoints;

    setCalculatedResult({
      id: Date.now(),
      name: teamName,
      kills,
      placement,
      bonus: bonusPoints,
      killPoints: killPointsTotal,
      placePoints,
      totalPoints
    });
  };

  const addToLeaderboard = () => {
    if (calculatedResult) {
      const existingTeamIndex = leaderboard.findIndex(t => t.name.toLowerCase() === calculatedResult.name.toLowerCase());
      if(existingTeamIndex > -1){
        const updatedLeaderboard = [...leaderboard];
        const existingTeam = updatedLeaderboard[existingTeamIndex];
        updatedLeaderboard[existingTeamIndex] = {
          ...existingTeam,
          kills: existingTeam.kills + calculatedResult.kills,
          bonus: existingTeam.bonus + calculatedResult.bonus,
          killPoints: existingTeam.killPoints + calculatedResult.killPoints,
          placePoints: existingTeam.placePoints + calculatedResult.placePoints,
          totalPoints: existingTeam.totalPoints + calculatedResult.totalPoints,
          placement: calculatedResult.placement,
        }
        setLeaderboard(updatedLeaderboard);
      } else {
        setLeaderboard(prev => [...prev, calculatedResult]);
      }
      resetForm();
    }
  };
  
  const updateLeaderboardRow = (team: Team) => {
      setLeaderboard(prev => prev.map(t => t.id === team.id ? team : t));
      setEditingRowId(null);
  }

  const deleteLeaderboardRow = (id: number) => {
    setLeaderboard(prev => prev.filter(t => t.id !== id));
  }

  const resetForm = () => {
    setTeamName('');
    setKills(0);
    setPlacement(1);
    setBonusPoints(0);
    setCalculatedResult(null);
  };

  const clearLeaderboard = () => {
    setLeaderboard([]);
  };

  const exportResultAsImage = () => {
    if (resultCardRef.current) {
        html2canvas(resultCardRef.current, { 
            backgroundColor: null,
            useCORS: true, 
            scale: 2 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `result-${calculatedResult?.name || 'team'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
  };

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8 sticky top-24">
          <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Point Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculatePoints} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" placeholder="Enter team name" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="kills">Kills</Label>
                        <Input id="kills" type="number" min="0" value={kills} onChange={e => setKills(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="placement">Placement</Label>
                        <Select value={String(placement)} onValueChange={val => setPlacement(parseInt(val))}>
                            <SelectTrigger id="placement"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 25 }, (_, i) => i + 1).map(p => <SelectItem key={p} value={String(p)}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonusPoints">Bonus Points (Optional)</Label>
                  <Input id="bonusPoints" type="number" value={bonusPoints} onChange={e => setBonusPoints(parseInt(e.target.value) || 0)} />
                </div>
                <Button type="submit" className="w-full" variant="hero">Calculate Points</Button>
              </form>
            </CardContent>
          </Card>

          {calculatedResult && (
             <Card className="shadow-strong border-primary/50 bg-card/70 backdrop-blur-sm" id="result-card">
                 <div ref={resultCardRef} className="p-6 bg-transparent relative">
                    <div className="absolute inset-0 bg-black/50 -z-10"></div>
                    <CardHeader className="text-center p-0 mb-4">
                        <CardDescription className="text-primary">Match Result</CardDescription>
                        <CardTitle className="text-3xl font-bold text-white">{calculatedResult.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center p-0">
                        <div className="text-6xl font-bold text-primary mb-4">{calculatedResult.totalPoints} <span className="text-2xl text-white/80">PTS</span></div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-white">
                            <div className="bg-white/10 p-2 rounded-md"><div className="font-bold text-lg">{calculatedResult.killPoints}</div><div className="text-white/60">Kill Pts</div></div>
                            <div className="bg-white/10 p-2 rounded-md"><div className="font-bold text-lg">{calculatedResult.placePoints}</div><div className="text-white/60">Place Pts</div></div>
                            <div className="bg-white/10 p-2 rounded-md"><div className="font-bold text-lg">{calculatedResult.bonus}</div><div className="text-white/60">Bonus</div></div>
                        </div>
                    </CardContent>
                </div>
                <CardContent className="p-6 pt-4">
                    <div className="flex gap-2 mt-4">
                        <Button className="w-full" onClick={addToLeaderboard} variant="secondary"><PlusCircle className="mr-2 h-4 w-4"/> Add to Leaderboard</Button>
                        <Button variant="outline" onClick={exportResultAsImage}><Download className="mr-2 h-4 w-4"/> Export</Button>
                        <Button variant="ghost" onClick={resetForm}><RefreshCw className="h-4 w-4"/></Button>
                    </div>
                </CardContent>
             </Card>
          )}

          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings /> Scoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="killPointValue" className="flex items-center gap-2">Points per Kill 
                      <Tooltip><TooltipTrigger type="button"><Info className="h-4 w-4 text-muted-foreground"/></TooltipTrigger><TooltipContent>Set the number of points awarded for each kill.</TooltipContent></Tooltip>
                    </Label>
                    <Input id="killPointValue" type="number" min="0" value={killPointValue} onChange={e => setKillPointValue(parseInt(e.target.value) || 0)} />
                </div>
                 <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="placement-mode" checked={useDefaultPlacement} onCheckedChange={setUseDefaultPlacement} />
                        <Label htmlFor="placement-mode">Use Default Placement Points</Label>
                    </div>

                    {!useDefaultPlacement && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            <Label>Manual Placement Points</Label>
                            {Array.from({ length: 25 }, (_, i) => i).map(i => (
                                <div key={i} className="flex items-center gap-2">
                                    <Label htmlFor={`placement-${i+1}`} className="w-12">#{i+1}</Label>
                                    <Input id={`placement-${i+1}`} type="number" min="0" value={manualPlacementPoints[i]} onChange={e => handleManualPlacementPointChange(i, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tournament Leaderboard</CardTitle>
                <CardDescription>Teams are ranked by total points, then kills.</CardDescription>
              </div>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={leaderboard.length === 0}><RefreshCw className="mr-2 h-4 w-4"/>Clear All</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently clear the entire leaderboard. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearLeaderboard}>Yes, clear it</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Kills</TableHead>
                      <TableHead className="text-center">Total Pts</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedLeaderboard.length > 0 ? (
                      sortedLeaderboard.map((team, index) => (
                        editingRowId === team.id ? (
                            <EditableRow key={team.id} team={team} onSave={updateLeaderboardRow} onCancel={() => setEditingRowId(null)} />
                        ) : (
                        <TableRow key={team.id}>
                          <TableCell className="font-bold text-center"><RankIcon rank={index + 1} /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                              <span className="font-medium">{team.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{team.kills}</TableCell>
                          <TableCell className="text-center font-bold text-lg text-primary">{team.totalPoints}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Button size="icon" variant="ghost" onClick={() => setEditingRowId(team.id)}><Edit className="h-4 w-4" /></Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete {team.name}?</AlertDialogTitle><AlertDialogDescription>This will permanently remove the team and their score from the leaderboard.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteLeaderboardRow(team.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                        )
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Leaderboard is empty. Calculate points and add teams.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}


function EditableRow({ team, onSave, onCancel }: { team: Team, onSave: (team: Team) => void, onCancel: () => void }) {
    const [editedTeam, setEditedTeam] = useState(team);

    const handleChange = (field: keyof Team, value: string) => {
        setEditedTeam(prev => ({...prev, [field]: parseInt(value) || 0}));
    }

    return (
        <TableRow className="bg-muted/50">
            <TableCell className="font-bold text-center">-</TableCell>
            <TableCell>
                <Input value={editedTeam.name} onChange={(e) => setEditedTeam(prev => ({...prev, name: e.target.value}))} className="h-8"/>
            </TableCell>
            <TableCell>
                 <Input type="number" value={editedTeam.kills} onChange={e => handleChange('kills', e.target.value)} className="h-8 w-20 mx-auto text-center" />
            </TableCell>
            <TableCell>
                 <Input type="number" value={editedTeam.totalPoints} onChange={e => handleChange('totalPoints', e.target.value)} className="h-8 w-20 mx-auto text-center font-bold" />
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onSave(editedTeam)}><Save className="h-4 w-4 text-primary"/></Button>
                    <Button size="icon" variant="ghost" onClick={onCancel}><X className="h-4 w-4"/></Button>
                </div>
            </TableCell>
        </TableRow>
    )
}