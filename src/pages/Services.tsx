import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Service } from '@/types';

const categories = [
  { id: 'all', label: 'All Services' },
  { id: 'wash', label: 'Wash' },
  { id: 'detailing', label: 'Detailing' },
  { id: 'coating', label: 'Coating' },
  { id: 'correction', label: 'Correction' },
  { id: 'restoration', label: 'Restoration' },
];

export function Services() {
  const [filter, setFilter] = useState('all');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      try {
        const data = await api.getServices();
        if (active) setServices(data as Service[]);
      } catch {
        if (active) setServices([]);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <PageHeader eyebrow="Our Services" title="Detailing Services for Every Need" subtitle="From a quick refresh to full paint protection — choose the service that fits your car and budget." />

      <Section className="pt-0">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                filter === c.id ? 'gold-gradient text-black' : 'glass text-muted-foreground hover:text-foreground',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <Card className="h-full overflow-hidden flex flex-col group hover:border-gold/40 transition-all duration-300">
                <div className="relative aspect-[16/10]">
                  <BeforeAfterSlider beforeImage={service.beforeImage} afterImage={service.afterImage} className="rounded-none" />
                  {service.popular && (
                    <Badge className="absolute top-3 left-1/2 -translate-x-1/2 gold-gradient text-black z-10">Popular</Badge>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold">{service.name}</h3>
                    <span className="font-display text-lg font-bold text-gold whitespace-nowrap">{formatCurrency(service.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                    <Clock className="h-3.5 w-3.5" /> {service.duration}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full gold-gradient text-black hover:opacity-90">
                    <Link to={`/booking?service=${service.id}`}>Book This Service <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
