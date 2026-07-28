export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rewardPoints: number;
  membershipTier?: 'silver' | 'gold' | 'platinum' | null;
}

export interface Service {
  id: string;
  name: string;
  category: 'wash' | 'detailing' | 'coating' | 'correction' | 'restoration';
  price: number;
  duration: string;
  description: string;
  benefits: string[];
  beforeImage: string;
  afterImage: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  carBrand: string;
  carModel: string;
  vehicleNumber: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentMethod: string;
  amount: number;
  notes?: string;
  assignedEmployee?: string;
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  name: 'Silver' | 'Gold' | 'Platinum';
  price: number;
  period: string;
  color: string;
  benefits: string[];
  popular?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  avatar: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  approved: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'exterior' | 'ceramic' | 'ppf';
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  experience: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  attendance: number;
  assignedJobs: number;
  completedJobs: number;
  performance: number;
  salary: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'wax' | 'shampoo' | 'foam' | 'ceramic' | 'microfiber';
  stock: number;
  unit: string;
  minStock: number;
  lastPurchase: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  method: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  active: boolean;
  uses: number;
  maxUses: number;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  vehicleNumber: string;
  year: string;
  color: string;
}
