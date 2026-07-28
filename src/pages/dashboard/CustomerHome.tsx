import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Crown, Gift, Car, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatCard, DashboardCard, statusColors } from '@/components/dashboard/DashboardUI';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking, Invoice } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CustomerHome() {
  const { user } = useAuth();
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [bookingData, invoiceData] = await Promise.all([api.getCustomerBookings(user?.id || ''), api.getInvoices()]);
        if (!active) return;
        setCustomerBookings(bookingData as Booking[]);
        setInvoices(invoiceData as Invoice[]);
      } catch {
        if (active) {
          setCustomerBookings([]);
          setInvoices([]);
        }
      }
    };

    if (user?.id) {
      loadData();
    }

    return () => {
      active = false;
    };
  }, [user?.id]);

  const upcoming = customerBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const history = customerBookings.filter((b) => b.status === 'completed');
  const myInvoices = invoices.filter((i) => i.customerName === user?.name);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-muted-foreground mt-1">Here is an overview of your detailingPro account.</p>
        </div>
        <Button asChild className="gold-gradient text-black"><Link to="/booking">Book a Service <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Total Bookings" value={customerBookings.length} delay={0} />
        <StatCard icon={Crown} label="Membership" value={user?.membershipTier ? user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1) : 'None'} delay={0.05} />
        <StatCard icon={Gift} label="Reward Points" value={(user?.rewardPoints ?? 0).toLocaleString()} delay={0.1} />
        <StatCard icon={Car} label="Saved Cars" value={2} delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming */}
        <DashboardCard className="lg:col-span-2" title="Upcoming Booking" action={<Link to="/dashboard/bookings" className="text-sm text-gold hover:underline">View all</Link>}>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg glass">
                  <div>
                    <p className="font-semibold">{b.serviceName}</p>
                    <p className="text-sm text-muted-foreground">{b.carBrand} {b.carModel} · {b.vehicleNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm flex items-center gap-1.5 justify-end"><Clock className="h-3.5 w-3.5" /> {formatDate(b.date)} · {b.time}</p>
                    <Badge className={`mt-1 border ${statusColors[b.status]}`}>{b.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No upcoming bookings. <Link to="/booking" className="text-gold">Book one now</Link>.</p>
          )}
        </DashboardCard>

        {/* Membership */}
        <DashboardCard title="Your Membership">
          <div className="text-center py-2">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl gold-gradient text-black mb-3">
              <Crown className="h-7 w-7" />
            </div>
            <p className="font-display text-xl font-bold capitalize">{user?.membershipTier || 'No'} Member</p>
            <p className="text-sm text-muted-foreground mt-1">Renews on Aug 1, 2025</p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/dashboard/membership">Manage</Link></Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent history */}
        <DashboardCard title="Booking History" action={<Link to="/dashboard/bookings" className="text-sm text-gold hover:underline">View all</Link>}>
          <div className="space-y-3">
            {history.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg glass">
                <div>
                  <p className="text-sm font-medium">{b.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(b.date)}</p>
                </div>
                <Badge className={`border ${statusColors[b.status]}`}>completed</Badge>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Recent invoices */}
        <DashboardCard title="Recent Invoices" action={<Link to="/dashboard/invoices" className="text-sm text-gold hover:underline">View all</Link>}>
          <div className="space-y-3">
            {myInvoices.slice(0, 3).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 p-3 rounded-lg glass">
                <div>
                  <p className="text-sm font-medium">{inv.id.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(inv.date)} · {inv.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(inv.amount)}</p>
                  <Badge className={`border ${statusColors[inv.status]}`}>{inv.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
