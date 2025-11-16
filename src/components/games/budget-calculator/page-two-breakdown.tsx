
'use client';

import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TournamentBudget } from '@/lib/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    income: z.object({
        sponsorship: z.coerce.number().min(0).default(0),
        advertisements: z.coerce.number().min(0).default(0),
        platformCharges: z.coerce.number().min(0).default(0),
    }),
    expenses: z.object({
        prizePoolDistribution: z.object({
            firstPlace: z.coerce.number().min(0).default(60),
            secondPlace: z.coerce.number().min(0).default(30),
            thirdPlace: z.coerce.number().min(0).default(10),
            specialAwards: z.coerce.number().min(0).default(0),
        }),
        staff: z.object({
            organizers: z.coerce.number().min(0).default(0),
            referees: z.coerce.number().min(0).default(0),
            moderators: z.coerce.number().min(0).default(0),
            casters: z.coerce.number().min(0).default(0),
            designers: z.coerce.number().min(0).default(0),
            editors: z.coerce.number().min(0).default(0),
        }),
        technical: z.object({
            roomCards: z.coerce.number().min(0).default(0),
            servers: z.coerce.number().min(0).default(0),
            botChecking: z.coerce.number().min(0).default(0),
            antiCheat: z.coerce.number().min(0).default(0),
        }),
        marketing: z.object({
            posters: z.coerce.number().min(0).default(0),
            paidAds: z.coerce.number().min(0).default(0),
            influencers: z.coerce.number().min(0).default(0),
        }),
        venue: z.object({
            stage: z.coerce.number().min(0).default(0),
            seating: z.coerce.number().min(0).default(0),
            soundLighting: z.coerce.number().min(0).default(0),
            cameraCrew: z.coerce.number().min(0).default(0),
        }),
        extra: z.object({
            transport: z.coerce.number().min(0).default(0),
            food: z.coerce.number().min(0).default(0),
            trophies: z.coerce.number().min(0).default(0),
            medals: z.coerce.number().min(0).default(0),
            certificates: z.coerce.number().min(0).default(0),
        }),
    })
});

type FormValues = z.infer<typeof schema>;

interface Props {
    onNext: (data: Partial<TournamentBudget>) => void;
    onBack: (data: Partial<TournamentBudget>) => void;
    initialData: Partial<TournamentBudget>;
}

const BreakdownCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card className="bg-card/30">
        <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {children}
        </CardContent>
    </Card>
);

const InputField: React.FC<{ name: keyof FormValues['expenses']['prizePoolDistribution'] | string; label: string; register: any; errors: any; isPercentage?: boolean; }> = ({ name, label, register, errors, isPercentage }) => {
    const error = name.split('.').reduce((o, i) => o?.[i], errors);
    return (
        <div className="space-y-2">
            <Label htmlFor={name as string}>{label}</Label>
            <div className="relative">
                <Input id={name as string} type="number" placeholder="0" {...register(name as string)} />
                {isPercentage && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>}
            </div>
            {error && <p className="text-destructive text-sm">{error.message}</p>}
        </div>
    );
}

export default function PageTwoBreakdown({ onNext, onBack, initialData }: Props) {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            income: initialData.income || {},
            expenses: initialData.expenses || {},
        },
    });

    const isPhysical = initialData.tournamentType === 'physical' || initialData.tournamentType === 'mixed';

    const handleNext = (data: FormValues) => {
        onNext(data);
    };
    
    const handleBack = () => {
        onBack(getValues());
    };

    return (
        <form onSubmit={handleSubmit(handleNext)}>
            <Card className="max-w-6xl mx-auto shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Page 2: Advanced Breakdown</CardTitle>
                    <CardDescription>Fine-tune your tournament's budget with a detailed breakdown of incomes and expenses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    
                    <BreakdownCard title="A. Income Calculation">
                        <InputField name="income.sponsorship" label="Sponsorship Income (LKR)" register={register} errors={errors} />
                        <InputField name="income.advertisements" label="Advertisements Income (LKR)" register={register} errors={errors} />
                        <InputField name="income.platformCharges" label="Platform Service Charges (LKR)" register={register} errors={errors} />
                    </BreakdownCard>

                    <h3 className="text-2xl font-semibold text-center">B. Expense Calculation</h3>
                    
                    <BreakdownCard title="1. Prize Pool Distribution">
                        <InputField name="expenses.prizePoolDistribution.firstPlace" label="1st Place" register={register} errors={errors} isPercentage />
                        <InputField name="expenses.prizePoolDistribution.secondPlace" label="2nd Place" register={register} errors={errors} isPercentage />
                        <InputField name="expenses.prizePoolDistribution.thirdPlace" label="3rd Place" register={register} errors={errors} isPercentage />
                        <InputField name="expenses.prizePoolDistribution.specialAwards" label="Special Awards (e.g., MVP)" register={register} errors={errors} isPercentage />
                    </BreakdownCard>

                    <BreakdownCard title="2. Staff Costs (LKR)">
                        <InputField name="expenses.staff.organizers" label="Organizers" register={register} errors={errors} />
                        <InputField name="expenses.staff.referees" label="Referees / Judges" register={register} errors={errors} />
                        <InputField name="expenses.staff.moderators" label="Moderators / Room Managers" register={register} errors={errors} />
                        <InputField name="expenses.staff.casters" label="Casters / Commentators" register={register} errors={errors} />
                        <InputField name="expenses.staff.designers" label="Graphic Designers" register={register} errors={errors} />
                        <InputField name="expenses.staff.editors" label="Video Editors" register={register} errors={errors} />
                    </BreakdownCard>

                     <BreakdownCard title="3. Technical Costs (LKR)">
                        <InputField name="expenses.technical.roomCards" label="Room Cards" register={register} errors={errors} />
                        <InputField name="expenses.technical.servers" label="Server Costs" register={register} errors={errors} />
                        <InputField name="expenses.technical.botChecking" label="Bot Checking Tools" register={register} errors={errors} />
                        <InputField name="expenses.technical.antiCheat" label="Anti-Cheat Systems" register={register} errors={errors} />
                    </BreakdownCard>

                    <BreakdownCard title="4. Marketing (LKR)">
                        <InputField name="expenses.marketing.posters" label="Posters / Thumbnails" register={register} errors={errors} />
                        <InputField name="expenses.marketing.paidAds" label="Paid Ads" register={register} errors={errors} />
                        <InputField name="expenses.marketing.influencers" label="Influencer Promotions" register={register} errors={errors} />
                    </BreakdownCard>

                    {isPhysical && (
                        <BreakdownCard title="5. Venue (LKR)">
                            <InputField name="expenses.venue.stage" label="Stage Cost" register={register} errors={errors} />
                            <InputField name="expenses.venue.seating" label="Chairs / Tables" register={register} errors={errors} />
                            <InputField name="expenses.venue.soundLighting" label="Sound / Lighting" register={register} errors={errors} />
                            <InputField name="expenses.venue.cameraCrew" label="Camera Crew" register={register} errors={errors} />
                        </BreakdownCard>
                    )}
                    
                     <BreakdownCard title="6. Extra Costs (LKR)">
                        <InputField name="expenses.extra.transport" label="Transport" register={register} errors={errors} />
                        <InputField name="expenses.extra.food" label="Food" register={register} errors={errors} />
                        <InputField name="expenses.extra.trophies" label="Trophies" register={register} errors={errors} />
                        <InputField name="expenses.extra.medals" label="Medals" register={register} errors={errors} />
                        <InputField name="expenses.extra.certificates" label="Certificates" register={register} errors={errors} />
                    </BreakdownCard>


                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button size="lg" variant="outline" type="button" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button type="submit" size="lg">
                        Next: Final Summary
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
