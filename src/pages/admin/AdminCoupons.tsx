import { useEffect, useState } from 'react';
import { Ticket, Plus, Pencil, Trash2, Power } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatCurrency, exportToCsv } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Coupon } from '@/types';

export function AdminCoupons() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage' as 'percentage' | 'flat' });

  useEffect(() => {
    let active = true;
    const loadCoupons = async () => {
      try {
        const data = await api.getCoupons();
        if (active) setItems(data as Coupon[]);
      } catch {
        if (active) setItems([]);
      }
    };

    loadCoupons();
    return () => {
      active = false;
    };
  }, []);

  const add = () => {
    if (!form.code || !form.discount) { toast.error('Fill all fields'); return; }
    setItems((prev) => [...prev, { id: `cp-${Date.now()}`, code: form.code.toUpperCase(), discount: Number(form.discount), type: form.type, active: true, uses: 0, maxUses: 100 }]);
    setOpen(false);
    setForm({ code: '', discount: '', type: 'percentage' });
    toast.success('Coupon created');
  };

  const toggle = (id: string) => setItems((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const remove = (id: string) => { setItems((prev) => prev.filter((c) => c.id !== id)); toast.success('Coupon deleted'); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => exportToCsv('coupons.csv', items as unknown as Record<string, unknown>[])}>Export</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-black"><Plus className="mr-2 h-4 w-4" /> Create Coupon</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SUMMER20" className="mt-1.5 uppercase" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Discount</Label><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Type</Label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'flat' })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3"><option value="percentage">Percentage (%)</option><option value="flat">Flat (₹)</option></select></div>
              </div>
            </div>
            <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={add} className="gold-gradient text-black">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <DashboardCard><EmptyState icon={Ticket} title="No coupons" desc="Create a coupon to offer discounts." /></DashboardCard>
      ) : (
        <DashboardCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-3 font-medium">Code</th><th className="pb-3 font-medium">Discount</th><th className="pb-3 font-medium">Uses</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Actions</th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3"><span className="font-mono font-semibold">{c.code}</span></td>
                    <td className="py-3">{c.type === 'percentage' ? `${c.discount}%` : formatCurrency(c.discount)}</td>
                    <td className="py-3 text-muted-foreground">{c.uses} / {c.maxUses}</td>
                    <td className="py-3"><Badge className={c.active ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}>{c.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="py-3 text-right"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={() => toggle(c.id)}><Power className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></td>
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
