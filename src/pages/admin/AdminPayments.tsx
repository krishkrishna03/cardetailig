import { useEffect, useState } from 'react';
import { CreditCard, IndianRupee, Download } from 'lucide-react';
import { StatCard, DashboardCard, statusColors } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, exportToCsv } from '@/lib/utils';

export function AdminPayments() {
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

  const total = invoices.reduce((sum, i) => sum + (i.amount || 0), 0);
  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const pending = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + (i.amount || 0), 0);

  const byMethod = ['UPI', 'Card', 'Cash', 'Online'].map((m) => ({ method: m, count: invoices.filter((i) => i.method === m).length }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Collected" value={formatCurrency(paid)} />
        <StatCard icon={CreditCard} label="Pending" value={formatCurrency(pending)} />
        <StatCard icon={CreditCard} label="Total Transactions" value={invoices.length} />
        <StatCard icon={IndianRupee} label="Total Value" value={formatCurrency(total)} />
      </div>

      <div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => exportToCsv('payments.csv', invoices as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button></div>

      <DashboardCard title="Payment Methods">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {byMethod.map((m) => (
            <div key={m.method} className="glass rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">{m.method}</p>
              <p className="font-display text-2xl font-bold mt-1">{m.count}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="All Transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-3 font-medium">Invoice</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Method</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Status</th></tr></thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3 font-medium">{i.id.toUpperCase()}</td>
                  <td className="py-3">{i.customerName}</td>
                  <td className="py-3 text-muted-foreground">{formatDate(i.date)}</td>
                  <td className="py-3">{i.method}</td>
                  <td className="py-3 font-semibold">{formatCurrency(i.amount)}</td>
                  <td className="py-3"><Badge className={`border ${statusColors[i.status]}`}>{i.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
