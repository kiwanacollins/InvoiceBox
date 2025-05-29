import { create } from 'zustand';
import { Invoice, InvoiceItem, Payment } from '../types';
import { dummyInvoices, dummyPayments } from '../data/dummyData';

interface InvoiceState {
  invoices: Invoice[];
  allInvoices: Invoice[]; // Keep track of all invoices
  payments: Payment[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  
  // Invoice CRUD operations
  fetchInvoices: (userId: string, role: 'provider' | 'purchaser') => void;
  fetchInvoiceById: (id: string) => Invoice | null;
  createInvoice: (invoice: Partial<Invoice>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  
  // Payment operations
  addPayment: (payment: Partial<Payment>) => Promise<Payment>;
  getInvoicePayments: (invoiceId: string) => Payment[];
  
  // Helper methods
  clearCurrentInvoice: () => void;
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [...dummyInvoices],
  allInvoices: [...dummyInvoices], // Initialize with dummy invoices
  payments: [...dummyPayments],
  currentInvoice: null,
  loading: false,
  error: null,
  
  // Fetch invoices based on user role and ID
  fetchInvoices: (userId: string, role: 'provider' | 'purchaser') => {
    set({ loading: true });
    
    try {
      // Filter from all invoices based on role
      const allInvoices = get().allInvoices;
      const filteredInvoices = allInvoices.filter(invoice => 
        role === 'provider' 
          ? invoice.providerId === userId 
          : invoice.purchaserId === userId
      );
      
      set({ 
        invoices: filteredInvoices,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to fetch invoices' 
      });
    }
  },
  
  // Fetch single invoice by ID
  fetchInvoiceById: (id: string) => {
    const invoice = get().allInvoices.find(inv => inv.id === id) || null;
    set({ currentInvoice: invoice });
    return invoice;
  },
  
  // Create new invoice
  createInvoice: async (invoiceData: Partial<Invoice>) => {
    set({ loading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Create new invoice with ID and timestamps
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        providerId: invoiceData.providerId || '',
        providerName: invoiceData.providerName || '',
        purchaserId: invoiceData.purchaserId || '',
        purchaserName: invoiceData.purchaserName || '',
        issueDate: invoiceData.issueDate || new Date().toISOString(),
        dueDate: invoiceData.dueDate || new Date().toISOString(),
        items: invoiceData.items || [],
        subtotal: invoiceData.subtotal || 0,
        tax: invoiceData.tax || 0,
        total: invoiceData.total || 0,
        amountPaid: 0,
        balance: invoiceData.total || 0,
        currency: invoiceData.currency || 'USD',
        status: 'pending',
        notes: invoiceData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to both invoices arrays
      set(state => ({ 
        invoices: [...state.invoices, newInvoice],
        allInvoices: [...state.allInvoices, newInvoice],
        currentInvoice: newInvoice,
        loading: false,
        error: null
      }));
      
      return newInvoice;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to create invoice' 
      });
      throw error;
    }
  },
  
  // Update existing invoice
  updateInvoice: async (id: string, invoiceData: Partial<Invoice>) => {
    set({ loading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find invoice index
      const invoiceIndex = get().invoices.findIndex(inv => inv.id === id);
      
      if (invoiceIndex === -1) {
        throw new Error('Invoice not found');
      }
      
      // Create updated invoice
      const updatedInvoice: Invoice = {
        ...get().invoices[invoiceIndex],
        ...invoiceData,
        updatedAt: new Date().toISOString(),
      };
      
      // Update invoices array
      const updatedInvoices = [...get().invoices];
      updatedInvoices[invoiceIndex] = updatedInvoice;
      
      set({ 
        invoices: updatedInvoices,
        currentInvoice: updatedInvoice,
        loading: false,
        error: null
      });
      
      return updatedInvoice;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to update invoice' 
      });
      throw error;
    }
  },
  
  // Delete invoice
  deleteInvoice: async (id: string) => {
    set({ loading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Filter out the invoice to delete
      const updatedInvoices = get().invoices.filter(inv => inv.id !== id);
      
      set({ 
        invoices: updatedInvoices,
        currentInvoice: null,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to delete invoice' 
      });
      throw error;
    }
  },
  
  // Add payment to an invoice
  addPayment: async (paymentData: Partial<Payment>) => {
    set({ loading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        invoiceId: paymentData.invoiceId || '',
        amount: paymentData.amount || 0,
        currency: paymentData.currency || 'USD',
        paymentDate: paymentData.paymentDate || new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod || 'bank_transfer',
        reference: paymentData.reference || '',
        notes: paymentData.notes || '',
        createdAt: new Date().toISOString(),
      };
      
      // Add payment to payments array
      set(state => ({ 
        payments: [...state.payments, newPayment] 
      }));
      
      // Update invoice status and amount paid
      const invoice = get().invoices.find(inv => inv.id === newPayment.invoiceId);
      
      if (invoice) {
        const amountPaid = invoice.amountPaid + newPayment.amount;
        const balance = invoice.total - amountPaid;
        
        let status: Invoice['status'] = 'pending';
        if (balance <= 0) {
          status = 'paid';
        } else if (amountPaid > 0) {
          status = 'partial';
        } else if (new Date(invoice.dueDate) < new Date()) {
          status = 'overdue';
        }
        
        await get().updateInvoice(invoice.id, {
          amountPaid,
          balance,
          status,
        });
      }
      
      set({ loading: false, error: null });
      return newPayment;
    } catch (error) {
      set({ 
        loading: false, 
        error: 'Failed to add payment' 
      });
      throw error;
    }
  },
  
  // Get payments for an invoice
  getInvoicePayments: (invoiceId: string) => {
    return get().payments.filter(payment => payment.invoiceId === invoiceId);
  },
  
  // Clear current invoice
  clearCurrentInvoice: () => {
    set({ currentInvoice: null });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));