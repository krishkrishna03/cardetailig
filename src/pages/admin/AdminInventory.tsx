import { useEffect, useState } from 'react';
import { Package, Plus, AlertTriangle, Download } from 'lucide-react';
import { StatCard, DashboardCard } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatDate, exportToCsv } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { InventoryItem } from '@/types';

export function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'wax' as InventoryItem['category'], stock: '', unit: '', minStock: '' });

  useEffect(() => {
    let active = true;
    const loadInventory = async () => {
      try {
        const data = await api.getInventory();
        if (active) setItems(data as InventoryItem[]);
      } catch {
        if (active) setItems([]);
      }
    };

    loadInventory();
    return () => {
      active = false;
    };
  }, []);

  const lowStock = items.filter((i) => i.stock <= i.minStock);

  const add = () => {
    if (!form.name) { toast.error('Name required'); return; }
    setItems((prev) => [...prev, { id: `inv-${Date.now()}`, name: form.name, category: form.category, stock: Number(form.stock) || 0, unit: form.unit, minStock: Number(form.minStock) || 0, lastPurchase: new Date().toISOString().slice(0, 10) }]);
    setOpen(false);
    setForm({ name: '', category: 'wax', stock: '', unit: '', minStock: '' });
    toast.success('Item added');
  };

  const restock = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, stock: i.stock + 20, lastPurchase: new Date().toISOString().slice(0, 10) } : i));
    toast.success('Restocked +20');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Total Items" value={items.length} />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStock.length} />
        <StatCard icon={Package} label="Categories" value={new Set(items.map((i) => i.category)).size} />
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => exportToCsv('inventory.csv', items as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-black"><Plus className="mr-2 h-4 w-4" /> Add Item</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as InventoryItem['category'] })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3"><option value="wax">Wax</option><option value="shampoo">Shampoo</option><option value="foam">Foam</option><option value="ceramic">Ceramic</option><option value="microfiber">Microfiber</option></select></div>
                <div><Label>Unit</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="liters, pcs" className="mt-1.5" /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Min Stock</Label><Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className="mt-1.5" /></div>
              </div>
            </div>
            <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={add} className="gold-gradient text-black">Add</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DashboardCard title="Inventory">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-3 font-medium">Item</th><th className="pb-3 font-medium">Category</th><th className="pb-3 font-medium">Stock</th><th className="pb-3 font-medium">Min</th><th className="pb-3 font-medium">Last Purchase</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Action</th></tr></thead>
            <tbody>
              {items.map((i) => {
                const low = i.stock <= i.minStock;
                return (
                  <tr key={i.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 font-medium">{i.name}</td>
                    <td className="py-3 capitalize text-muted-foreground">{i.category}</td>
                    <td className="py-3">{i.stock} {i.unit}</td>
                    <td className="py-3 text-muted-foreground">{i.minStock}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(i.lastPurchase)}</td>
                    <td className="py-3">{low ? <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Low Stock</Badge> : <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Stock</Badge>}</td>
                    <td className="py-3 text-right"><Button size="sm" variant="outline" onClick={() => restock(i.id)}>Restock</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
