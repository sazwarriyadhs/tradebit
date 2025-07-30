'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import type { Asset, Alert, NewsArticle, TradingInsights } from '@/types';
import { getTradingInsights } from '@/app/actions';
import Watchlist from './watchlist';
import Header from './header';
import AssetOverview from './asset-overview';
import AITradingInsights from './trading-insights';
import NewsFeed from './news-feed';
import PriceAlerts from './price-alerts';

interface DashboardClientProps {
  assets: Asset[];
  alerts: Alert[];
  marketNews: NewsArticle[];
}

export default function DashboardClient({ assets, alerts: initialAlerts, marketNews }: DashboardClientProps) {
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(assets[0]);
  const [insights, setInsights] = React.useState<TradingInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = React.useState(true);
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);

  React.useEffect(() => {
    async function fetchInsights() {
      if (!selectedAsset) return;
      setLoadingInsights(true);
      setInsights(null);
      const result = await getTradingInsights(selectedAsset.ticker, selectedAsset.news);
      setInsights(result);
      setLoadingInsights(false);
    }
    fetchInsights();
  }, [selectedAsset]);

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };
  
  const handleAddAlert = (alert: Omit<Alert, 'id' | 'status'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `a${alerts.length + 1}`,
      status: 'active',
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const handleToggleAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
      )
    );
  };
  
  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <Logo className="size-8" />
            <h1 className="text-2xl font-headline font-semibold">TradeFlow</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Watchlist assets={assets} selectedAsset={selectedAsset} onSelectAsset={handleSelectAsset} />
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-sm">User</p>
                  <p className="text-xs text-muted-foreground">user@tradeflow.com</p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-svh bg-background">
          <Header asset={selectedAsset} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <AssetOverview asset={selectedAsset} />
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 flex flex-col gap-6">
                <AITradingInsights insights={insights} loading={loadingInsights} />
                <NewsFeed news={marketNews} assetNews={selectedAsset.news} />
              </div>
              <div className="xl:col-span-1 flex flex-col gap-6">
                <PriceAlerts
                  alerts={alerts.filter(a => a.assetTicker === selectedAsset.ticker || a.assetTicker === "All")}
                  assets={assets}
                  onAddAlert={handleAddAlert}
                  onToggleAlert={handleToggleAlert}
                  onDeleteAlert={handleDeleteAlert}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
