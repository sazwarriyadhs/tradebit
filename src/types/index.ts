export type PriceHistoryData = {
  date: string;
  price: number;
};

export type Asset = {
  id: string;
  ticker: string;
  name: string;
  type: 'Crypto' | 'Equity';
  price: number;
  change24h: number;
  change24hPercent: number;
  marketCap: string;
  volume24h: string;
  logoUrl: string;
  priceHistory: {
    '1D': PriceHistoryData[];
    '1W': PriceHistoryData[];
    '1M': PriceHistoryData[];
    '1Y': PriceHistoryData[];
  };
  news: NewsArticle[];
};

export type NewsArticle = {
  id: string;
  source: string;
  headline: string;
  timestamp: string;
  url: string;
  summary?: string;
};

export type Alert = {
  id: string;
  assetTicker: string;
  targetPrice: number;
  type: 'above' | 'below';
  status: 'active' | 'triggered' | 'inactive';
};

export type TradingInsights = {
  tradingSignal: string;
  rationale: string;
  confidenceScore: number;
  sentimentSummary: string;
};
