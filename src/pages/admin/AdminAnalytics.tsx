import { useEffect, useState } from 'react';
import { IndianRupee, Users, Calendar, TrendingUp } from 'lucide-react';
import { StatCard, DashboardCard } from '@/components/dashboard/DashboardUI';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['hsl(43 74% 58%)', 'hsl(173 58% 45%)', 'hsl(197 70% 55%)', 'hsl(280 65% 65%)', 'hsl(340 75% 60%)', 'hsl(0 0% 50%)'];

export function AdminAnalytics() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, totalCustomers: 0, avgOrderValue: 0 });
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [bookingData, dashboardStats] = await Promise.all([api.getAdminBookings(), api.getDashboardStats()]);
        if (!active) return;
        setBookings(bookingData as any[]);
        const statsData = dashboardStats as { todayRevenue?: number; monthRevenue?: number; bookings?: number; customers?: number };
        setStats({
          totalRevenue: (statsData.monthRevenue || 0) * 2,
          totalBookings: statsData.bookings || 0,
          totalCustomers: statsData.customers || 0,
          avgOrderValue: statsData.monthRevenue && statsData.bookings ? Math.round(statsData.monthRevenue / statsData.bookings) : 0,
        });
      } catch {
        if (active) {
          setBookings([]);
          setStats({ totalRevenue: 0, totalBookings: 0, totalCustomers: 0, avgOrderValue: 0 });
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
    { month: 'Feb', revenue: 220000, bookings: 22 },
    { month: 'Mar', revenue: 250000, bookings: 24 },
    { month: 'Apr', revenue: 280000, bookings: 27 },
    { month: 'May', revenue: 320000, bookings: 31 },
    { month: 'Jun', revenue: 360000, bookings: 34 },
  ];
  const customerGrowthData = [
    { month: 'Jan', customers: 120 },
    { month: 'Feb', customers: 140 },
    { month: 'Mar', customers: 165 },
    { month: 'Apr', customers: 190 },
    { month: 'May', customers: 215 },
    { month: 'Jun', customers: 240 },
  ];
  const servicePopularity = [
    { name: 'Premium Wash', value: 35 },
    { name: 'Ceramic Coating', value: 25 },
    { name: 'Interior Detailing', value: 20 },
    { name: 'Paint Correction', value: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="+24%" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings} trend="+19%" delay={0.05} />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} trend="+15%" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={formatCurrency(stats.avgOrderValue)} trend="+5%" delay={0.15} />
      </div>

      <DashboardCard title="Revenue Chart">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(43 74% 58%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(43 74% 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
            <XAxis dataKey="month" stroke="hsl(0 0% 64%)" fontSize={12} />
            <YAxis stroke="hsl(0 0% 64%)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(43 74% 58%)" strokeWidth={2} fill="url(#rev2)" />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <DashboardCard title="Bookings Chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 64%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 64%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
              <Bar dataKey="bookings" fill="hsl(173 58% 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="Customer Growth">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 64%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 64%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="customers" stroke="hsl(197 70% 55%)" strokeWidth={2} dot={{ fill: 'hsl(197 70% 55%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <DashboardCard title="Service Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={servicePopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
              {servicePopularity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)', borderRadius: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </DashboardCard>
    </div>
  );
}
