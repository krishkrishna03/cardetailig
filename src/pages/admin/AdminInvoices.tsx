import { useEffect, useState } from 'react';
import { Receipt, Download, Printer, Eye } from 'lucide-react';
import { DashboardCard, statusColors } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, exportToCsv } from '@/lib/utils';

export function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const loadInvoices = async () => {
      try {
        const data = await api.getInvoices();
        if (active) setInvoices(data as any[]);
      } catch {
        if (active) setInvoices([]);
      }
    };

    loadInvoices();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => exportToCsv('invoices.csv', invoices as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button></div>

      <DashboardCard title="All Invoices">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-3 font-medium">Invoice #</th><th className="pb-3 font-medium">Booking</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Actions</th></tr></thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3 font-medium">{i.id.toUpperCase()}</td>
                  <td className="py-3 text-muted-foreground">{i.bookingId}</td>
                  <td className="py-3">{i.customerName}</td>
                  <td className="py-3 text-muted-foreground">{formatDate(i.date)}</td>
                  <td className="py-3 font-semibold">{formatCurrency(i.amount)}</td>
                  <td className="py-3"><Badge className={`border ${statusColors[i.status]}`}>{i.status}</Badge></td>
                  <td className="py-3 text-right">
                    <Dialog>
                      <DialogTrigger asChild><Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Invoice {i.id.toUpperCase()}</DialogTitle></DialogHeader>
                        <div className="space-y-3 py-2">
                          <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{i.customerName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span>{i.bookingId}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDate(i.date)}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>{i.method}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className={`border ${statusColors[i.status]}`}>{i.status}</Badge></div>
                          <div className="flex justify-between pt-3 border-t border-border"><span className="font-semibold">Total</span><span className="font-display text-xl font-bold text-gold">{formatCurrency(i.amount)}</span></div>
                        </div>
                        <Button className="w-full gold-gradient text-black" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
