
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useStorage, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const tournamentSchema = z.object({
    tournamentName: z.string().min(5, "Tournament name is required."),
    organizerName: z.string().min(2, "Organizer name is required."),
    organizerEmail: z.string().email(),
    contactNumber: z.string().min(10, "A valid contact number is required."),
    gameType: z.string({ required_error: "Please select a game." }),
    description: z.string().min(20, "Please provide a detailed description."),
    rules: z.string().min(10, "Please list the rules."),
    prizePool: z.string().min(1, "Prize pool is required."),
    entryFee: z.string().min(1, "Entry fee is required."),
    startDate: z.date({ required_error: "A start date is required." }),
    endDate: z.date({ required_error: "An end date is required." }),
    registrationLink: z.string().url("Please enter a valid URL."),
});

type TournamentFormValues = z.infer<typeof tournamentSchema>;

export default function SubmitTournamentPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const storage = useStorage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [posterFile, setPosterFile] = useState<File | null>(null);

    const form = useForm<TournamentFormValues>({
        resolver: zodResolver(tournamentSchema),
        defaultValues: {
            tournamentName: searchParams.get('name') || '',
            gameType: searchParams.get('game') || undefined,
            prizePool: searchParams.get('prize') || '',
            entryFee: searchParams.get('fee') || '',
            organizerName: user?.displayName ?? "",
            organizerEmail: user?.email ?? "",
        }
    });

    // Effect to update form values if user data becomes available after form init
    useEffect(() => {
        if (user) {
            form.setValue('organizerName', user.displayName || '');
            form.setValue('organizerEmail', user.email || '');
        }
    }, [user, form]);

    const uploadImage = async (file: File, path: string): Promise<string> => {
        if (!storage) throw new Error("Firebase Storage is not configured.");
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const onSubmit = async (data: TournamentFormValues) => {
        if (!user) {
            toast.error("You must be logged in to submit a tournament.");
            router.push('/auth');
            return;
        }
        if (!posterFile) {
            toast.error("A tournament poster is required.");
            return;
        }
        setIsSubmitting(true);
        try {
            const posterUrl = await uploadImage(posterFile, `tournaments/${Date.now()}_${posterFile.name}`);
            
            await addDoc(collection(firestore, 'tournaments'), {
                ...data,
                userId: user.uid,
                posterUrl,
                status: 'pending-approval',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            toast.success("Tournament submitted successfully! It will be reviewed by an admin shortly.");
            router.push('/dashboard/my-tournaments');
        } catch (error: any) {
            console.error("Error submitting tournament:", error);
            toast.error(`Submission failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isUserLoading) {
        return (
             <div className="container py-12 pt-24 max-w-4xl mx-auto">
                 <Skeleton className="h-96 w-full" />
             </div>
        )
    }

    if (!user) {
        return (
             <div className="container py-12 pt-24 max-w-4xl mx-auto">
                <Alert>
                  <AlertTitle className="flex items-center gap-2"><LogIn /> Authentication Required</AlertTitle>
                  <AlertDescription>
                    You must be logged in to submit a tournament. Please sign in or create an account to continue.
                  </AlertDescription>
                  <div className="mt-4">
                      <Button onClick={() => router.push('/auth')}>Go to Login</Button>
                  </div>
                </Alert>
             </div>
        )
    }

    return (
        <div className="container py-12 pt-24">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Submit Your Tournament</h1>
                <p className="text-muted-foreground">Fill out the form below to get your tournament listed on our platform.</p>
            </div>

            <Card className="max-w-4xl mx-auto shadow-strong">
                <CardHeader>
                    <CardTitle>Tournament Details</CardTitle>
                    <CardDescription>Provide all the necessary information for your event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="tournamentName" render={({ field }) => (
                                    <FormItem><FormLabel>Tournament Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="organizerName" render={({ field }) => (
                                    <FormItem><FormLabel>Organizer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="organizerEmail" render={({ field }) => (
                                    <FormItem><FormLabel>Organizer Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gameType" render={({ field }) => (
                                    <FormItem><FormLabel>Game</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a game" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="PUBG">PUBG / BGMI</SelectItem>
                                                <SelectItem value="Free Fire">Free Fire</SelectItem>
                                                <SelectItem value="Valorant">Valorant</SelectItem>
                                                <SelectItem value="Fortnite">Fortnite</SelectItem>
                                                <SelectItem value="MLBB">Mobile Legends</SelectItem>
                                                <SelectItem value="Cricket">Cricket</SelectItem>
                                                <SelectItem value="Football">Football</SelectItem>
                                                <SelectItem value="Custom">Custom</SelectItem>
                                            </SelectContent>
                                        </Select><FormMessage />
                                    </FormItem>
                                )} />
                                <div className="space-y-2">
                                  <Label htmlFor="poster">Tournament Poster</Label>
                                  <Input id="poster" type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)} required />
                                </div>
                                <FormField control={form.control} name="prizePool" render={({ field }) => (
                                    <FormItem><FormLabel>Prize Pool</FormLabel><FormControl><Input {...field} placeholder="e.g., LKR 50,000" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="entryFee" render={({ field }) => (
                                    <FormItem><FormLabel>Entry Fee</FormLabel><FormControl><Input {...field} placeholder="e.g., LKR 500 or Free" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="startDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                                        </PopoverContent>
                                    </Popover><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="endDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("startDate") || new Date())} initialFocus />
                                        </PopoverContent>
                                    </Popover><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="rules" render={({ field }) => (
                                <FormItem><FormLabel>Rules & Instructions</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="registrationLink" render={({ field }) => (
                                <FormItem><FormLabel>Registration Link</FormLabel><FormControl><Input {...field} placeholder="https://forms.gle/your-form" /></FormControl><FormMessage /></FormItem>
                            )} />

                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                <Upload className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Submitting..." : "Submit Tournament"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
