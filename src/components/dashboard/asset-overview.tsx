
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { Asset, PriceHistoryData } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetOverviewProps {
  asset: Asset;
}

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function AssetOverview({ asset }: AssetOverviewProps) {
  const [timeRange, setTimeRange] = React.useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [chartData, setChartData] = React.useState<PriceHistoryData[]>([]);

  React.useEffect(() => {
    if (asset) {
      setChartData(asset.priceHistory[timeRange]);
    }
  }, [asset, timeRange]);

  const formatYAxis = (value: number) => `$${value.toLocaleString()}`;
  const formatTooltip = (value: any) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardDescription>{asset.name}</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl font-bold font-headline">
                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
              <div className={cn(
                "flex items-center text-base font-semibold",
                asset.change24hPercent >= 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {asset.change24hPercent >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                <span>{asset.change24h.toFixed(2)} ({asset.change24hPercent.toFixed(2)}%)</span>
                <span className="text-muted-foreground font-normal ml-2">24h</span>
              </div>
            </div>
          </div>
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="hidden md:block">
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <AreaChart data={chartData} accessibilityLayer>
                <defs>
                  <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    if (timeRange === '1D') return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    if (timeRange === '1Y') return new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit'});
                    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatYAxis}
                  domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={<ChartTooltipContent formatter={formatTooltip} />}
                />
                <Area dataKey="price" type="monotone" fill="url(#chart-fill)" stroke="hsl(var(--primary))" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t">
            <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-semibold">{asset.marketCap}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Volume (24h)</p>
                <p className="font-semibold">{asset.volume24h}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Asset Type</p>
                <p className="font-semibold">{asset.type}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Ticker</p>
                <p className="font-semibold">{asset.ticker}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
