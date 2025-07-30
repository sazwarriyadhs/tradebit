'use server';

import { generateTradingInsights } from '@/ai/flows/generate-trading-insights';
import { summarizeNewsSentiment } from '@/ai/flows/summarize-news-sentiment';
import type { NewsArticle, TradingInsights } from '@/types';

export async function getTradingInsights(
  ticker: string,
  newsArticles: NewsArticle[]
): Promise<TradingInsights | null> {
  try {
    const headlines = newsArticles.map(article => article.headline);
    const historicalDataPlaceholder = "Recent price action shows [trend]."; // In a real app, you'd pass real data.

    const sentimentResult = await summarizeNewsSentiment({
      ticker,
      newsArticles: headlines,
    });

    if (!sentimentResult.sentimentSummary) {
      throw new Error('Failed to get sentiment summary.');
    }

    const insightsResult = await generateTradingInsights({
      ticker,
      newsSummary: sentimentResult.sentimentSummary,
      historicalPriceData: historicalDataPlaceholder,
    });
    
    return { ...insightsResult, sentimentSummary: sentimentResult.sentimentSummary };
  } catch (error) {
    console.error("Error getting trading insights:", error);
    return null;
  }
}
