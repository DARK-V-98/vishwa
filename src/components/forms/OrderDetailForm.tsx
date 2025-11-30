
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WebOrder } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  businessName: z.string().optional(),
  features: z.string().min(10, "Please describe the required features."),
  hostingOption: z.enum(['provide', 'existing'], { required_error: 'Please select a hosting option.'}),
  domainOption: z.enum(['new', 'existing'], { required_error: 'Please select a domain option.'}),
  paymentPlanType: z.enum(['full', 'monthly'], { required_error: 'Please select a payment plan.'}),
  selectedMonths: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderDetailFormProps {
    order: WebOrder;
}

export default function OrderDetailForm({ order }: OrderDetailFormProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const paymentOptions = useMemo(() => {
        const options: { months: number; allowed: boolean }[] = [];
        if (order.totalCost < 15000) {
            return [{ months: 1, allowed: true }]; // Only full payment
        }
        if (order.totalCost >= 15000 && order.totalCost < 30000) options.push({ months: 2, allowed: true });
        if (order.totalCost >= 30000 && order.totalCost < 50000) options.push({ months: 3, allowed: true });
        if (order.totalCost >= 50000 && order.totalCost < 75000) options.push({ months: 4, allowed: true });
        if (order.totalCost >= 75000) options.push({ months: 5, allowed: true });

        // Ensure at least one option is available if cost is high
        if (options.length === 0 && order.totalCost >= 15000) {
             options.push({ months: 2, allowed: true });
        }
        
        return [{ months: 1, allowed: true }, ...options];
    }, [order.totalCost]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: user?.displayName || '',
            paymentPlanType: paymentOptions.length === 1 ? 'full' : undefined,
        },
    });

    const paymentPlanType = form.watch('paymentPlanType');
    const selectedMonths = form.watch('selectedMonths');

    const monthlyAmount = useMemo(() => {
        if (paymentPlanType === 'monthly' && selectedMonths) {
            return order.totalCost / selectedMonths;
        }
        return 0;
    }, [paymentPlanType, selectedMonths, order.totalCost]);


    async function onSubmit(values: FormValues) {
        if (!user) {
            toast.error("You must be logged in.");
            return;
        }
        setIsSubmitting(true);

        const detailData = {
            ...values,
            orderId: order.id,
            submittedAt: serverTimestamp(),
        };

        const orderUpdates: Partial<WebOrder> = {
            status: 'In Progress',
            updatedAt: serverTimestamp(),
        };
        if (paymentPlanType === 'monthly' && selectedMonths) {
            orderUpdates.monthsAllowed = selectedMonths;
            orderUpdates.monthlyAmount = monthlyAmount;
        }

        try {
            // Save details in subcollection
            const detailDocRef = doc(firestore, 'webOrders', order.id, 'details', 'client');
            await setDoc(detailDocRef, detailData);

            // Update main order document
            const orderDocRef = doc(firestore, 'webOrders', order.id);
            await updateDoc(orderDocRef, orderUpdates);

            toast.success("Your project details have been submitted successfully!");
            router.push('/dashboard/my-websites');
        } catch (e: any) {
            toast.error("Failed to submit details. Please try again.");
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="shadow-strong">
            <CardHeader>
                <CardTitle className="text-center">Project Details for Order #{order.id}</CardTitle>
                <CardDescription className="text-center">Please fill out the form below to begin your project.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold">Your Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><Input {...field} /></FormItem>
                            )} />
                            <FormField control={form.control} name="businessName" render={({ field }) => (
                                <FormItem><FormLabel>Business Name (Optional)</FormLabel><Input {...field} /></FormItem>
                            )} />
                        </div>
                    </div>

                    <Separator/>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Project Requirements</h3>
                         <FormField control={form.control} name="features" render={({ field }) => (
                            <FormItem><FormLabel>Required Features</FormLabel><Textarea {...field} rows={5} placeholder="e.g., Contact form, image gallery, blog, user accounts..." /></FormItem>
                        )} />
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="hostingOption" render={({ field }) => (
                                <FormItem><FormLabel>Hosting</FormLabel>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><RadioGroupItem value="provide" id="h-provide"/><Label htmlFor="h-provide">Provide for me</Label></FormItem>
                                    <FormItem className="flex items-center space-x-2"><RadioGroupItem value="existing" id="h-existing"/><Label htmlFor="h-existing">I have existing hosting</Label></FormItem>
                                </RadioGroup></FormItem>
                            )} />
                            <FormField control={form.control} name="domainOption" render={({ field }) => (
                                <FormItem><FormLabel>Domain Name</FormLabel>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                    <FormItem className="flex items-center space-x-2"><RadioGroupItem value="new" id="d-new"/><Label htmlFor="d-new">Register a new one</Label></FormItem>
                                    <FormItem className="flex items-center space-x-2"><RadioGroupItem value="existing" id="d-existing"/><Label htmlFor="d-existing">I have an existing domain</Label></FormItem>
                                </RadioGroup></FormItem>
                            )} />
                        </div>
                    </div>
                    
                    <Separator/>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Payment Plan</h3>
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Project Cost</span>
                                <Badge variant="secondary" className="text-lg">LKR {order.totalCost.toLocaleString()}</Badge>
                            </div>
                        </div>
                         <FormField control={form.control} name="paymentPlanType" render={({ field }) => (
                            <FormItem><FormLabel>Select Your Plan</FormLabel>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                {paymentOptions.map(opt => (
                                    <Card key={opt.months} className={`p-3 cursor-pointer ${paymentPlanType === (opt.months === 1 ? 'full' : 'monthly') && (!selectedMonths || selectedMonths === opt.months) ? 'border-primary ring-2 ring-primary' : ''}`}>
                                        <Label className="flex items-center justify-between w-full cursor-pointer">
                                            <span>
                                                <strong className="block">{opt.months === 1 ? 'Full Payment' : `${opt.months}-Month Plan`}</strong>
                                                <small className="text-muted-foreground">
                                                    {opt.months > 1 ? `${(order.totalCost / opt.months).toLocaleString('en-US', { style: 'currency', currency: 'LKR' })} / month` : 'Pay upfront'}
                                                </small>
                                            </span>
                                            <RadioGroupItem 
                                                value={opt.months === 1 ? 'full' : 'monthly'} 
                                                id={`plan-${opt.months}`}
                                                onClick={() => form.setValue('selectedMonths', opt.months > 1 ? opt.months : undefined)}
                                                disabled={!opt.allowed}
                                            />
                                        </Label>
                                    </Card>
                                ))}
                            </RadioGroup></FormItem>
                        )} />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit Project Details
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

