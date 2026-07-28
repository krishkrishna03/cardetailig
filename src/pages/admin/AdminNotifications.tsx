import { useState } from 'react';
import { Bell, Send, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

export function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState({ push: true, email: true, sms: false });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) { toast.error('Title and message required'); return; }
    toast.success('Notification sent to all customers');
    setTitle(''); setMessage('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <DashboardCard title="Send Notification">
        <form onSubmit={send} className="space-y-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Special offer!" className="mt-1.5" /></div>
          <div><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your message..." className="mt-1.5" /></div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Channels</p>
            {[
              { key: 'push', icon: Bell, label: 'Push Notification' },
              { key: 'email', icon: Mail, label: 'Email' },
              { key: 'sms', icon: Smartphone, label: 'SMS' },
            ].map((c) => (
              <div key={c.key} className="flex items-center justify-between glass rounded-lg p-3">
                <div className="flex items-center gap-3"><c.icon className="h-4 w-4 text-gold" /><span className="text-sm">{c.label}</span></div>
                <Switch checked={channels[c.key as keyof typeof channels]} onCheckedChange={(v) => setChannels({ ...channels, [c.key]: v })} />
              </div>
            ))}
          </div>
          <Button type="submit" className="gold-gradient text-black"><Send className="mr-2 h-4 w-4" /> Send Notification</Button>
        </form>
      </DashboardCard>

      <DashboardCard title="Recent Notifications">
        <div className="space-y-3">
          {[
            { title: 'Monsoon Offer', desc: '20% off all coating services', time: '2h ago', icon: MessageSquare },
            { title: 'New Service Launch', desc: 'Graphene coating now available', time: '1d ago', icon: Bell },
            { title: 'Studio Closed', desc: 'Closed on July 15 for maintenance', time: '3d ago', icon: Mail },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg glass">
              <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-black"><n.icon className="h-4 w-4" /></div>
              <div><p className="text-sm font-semibold">{n.title}</p><p className="text-sm text-muted-foreground">{n.desc}</p><p className="text-xs text-muted-foreground mt-1">{n.time}</p></div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
