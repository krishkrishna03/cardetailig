import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface MembershipPlan {
  id: string | number;
  name: string;
  price: number;
  period: string;
  benefits: string[];
  popular: boolean;
  color: string;
}

export function AdminMembership() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    let active = true;

    const loadMemberships = async () => {
      try {
        const data = await api.getMemberships();

        if (active) {
          setMembershipPlans(data as MembershipPlan[]);
        }
      } catch (error) {
        console.error('Failed to load memberships:', error);

        if (active) {
          setMembershipPlans([]);
        }
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
        {membershipPlans.map((plan: MembershipPlan) => (
          <DashboardCard
            key={plan.id}
            className={cn(plan.popular && 'border-gold/50')}
          >
            {plan.popular && (
              <Badge className="mb-2 gold-gradient text-black">
                Most Popular
              </Badge>
            )}

            <p
              className={cn(
                'mb-2 bg-gradient-to-r bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent',
                plan.color
              )}
            >
              {plan.name}
            </p>

            <p className="font-display text-3xl font-bold">
              ₹{plan.price.toLocaleString('en-IN')}
              <span className="text-sm font-normal text-muted-foreground">
                /{plan.period}
              </span>
            </p>

            <ul className="mt-4 space-y-2">
              {plan.benefits.map((benefit: string) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 text-sm"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                Active members
              </span>

              <span className="font-semibold">
                {plan.name === 'Silver'
                  ? 142
                  : plan.name === 'Gold'
                  ? 89
                  : 34}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
            >
              Edit Plan
            </Button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}