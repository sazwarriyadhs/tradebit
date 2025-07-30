'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TradingInsights } from '@/types';
import { cn } from '@/lib/utils';

interface AITradingInsightsProps {
  insights: TradingInsights | null;
  loading: boolean;
}

const SignalIcon = ({ signal }: { signal: string }) => {
  if (signal.toLowerCase().includes('buy')) return <TrendingUp className="h-5 w-5 text-green-500" />;
  if (signal.toLowerCase().includes('sell')) return <TrendingDown className="h-5 w-5 text-red-500" />;
  return <Minus className="h-5 w-5 text-gray-500" />;
};

const SignalBadge = ({ signal }: { signal: string }) => {
  const variant = signal.toLowerCase().includes('buy')
    ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
    : signal.toLowerCase().includes('sell')
    ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
    : 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
  
  return <Badge variant="outline" className={cn("text-base", variant)}>{signal}</Badge>;
};

export default function AITradingInsights({ insights, loading }: AITradingInsightsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            <span>AI Trading Insights</span>
          </CardTitle>
          <CardDescription>Generating analysis based on the latest data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            <span>AI Trading Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Could not generate AI insights at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="text-accent" />
          <span>AI Trading Insights</span>
        </CardTitle>
        <CardDescription>
          Sentiment Summary: {insights.sentimentSummary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <SignalIcon signal={insights.tradingSignal} />
             <p className="text-lg font-semibold">Signal:</p>
          </div>
          <SignalBadge signal={insights.tradingSignal} />
        </div>

        <div>
          <h4 className="font-semibold mb-1">Rationale</h4>
          <p className="text-sm text-muted-foreground">{insights.rationale}</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold">Confidence Score</h4>
            <p className="font-mono text-sm font-semibold text-accent">{(insights.confidenceScore * 100).toFixed(0)}%</p>
          </div>
          <Progress value={insights.confidenceScore * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
