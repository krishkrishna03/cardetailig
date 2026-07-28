import { useState } from 'react';
import { Image, Plus, Trash2 } from 'lucide-react';
import { galleryItems } from '@/data/mockData';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import type { GalleryItem } from '@/types';

const categories: GalleryItem['category'][] = ['interior', 'exterior', 'ceramic', 'ppf'];

export function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); toast.success('Photo removed'); };

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button className="gold-gradient text-black"><Plus className="mr-2 h-4 w-4" /> Add Photo</Button></div>

      {items.length === 0 ? (
        <DashboardCard><EmptyState icon={Image} title="No gallery photos" desc="Upload before/after photos to showcase your work." /></DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DashboardCard key={item.id} className="overflow-hidden p-0">
              <div className="aspect-[16/10] relative">
                <img src={item.afterImage} alt={item.title} className="h-full w-full object-cover" />
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-black/60" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="p-4">
                <Badge className="capitalize mb-2">{item.category}</Badge>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
