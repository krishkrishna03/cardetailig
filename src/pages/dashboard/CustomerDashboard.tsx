import { Routes, Route } from 'react-router-dom';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { CustomerHome } from './CustomerHome';
import { CustomerBookings } from './CustomerBookings';
import { CustomerInvoices } from './CustomerInvoices';
import { CustomerMembership } from './CustomerMembership';
import { CustomerRewards } from './CustomerRewards';
import { CustomerCars } from './CustomerCars';
import { CustomerPhotos } from './CustomerPhotos';
import { CustomerNotifications } from './CustomerNotifications';
import { CustomerProfile } from './CustomerProfile';
import { CustomerSettings } from './CustomerSettings';

export function CustomerDashboard() {
  return (
    <CustomerDashboardLayout>
      <Routes>
        <Route index element={<CustomerHome />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="membership" element={<CustomerMembership />} />
        <Route path="rewards" element={<CustomerRewards />} />
        <Route path="cars" element={<CustomerCars />} />
        <Route path="photos" element={<CustomerPhotos />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="settings" element={<CustomerSettings />} />
      </Routes>
    </CustomerDashboardLayout>
  );
}
