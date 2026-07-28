import { useEffect, useState } from 'react';
import { Users, Download, Search, Crown, Gift, Car } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, exportToCsv } from '@/lib/utils';
import type { Booking, User } from '@/types';

export function AdminCustomers() {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [customerData, bookingData] = await Promise.all([api.getCustomers(), api.getAdminBookings()]);
        if (!active) return;
        setCustomers(customerData as User[]);
        setBookings(bookingData as Booking[]);
      } catch {
        if (active) {
          setCustomers([]);
          setBookings([]);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()));
  const customerBookingsFor = (name: string) => bookings.filter((b) => b.customerName === name);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm" onClick={() => exportToCsv('customers.csv', filtered as unknown as Record<string, unknown>[])}><Download className="mr-2 h-4 w-4" /> Export</Button>
      </div>

      {filtered.length === 0 ? (
        <DashboardCard><EmptyState icon={Users} title="No customers found" desc="Try a different search." /></DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <DashboardCard key={c.id}>
              <Dialog>
                <DialogTrigger asChild><button className="w-full text-left" onClick={() => setSelected(c)}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12"><AvatarImage src={c.avatar} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-xs text-muted-foreground">Tier</p><p className="text-sm font-semibold capitalize">{c.membershipTier || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Points</p><p className="text-sm font-semibold">{c.rewardPoints.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Bookings</p><p className="text-sm font-semibold">{customerBookingsFor(c.name).length}</p></div>
                  </div>
                </button></DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Customer Profile</DialogTitle></DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16"><AvatarImage src={c.avatar} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
                    <div><p className="font-display text-lg font-bold">{c.name}</p><p className="text-sm text-muted-foreground">{c.email}</p><p className="text-sm text-muted-foreground">{c.phone}</p></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="glass rounded-lg p-3 text-center"><Crown className="h-4 w-4 text-gold mx-auto mb-1" /><p className="text-xs text-muted-foreground">Membership</p><p className="text-sm font-semibold capitalize">{c.membershipTier || 'None'}</p></div>
                    <div className="glass rounded-lg p-3 text-center"><Gift className="h-4 w-4 text-gold mx-auto mb-1" /><p className="text-xs text-muted-foreground">Points</p><p className="text-sm font-semibold">{c.rewardPoints.toLocaleString()}</p></div>
                    <div className="glass rounded-lg p-3 text-center"><Car className="h-4 w-4 text-gold mx-auto mb-1" /><p className="text-xs text-muted-foreground">Vehicles</p><p className="text-sm font-semibold">2</p></div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Service History</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {customerBookingsFor(c.name).map((b) => (
                        <div key={b.id} className="flex justify-between p-2 rounded-lg glass text-sm">
                          <span>{b.serviceName}</span>
                          <span className="text-muted-foreground">{formatDate(b.date)} · {formatCurrency(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
