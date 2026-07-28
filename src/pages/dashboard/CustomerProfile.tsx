import { User, Mail, Phone, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

export function CustomerProfile() {
  const { user } = useAuth();

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <DashboardCard className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4"><AvatarImage src={user?.avatar} /><AvatarFallback>{user?.name?.[0]}</AvatarFallback></Avatar>
        <h3 className="font-display text-lg font-bold">{user?.name}</h3>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm capitalize">
          <span className="text-gold">★</span> {user?.membershipTier} Member
        </div>
      </DashboardCard>

      <DashboardCard className="lg:col-span-2" title="Edit Profile">
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input defaultValue={user?.name} className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input defaultValue={user?.phone} className="mt-1.5" /></div>
          </div>
          <div><Label>Email</Label><Input defaultValue={user?.email} className="mt-1.5" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>City</Label><Input defaultValue="Mumbai" className="mt-1.5" /></div>
            <div><Label>State</Label><Input defaultValue="Maharashtra" className="mt-1.5" /></div>
          </div>
          <Button type="submit" className="gold-gradient text-black"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </form>
      </DashboardCard>
    </div>
  );
}
