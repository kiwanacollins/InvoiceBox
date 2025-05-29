// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'provider' | 'purchaser';
  company: string;
  profileImage?: string;
  createdAt: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Invoice types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  providerId: string;
  providerName: string;
  purchaserId: string;
  purchaserName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  currency: 'UGX' | 'USD' | 'LYD';
  status: 'draft' | 'pending' | 'paid' | 'partial' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: 'UGX' | 'USD' | 'LYD';
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check' | 'credit_card' | 'other';
  reference?: string;
  notes?: string;
  createdAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalInvoices: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

// Select option type
export interface SelectOption {
  value: string;
  label: string;
}

// Notification type
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}