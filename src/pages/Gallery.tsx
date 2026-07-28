import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/Section';
import { Section } from '@/components/Section';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'ceramic', label: 'Ceramic' },
  { id: 'ppf', label: 'PPF' },
];

export function Gallery() {
  const [filter, setFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    let active = true;
    const loadGallery = async () => {
      try {
        const data = await api.getGallery();
        if (active) setGalleryItems(data as GalleryItem[]);
      } catch {
        if (active) setGalleryItems([]);
      }
    };

    loadGallery();
    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <>
      <PageHeader eyebrow="Our Work" title="Before & After Gallery" subtitle="Drag the sliders to see the transformation our detailing studio delivers." />

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
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <div className="mb-3">
                <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} />
              </div>
              <Badge className="mb-2 capitalize">{item.category}</Badge>
              <h3 className="font-display font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
