import { useEffect, useState } from 'react';
import { Crown, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function CustomerMembership() {
  const { user } = useAuth();
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

  const current = membershipPlans.find(
    (plan) => plan.name.toLowerCase() === user?.membershipTier
  );

  return (
    <div className="space-y-6">
      {current && (
        <DashboardCard className="border-gold/20 bg-gold/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="gold-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-black">
                <Crown className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Current Plan
                </p>

                <p className="font-display text-2xl font-bold">
                  {current.name} Member
                </p>

                <p className="text-sm text-muted-foreground">
                  Renews on Aug 1, 2025 · ₹
                  {current.price.toLocaleString('en-IN')}/{current.period}
                </p>
              </div>
            </div>

            <Button variant="outline">
              Cancel Membership
            </Button>
          </div>
        </DashboardCard>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {membershipPlans.map((plan: MembershipPlan) => {
          const isCurrent =
            plan.name.toLowerCase() === user?.membershipTier;

          return (
            <DashboardCard
              key={plan.id}
              className={cn(
                'relative flex flex-col',
                plan.popular && 'border-gold/50',
                isCurrent && 'gold-glow'
              )}
            >
              {plan.popular && (
                <Badge className="gold-gradient absolute -top-3 left-1/2 -translate-x-1/2 text-black">
                  Most Popular
                </Badge>
              )}

              {isCurrent && (
                <Badge className="glass absolute -top-3 right-3">
                  Current
                </Badge>
              )}

              <div
                className={cn(
                  'mb-2 bg-gradient-to-r bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent',
                  plan.color
                )}
              >
                {plan.name}
              </div>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>

                <span className="text-sm text-muted-foreground">
                  /{plan.period}
                </span>
              </div>

              <ul className="flex-1 space-y-2">
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

              <Button
                className="mt-5 w-full"
                variant={isCurrent ? 'outline' : 'default'}
                disabled={isCurrent}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : plan.popular ? (
                  <span className="gold-gradient w-full text-black">
                    Upgrade
                  </span>
                ) : (
                  'Switch Plan'
                )}
              </Button>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
