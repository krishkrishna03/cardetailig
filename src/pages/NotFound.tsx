import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl gold-gradient text-black mb-6">
          <Car className="h-10 w-10" />
        </div>
        <h1 className="font-display text-7xl sm:text-9xl font-bold text-gradient-gold">404</h1>
        <h2 className="font-display text-2xl font-bold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">The page you are looking for has been moved, removed, or never existed. Let's get you back on the road.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="gold-gradient text-black"><Link to="/"><Home className="mr-2 h-4 w-4" /> Back Home</Link></Button>
          <Button asChild variant="outline"><Link to="/services"><ArrowLeft className="mr-2 h-4 w-4" /> View Services</Link></Button>
        </div>
      </motion.div>
    </div>
  );
}
