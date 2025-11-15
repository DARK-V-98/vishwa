'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Crown, Medal, Trophy, RefreshCw, Edit, Save, X, Settings, Download, Info, Gamepad2, Swords } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import html2canvas from 'html2canvas';
import { Separator } from '../ui/separator';

interface MatchScore {
  kills: number;
  placement: number;
  bonus: number;
}

interface Team {
  id: number;
  name:string;
  matchScores: MatchScore[];
}

interface CalculatedTeam extends Team {
    totalPoints: number;
    totalKills: number;
}

const GAME_PRESETS = {
    'custom': {
        killPointValue: 1,
        placementPoints: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
    'freefire': {
        killPointValue: 1,
        placementPoints: [12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    'pubg': {
        killPointValue: 1,
        placementPoints: [15, 12, 10, 8, 6, 4, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
     'apex': {
        killPointValue: 1,
        placementPoints: [12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-amber-700" />;
  return <span className="font-mono text-sm w-5 text-center">{rank}</span>;
};


export default function PointCalculator() {
  // Scoring Settings
  const [gamePreset, setGamePreset] = useState('freefire');
  const [killPointValue, setKillPointValue] = useState(GAME_PRESETS.freefire.killPointValue);
  const [placementPoints, setPlacementPoints] = useState<number[]>(GAME_PRESETS.freefire.placementPoints);
  const [useDefaultPlacement, setUseDefaultPlacement] = useState(true);

  // Tournament State
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchCount, setMatchCount] = useState(1);
  const [teamNameInput, setTeamNameInput] = useState('');
  
  // UI State
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamData, setEditingTeamData] = useState<Team | null>(null);

  useEffect(() => {
    try {
      const savedTeams = localStorage.getItem('esportsTeams');
      const savedMatchCount = localStorage.getItem('esportsMatchCount');
      if (savedTeams) {
        const parsedTeams: Team[] = JSON.parse(savedTeams);
        const count = savedMatchCount ? parseInt(savedMatchCount, 10) : 1;
        
        // Ensure data integrity
        parsedTeams.forEach(team => {
            if (team.matchScores.length < count) {
                for (let i = team.matchScores.length; i < count; i++) {
                    team.matchScores.push({ kills: 0, placement: 25, bonus: 0 });
                }
            }
        });

        setTeams(parsedTeams);
      }
      if (savedMatchCount) {
        setMatchCount(parseInt(savedMatchCount, 10));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('esportsTeams', JSON.stringify(teams));
        localStorage.setItem('esportsMatchCount', String(matchCount));
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [teams, matchCount]);

  useEffect(() => {
    if (useDefaultPlacement) {
        const preset = GAME_PRESETS[gamePreset as keyof typeof GAME_PRESETS] || GAME_PRESETS.custom;
        setPlacementPoints(preset.placementPoints);
        setKillPointValue(preset.killPointValue);
    }
  }, [gamePreset, useDefaultPlacement]);

  const calculatedLeaderboard = useMemo((): CalculatedTeam[] => {
    return teams.map(team => {
      let totalPoints = 0;
      let totalKills = 0;

      team.matchScores.forEach(score => {
        const placePts = placementPoints[score.placement - 1] ?? 0;
        const killPts = score.kills * killPointValue;
        totalPoints += placePts + killPts + score.bonus;
        totalKills += score.kills;
      });

      return { ...team, totalPoints, totalKills };
    }).sort((a, b) => b.totalPoints - a.totalPoints || b.totalKills - a.totalKills);
  }, [teams, killPointValue, placementPoints]);


  const handleAddTeam = () => {
    if (!teamNameInput.trim()) return;
    const newTeam: Team = {
      id: Date.now(),
      name: teamNameInput.trim(),
      matchScores: Array(matchCount).fill(null).map(() => ({
        kills: 0,
        placement: 25,
        bonus: 0,
      })),
    };
    setTeams(prev => [...prev, newTeam]);
    setTeamNameInput('');
  };

  const handleUpdateTeamScore = (teamId: number, matchIndex: number, field: keyof MatchScore, value: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? {
            ...team,
            matchScores: team.matchScores.map((score, i) => 
              i === matchIndex ? { ...score, [field]: value } : score
            )
          } 
        : team
    ));
  };
  
  const handleAddMatch = () => {
    setMatchCount(prev => prev + 1);
    setTeams(prev => prev.map(team => ({
        ...team,
        matchScores: [...team.matchScores, { kills: 0, placement: 25, bonus: 0 }]
    })))
  };
  
  const handleManualPlacementPointChange = (index: number, value: string) => {
    const newPoints = [...placementPoints];
    newPoints[index] = parseInt(value, 10) || 0;
    setPlacementPoints(newPoints);
  };
  
  const startEditing = (team: Team) => {
      setEditingTeamId(team.id);
      setEditingTeamData(JSON.parse(JSON.stringify(team))); // Deep copy for editing
  };
  
  const saveEditing = () => {
      if (editingTeamData) {
          setTeams(prev => prev.map(t => t.id === editingTeamId ? editingTeamData : t));
      }
      setEditingTeamId(null);
      setEditingTeamData(null);
  };

  const deleteTeam = (id: number) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  }

  const clearLeaderboard = () => {
    setTeams([]);
    setMatchCount(1);
  };

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8 sticky top-24">
          <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tournament Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="teamName">Add New Team</Label>
                   <div className="flex gap-2">
                    <Input id="teamName" placeholder="Enter team name" value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)} />
                    <Button onClick={handleAddTeam}><PlusCircle className="h-4 w-4"/></Button>
                  </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Matches</Label>
                 <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Total Matches: {matchCount}</p>
                    <Button size="sm" variant="outline" onClick={handleAddMatch}>Add Match</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings /> Scoring System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="gamePreset" className="flex items-center gap-2">Game Preset</Label>
                    <Select value={gamePreset} onValueChange={setGamePreset}>
                        <SelectTrigger id="gamePreset"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="freefire">Free Fire</SelectItem>
                            <SelectItem value="pubg">PUBG / BGMI</SelectItem>
                            <SelectItem value="apex">Apex Legends</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch id="placement-mode" checked={useDefaultPlacement} onCheckedChange={setUseDefaultPlacement} />
                    <Label htmlFor="placement-mode">Use Preset Scoring</Label>
                </div>
                
                {!useDefaultPlacement && (
                    <>
                    <div className="space-y-2">
                        <Label htmlFor="killPointValue" className="flex items-center gap-2">Points per Kill</Label>
                        <Input id="killPointValue" type="number" min="0" value={killPointValue} onChange={e => setKillPointValue(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        <Label>Manual Placement Points</Label>
                        {Array.from({ length: 25 }, (_, i) => i).map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <Label htmlFor={`placement-${i+1}`} className="w-12">#{i+1}</Label>
                                <Input id={`placement-${i+1}`} type="number" min="0" value={placementPoints[i] || 0} onChange={e => handleManualPlacementPointChange(i, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    </>
                )}
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
                    <Button variant="destructive" size="sm" disabled={teams.length === 0}><RefreshCw className="mr-2 h-4 w-4"/>Clear All</Button>
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
                <Tabs defaultValue="match-0">
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                        {Array.from({length: matchCount}, (_, i) => (
                             <TabsTrigger key={i} value={`match-${i}`}>Match {i + 1}</TabsTrigger>
                        ))}
                        <TabsTrigger value="overall">Overall</TabsTrigger>
                    </TabsList>
                    
                    {Array.from({length: matchCount}, (_, i) => (
                        <TabsContent key={i} value={`match-${i}`}>
                            <MatchInputTable 
                                teams={teams}
                                matchIndex={i}
                                onScoreChange={handleUpdateTeamScore}
                            />
                        </TabsContent>
                    ))}

                    <TabsContent value="overall">
                        <OverallLeaderboard leaderboard={calculatedLeaderboard} onDelete={deleteTeam} onEdit={startEditing} />
                    </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

const MatchInputTable = ({ teams, matchIndex, onScoreChange }: { teams: Team[], matchIndex: number, onScoreChange: (teamId: number, matchIndex: number, field: keyof MatchScore, value: number) => void }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">Kills</TableHead>
                        <TableHead className="text-center">Placement</TableHead>
                        <TableHead className="text-center">Bonus</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {teams.map(team => (
                        <TableRow key={team.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                                <span className="font-medium">{team.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    className="w-20 mx-auto text-center"
                                    value={team.matchScores[matchIndex]?.kills ?? 0}
                                    onChange={e => onScoreChange(team.id, matchIndex, 'kills', parseInt(e.target.value) || 0)}
                                />
                            </TableCell>
                             <TableCell>
                                <Input 
                                    type="number" 
                                    className="w-20 mx-auto text-center"
                                    min="1"
                                    max="25"
                                    value={team.matchScores[matchIndex]?.placement ?? 25}
                                    onChange={e => onScoreChange(team.id, matchIndex, 'placement', parseInt(e.target.value) || 25)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    className="w-20 mx-auto text-center"
                                    value={team.matchScores[matchIndex]?.bonus ?? 0}
                                    onChange={e => onScoreChange(team.id, matchIndex, 'bonus', parseInt(e.target.value) || 0)}
                                />
                            </TableCell>
                        </TableRow>
                     ))}
                </TableBody>
            </Table>
        </div>
    )
}

const OverallLeaderboard = ({ leaderboard, onDelete, onEdit }: { leaderboard: CalculatedTeam[], onDelete: (id: number) => void, onEdit: (team: Team) => void }) => {
     return (
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">Total Kills</TableHead>
                <TableHead className="text-center">Total Pts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard.length > 0 ? (
                leaderboard.map((team, index) => (
                    <TableRow key={team.id}>
                    <TableCell className="font-bold text-center"><RankIcon rank={index + 1} /></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <span className="font-medium">{team.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{team.totalKills}</TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary">{team.totalPoints}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                        {/* <Button size="icon" variant="ghost" onClick={() => onEdit(team)}><Edit className="h-4 w-4" /></Button> */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Delete {team.name}?</AlertDialogTitle><AlertDialogDescription>This will permanently remove the team and all their scores from the tournament.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(team.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Leaderboard is empty. Add teams to get started.</TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    )
}
