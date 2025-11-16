
'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Download, Save, Share2, AlertTriangle, TrendingUp, TrendingDown, CircleHelp, ArrowRight, Sparkles } from 'lucide-react';
import type { TournamentBudget } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateBudgetSuggestions, BudgetSuggestionOutput } from '@/ai/flows/budget-suggestion-flow';
import { Skeleton } from '@/components/ui/skeleton';


interface Props {
    onBack: () => void;
    onRestart: () => void;
    initialData: Partial<TournamentBudget>;
}

const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const SummaryCard = ({ title, value, variant = 'default', tooltipText }: { title: string, value: string | number, variant?: 'default' | 'profit' | 'loss', tooltipText?: string }) => {
    const valueColor = variant === 'profit' ? 'text-green-500' : variant === 'loss' ? 'text-red-500' : '';
    return (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
                 <p className="text-muted-foreground">{title}</p>
                 {tooltipText && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CircleHelp className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent><p>{tooltipText}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                 )}
            </div>
            <p className={`text-lg font-bold ${valueColor}`}>{typeof value === 'number' ? formatCurrency(value) : value}</p>
        </div>
    );
};

export default function PageThreeSummary({ onBack, onRestart, initialData }: Props) {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<BudgetSuggestionOutput | null>(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

    const calculations = useMemo(() => {
        const { participants = 0, regFeeType, regFeeAmount = 0, income, expenses, estimatedPrizePool = 0, refereeCost = 0, venueCost = 0 } = initialData;
        
        let registrationIncome = 0;
        if (regFeeType === 'per-player' || regFeeType === 'per-team') {
            registrationIncome = participants * regFeeAmount;
        }

        const sponsorship = income?.sponsorship || 0;
        const advertisements = income?.advertisements || 0;
        const platformCharges = income?.platformCharges || 0;

        const totalIncome = registrationIncome + sponsorship + advertisements + platformCharges;

        const staffCosts = Object.values(expenses?.staff || {}).reduce((sum, val) => sum + val, 0);
        const technicalCosts = Object.values(expenses?.technical || {}).reduce((sum, val) => sum + val, 0);
        const marketingCosts = Object.values(expenses?.marketing || {}).reduce((sum, val) => sum + val, 0);
        const venueCosts = Object.values(expenses?.venue || {}).reduce((sum, val) => sum + val, 0) + venueCost;
        const extraCosts = Object.values(expenses?.extra || {}).reduce((sum, val) => sum + val, 0);

        const totalExpenses = estimatedPrizePool + refereeCost + staffCosts + technicalCosts + marketingCosts + venueCosts + extraCosts;

        const profitOrLoss = totalIncome - totalExpenses;
        
        const profitPercentage = totalIncome > 0 ? (profitOrLoss / totalIncome) * 100 : 0;
        
        let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
        if (profitOrLoss < 0) {
            riskLevel = 'High';
        } else if (profitPercentage < 20) {
            riskLevel = 'Medium';
        }

        return {
            totalIncome,
            totalExpenses,
            profitOrLoss,
            riskLevel,
            profitPercentage,
            registrationIncome,
        };
    }, [initialData]);
    
    useEffect(() => {
        async function fetchSuggestions() {
            setIsLoadingSuggestions(true);
            try {
                const suggestionInput = {
                    participants: initialData.participants || 0,
                    regFeeAmount: initialData.regFeeAmount || 0,
                    estimatedPrizePool: initialData.estimatedPrizePool || 0,
                    totalExpenses: calculations.totalExpenses,
                    totalIncome: calculations.totalIncome,
                };
                const result = await generateBudgetSuggestions(suggestionInput);
                setSuggestions(result);
            } catch (error) {
                console.error("Failed to fetch AI suggestions:", error);
                // Silently fail, don't show an error to the user
                setSuggestions(null);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }
        fetchSuggestions();
    }, [calculations, initialData]);


    const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
        if (risk === 'High') return 'bg-red-500/20 text-red-500 border-red-500/30';
        if (risk === 'Medium') return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
        return 'bg-green-500/20 text-green-500 border-green-500/30';
    }

    const handleContinue = () => {
        const queryParams = new URLSearchParams({
            name: initialData.tournamentName || '',
            game: initialData.gameType || '',
            prize: initialData.estimatedPrizePool?.toString() || '0',
            fee: initialData.regFeeAmount?.toString() || '0',
        });
        router.push(`/tournaments/submit?${queryParams.toString()}`);
    }

    return (
        <Card className="max-w-4xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Page 3: Final Summary</CardTitle>
                <CardDescription>Here's the complete financial breakdown of your tournament plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Main Summary */}
                <div className="space-y-4">
                    <SummaryCard title="Total Income" value={calculations.totalIncome} variant="profit" tooltipText="Registration + Sponsorship + Ads + Platform Charges" />
                    <SummaryCard title="Total Expenses" value={calculations.totalExpenses} variant="loss" tooltipText="Prize Pool + All Other Costs" />
                    <div className="border-t border-dashed my-2"></div>
                    <SummaryCard title={calculations.profitOrLoss >= 0 ? "Estimated Profit" : "Estimated Loss"} value={calculations.profitOrLoss} variant={calculations.profitOrLoss >= 0 ? 'profit' : 'loss'} />
                </div>

                {/* Risk & Profitability */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`flex flex-col items-center justify-center p-6 rounded-lg ${getRiskColor(calculations.riskLevel)}`}>
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p className="font-bold text-lg">{calculations.riskLevel} Risk</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                        {calculations.profitOrLoss >= 0 ? <TrendingUp className="h-8 w-8 mb-2 text-green-500" /> : <TrendingDown className="h-8 w-8 mb-2 text-red-500" />}
                        <p className="font-bold text-lg">{calculations.profitPercentage.toFixed(2)}% Profit Margin</p>
                    </div>
                </div>

                 {/* AI Suggestions */}
                <Card className="bg-card/30">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><Sparkles className="text-primary"/>AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        {isLoadingSuggestions ? (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-5 w-4/5" />
                            </div>
                        ) : suggestions ? (
                             <>
                                <p><strong className="text-primary">Suggested Fee:</strong> {suggestions.suggestedFee}</p>
                                <p><strong className="text-primary">Prize Distribution:</strong> {suggestions.prizeDistribution}</p>
                                <p><strong className="text-primary">Cost Saving Tip:</strong> {suggestions.costSavingTip}</p>
                             </>
                        ) : (
                            <p>AI suggestions could not be loaded at this time.</p>
                        )}
                    </CardContent>
                </Card>

                {/* User Actions */}
                <div className="space-y-3 pt-4">
                     <h3 className="text-lg font-semibold text-center">What's Next?</h3>
                     <div className="grid grid-cols-1 gap-4">
                         <Button size="lg" variant="hero" onClick={handleContinue}>
                             Continue to Tournament Submission 
                             <ArrowRight className="ml-2 h-4 w-4" />
                         </Button>
                         <div className="grid md:grid-cols-2 gap-4">
                            <Button size="lg" variant="secondary" disabled><Save className="mr-2 h-4 w-4" /> Save to Profile</Button>
                            <Button size="lg" variant="outline" disabled><Download className="mr-2 h-4 w-4" /> Export</Button>
                         </div>
                     </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-4">
                <Button size="lg" variant="outline" type="button" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button size="lg" variant="ghost" type="button" onClick={onRestart}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                </Button>
            </CardFooter>
        </Card>
    );
}
