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
  category: z.string().describe('The selected service category.'),
  service: z.string().describe('The selected service.'),
  tier: z.object({
    name: z.string(),
    price: z.string(),
  }).optional().describe('The selected pricing tier.'),
  addons: z.array(z.object({
    name: z.string(),
    price: z.string(),
  })).optional().describe('A list of selected add-ons.'),
  commonAddons: z.array(z.object({
    name: z.string(),
    price: z.string(),
  })).optional().describe('A list of selected common add-ons.'),
  total: z.number().describe('The calculated total price.'),
});
export type GenerateQuotationInput = z.infer<typeof GenerateQuotationInputSchema>;

const GenerateQuotationOutputSchema = z.object({
  quotation: z.string().describe('The generated project quotation in Markdown format.'),
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

  Based on the client's selections below, generate a detailed and professional quotation in Markdown format.
  
  The quotation should include:
  1. A professional greeting.
  2. A summary of the selected services.
  3. A breakdown of the costs for the selected tier and each addon.
  4. The total estimated cost.
  5. A concluding statement with next steps.

  Selections:
  - Category: {{{category}}}
  - Service: {{{service}}}
  {{#if tier}}- Tier: {{{tier.name}}} ({{{tier.price}}}){{/if}}
  {{#if addons}}
  - Add-ons:
    {{#each addons}}
    - {{{this.name}}} ({{{this.price}}})
    {{/each}}
  {{/if}}
  {{#if commonAddons}}
  - Common Add-ons:
    {{#each commonAddons}}
    - {{{this.name}}} ({{{this.price}}})
    {{/each}}
  {{/if}}
  - Total: Rs. {{{total}}}
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
