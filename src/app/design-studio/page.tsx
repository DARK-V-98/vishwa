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
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Paperclip, Send } from "lucide-react";
import React from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  serviceType: z.enum(["logo", "post"], { required_error: "Please select a service type." }),
  projectBrief: z.string().min(20, "Brief must be at least 20 characters.").max(500),
});

export default function DesignStudioPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      projectBrief: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically handle form submission, e.g., send to a server
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-2">Design Studio</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Bring your vision to life. Order custom logos and posts, manage feedback, and schedule previews all in one place.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>New Design Order</CardTitle>
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
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
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
                <Button type="submit" className="w-full">Place Order</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Schedule Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Client Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-80">
                      <div className="flex-grow space-y-4 pr-4 overflow-y-auto">
                          <div className="flex items-start gap-2.5">
                              <Avatar>
                                  <AvatarImage src="https://picsum.photos/seed/client/40/40" />
                                  <AvatarFallback>C</AvatarFallback>
                              </Avatar>
                              <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-xs">
                                  <p className="text-sm">Hi! Looking forward to seeing the first draft.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-2.5 justify-end">
                               <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-xs">
                                  <p className="text-sm">Of course! We're putting the finishing touches on it and will send it over shortly.</p>
                              </div>
                              <Avatar>
                                  <AvatarImage src="https://picsum.photos/seed/designer/40/40" />
                                  <AvatarFallback>D</AvatarFallback>
                              </Avatar>
                          </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <Input placeholder="Type a message..." className="pr-20" />
                        <div className="absolute top-0 right-0 h-full flex items-center">
                            <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Send className="h-4 w-4" /></Button>
                        </div>
                      </div>
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
