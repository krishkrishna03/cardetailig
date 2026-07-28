import { useEffect, useState } from 'react';
import { Star, Check, X, MessageSquare } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Review } from '@/types';

export function AdminReviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [replyTo, setReplyTo] = useState<Review | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    let active = true;
    const loadReviews = async () => {
      try {
        const data = await api.getReviews();
        if (active) setItems(data as Review[]);
      } catch {
        if (active) setItems([]);
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  const approve = (id: string) => { setItems((prev) => prev.map((r) => r.id === id ? { ...r, approved: true } : r)); toast.success('Review approved'); };
  const remove = (id: string) => { setItems((prev) => prev.filter((r) => r.id !== id)); toast.success('Review deleted'); };
  const sendReply = () => { setReplyTo(null); setReply(''); toast.success('Reply sent'); };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <DashboardCard><EmptyState icon={Star} title="No reviews" desc="Customer reviews will appear here." /></DashboardCard>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((r) => (
            <DashboardCard key={r.id}>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10"><AvatarImage src={r.avatar} /><AvatarFallback>{r.customerName[0]}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.customerName}</p>
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-gold fill-gold' : 'text-muted-foreground'}`} />)}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.service} · {formatDate(r.date)}</p>
                  <p className="text-sm mt-2">{r.comment}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={r.approved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>{r.approved ? 'Approved' : 'Pending'}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!r.approved && <Button size="sm" variant="outline" onClick={() => approve(r.id)}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>}
                    <Dialog open={replyTo?.id === r.id} onOpenChange={(o) => !o && setReplyTo(null)}>
                      <DialogTrigger asChild><Button size="sm" variant="ghost" onClick={() => setReplyTo(r)}><MessageSquare className="mr-1 h-3.5 w-3.5" /> Reply</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Reply to {r.customerName}</DialogTitle></DialogHeader>
                        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="Write your reply..." />
                        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={sendReply} className="gold-gradient text-black">Send Reply</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><X className="mr-1 h-3.5 w-3.5 text-destructive" /> Delete</Button>
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
