import { Car, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Vehicle } from '@/types';
import toast from 'react-hot-toast';

const initialCars: Vehicle[] = [
  { id: 'v1', brand: 'Porsche', model: '911 Carrera', vehicleNumber: 'MH 01 CK 911', year: '2023', color: 'Guards Red' },
  { id: 'v2', brand: 'BMW', model: 'M5 Competition', vehicleNumber: 'MH 02 BM 555', year: '2022', color: 'Alpine White' },
];

const brands = ['Porsche', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Range Rover', 'Toyota', 'Honda'];

export function CustomerCars() {
  const [cars, setCars] = useState<Vehicle[]>(initialCars);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', vehicleNumber: '', year: '', color: '' });

  const addCar = () => {
    if (!form.brand || !form.model || !form.vehicleNumber) { toast.error('Fill all fields'); return; }
    setCars((prev) => [...prev, { ...form, id: `v${Date.now()}` }]);
    setForm({ brand: '', model: '', vehicleNumber: '', year: '', color: '' });
    setOpen(false);
    toast.success('Vehicle added');
  };

  const removeCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    toast.success('Vehicle removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-black"><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add a Vehicle</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Brand</Label><Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. 911 Carrera" className="mt-1.5" /></div>
                <div><Label>Vehicle Number</Label><Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="MH 01 XX 1234" className="mt-1.5" /></div>
                <div><Label>Year</Label><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2023" className="mt-1.5" /></div>
                <div className="sm:col-span-2"><Label>Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Guards Red" className="mt-1.5" /></div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={addCar} className="gold-gradient text-black">Add Vehicle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cars.length === 0 ? (
        <DashboardCard><EmptyState icon={Car} title="No saved vehicles" desc="Add your vehicles to book services faster next time." /></DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cars.map((c) => (
            <DashboardCard key={c.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-black"><Car className="h-6 w-6" /></div>
                  <div>
                    <p className="font-display font-semibold text-lg">{c.brand} {c.model}</p>
                    <p className="text-sm text-muted-foreground">{c.color} · {c.year}</p>
                    <Badge variant="secondary" className="mt-2">{c.vehicleNumber}</Badge>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeCar(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
