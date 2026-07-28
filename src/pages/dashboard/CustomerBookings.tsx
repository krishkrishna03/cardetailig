import { useEffect, useState } from 'react';
import { Calendar, Clock, Car, CheckCircle2, XCircle, Loader2, Filter } from 'lucide-react';
import { DashboardCard, EmptyState, statusColors } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCsv } from '@/lib/utils';

const statusIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  confirmed: CheckCircle2,
  in_progress: Loader2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export function CustomerBookings() {
  const [filter, setFilter] = useState('all');
  const [customerBookings, setCustomerBookings] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('detailpro_user') || 'null');
        const data = await api.getCustomerBookings(user?.id || '');
        if (active) setCustomerBookings(data as any[]);
      } catch {
        if (active) setCustomerBookings([]);
      }
    };

    loadBookings();
    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'all' ? customerBookings : customerBookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => exportToCsv('my-bookings.csv', filtered as unknown as Record<string, unknown>[])}>
          Export CSV
        </Button>
      </div>

      {filtered.length === 0 ? (
        <DashboardCard><EmptyState icon={Calendar} title="No bookings found" desc="You have no bookings matching this filter. Book a service to see it here." /></DashboardCard>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => {
            const Icon = statusIcon[b.status];
            return (
              <DashboardCard key={b.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-black shrink-0">
                      <Car className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-lg">{b.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{b.carBrand} {b.carModel} · {b.vehicleNumber}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(b.date)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {b.time}</span>
                        {b.assignedEmployee && <span>Assigned: {b.assignedEmployee}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-gold">{formatCurrency(b.amount)}</p>
                    <Badge className={`mt-1 border ${statusColors[b.status]}`}>
                      <Icon className="mr-1 h-3 w-3" /> {b.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{b.paymentMethod}</p>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
