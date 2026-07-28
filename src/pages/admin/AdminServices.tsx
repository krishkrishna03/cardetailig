import { useEffect, useState } from 'react';
import { Car, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatCurrency, exportToCsv } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Service } from '@/types';

export function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      try {
        const data = await api.getServices();
        if (active) setItems(data as Service[]);
      } catch {
        if (active) setItems([]);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', price: '', duration: '', description: '' }); setOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, price: String(s.price), duration: s.duration, description: s.description }); setOpen(true); };

  const save = () => {
    if (!form.name || !form.price) { toast.error('Name and price required'); return; }
    if (editing) {
      setItems((prev) => prev.map((s) => s.id === editing.id ? { ...editing, name: form.name, price: Number(form.price), duration: form.duration, description: form.description } : s));
      toast.success('Service updated');
    } else {
      setItems((prev) => [...prev, { id: `svc-${Date.now()}`, name: form.name, price: Number(form.price), duration: form.duration, description: form.description, benefits: [], beforeImage: '', afterImage: '', category: 'wash' }]);
      toast.success('Service added');
    }
    setOpen(false);
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((s) => s.id !== id)); toast.success('Service deleted'); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => exportToCsv('services.csv', items as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-black" onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Service</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 hrs" className="mt-1.5" /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1.5" /></div>
            </div>
            <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={save} className="gold-gradient text-black">Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <DashboardCard><EmptyState icon={Car} title="No services" desc="Add a service to get started." /></DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <DashboardCard key={s.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
                  <div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.duration}</p></div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{s.description}</p>
              <p className="font-display text-lg font-bold text-gold mt-3">{formatCurrency(s.price)}</p>
              {s.popular && <Badge className="mt-2 gold-gradient text-black">Popular</Badge>}
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
