import { useState } from 'react';
import { Building, Save, Upload, Moon, Globe } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const [dark, setDark] = useState(true);

  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success('Settings saved'); };

  return (
    <div className="space-y-6 max-w-3xl">
      <DashboardCard title="Business Details">
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Business Name</Label><Input defaultValue="DetailPro" className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" className="mt-1.5" /></div>
            <div><Label>Email</Label><Input defaultValue="hello@detailpro.com" className="mt-1.5" /></div>
            <div><Label>GST Number</Label><Input defaultValue="27ABCDE1234F1Z5" className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Address</Label><Input defaultValue="Bandra West, Mumbai 400050" className="mt-1.5" /></div>
          </div>
          <Button type="submit" className="gold-gradient text-black"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </form>
      </DashboardCard>

      <DashboardCard title="Logo & Branding">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gold-gradient text-black"><Building className="h-10 w-10" /></div>
          <div><Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Logo</Button><p className="text-xs text-muted-foreground mt-2">PNG or SVG, max 1MB</p></div>
        </div>
      </DashboardCard>

      <DashboardCard title="Social Links">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Instagram</Label><Input defaultValue="@detailpro" className="mt-1.5" /></div>
          <div><Label>Facebook</Label><Input defaultValue="/detailpro" className="mt-1.5" /></div>
          <div><Label>Twitter</Label><Input defaultValue="@detailpro" className="mt-1.5" /></div>
          <div><Label>YouTube</Label><Input defaultValue="@detailpro" className="mt-1.5" /></div>
        </div>
        <Button className="mt-4 gold-gradient text-black" onClick={() => toast.success('Saved')}><Save className="mr-2 h-4 w-4" /> Save Links</Button>
      </DashboardCard>

      <DashboardCard title="Theme & Appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Moon className="h-5 w-5 text-gold" /><div><Label>Dark Mode</Label><p className="text-xs text-muted-foreground">Default theme for the platform</p></div></div><Switch checked={dark} onCheckedChange={setDark} /></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Globe className="h-5 w-5 text-gold" /><div><Label>Default Language</Label><p className="text-xs text-muted-foreground">Platform display language</p></div></div><Select defaultValue="en"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">Hindi</SelectItem></SelectContent></Select></div>
        </div>
      </DashboardCard>
    </div>
  );
}
