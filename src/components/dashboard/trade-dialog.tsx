'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Asset } from '@/types';
import { cn } from '@/lib/utils';

interface TradeDialogProps {
  asset: Asset;
  tradeType: 'buy' | 'sell';
  cashBalance: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTrade: (ticker: string, tradeType: 'buy' | 'sell', quantity: number, price: number) => void;
}

export function TradeDialog({ asset, tradeType, cashBalance, isOpen, onOpenChange, onTrade }: TradeDialogProps) {
  const isBuy = tradeType === 'buy';

  const formSchema = z.object({
    quantity: z.coerce
      .number()
      .positive('Quantity must be positive.')
      .max(isBuy ? Infinity : asset.quantity ?? 0, `You only have ${asset.quantity} to sell.`)
      .refine(
        (val) => !isBuy || val * asset.price <= cashBalance,
        { message: "You don't have enough cash for this purchase." }
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: undefined,
    },
  });

  const { watch, trigger } = form;
  const quantity = watch('quantity');
  const totalCost = (quantity || 0) * asset.price;

  React.useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onTrade(asset.ticker, tradeType, values.quantity, asset.price);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {tradeType} {asset.name} ({asset.ticker})
          </DialogTitle>
          <DialogDescription>
            Current Price: ${asset.price.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        step="any"
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => {
                            field.onChange(e);
                            trigger('quantity');
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-3 rounded-md bg-muted/50 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total {isBuy ? 'Cost' : 'Proceeds'}</span>
                    <span className="font-semibold">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">{isBuy ? 'Remaining' : 'New'} Cash Balance</span>
                    <span className={cn("font-semibold", { 'text-red-500': isBuy && totalCost > cashBalance })}>
                        ${(isBuy ? cashBalance - totalCost : cashBalance + totalCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!quantity || form.formState.isSubmitting || !form.formState.isValid}>
                Confirm {isBuy ? 'Buy' : 'Sell'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
