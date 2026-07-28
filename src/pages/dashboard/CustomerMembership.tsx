import { useEffect, useState } from 'react';
import { Crown, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export function CustomerMembership() {
  const { user } = useAuth();
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

  const current = membershipPlans.find((p) => p.name.toLowerCase() === user?.membershipTier);

  return (
    <div className="space-y-6">
      {current && (
        <DashboardCard className="bg-gold/5 border-gold/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient text-black"><Crown className="h-7 w-7" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-display text-2xl font-bold">{current.name} Member</p>
                <p className="text-sm text-muted-foreground">Renews on Aug 1, 2025 · ₹{current.price.toLocaleString('en-IN')}/month</p>
              </div>
            </div>
            <Button variant="outline">Cancel Membership</Button>
          </div>
        </DashboardCard>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {membershipPlans.map((plan) => {
          const isCurrent = plan.name.toLowerCase() === user?.membershipTier;
          return (
            <DashboardCard key={plan.id} className={cn('relative flex flex-col', plan.popular && 'border-gold/50', isCurrent && 'gold-glow')}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-black">Most Popular</Badge>}
              {isCurrent && <Badge className="absolute -top-3 right-3 glass">Current</Badge>}
              <div className={cn('text-sm font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r bg-clip-text text-transparent', plan.color)}>{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="font-display text-3xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span><span className="text-sm text-muted-foreground">/{plan.period}</span></div>
              <ul className="space-y-2 flex-1">
                {plan.benefits.map((b) => <li key={b} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}</li>)}
              </ul>
              <Button className="mt-5 w-full" variant={isCurrent ? 'outline' : 'default'} disabled={isCurrent}>
                {isCurrent ? 'Current Plan' : plan.popular ? <span className="gold-gradient text-black w-full">Upgrade</span> : 'Switch Plan'}
              </Button>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
