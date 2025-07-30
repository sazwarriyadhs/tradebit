'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating trading insights based on news sentiment and historical price data.
 *
 * - generateTradingInsights - A function that initiates the trading insights generation process.
 * - GenerateTradingInsightsInput - The input type for the generateTradingInsights function.
 * - GenerateTradingInsightsOutput - The return type for the generateTradingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingInsightsInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the cryptocurrency or US equity.'),
  newsSummary: z.string().describe('A summary of recent news articles related to the ticker.'),
  historicalPriceData: z.string().describe('Historical price data for the ticker.'),
});
export type GenerateTradingInsightsInput = z.infer<typeof GenerateTradingInsightsInputSchema>;

const GenerateTradingInsightsOutputSchema = z.object({
  tradingSignal: z.string().describe('A trading signal (e.g., Buy, Sell, Hold) based on the analysis.'),
  rationale: z.string().describe('The rationale behind the trading signal, based on news sentiment and historical price data.'),
  confidenceScore: z.number().describe('A confidence score (0-1) indicating the reliability of the trading signal.'),
});
export type GenerateTradingInsightsOutput = z.infer<typeof GenerateTradingInsightsOutputSchema>;

export async function generateTradingInsights(input: GenerateTradingInsightsInput): Promise<GenerateTradingInsightsOutput> {
  return generateTradingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingInsightsPrompt',
  input: {schema: GenerateTradingInsightsInputSchema},
  output: {schema: GenerateTradingInsightsOutputSchema},
  prompt: `You are an expert financial analyst specializing in generating trading insights.

  Based on the provided news summary and historical price data for a given ticker, you will generate a trading signal (Buy, Sell, or Hold), a rationale for the signal, and a confidence score (0-1).

  News Summary: {{{newsSummary}}}
  Historical Price Data: {{{historicalPriceData}}}

  Consider both the sentiment expressed in the news and the trends observed in the historical price data to form your analysis.

  Output your trading signal, rationale, and confidence score in the following format:
  {
    "tradingSignal": "...",
    "rationale": "...",
    "confidenceScore": 0.0
  }

  tradingSignal: A trading signal (e.g., Buy, Sell, Hold) based on the analysis.
  rationale: The rationale behind the trading signal, based on news sentiment and historical price data.
  confidenceScore: A confidence score (0-1) indicating the reliability of the trading signal.
  `,
});

const generateTradingInsightsFlow = ai.defineFlow(
  {
    name: 'generateTradingInsightsFlow',
    inputSchema: GenerateTradingInsightsInputSchema,
    outputSchema: GenerateTradingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
