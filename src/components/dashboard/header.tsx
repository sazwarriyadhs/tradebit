'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Asset } from '@/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  asset: Asset;
}

export default function Header({ asset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {asset.name} <span className="text-muted-foreground">{asset.ticker}</span>
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
      </div>
    </header>
  );
}
