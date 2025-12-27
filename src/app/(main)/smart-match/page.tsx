"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getMatchingOpportunities, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Bot, ThumbsUp, Loader2 } from "lucide-react";
import { freelancers, availableOpportunities } from "@/lib/data";

const initialStudentProfile = JSON.stringify({
  name: freelancers[0].name,
  skills: freelancers[0].skills,
  interests: ["AI", "Web Development", "FinTech"],
  experience: "1 year of freelance work, 2 hackathons.",
}, null, 2);

const initialOpportunities = JSON.stringify(availableOpportunities, null, 2);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Matching...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Find My Matches
        </>
      )}
    </Button>
  );
}

export default function SmartMatchPage() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useFormState(getMatchingOpportunities, initialState);

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Smart Opportunity Matching</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI analyze your profile and find the most relevant freelance gigs and hackathon teams for you.
        </p>
      </div>

      <Card className="mt-8 max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentProfile" className="font-semibold">Student Profile (JSON)</Label>
                <Textarea
                  id="studentProfile"
                  name="studentProfile"
                  rows={15}
                  defaultValue={initialStudentProfile}
                  className="font-code text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableOpportunities" className="font-semibold">Available Opportunities (JSON)</Label>
                <Textarea
                  id="availableOpportunities"
                  name="availableOpportunities"
                  rows={15}
                  defaultValue={initialOpportunities}
                  className="font-code text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <SubmitButton />
            </div>
            
            {state.message && state.issues && (
              <div className="text-red-500 text-sm">
                <p>{state.message}</p>
                <ul className="list-disc list-inside">
                  {state.issues.map((issue, index) => <li key={index}>{issue}</li>)}
                </ul>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {state.data && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="font-headline text-2xl font-bold mb-4">Your AI-Powered Recommendations</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-primary" /> Recommended Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-secondary rounded-md text-sm whitespace-pre-wrap font-code">{state.data.recommendedOpportunities}</pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Reasoning</CardTitle>
                <CardDescription>Here's why the AI recommended these opportunities for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
