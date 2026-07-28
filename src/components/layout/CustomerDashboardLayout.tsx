import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Receipt, Crown, Gift, Car, Bell, User, Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const customerNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
  { label: 'Invoices', path: '/dashboard/invoices', icon: Receipt },
  { label: 'Membership', path: '/dashboard/membership', icon: Crown },
  { label: 'Reward Points', path: '/dashboard/rewards', icon: Gift },
  { label: 'Saved Cars', path: '/dashboard/cars', icon: Car },
  { label: 'Before/After', path: '/dashboard/photos', icon: Receipt },
  { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
            <span className="font-display text-lg font-bold">Detail<span className="text-gold">Pro</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {customerNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all', active ? 'gold-gradient text-black' : 'text-muted-foreground hover:text-foreground hover:bg-white/5')}>
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src={user?.avatar} alt={user?.name} className="h-9 w-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-64 bg-card z-50 lg:hidden flex flex-col">
              <div className="p-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div><span className="font-display text-lg font-bold">Detail<span className="text-gold">Pro</span></span></Link>
                <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 px-3 space-y-1 overflow-y-auto" onClick={() => setOpen(false)}>
                {customerNav.map((item) => {
                  const active = location.pathname === item.path;
                  return <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all', active ? 'gold-gradient text-black' : 'text-muted-foreground hover:text-foreground hover:bg-white/5')}><item.icon className="h-4 w-4" /> {item.label}</Link>;
                })}
              </nav>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 glass border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
          <h1 className="font-display text-lg font-semibold capitalize">
            {customerNav.find((n) => location.pathname.startsWith(n.path))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/booking" className="text-sm text-gold hover:underline hidden sm:flex items-center gap-1">Book Now <ChevronRight className="h-3 w-3" /></Link>
            <img src={user?.avatar} alt={user?.name} className="h-9 w-9 rounded-full object-cover" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
