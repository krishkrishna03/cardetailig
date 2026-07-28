import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-5 hover:border-gold/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gold-gradient text-black">
          <Icon className="h-5 w-5" />
        </div>
        {trend && <span className="text-xs text-green-400 font-medium">{trend}</span>}
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

export function DashboardCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      {title && (
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="text-center py-16">
      <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl glass mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{desc}</p>
    </div>
  );
}

export const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
};
