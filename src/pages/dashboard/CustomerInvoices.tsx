import { useEffect, useState } from 'react';
import { Receipt, Download, Printer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard, EmptyState, statusColors } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, exportToCsv } from '@/lib/utils';

export function CustomerInvoices() {
  const { user } = useAuth();
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

  const myInvoices = invoices.filter((i) => i.customerName === user?.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => exportToCsv('my-invoices.csv', myInvoices as unknown as Record<string, unknown>[])}>Export CSV</Button>
      </div>

      {myInvoices.length === 0 ? (
        <DashboardCard><EmptyState icon={Receipt} title="No invoices yet" desc="Your invoices will appear here after your first completed service." /></DashboardCard>
      ) : (
        <DashboardCard title="Your Invoices">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Invoice #</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 font-medium">{inv.id.toUpperCase()}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(inv.date)}</td>
                    <td className="py-3 text-muted-foreground">{inv.method}</td>
                    <td className="py-3 font-semibold">{formatCurrency(inv.amount)}</td>
                    <td className="py-3"><Badge className={`border ${statusColors[inv.status]}`}>{inv.status}</Badge></td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost"><Printer className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
