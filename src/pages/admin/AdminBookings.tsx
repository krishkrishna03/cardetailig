import { useEffect, useState } from 'react';
import { Calendar, Filter, Download, UserCog } from 'lucide-react';
import { DashboardCard, EmptyState, statusColors } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, exportToCsv } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Booking, Employee } from '@/types';

const statuses: Booking['status'][] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState('all');
  const [assignTarget, setAssignTarget] = useState<Booking | null>(null);
  const [employee, setEmployee] = useState('');

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [bookingData, employeeData] = await Promise.all([api.getAdminBookings(), api.getEmployees()]);
        if (!active) return;
        setBookings(bookingData as Booking[]);
        setEmployees(employeeData as Employee[]);
      } catch {
        if (active) {
          setBookings([]);
          setEmployees([]);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    toast.success(`Booking marked as ${status.replace('_', ' ')}`);
  };

  const assign = () => {
    if (!assignTarget || !employee) return;
    setBookings((prev) => prev.map((b) => b.id === assignTarget.id ? { ...b, assignedEmployee: employee } : b));
    setAssignTarget(null);
    setEmployee('');
    toast.success(`Assigned to ${employee}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => exportToCsv('bookings.csv', filtered as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button>
      </div>

      {filtered.length === 0 ? (
        <DashboardCard><EmptyState icon={Calendar} title="No bookings" desc="No bookings match this filter." /></DashboardCard>
      ) : (
        <DashboardCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Assigned</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3"><p className="font-medium">{b.customerName}</p><p className="text-xs text-muted-foreground">{b.paymentMethod}</p></td>
                    <td className="py-3"><p>{b.carBrand} {b.carModel}</p><p className="text-xs text-muted-foreground">{b.vehicleNumber}</p></td>
                    <td className="py-3">{b.serviceName}</td>
                    <td className="py-3">{formatDate(b.date)}<p className="text-xs text-muted-foreground">{b.time}</p></td>
                    <td className="py-3 font-semibold">{formatCurrency(b.amount)}</td>
                    <td className="py-3"><Badge className={`border ${statusColors[b.status]}`}>{b.status.replace('_', ' ')}</Badge></td>
                    <td className="py-3">{b.assignedEmployee || <span className="text-muted-foreground text-xs">Unassigned</span>}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Select onValueChange={(v) => updateStatus(b.id, v as Booking['status'])}>
                          <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
                          </Select>
                        <Dialog open={assignTarget?.id === b.id} onOpenChange={(o) => !o && setAssignTarget(null)}>
                          <DialogTrigger asChild><Button size="icon" variant="ghost" onClick={() => setAssignTarget(b)}><UserCog className="h-4 w-4" /></Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Assign Employee</DialogTitle></DialogHeader>
                            <p className="text-sm text-muted-foreground">Booking: {b.serviceName} for {b.customerName}</p>
                            <Select value={employee} onValueChange={setEmployee}>
                              <SelectTrigger className="mt-2"><SelectValue placeholder="Select employee" /></SelectTrigger>
                              <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.name}>{e.name} ({e.role})</SelectItem>)}</SelectContent>
                            </Select>
                            <DialogFooter>
                              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                              <Button onClick={assign} className="gold-gradient text-black">Assign</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
