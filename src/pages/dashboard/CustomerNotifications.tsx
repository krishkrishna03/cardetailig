import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { DashboardCard, EmptyState } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';

const initialNotifications = [
  { id: 'n1', title: 'Booking Confirmed', desc: 'Your Ceramic Coating on July 30 is confirmed.', time: '2h ago', read: false },
  { id: 'n2', title: 'Service Completed', desc: 'Your Porsche 911 is ready for pickup.', time: '1d ago', read: false },
  { id: 'n3', title: 'Reward Points Earned', desc: 'You earned 1500 points from your last booking.', time: '3d ago', read: true },
  { id: 'n4', title: 'Membership Renewal', desc: 'Your Gold membership renews on Aug 1.', time: '5d ago', read: true },
  { id: 'n5', title: 'Special Offer', desc: '20% off all coating services this month.', time: '1w ago', read: true },
];

export function CustomerNotifications() {
  const [notifs, setNotifs] = useState(initialNotifications);

  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const remove = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
      </div>
      {notifs.length === 0 ? (
        <DashboardCard><EmptyState icon={Bell} title="No notifications" desc="You are all caught up." /></DashboardCard>
      ) : (
        <DashboardCard>
          <div className="space-y-2">
            {notifs.map((n) => (
              <div key={n.id} className={`flex items-start justify-between gap-3 p-4 rounded-lg ${n.read ? 'glass' : 'glass border-gold/30 bg-gold/5'}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${n.read ? 'glass' : 'gold-gradient text-black'}`}><Bell className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!n.read && <Button size="icon" variant="ghost" onClick={() => markRead(n.id)}><Check className="h-4 w-4" /></Button>}
                  <Button size="icon" variant="ghost" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
