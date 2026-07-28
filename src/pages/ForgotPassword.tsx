import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success('Reset link sent to your email.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <img src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
          <span className="font-display text-xl font-bold">Detail<span className="text-gold">Pro</span></span>
        </Link>

        <div className="glass rounded-2xl p-8 premium-shadow">
          {sent ? (
            <div className="text-center">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/20 text-green-400 mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">Check your email</h1>
              <p className="text-muted-foreground mb-6">We sent a reset link to <span className="text-gold">{email}</span>. Follow the link to reset your password.</p>
              <Button onClick={() => navigate('/login')} className="w-full gold-gradient text-black">Back to Sign In</Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold mb-4"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to login</Link>
              <h1 className="font-display text-2xl font-bold">Forgot Password?</h1>
              <p className="text-muted-foreground mt-2 mb-6">Enter your email and we will send you a reset link.</p>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full gold-gradient text-black" size="lg">
                  {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
