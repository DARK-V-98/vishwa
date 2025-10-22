"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const appointmentSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  meetingType: z.enum(["online", "physical"], { required_error: "Please select a meeting type." }),
  timeSlot: z.string({ required_error: "Please select a time slot." }),
});

const timeSlots = [
  "09:00 AM - 09:30 AM",
  "10:00 AM - 10:30 AM",
  "11:00 AM - 11:30 AM",
  "02:00 PM - 02:30 PM",
  "03:00 PM - 03:30 PM",
  "04:00 PM - 04:30 PM",
];

export default function AppointmentPage() {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(values: z.infer<typeof appointmentSchema>) {
    const formattedDate = date ? format(date, "PPP") : "No date selected";
    toast({
      title: "Appointment Booked!",
      description: `We'll meet with ${values.name} on ${formattedDate} at ${values.timeSlot}. A confirmation has been sent to ${values.email}.`,
    });
    form.reset();
  }
  
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-2">Book an Appointment</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Schedule a meeting with us to discuss your project. Choose a date, select a time, and let's talk.
      </p>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-lg"
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            />
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Confirm Your Slot</CardTitle>
            <CardDescription>
              Selected Date: {date ? format(date, "PPP") : "Please select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="meetingType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Meeting Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="online" /></FormControl>
                            <FormLabel className="font-normal">Online Meeting</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="physical" /></FormControl>
                            <FormLabel className="font-normal">Physical Meeting</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Time Slots</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={!date}>Book Appointment</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
