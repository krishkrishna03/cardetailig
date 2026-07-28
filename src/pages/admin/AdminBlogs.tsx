import { useEffect, useState } from 'react';
import { FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { BlogPost } from '@/types';

export function AdminBlogs() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', category: '', content: '' });

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const data = await api.getBlogPosts();
        if (active) setItems(data as BlogPost[]);
      } catch {
        if (active) setItems([]);
      }
    };

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  const add = () => {
    if (!form.title) { toast.error('Title required'); return; }
    setItems((prev) => [{ id: `blog-${Date.now()}`, title: form.title, excerpt: form.excerpt, content: form.content.split('\n').filter(Boolean), author: 'Admin', date: new Date().toISOString().slice(0, 10), image: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800', category: form.category || 'General', readTime: '3 min' }, ...prev]);
    setOpen(false);
    setForm({ title: '', excerpt: '', category: '', content: '' });
    toast.success('Blog post created');
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((p) => p.id !== id)); toast.success('Post deleted'); };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-black"><Plus className="mr-2 h-4 w-4" /> New Post</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Blog Post</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Coatings, Maintenance..." className="mt-1.5" /></div>
              <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="mt-1.5" /></div>
              <div><Label>Content (one paragraph per line)</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="mt-1.5" /></div>
            </div>
            <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={add} className="gold-gradient text-black">Publish</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <DashboardCard><EmptyState icon={FileText} title="No blog posts" desc="Write your first article." /></DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <DashboardCard key={p.id} className="overflow-hidden p-0">
              <div className="aspect-[16/10] overflow-hidden"><img src={p.image} alt={p.title} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <Badge variant="secondary" className="mb-2">{p.category}</Badge>
                <p className="font-semibold line-clamp-2">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(p.date)} · {p.readTime}</p>
                <div className="flex gap-1 mt-3"><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
