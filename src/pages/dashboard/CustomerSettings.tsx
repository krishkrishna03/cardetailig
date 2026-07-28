import { Moon, Bell, Globe, Shield } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function CustomerSettings() {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <DashboardCard title="Appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Moon className="h-5 w-5 text-gold" /><div><Label>Dark Mode</Label><p className="text-xs text-muted-foreground">Use dark theme across the app</p></div></div>
            <Switch checked={dark} onCheckedChange={setDark} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-gold" /><div><Label>Language</Label><p className="text-xs text-muted-foreground">Display language</p></div></div>
            <Select defaultValue="en"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">Hindi</SelectItem></SelectContent></Select>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-gold" /><div><Label>Push Notifications</Label><p className="text-xs text-muted-foreground">Booking updates and offers</p></div></div><Switch checked={notif} onCheckedChange={setNotif} /></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-gold" /><div><Label>Email Alerts</Label><p className="text-xs text-muted-foreground">Receive emails for important updates</p></div></div><Switch checked={email} onCheckedChange={setEmail} /></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-gold" /><div><Label>SMS Alerts</Label><p className="text-xs text-muted-foreground">Text messages for booking status</p></div></div><Switch checked={sms} onCheckedChange={setSms} /></div>
        </div>
      </DashboardCard>

      <DashboardCard title="Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Shield className="h-5 w-5 text-gold" /><div><Label>Two-Factor Authentication</Label><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div></div><Switch /></div>
          <Button variant="outline" onClick={() => toast.success('Settings saved')}>Save Settings</Button>
        </div>
      </DashboardCard>
    </div>
  );
}
