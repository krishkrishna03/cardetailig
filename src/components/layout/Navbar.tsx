import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Car } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Membership', path: '/membership' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled ? 'glass py-3' : 'py-5 bg-transparent',
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black font-bold">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Detail<span className="text-gold">Pro</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="gold-gradient text-black hover:opacity-90">
                <Link to="/booking">Book Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden glass mt-3 mx-4 rounded-2xl"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/5">Dashboard</Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-sm font-medium text-left text-destructive hover:bg-white/5">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/5">Sign In</Link>
                  <Link to="/booking" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium gold-gradient text-black text-center">Book Now</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
