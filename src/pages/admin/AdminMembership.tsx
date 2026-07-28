import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export function AdminMembership() {
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const loadMemberships = async () => {
      try {
        const data = await api.getMemberships();
        if (active) setMembershipPlans(data as any[]);
      } catch {
        if (active) setMembershipPlans([]);
      }
    };

    loadMemberships();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {membershipPlans.map((plan) => (
          <DashboardCard key={plan.id} className={cn(plan.popular && 'border-gold/50')}>
            {plan.popular && <Badge className="mb-2 gold-gradient text-black">Most Popular</Badge>}
            <p className={cn('text-sm font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r bg-clip-text text-transparent', plan.color)}>{plan.name}</p>
            <p className="font-display text-3xl font-bold">₹{plan.price.toLocaleString('en-IN')}<span className="text-sm text-muted-foreground font-normal">/{plan.period}</span></p>
            <ul className="mt-4 space-y-2">
              {plan.benefits.map((b) => <li key={b} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}</li>)}
            </ul>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active members</span>
              <span className="font-semibold">{plan.name === 'Silver' ? 142 : plan.name === 'Gold' ? 89 : 34}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">Edit Plan</Button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
