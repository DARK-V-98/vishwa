
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Crown, Medal, Trophy, RefreshCw, Edit, Save, X, Settings, Download, Info, Gamepad2, Swords, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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
  name: string;
  logoUrl: string;
  players: string[];
  region: string;
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
    'valorant': { // Placeholder
        killPointValue: 0,
        placementPoints: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
    'fortnite': { // Placeholder
        killPointValue: 1,
        placementPoints: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
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
  const [activeTab, setActiveTab] = useState('match-0');
  
  // UI State
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamData, setEditingTeamData] = useState<Team | null>(null);

  useEffect(() => {
    try {
      const savedTeams = localStorage.getItem('esportsTeams');
      const savedMatchCount = localStorage.getItem('esportsMatchCount');
      const savedPreset = localStorage.getItem('esportsPreset');
      const savedKillPoints = localStorage.getItem('esportsKillPoints');
      const savedPlacementPoints = localStorage.getItem('esportsPlacementPoints');
      const savedUseDefault = localStorage.getItem('esportsUseDefault');

      if (savedPreset) setGamePreset(savedPreset);
      const useDefault = savedUseDefault ? JSON.parse(savedUseDefault) : true;
      setUseDefaultPlacement(useDefault);

      if (useDefault) {
          const presetKey = (savedPreset || 'freefire') as keyof typeof GAME_PRESETS;
          setKillPointValue(GAME_PRESETS[presetKey].killPointValue);
          setPlacementPoints(GAME_PRESETS[presetKey].placementPoints);
      } else {
          if(savedKillPoints) setKillPointValue(JSON.parse(savedKillPoints));
          if(savedPlacementPoints) setPlacementPoints(JSON.parse(savedPlacementPoints));
      }

      if (savedTeams) {
        const parsedTeams: Team[] = JSON.parse(savedTeams);
        const count = savedMatchCount ? parseInt(savedMatchCount, 10) : 1;
        
        // Ensure data integrity
        parsedTeams.forEach(team => {
            if (!team.logoUrl) team.logoUrl = '';
            if (!team.players) team.players = [];
            if (!team.region) team.region = '';
            if (team.matchScores.length < count) {
                for (let i = team.matchScores.length; i < count; i++) {
                    team.matchScores.push({ kills: 0, placement: 25, bonus: 0 });
                }
            } else if (team.matchScores.length > count) {
                team.matchScores = team.matchScores.slice(0, count);
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
        localStorage.setItem('esportsPreset', gamePreset);
        localStorage.setItem('esportsKillPoints', JSON.stringify(killPointValue));
        localStorage.setItem('esportsPlacementPoints', JSON.stringify(placementPoints));
        localStorage.setItem('esportsUseDefault', JSON.stringify(useDefaultPlacement));
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [teams, matchCount, gamePreset, killPointValue, placementPoints, useDefaultPlacement]);

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

  const handleAddTeam = (newTeam: Omit<Team, 'id' | 'matchScores'>) => {
    const teamToAdd: Team = {
      id: Date.now(),
      ...newTeam,
      matchScores: Array(matchCount).fill(null).map(() => ({
        kills: 0,
        placement: 25,
        bonus: 0,
      })),
    };
    setTeams(prev => [...prev, teamToAdd]);
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
    setMatchCount(prev => {
        const newCount = prev + 1;
        setTeams(prevTeams => prevTeams.map(team => ({
            ...team,
            matchScores: [...team.matchScores, { kills: 0, placement: 25, bonus: 0 }]
        })))
        setActiveTab(`match-${newCount - 1}`);
        return newCount;
    });
  };

  const handleRemoveMatch = () => {
    if (matchCount <= 1) return;
    setMatchCount(prev => {
        const newCount = prev - 1;
        setTeams(prevTeams => prevTeams.map(team => ({
            ...team,
            matchScores: team.matchScores.slice(0, newCount)
        })));
        
        if (activeTab === `match-${newCount}`) {
            setActiveTab(`match-${newCount - 1}`);
        }
        
        return newCount;
    });
  };
  
  const handleManualPlacementPointChange = (index: number, value: string) => {
    const newPoints = [...placementPoints];
    newPoints[index] = parseInt(value, 10) || 0;
    setPlacementPoints(newPoints);
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
    setActiveTab('match-0');
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
              <TeamEntryDialog onAddTeam={handleAddTeam} />
              <Separator />
              <div className="space-y-2">
                <Label>Matches</Label>
                 <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Total: {matchCount}</p>
                    <Button size="sm" variant="outline" onClick={handleAddMatch}>Add Match</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={matchCount <= 1}>Remove Last</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Last Match?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete all scores for Match {matchCount}. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRemoveMatch}>Yes, remove it</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                            <SelectItem value="valorant">Valorant</SelectItem>
                            <SelectItem value="fortnite">Fortnite</SelectItem>
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
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                        <OverallLeaderboard leaderboard={calculatedLeaderboard} onDelete={deleteTeam} />
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
                                <Avatar><AvatarImage src={team.logoUrl} /><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
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

const OverallLeaderboard = ({ leaderboard, onDelete }: { leaderboard: CalculatedTeam[], onDelete: (id: number) => void }) => {
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
                        <Avatar><AvatarImage src={team.logoUrl} /><AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        <span className="font-medium">{team.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{team.totalKills}</TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary">{team.totalPoints}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
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

function TeamEntryDialog({ onAddTeam }: { onAddTeam: (team: Omit<Team, 'id'|'matchScores'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [players, setPlayers] = useState(['']);
    const [region, setRegion] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlayerChange = (index: number, value: string) => {
        const newPlayers = [...players];
        newPlayers[index] = value;
        setPlayers(newPlayers);
    };

    const addPlayerInput = () => setPlayers([...players, '']);
    const removePlayerInput = (index: number) => setPlayers(players.filter((_, i) => i !== index));

    const handleSubmit = () => {
        if (!teamName.trim()) return;
        onAddTeam({ name: teamName, logoUrl: logoPreview, players: players.filter(p => p.trim()), region });
        // Reset form
        setTeamName('');
        setLogoFile(null);
        setLogoPreview('');
        setPlayers(['']);
        setRegion('');
        setIsOpen(false);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add New Team</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a New Team</DialogTitle>
                    <DialogDescription>Enter the details for the new team.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logo" className="text-right">Logo</Label>
                        <div className="col-span-3 flex items-center gap-2">
                           <Avatar>
                                <AvatarImage src={logoPreview} />
                                <AvatarFallback><Upload className="h-4 w-4" /></AvatarFallback>
                           </Avatar>
                           <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="region" className="text-right">Region</Label>
                        <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="col-span-3" placeholder="e.g., Sri Lanka" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                       <Label className="text-right pt-2">Players</Label>
                       <div className="col-span-3 space-y-2">
                            {players.map((player, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input value={player} onChange={(e) => handlePlayerChange(index, e.target.value)} placeholder={`Player ${index + 1}`} />
                                    <Button variant="ghost" size="icon" onClick={() => removePlayerInput(index)} disabled={players.length === 1}><X className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addPlayerInput}>Add Player</Button>
                       </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSubmit}>Add Team</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    

    