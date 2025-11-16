'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/automated-quotation-generation.ts';
import '@/ai/flows/budget-suggestion-flow.ts';
