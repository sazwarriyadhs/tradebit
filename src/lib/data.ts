import type { Asset, NewsArticle, Alert } from '@/types';

const generatePriceHistory = (basePrice: number) => {
  const generateData = (days: number, points: number) => {
    const data = [];
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days * (points - i)) / points);
      const price = basePrice * (1 + (Math.random() - 0.5) * (days / 10));
      data.push({ date: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
    }
    return data;
  };

  return {
    '1D': generateData(1, 24),
    '1W': generateData(7, 7),
    '1M': generateData(30, 30),
    '1Y': generateData(365, 52),
  };
};

export const assets: Asset[] = [
  {
    id: '1',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: 'Crypto',
    price: 68134.32,
    change24h: 1254.32,
    change24hPercent: 1.88,
    marketCap: '1.34T',
    volume24h: '24.5B',
    logoUrl: 'https://placehold.co/40x40/4B0082/FFFFFF/png?text=B',
    priceHistory: generatePriceHistory(68000),
    news: [
      { id: 'n1', source: 'CoinDesk', headline: 'Bitcoin Halving Event Creates New Market Dynamics', timestamp: '2h ago', url: '#' },
      { id: 'n2', source: 'Bloomberg', headline: 'Institutional Interest in Bitcoin ETFs Remains Strong', timestamp: '5h ago', url: '#' },
    ],
  },
  {
    id: '2',
    ticker: 'ETH',
    name: 'Ethereum',
    type: 'Crypto',
    price: 3540.88,
    change24h: -56.12,
    change24hPercent: -1.56,
    marketCap: '425.3B',
    volume24h: '12.1B',
    logoUrl: 'https://placehold.co/40x40/4B0082/FFFFFF/png?text=E',
    priceHistory: generatePriceHistory(3500),
    news: [
      { id: 'n3', source: 'Reuters', headline: 'Ethereum "Dencun" Upgrade Goes Live, Slashing Fees', timestamp: '1d ago', url: '#' },
      { id: 'n4', source: 'The Block', headline: 'Vitalik Buterin Proposes New EIP to Improve Staking', timestamp: '3d ago', url: '#' },
    ],
  },
  {
    id: '3',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: 'Equity',
    price: 194.82,
    change24h: 2.75,
    change24hPercent: 1.43,
    marketCap: '2.98T',
    volume24h: '54.3M',
    logoUrl: 'https://placehold.co/40x40/4B0082/FFFFFF/png?text=A',
    priceHistory: generatePriceHistory(195),
    news: [
      { id: 'n5', source: 'Wall Street Journal', headline: 'Apple Unveils New AI Features for iOS 18 at WWDC', timestamp: '4h ago', url: '#' },
      { id: 'n6', source: 'CNBC', headline: 'Analysts Upgrade AAPL Stock on Vision Pro Sales Forecast', timestamp: '1d ago', url: '#' },
    ],
  },
  {
    id: '4',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'Equity',
    price: 177.45,
    change24h: -1.02,
    change24hPercent: -0.57,
    marketCap: '2.19T',
    volume24h: '25.1M',
    logoUrl: 'https://placehold.co/40x40/4B0082/FFFFFF/png?text=G',
    priceHistory: generatePriceHistory(177),
     news: [
      { id: 'n7', source: 'TechCrunch', headline: 'Google I/O Showcases Gemini AI Integration Across Products', timestamp: '8h ago', url: '#' },
      { id: 'n8', source: 'MarketWatch', headline: 'Alphabet faces antitrust scrutiny in the EU over advertising practices', timestamp: '2d ago', url: '#' },
    ],
  },
];

export const alerts: Alert[] = [
  { id: 'a1', assetTicker: 'BTC', targetPrice: 70000, type: 'above', status: 'active' },
  { id: 'a2', assetTicker: 'AAPL', targetPrice: 190, type: 'below', status: 'triggered' },
  { id: 'a3', assetTicker: 'ETH', targetPrice: 4000, type: 'above', status: 'active' },
];

export const marketNews: NewsArticle[] = [
  { id: 'mn1', source: 'Reuters', headline: 'Federal Reserve Holds Interest Rates Steady, Cites "Lack of Further Progress" on Inflation', timestamp: '30m ago', url: '#', summary: 'The Federal Reserve concluded its two-day policy meeting by keeping its benchmark interest rate unchanged, signaling that rate cuts may be further off than previously anticipated.' },
  { id: 'mn2', source: 'Bloomberg', headline: 'Global Supply Chain Pressures Ease, But Shipping Costs Remain a Concern', timestamp: '1h ago', url: '#', summary: 'While major bottlenecks have cleared, new geopolitical tensions and rising fuel costs are keeping shipping rates elevated, potentially impacting inflation for consumer goods.' },
  { id: 'mn3', source: 'The Economist', headline: 'The Rise of AI in Corporate Decision-Making: Opportunities and Risks', timestamp: '4h ago', url: '#', summary: 'A deep dive into how artificial intelligence is transforming business strategy, from marketing and sales to operations and finance, and the ethical considerations that arise.' },
  { id: 'mn4', source: 'Financial Times', headline: 'European Central Bank Signals Potential Rate Cut in June', timestamp: '1d ago', url: '#', summary: 'ECB officials have grown more confident that inflation is returning to its 2% target, paving the way for a possible interest rate reduction next month.' },
];
