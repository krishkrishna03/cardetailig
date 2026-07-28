import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, UserCog, Package, CreditCard, Receipt, Image, Star, FileText, Bell, Settings, LogOut, Menu, X, Car, Ticket, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNav = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
  { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Employees', path: '/admin/employees', icon: UserCog },
  { label: 'Services', path: '/admin/services', icon: Car },
  { label: 'Membership', path: '/admin/membership', icon: Car },
  { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { label: 'Invoices', path: '/admin/invoices', icon: Receipt },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Reviews', path: '/admin/reviews', icon: Star },
  { label: 'Blogs', path: '/admin/blogs', icon: FileText },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeLabel = adminNav.find((n) => location.pathname === n.path)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
            <div><span className="font-display text-lg font-bold">Detail<span className="text-gold">Pro</span></span><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Panel</p></div>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {adminNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all', active ? 'gold-gradient text-black' : 'text-muted-foreground hover:text-foreground hover:bg-white/5')}>
                <item.icon className="h-4 w-4 shrink-0" /> <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-black font-semibold text-sm">A</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.name}</p><p className="text-xs text-muted-foreground truncate">{user?.email}</p></div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-64 bg-card z-50 lg:hidden flex flex-col">
              <div className="p-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div><span className="font-display text-lg font-bold">Detail<span className="text-gold">Pro</span></span></Link>
                <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto" onClick={() => setOpen(false)}>
                {adminNav.map((item) => { const active = location.pathname === item.path; return <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all', active ? 'gold-gradient text-black' : 'text-muted-foreground hover:text-foreground hover:bg-white/5')}><item.icon className="h-4 w-4" /> {item.label}</Link>; })}
              </nav>
              <div className="p-3 border-t border-border"><Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</Button></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 glass border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
            <h1 className="font-display text-lg font-semibold">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gold" /></Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-black font-semibold text-sm">A</div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
