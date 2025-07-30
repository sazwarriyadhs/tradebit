'use client';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { Asset } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WatchlistProps {
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
}

function getIconForAssetType(type: 'Crypto' | 'Equity') {
  return type === 'Crypto' ? <DollarSign /> : <BarChart />;
}

export default function Watchlist({ assets, selectedAsset, onSelectAsset }: WatchlistProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {assets.map((asset) => (
          <SidebarMenuItem key={asset.id}>
            <SidebarMenuButton
              onClick={() => onSelectAsset(asset)}
              isActive={selectedAsset.id === asset.id}
              className="h-auto p-2"
            >
              <Image src={asset.logoUrl} alt={asset.name} width={32} height={32} className="rounded-full" data-ai-hint="logo" />
              <div className="flex flex-col items-start flex-1 truncate">
                <span className="font-semibold">{asset.ticker}</span>
                <span className="text-xs text-muted-foreground truncate">{asset.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">
                  ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={cn(
                    'text-xs flex items-center',
                    asset.change24hPercent >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {asset.change24hPercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {asset.change24hPercent.toFixed(2)}%
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
