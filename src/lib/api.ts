import type { Booking, User } from '@/types';

const API_BASE_URL = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Request failed');
  }

  return response.json() as Promise<T>;
}

function storeAuth(user: User, token: string, remember = false) {
  if (remember) localStorage.setItem('detailpro_token', token);
  else sessionStorage.setItem('detailpro_token', token);
  localStorage.setItem('detailpro_user', JSON.stringify(user));
}

export const api = {
  async login(email: string, password: string, remember = false) {
    const data = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    storeAuth(data.user, data.token, remember);
    return data;
  },

  async sendOtp(phone: string) {
    return request<{ sent: boolean; otp?: string; message?: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone: string, otp: string) {
    const data = await request<{ user: User; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    storeAuth(data.user, data.token, true);
    return data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore backend logout errors and clear local auth state
    }

    localStorage.removeItem('detailpro_token');
    localStorage.removeItem('detailpro_user');
    sessionStorage.removeItem('detailpro_token');
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('detailpro_user');
    return raw ? JSON.parse(raw) : null;
  },

  async getServices() {
    return request('/services');
  },

  async getMemberships() {
    return request('/memberships');
  },

  async getReviews() {
    const reviews = await request<Array<{ approved: boolean }>>('/reviews');
    return reviews.filter((review) => review.approved);
  },

  async getGallery() {
    return request('/gallery');
  },

  async getTeam() {
    return request('/team');
  },

  async getBlogPosts() {
    return request('/blogposts');
  },

  async getBlogPost(id: string) {
    return request(`/blogposts/${id}`);
  },

  async createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt'>) {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCustomerBookings(userId: string) {
    return request<Booking[]>(`/bookings/customer/${userId}`);
  },

  async getAdminBookings() {
    return request<Booking[]>('/bookings/admin');
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    return request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async assignEmployee(bookingId: string, employeeName: string) {
    return request<Booking>(`/bookings/${bookingId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ employeeName }),
    });
  },

  async getCustomers() {
    return request('/customers');
  },

  async getEmployees() {
    return request('/employees');
  },

  async getInventory() {
    return request('/inventory');
  },

  async getInvoices() {
    return request('/invoices');
  },

  async getCoupons() {
    return request('/coupons');
  },

  async getDashboardStats() {
    return request('/dashboard/stats');
  },
};
