
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet as WalletIcon, ArrowDown, ArrowUp } from 'lucide-react';
import type { Asset } from '@/types';
import { cn } from '@/lib/utils';

interface WalletProps {
  assets: Asset[];
  cashBalance: number;
  onTrade: (asset: Asset, tradeType: 'buy' | 'sell') => void;
}

export default function Wallet({ assets, cashBalance, onTrade }: WalletProps) {

  const totalPortfolioValue = assets.reduce((acc, asset) => {
    return acc + (asset.quantity ?? 0) * asset.price;
  }, cashBalance);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <WalletIcon className="text-accent" />
            My Wallet
          </CardTitle>
          <CardDescription>
            Total Value: ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Cash Balance</p>
            <p className="text-lg font-semibold">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length > 0 ? assets.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Image src={asset.logoUrl} alt={asset.name} width={24} height={24} className="rounded-full" data-ai-hint="logo" />
                    <div>
                      <div>{asset.ticker}</div>
                      <div className="text-xs text-muted-foreground">
                        {asset.quantity?.toLocaleString('en-US') ?? 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${((asset.quantity ?? 0) * asset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onTrade(asset, 'buy')}>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onTrade(asset, 'sell')}>
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    You don't own any assets.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
