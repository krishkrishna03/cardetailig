import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Calendar, Users, Star, TrendingUp, ArrowRight, Crown } from 'lucide-react';
import { StatCard, DashboardCard, statusColors } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { Booking } from '@/types';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['hsl(43 74% 58%)', 'hsl(173 58% 45%)', 'hsl(197 70% 55%)', 'hsl(280 65% 65%)', 'hsl(340 75% 60%)', 'hsl(0 0% 50%)'];

export function AdminHome() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    bookings: 0,
    customers: 0,
    avgRating: 4.9,
    popularService: 'Premium Wash',
  });

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [bookingData, dashboardStats] = await Promise.all([api.getAdminBookings(), api.getDashboardStats()]);
        if (!active) return;
        setBookings(bookingData as Booking[]);
        setStats((dashboardStats as typeof stats));
      } catch {
        if (active) {
          setBookings([]);
          setStats({ todayRevenue: 0, monthRevenue: 0, bookings: 0, customers: 0, avgRating: 4.9, popularService: 'Premium Wash' });
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const revenueData = [
    { month: 'Jan', revenue: 180000, bookings: 18 },
    { month: 'Feb', revenue: 210000, bookings: 22 },
    { month: 'Mar', revenue: 240000, bookings: 25 },
    { month: 'Apr', revenue: 270000, bookings: 29 },
    { month: 'May', revenue: 300000, bookings: 32 },
    { month: 'Jun', revenue: 340000, bookings: 35 },
  ];
  const servicePopularity = [
    { name: 'Premium Wash', value: 35 },
    { name: 'Ceramic Coating', value: 25 },
    { name: 'Interior Detailing', value: 20 },
    { name: 'Paint Correction', value: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Good morning, Admin</h2>
          <p className="text-muted-foreground mt-1">Here is what is happening at your studio today.</p>
        </div>
        <Button asChild className="gold-gradient text-black"><Link to="/admin/bookings">Manage Bookings <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={IndianRupee} label="Today's Revenue" value={formatCurrency(stats.todayRevenue)} trend="+12%" delay={0} />
        <StatCard icon={TrendingUp} label="Monthly Revenue" value={formatCurrency(stats.monthRevenue)} trend="+18%" delay={0.05} />
        <StatCard icon={Calendar} label="Bookings" value={stats.bookings} trend="+8%" delay={0.1} />
        <StatCard icon={Users} label="Customers" value={stats.customers} trend="+15%" delay={0.15} />
        <StatCard icon={Star} label="Avg Rating" value={stats.avgRating.toFixed(1)} delay={0.2} />
        <StatCard icon={Crown} label="Popular Service" value={stats.popularService} delay={0.25} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2" title="Revenue Overview">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43 74% 58%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(43 74% 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 64%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 64%)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(43 74% 58%)" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="Service Popularity">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={servicePopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {servicePopularity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2" title="Bookings Trend">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 64%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 64%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
              <Bar dataKey="bookings" fill="hsl(173 58% 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="Recent Bookings" action={<Link to="/admin/bookings" className="text-sm text-gold hover:underline">View all</Link>}>
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2 p-3 rounded-lg glass">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{b.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.serviceName}</p>
                </div>
                <Badge className={`border shrink-0 ${statusColors[b.status]}`}>{b.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
