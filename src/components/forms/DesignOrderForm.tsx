
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters."),
  clientEmail: z.string().email("Invalid email address."),
  serviceType: z.enum(["logo", "post"], { required_error: "Please select a service type." }),
  projectBrief: z.string().min(20, "Brief must be at least 20 characters.").max(500),
});

export default function DesignOrderForm() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: user?.displayName || "",
      clientEmail: user?.email || "",
      projectBrief: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isUserLoading) {
      toast.info("Please wait, user session is loading.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to place an order.", {
        action: { label: "Sign In", onClick: () => router.push('/auth') },
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const designOrdersCollection = collection(firestore, 'designOrders');
      await addDoc(designOrdersCollection, {
        clientId: user.uid,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        serviceType: values.serviceType,
        projectBrief: values.projectBrief,
        status: "Pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Your design order has been placed!");
      form.reset();

    } catch (error: any) {
      console.error("Error placing design order: ", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>New Design Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a design service" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="logo">Logo Design</SelectItem>
                        <SelectItem value="post">Social Media Post</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="projectBrief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Brief</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your vision, brand colors, target audience, etc." {...field} rows={5} />
                  </FormControl>
                  <FormDescription>
                    The more details you provide, the better we can match your vision.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting || isUserLoading}>
                {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    