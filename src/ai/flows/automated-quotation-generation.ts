'use server';
/**
 * @fileOverview An automated quotation generation AI agent.
 *
 * - generateQuotation - A function that handles the quotation generation process.
 * - GenerateQuotationInput - The input type for the generateQuotation function.
 * - GenerateQuotationOutput - The return type for the generateQuotation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuotationInputSchema = z.object({
  projectType: z
    .string()
    .describe('The type of project, e.g., web development, mobile app, etc.'),
  projectDescription: z
    .string()
    .describe('A detailed description of the project requirements.'),
  budget: z
    .string()
    .describe('The client estimated budget for the project, e.g., $5000 - $10000'),
  timeline: z
    .string()
    .describe('The expected timeline for project completion, e.g., 2-3 months.'),
  features: z
    .string()
    .describe('The list of must-have features for the project.'),
});
export type GenerateQuotationInput = z.infer<typeof GenerateQuotationInputSchema>;

const GenerateQuotationOutputSchema = z.object({
  quotation: z.string().describe('The generated project quotation.'),
});
export type GenerateQuotationOutput = z.infer<typeof GenerateQuotationOutputSchema>;

export async function generateQuotation(
  input: GenerateQuotationInput
): Promise<GenerateQuotationOutput> {
  return generateQuotationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuotationPrompt',
  input: {schema: GenerateQuotationInputSchema},
  output: {schema: GenerateQuotationOutputSchema},
  prompt: `You are an expert in generating project quotations for ESystemLK, a company that offers web development and custom software solutions.

  Based on the client's requirements below, generate a detailed and professional quotation. Include a breakdown of costs, a timeline, and any assumptions made.
  Use a professional tone, and be specific about the services included.

  Project Type: {{{projectType}}}
  Project Description: {{{projectDescription}}}
  Budget: {{{budget}}}
  Timeline: {{{timeline}}}
  Features: {{{features}}}
  `,
});

const generateQuotationFlow = ai.defineFlow(
  {
    name: 'generateQuotationFlow',
    inputSchema: GenerateQuotationInputSchema,
    outputSchema: GenerateQuotationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
