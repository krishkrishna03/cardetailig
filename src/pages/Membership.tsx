import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { MembershipPlan } from '@/types';

export function Membership() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    let active = true;
    const loadPlans = async () => {
      try {
        const data = await api.getMemberships();
        if (active) setMembershipPlans(Array.isArray(data) ? data : []);
      } catch {
        if (active) setMembershipPlans([]);
      }
    };

    loadPlans();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader eyebrow="Membership" title="Join the DetailPro Club" subtitle="Exclusive perks, priority booking, and significant savings for members." />

      <Section className="pt-0">
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {(membershipPlans || []).map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(plan.popular && 'lg:-mt-4')}
            >
              <Card className={cn('relative h-full p-8 flex flex-col', plan.popular ? 'border-gold/50 gold-glow' : '')}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-black">
                    <Crown className="mr-1 h-3 w-3" /> Most Popular
                  </Badge>
                )}
                <div className={cn('text-sm font-semibold uppercase tracking-wider mb-3 bg-gradient-to-r bg-clip-text text-transparent', plan.color)}>
                  {plan.name} Member
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-5xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Billed monthly. Cancel anytime.</p>

                <ul className="space-y-3 flex-1">
                  {(plan.benefits ?? []).map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full gold-gradient text-black mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <Button asChild className={cn('mt-8 w-full', plan.popular ? 'gold-gradient text-black' : '')} variant={plan.popular ? 'default' : 'outline'}>
                  <Link to="/booking">Book Membership</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            All memberships include access to our rewards program, member-only seasonal offers, and a dedicated support line. Members also earn 2x–3x reward points on every booking.
          </p>
        </div>
      </Section>
    </>
  );
}
