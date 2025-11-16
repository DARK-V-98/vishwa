
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TournamentBudget } from '@/lib/types';

const schema = z.object({
  tournamentName: z.string().min(1, "Tournament name is required."),
  gameType: z.string().min(1, "Game type is required."),
  gameMode: z.string().min(1, "Game mode is required."),
  participants: z.coerce.number().min(2, "Must have at least 2 participants."),
  tournamentType: z.enum(['online', 'physical', 'mixed']),
  regFeeType: z.enum(['fixed', 'per-player', 'per-team']),
  regFeeAmount: z.coerce.number().min(0).default(0),
  estimatedPrizePool: z.coerce.number().min(0).default(0),
  refereeCost: z.coerce.number().min(0).default(0),
  venueCost: z.coerce.number().min(0).default(0),
  autoCalculatePrizePool: z.boolean().default(false),
  extraFees: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    onNext: (data: Partial<TournamentBudget>) => void;
    initialData: Partial<TournamentBudget>;
}

export default function PageOneSetup({ onNext, initialData }: Props) {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            tournamentName: initialData.tournamentName || '',
            gameType: initialData.gameType || '',
            gameMode: initialData.gameMode || '',
            participants: initialData.participants || 64,
            tournamentType: initialData.tournamentType || 'online',
            regFeeType: initialData.regFeeType || 'fixed',
            regFeeAmount: initialData.regFeeAmount || 0,
            estimatedPrizePool: initialData.estimatedPrizePool || 0,
            refereeCost: initialData.refereeCost || 0,
            venueCost: initialData.venueCost || 0,
            autoCalculatePrizePool: initialData.autoCalculatePrizePool || false,
            extraFees: initialData.extraFees || false
        }
    });

    const tournamentType = watch('tournamentType');

    const onSubmit = (data: FormValues) => {
        onNext(data);
    };

    return (
        <TooltipProvider>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <Input id="tournamentName" placeholder="e.g., Ultimate Gaming Showdown" {...register('tournamentName')} />
                                    {errors.tournamentName && <p className="text-destructive text-sm">{errors.tournamentName.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="gameType">Game Type</Label>
                                    <Controller
                                        name="gameType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        )}
                                    />
                                    {errors.gameType && <p className="text-destructive text-sm">{errors.gameType.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gameMode">Mode</Label>
                                     <Controller
                                        name="gameMode"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger id="gameMode"><SelectValue placeholder="Select a mode..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solo">Solo</SelectItem>
                                                    <SelectItem value="duo">Duo</SelectItem>
                                                    <SelectItem value="squad">Squad</SelectItem>
                                                    <SelectItem value="custom">Custom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.gameMode && <p className="text-destructive text-sm">{errors.gameMode.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="participants">Expected Participants</Label>
                                    <Input id="participants" type="number" placeholder="e.g., 64" {...register('participants')} />
                                    {errors.participants && <p className="text-destructive text-sm">{errors.participants.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="tournamentType">Tournament Type</Label>
                                    <Controller
                                        name="tournamentType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger id="tournamentType"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="online">Online</SelectItem>
                                                    <SelectItem value="physical">Physical Event</SelectItem>
                                                    <SelectItem value="mixed">Mixed (Online & Physical)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Financial Inputs */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Financial Inputs</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="regFeeType">Registration Fee</Label>
                                    <Controller
                                        name="regFeeType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger id="regFeeType"><SelectValue placeholder="Select fee type..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Free</SelectItem>
                                                    <SelectItem value="per-player">Per Player</SelectItem>
                                                    <SelectItem value="per-team">Per Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="regFeeAmount">Fee Amount (LKR)</Label>
                                    <Input id="regFeeAmount" type="number" placeholder="e.g., 100" {...register('regFeeAmount')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedPrizePool">Estimated Prize Pool</Label>
                                    <Input id="estimatedPrizePool" placeholder="e.g., 50,000 LKR" {...register('estimatedPrizePool')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="refereeCost">Referee / Judge Cost (Optional)</Label>
                                    <Input id="refereeCost" type="number" placeholder="e.g., 5,000" {...register('refereeCost')} />
                                </div>
                                {(tournamentType === 'physical' || tournamentType === 'mixed') && (
                                    <div className="space-y-2 animate-in fade-in">
                                        <Label htmlFor="venueCost">Venue Cost (If Physical)</Label>
                                        <Input id="venueCost" type="number" placeholder="e.g., 20,000" {...register('venueCost')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Auto Options */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Auto Options</h3>
                            <div className="space-y-4">
                                <Controller
                                    name="autoCalculatePrizePool"
                                    control={control}
                                    render={({ field }) => (
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
                                            <Switch id="auto-prize-pool" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="extraFees"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="add-fees">Add Extra Fees</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Include service charges or platform fees in the calculation.
                                                </p>
                                            </div>
                                            <Switch id="add-fees" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full md:w-auto ml-auto">
                            Next: Continue to Advanced Breakdown
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </TooltipProvider>
    );
}
