
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function TournamentBudgetForm() {
  const [tournamentType, setTournamentType] = useState('online');

  return (
    <TooltipProvider>
      <Card className="max-w-4xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Page 1: Tournament Base Setup</CardTitle>
          <CardDescription>Enter the core details of your tournament to begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Tournament Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tournament Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tournamentName">Tournament Name</Label>
                <Input id="tournamentName" placeholder="e.g., Ultimate Gaming Showdown" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameType">Game Type</Label>
                <Select>
                  <SelectTrigger id="gameType"><SelectValue placeholder="Select a game..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freefire">Free Fire</SelectItem>
                    <SelectItem value="pubg">PUBG / BGMI</SelectItem>
                    <SelectItem value="mlbb">Mobile Legends: Bang Bang</SelectItem>
                    <SelectItem value="valorant">Valorant</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameMode">Mode</Label>
                <Select>
                  <SelectTrigger id="gameMode"><SelectValue placeholder="Select a mode..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="squad">Squad</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Expected Participants</Label>
                <Input id="participants" type="number" placeholder="e.g., 64" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tournamentType">Tournament Type</Label>
                <Select onValueChange={setTournamentType} defaultValue={tournamentType}>
                    <SelectTrigger id="tournamentType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="physical">Physical Event</SelectItem>
                        <SelectItem value="mixed">Mixed (Online & Physical)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Inputs</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="regFee">Registration Fee</Label>
                <Select>
                  <SelectTrigger id="regFee"><SelectValue placeholder="Select fee type..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="per-player">Per Player</SelectItem>
                    <SelectItem value="per-team">Per Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prizePool">Estimated Prize Pool</Label>
                 <Input id="prizePool" placeholder="e.g., 50,000 LKR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refereeCost">Referee / Judge Cost (Optional)</Label>
                <Input id="refereeCost" type="number" placeholder="e.g., 5,000" />
              </div>
              { (tournamentType === 'physical' || tournamentType === 'mixed') && (
                <div className="space-y-2 animate-in fade-in">
                  <Label htmlFor="venueCost">Venue Cost (If Physical)</Label>
                  <Input id="venueCost" type="number" placeholder="e.g., 20,000" />
                </div>
              )}
            </div>
          </div>

          <Separator />
          
          {/* Auto Options */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold">Auto Options</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label htmlFor="auto-prize-pool" className="flex items-center">
                            Auto-calculate prize pool
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Automatically set prize pool based on participants.</p></TooltipContent>
                            </Tooltip>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Calculates prize pool as a percentage of registration income.
                        </p>
                    </div>
                    <Switch id="auto-prize-pool" />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label htmlFor="add-fees">Add Extra Fees</Label>
                         <p className="text-xs text-muted-foreground">
                            Include service charges or platform fees in the calculation.
                        </p>
                    </div>
                    <Switch id="add-fees" />
                </div>
             </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full md:w-auto ml-auto">
            Next: Continue to Advanced Breakdown
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
