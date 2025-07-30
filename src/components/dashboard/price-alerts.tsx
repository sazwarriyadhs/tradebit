'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Alert, Asset } from '@/types';
import { cn } from '@/lib/utils';

interface PriceAlertsProps {
  alerts: Alert[];
  assets: Asset[];
  onAddAlert: (alert: Omit<Alert, 'id' | 'status'>) => void;
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
}

const alertFormSchema = z.object({
  assetTicker: z.string().min(1, 'Please select an asset.'),
  type: z.enum(['above', 'below']),
  targetPrice: z.coerce.number().positive('Price must be positive.'),
});

export default function PriceAlerts({ alerts, assets, onAddAlert, onToggleAlert, onDeleteAlert }: PriceAlertsProps) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<z.infer<typeof alertFormSchema>>({
        resolver: zodResolver(alertFormSchema),
        defaultValues: {
            assetTicker: '',
            type: 'above',
            targetPrice: 0,
        },
    });

    function onSubmit(values: z.infer<typeof alertFormSchema>) {
        onAddAlert(values);
        form.reset();
        setOpen(false);
    }
    
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bell className="text-accent" />
            Price Alerts
          </CardTitle>
          <CardDescription>Manage your price notifications.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Alert</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="assetTicker"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asset</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select an asset" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assets.map(asset => (
                                                <SelectItem key={asset.ticker} value={asset.ticker}>{asset.name} ({asset.ticker})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condition</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="above">Price is above</SelectItem>
                                            <SelectItem value="below">Price is below</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="targetPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 70000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit">Create Alert</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length > 0 ? alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.assetTicker}</TableCell>
                <TableCell>
                    {alert.type === 'above' ? 'Above' : 'Below'} ${alert.targetPrice.toLocaleString('en-US')}
                </TableCell>
                <TableCell>
                    <Badge variant={alert.status === 'active' ? 'default' : alert.status === 'triggered' ? 'secondary' : 'outline'} className={cn(
                        alert.status === 'active' && 'bg-green-500/20 text-green-400',
                        alert.status === 'triggered' && 'bg-blue-500/20 text-blue-400',
                    )}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onToggleAlert(alert.id)}>
                                {alert.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onSelect={() => onDeleteAlert(alert.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No alerts for this asset.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
