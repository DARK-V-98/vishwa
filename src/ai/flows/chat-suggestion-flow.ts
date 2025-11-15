'use server';
/**
 * @fileOverview An AI flow to generate chat suggestions for an admin.
 *
 * - generateChatSuggestion - A function that suggests a response for a customer support chat.
 * - ChatSuggestionInput - The input type (chat history).
 * - ChatSuggestionOutput - The output type (the suggested message).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ChatSuggestionInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'admin']),
    text: z.string(),
  })).describe('The recent history of the chat conversation.'),
});
export type ChatSuggestionInput = z.infer<typeof ChatSuggestionInputSchema>;

export const ChatSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('The AI-generated suggestion for the admin\'s next message.'),
});
export type ChatSuggestionOutput = z.infer<typeof ChatSuggestionOutputSchema>;

export async function generateChatSuggestion(
  input: ChatSuggestionInput
): Promise<ChatSuggestionOutput> {
  return generateChatSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatSuggestionPrompt',
  input: { schema: ChatSuggestionInputSchema },
  output: { schema: ChatSuggestionOutputSchema },
  prompt: `You are a helpful and professional customer support agent for ESystemLK, a company providing web development, design services, and game top-ups.
  
  Your task is to analyze the provided chat history between a user and an admin, and then suggest a concise and helpful response for the admin to send next.
  The user is the 'user' role, and you are generating a response for the 'admin' role.
  
  Keep the tone friendly and professional. If you need more information, suggest asking a clarifying question.
  
  Chat History:
  {{#each history}}
  - {{role}}: {{text}}
  {{/each}}
  
  Based on this history, what is the best response for the admin?
  `,
});

const generateChatSuggestionFlow = ai.defineFlow(
  {
    name: 'generateChatSuggestionFlow',
    inputSchema: ChatSuggestionInputSchema,
    outputSchema: ChatSuggestionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
