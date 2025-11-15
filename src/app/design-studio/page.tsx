
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Paperclip, Send } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DesignOrderForm from "@/components/forms/DesignOrderForm";

export default function DesignStudioPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="container py-12 pt-24">
      <h1 className="text-4xl font-bold text-center mb-2">Design Studio</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Bring your vision to life. Order custom logos and posts, manage feedback, and schedule previews all in one place.
      </p>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <DesignOrderForm />

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
