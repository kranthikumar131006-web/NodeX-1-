'use server';

/**
 * @fileOverview An AI agent that recommends relevant freelance opportunities and hackathon teams to students.
 *
 * - smartOpportunityMatching - A function that handles the opportunity matching process.
 * - SmartOpportunityMatchingInput - The input type for the smartOpportunityMatching function.
 * - SmartOpportunityMatchingOutput - The return type for the smartOpportunityMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartOpportunityMatchingInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('A detailed profile of the student, including skills, experience, and interests.'),
  availableOpportunities: z
    .string()
    .describe('A list of available freelance opportunities and hackathon teams.'),
});
export type SmartOpportunityMatchingInput = z.infer<typeof SmartOpportunityMatchingInputSchema>;

const SmartOpportunityMatchingOutputSchema = z.object({
  recommendedOpportunities: z
    .string()
    .describe('A list of freelance opportunities and hackathon teams recommended for the student.'),
  reasoning: z.string().describe('The AI agents reasoning for making the recommendations.'),
});
export type SmartOpportunityMatchingOutput = z.infer<typeof SmartOpportunityMatchingOutputSchema>;

export async function smartOpportunityMatching(
  input: SmartOpportunityMatchingInput
): Promise<SmartOpportunityMatchingOutput> {
  return smartOpportunityMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartOpportunityMatchingPrompt',
  input: {schema: SmartOpportunityMatchingInputSchema},
  output: {schema: SmartOpportunityMatchingOutputSchema},
  prompt: `You are an AI agent specializing in matching students with freelance opportunities and hackathon teams.

You will analyze the student's profile and the available opportunities to recommend the most relevant options.

Consider the student's skills, experience, and interests when making your recommendations. Explain your reasoning.

Student Profile: {{{studentProfile}}}

Available Opportunities: {{{availableOpportunities}}}`,
});

const smartOpportunityMatchingFlow = ai.defineFlow(
  {
    name: 'smartOpportunityMatchingFlow',
    inputSchema: SmartOpportunityMatchingInputSchema,
    outputSchema: SmartOpportunityMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
