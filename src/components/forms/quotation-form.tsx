"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleGenerateQuotation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";

const initialState = {
  message: "",
  quotation: "",
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Generating..." : "Generate Quotation"}
    </Button>
  );
}

export default function QuotationForm() {
  const [state, formAction] = useFormState(handleGenerateQuotation, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? "Error" : "Success",
        description: state.message,
        variant: state.isError ? "destructive" : "default",
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide as much detail as possible for an accurate quote.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Input id="projectType" name="projectType" placeholder="e.g., Web Development, Mobile App" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Estimated Budget</Label>
                <Input id="budget" name="budget" placeholder="e.g., $5,000 - $10,000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Expected Timeline</Label>
              <Input id="timeline" name="timeline" placeholder="e.g., 2-3 months" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Must-Have Features</Label>
              <Textarea id="features" name="features" placeholder="List the key features required" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea id="projectDescription" name="projectDescription" placeholder="Describe your project in detail" rows={6} />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.quotation && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Generated Quotation</AlertTitle>
          <AlertDescription>
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 font-mono text-sm text-white whitespace-pre-wrap">
              <code>{state.quotation}</code>
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
