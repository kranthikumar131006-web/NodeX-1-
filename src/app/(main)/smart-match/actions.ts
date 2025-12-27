"use server";

import { smartOpportunityMatching, type SmartOpportunityMatchingOutput } from "@/ai/flows/smart-opportunity-matching";
import { z } from "zod";

const FormSchema = z.object({
  studentProfile: z.string().min(10, "Student profile must be at least 10 characters."),
  availableOpportunities: z.string().min(10, "Available opportunities must be at least 10 characters."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: SmartOpportunityMatchingOutput;
};

export async function getMatchingOpportunities(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: "Error: Please check the provided information.",
      issues,
      fields: {
        studentProfile: formData.get("studentProfile") as string,
        availableOpportunities: formData.get("availableOpportunities") as string,
      }
    };
  }
  
  try {
    const result = await smartOpportunityMatching(validatedFields.data);
    return { message: "Successfully matched opportunities.", data: result };
  } catch (e) {
    const error = e as Error;
    return {
      message: `Error: ${error.message}. Please try again.`,
      fields: validatedFields.data,
    };
  }
}
