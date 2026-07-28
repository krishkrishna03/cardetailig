import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export function CustomerPhotos() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const loadGallery = async () => {
      try {
        const data = await api.getGallery();
        if (active) setGalleryItems(data as any[]);
      } catch {
        if (active) setGalleryItems([]);
      }
    };

    loadGallery();
    return () => {
      active = false;
    };
  }, []);

  const myPhotos = galleryItems.slice(0, 4);

  return (
    <div className="space-y-6">
      {myPhotos.length === 0 ? (
        <DashboardCard><EmptyState icon={Receipt} title="No before/after photos yet" desc="Photos from your completed services will appear here." /></DashboardCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {myPhotos.map((item) => (
            <DashboardCard key={item.id}>
              <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} className="mb-4" />
              <Badge className="capitalize mb-2">{item.category}</Badge>
              <h3 className="font-display font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
