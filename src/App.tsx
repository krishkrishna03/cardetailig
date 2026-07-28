import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Services } from '@/pages/Services';
import { Gallery } from '@/pages/Gallery';
import { Membership } from '@/pages/Membership';
import { Booking } from '@/pages/Booking';
import { Contact } from '@/pages/Contact';
import { FAQ } from '@/pages/FAQ';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Login } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { OtpVerify } from '@/pages/OtpVerify';
import { NotFound } from '@/pages/NotFound';

import { CustomerDashboard } from '@/pages/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

function ProtectedRoute({ children, role }: { children: ReactNode; role?: 'admin' | 'customer' }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />
      <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:id" element={<PublicLayout><BlogPost /></PublicLayout>} />

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<OtpVerify />} />

      <Route path="/dashboard/*" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 8%)',
              color: 'hsl(0 0% 98%)',
              border: '1px solid hsl(0 0% 18%)',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
