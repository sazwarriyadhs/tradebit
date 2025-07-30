'use server';
/**
 * @fileOverview Summarizes the sentiment of news articles related to watchlist items.
 *
 * - summarizeNewsSentiment - A function that summarizes news sentiment.
 * - SummarizeNewsSentimentInput - The input type for the summarizeNewsSentiment function.
 * - SummarizeNewsSentimentOutput - The return type for the summarizeNewsSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsSentimentInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock or cryptocurrency.'),
  newsArticles: z.array(z.string()).describe('An array of news article headlines related to the ticker.'),
});
export type SummarizeNewsSentimentInput = z.infer<typeof SummarizeNewsSentimentInputSchema>;

const SummarizeNewsSentimentOutputSchema = z.object({
  sentimentSummary: z.string().describe('A summary of the sentiment expressed in the news articles.'),
});
export type SummarizeNewsSentimentOutput = z.infer<typeof SummarizeNewsSentimentOutputSchema>;

export async function summarizeNewsSentiment(input: SummarizeNewsSentimentInput): Promise<SummarizeNewsSentimentOutput> {
  return summarizeNewsSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsSentimentPrompt',
  input: {schema: SummarizeNewsSentimentInputSchema},
  output: {schema: SummarizeNewsSentimentOutputSchema},
  prompt: `You are an expert financial analyst. Summarize the sentiment of the following news articles related to {{ticker}}.\n\nNews Articles:\n{{#each newsArticles}}- {{{this}}}\n{{/each}}\n\nProvide a concise summary of the overall sentiment (positive, negative, or neutral) and any potential impact on the asset's price.`,
});

const summarizeNewsSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeNewsSentimentFlow',
    inputSchema: SummarizeNewsSentimentInputSchema,
    outputSchema: SummarizeNewsSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
