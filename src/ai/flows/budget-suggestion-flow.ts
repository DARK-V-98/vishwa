'use server';
/**
 * @fileOverview An AI agent for generating tournament budget suggestions.
 *
 * - generateBudgetSuggestions - A function that provides financial suggestions for a tournament budget.
 * - BudgetSuggestionInput - The input type for the function.
 * - BudgetSuggestionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const BudgetSuggestionInputSchema = z.object({
  participants: z.number().describe('Number of expected participants (teams or players).'),
  regFeeAmount: z.number().describe('The registration fee amount per participant.'),
  estimatedPrizePool: z.number().describe('The total estimated prize pool.'),
  totalExpenses: z.number().describe('The sum of all estimated expenses, including the prize pool.'),
  totalIncome: z.number().describe('The sum of all estimated income, including registration fees.'),
});
export type BudgetSuggestionInput = z.infer<typeof BudgetSuggestionInputSchema>;

export const BudgetSuggestionOutputSchema = z.object({
  suggestedFee: z.string().describe('A suggested registration fee to improve profitability or participation.'),
  prizeDistribution: z.string().describe('A suggested prize distribution strategy (e.g., percentage split for top 3).'),
  costSavingTip: z.string().describe('A tip on how to potentially reduce costs.'),
});
export type BudgetSuggestionOutput = z.infer<typeof BudgetSuggestionOutputSchema>;

export async function generateBudgetSuggestions(
  input: BudgetSuggestionInput
): Promise<BudgetSuggestionOutput> {
  return budgetSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetSuggestionPrompt',
  input: { schema: BudgetSuggestionInputSchema },
  output: { schema: BudgetSuggestionOutputSchema },
  prompt: `You are a financial advisor for e-sports tournaments. Analyze the following budget and provide actionable suggestions. The currency is LKR (Sri Lankan Rupees).

  Current Budget:
  - Participants: {{{participants}}}
  - Registration Fee: {{{regFeeAmount}}}
  - Total Income: {{{totalIncome}}}
  - Total Expenses: {{{totalExpenses}}}
  - Prize Pool: {{{estimatedPrizePool}}}

  Based on this data, provide:
  1.  **Suggested Fee**: Recommend a registration fee. If the current plan is at a loss, suggest a fee that would lead to a 15-20% profit margin. If it's already profitable, suggest if it could be lowered to attract more players. Frame it as a concise recommendation.
  2.  **Prize Distribution**: Suggest a common, fair prize distribution split for the top 3 (e.g., 50% for 1st, 30% for 2nd, 20% for 3rd).
  3.  **Cost Saving Tip**: Provide one practical, high-impact tip for reducing costs for a tournament of this scale.
  `,
});

const budgetSuggestionFlow = ai.defineFlow(
  {
    name: 'budgetSuggestionFlow',
    inputSchema: BudgetSuggestionInputSchema,
    outputSchema: BudgetSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
