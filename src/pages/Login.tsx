import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';

export function Login() {
  const { login, loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, remember);
      toast.success('Welcome back!');
      navigate(email.includes('admin') ? '/admin' : '/dashboard');
    } catch {
      toast.error('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!phone) { toast.error('Enter phone number'); return; }
    setLoading(true);
    try {
      const result = await api.sendOtp(phone);
      setOtpSent(true);
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
      setLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithOtp(phone, otp);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/40" />
        <div className="relative p-12 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
            <span className="font-display text-xl font-bold">Detail<span className="text-gold">Pro</span></span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">Premium detailing<br />for cars that<br /><span className="text-gradient-gold">deserve the best.</span></h2>
            <p className="mt-4 text-muted-foreground max-w-md">Sign in to manage bookings, track service history, and unlock member rewards.</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 DetailPro. All rights reserved.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-black"><Car className="h-5 w-5" /></div>
            <span className="font-display text-xl font-bold">Detail<span className="text-gold">Pro</span></span>
          </Link>

          <h1 className="font-display text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 p-1 glass rounded-xl">
            <button onClick={() => setMode('email')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'email' ? 'gold-gradient text-black' : 'text-muted-foreground'}`}>
              <Mail className="inline h-4 w-4 mr-1.5" /> Email
            </button>
            <button onClick={() => setMode('otp')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'otp' ? 'gold-gradient text-black' : 'text-muted-foreground'}`}>
              <Phone className="inline h-4 w-4 mr-1.5" /> OTP
            </button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={onEmailSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-gold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <Label htmlFor="remember" className="text-sm cursor-pointer">Remember me</Label>
              </div>
              <Button type="submit" disabled={loading} className="w-full gold-gradient text-black hover:opacity-90" size="lg">
                {loading ? 'Signing in...' : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Demo: use any email. Add "admin" to email for admin access.</p>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="pl-10" disabled={otpSent} />
                </div>
              </div>
              {otpSent && (
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input id="otp" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="mt-1.5 tracking-[0.5em] text-center text-lg" />
                  {otp ? <p className="mt-2 text-xs text-center text-muted-foreground">Use code: {otp}</p> : null}
                </div>
              )}
              {!otpSent ? (
                <Button type="button" onClick={sendOtp} disabled={loading} className="w-full gold-gradient text-black" size="lg">{loading ? 'Sending...' : 'Send OTP'}</Button>
              ) : (
                <Button type="submit" disabled={loading} className="w-full gold-gradient text-black" size="lg">{loading ? 'Verifying...' : 'Verify & Sign In'}</Button>
              )}
              <p className="text-xs text-center text-muted-foreground">Use the code sent to WhatsApp.</p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/booking" className="text-gold hover:underline">Book a service</Link> to get started.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
