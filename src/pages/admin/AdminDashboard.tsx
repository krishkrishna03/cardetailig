import { Routes, Route } from 'react-router-dom';
import { AdminDashboardLayout } from '@/components/layout/AdminDashboardLayout';
import { AdminHome } from './AdminHome';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminBookings } from './AdminBookings';
import { AdminCustomers } from './AdminCustomers';
import { AdminEmployees } from './AdminEmployees';
import { AdminServices } from './AdminServices';
import { AdminMembership } from './AdminMembership';
import { AdminCoupons } from './AdminCoupons';
import { AdminInventory } from './AdminInventory';
import { AdminPayments } from './AdminPayments';
import { AdminInvoices } from './AdminInvoices';
import { AdminGallery } from './AdminGallery';
import { AdminReviews } from './AdminReviews';
import { AdminBlogs } from './AdminBlogs';
import { AdminNotifications } from './AdminNotifications';
import { AdminSettings } from './AdminSettings';

export function AdminDashboard() {
  return (
    <AdminDashboardLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="membership" element={<AdminMembership />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </AdminDashboardLayout>
  );
}
