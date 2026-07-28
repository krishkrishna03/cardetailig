import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export function OtpVerify() {
  const navigate = useNavigate();
  const { loginWithOtp } = useAuth();
  const [phone, setPhone] = useState('+916300852715');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const requestOtp = async () => {
    setSending(true);
    try {
      const result = await api.sendOtp(phone);
      const responseOtp = (result as { otp?: string }).otp;
      if (responseOtp) {
        setOtp(responseOtp);
        toast.success((result as { message?: string }).message || 'OTP generated successfully.');
      } else {
        toast.error((result as { message?: string }).message || 'Unable to send OTP right now.');
      }
    } catch {
      toast.error('Unable to send OTP right now.');
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithOtp(phone, otp);
      toast.success('Verified! Welcome back.');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden">
        <img src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
          <span className="font-display text-xl font-bold">Detail<span className="text-gold">Pro</span></span>
        </Link>

        <div className="glass rounded-2xl p-5 sm:p-8 premium-shadow text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold mb-4"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to login</Link>
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full gold-gradient text-black mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Verify Your Number</h1>
          <p className="text-muted-foreground mt-2 mb-6">Enter the 6-digit code sent to your WhatsApp number.</p>
          <div className="space-y-3 mb-4">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number" required />
            <Button type="button" variant="outline" className="w-full" onClick={requestOtp} disabled={sending || !phone}>
              {sending ? 'Sending…' : 'Send OTP to WhatsApp'}
            </Button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="••••••" className="tracking-[0.5em] text-center text-2xl" required />
            <Button type="submit" disabled={loading} className="w-full gold-gradient text-black" size="lg">
              {loading ? 'Verifying...' : <>Verify <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">The backend will only accept the OTP that was sent to your WhatsApp number.</p>
        </div>
      </div>
    </div>
  );
}
