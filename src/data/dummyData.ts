import { User, Invoice, Payment, Notification } from '../types';

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: 'provider-1',
    name: 'TechSolutions Ltd',
    email: 'provider@example.com',
    role: 'provider',
    company: 'TechSolutions Ltd',
    createdAt: '2023-01-15T08:00:00.000Z',
  },
  {
    id: 'provider-2',
    name: 'Global Suppliers Co.',
    email: 'supplier@example.com',
    role: 'provider',
    company: 'Global Suppliers Co.',
    createdAt: '2023-02-10T10:30:00.000Z',
  },
  {
    id: 'purchaser-1',
    name: 'Acme Corporation',
    email: 'purchaser@example.com',
    role: 'purchaser',
    company: 'Acme Corporation',
    createdAt: '2023-03-05T14:15:00.000Z',
  },
  {
    id: 'purchaser-2',
    name: 'Starlight Enterprises',
    email: 'client@example.com',
    role: 'purchaser',
    company: 'Starlight Enterprises',
    createdAt: '2023-04-20T09:45:00.000Z',
  },
];

// Dummy Invoices
export const dummyInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    providerId: 'provider-1',
    providerName: 'TechSolutions Ltd',
    purchaserId: 'purchaser-1',
    purchaserName: 'Acme Corporation',
    issueDate: '2024-05-01T10:00:00.000Z',
    dueDate: '2024-05-31T10:00:00.000Z',
    items: [
      {
        id: 'item-1',
        description: 'Web Development Services',
        quantity: 1,
        unitPrice: 2500,
        amount: 2500,
      },
      {
        id: 'item-2',
        description: 'UI/UX Design',
        quantity: 1,
        unitPrice: 1500,
        amount: 1500,
      },
    ],
    subtotal: 4000,
    tax: 400,
    total: 4400,
    amountPaid: 4400,
    balance: 0,
    currency: 'USD',
    status: 'paid',
    notes: 'Thank you for your business!',
    createdAt: '2024-05-01T10:00:00.000Z',
    updatedAt: '2024-05-10T15:30:00.000Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    providerId: 'provider-1',
    providerName: 'TechSolutions Ltd',
    purchaserId: 'purchaser-2',
    purchaserName: 'Starlight Enterprises',
    issueDate: '2024-05-05T14:00:00.000Z',
    dueDate: '2024-06-05T14:00:00.000Z',
    items: [
      {
        id: 'item-3',
        description: 'Mobile App Development',
        quantity: 1,
        unitPrice: 5000,
        amount: 5000,
      },
    ],
    subtotal: 5000,
    tax: 500,
    total: 5500,
    amountPaid: 2750,
    balance: 2750,
    currency: 'USD',
    status: 'partial',
    createdAt: '2024-05-05T14:00:00.000Z',
    updatedAt: '2024-05-15T11:20:00.000Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-003',
    providerId: 'provider-2',
    providerName: 'Global Suppliers Co.',
    purchaserId: 'purchaser-1',
    purchaserName: 'Acme Corporation',
    issueDate: '2024-05-10T09:00:00.000Z',
    dueDate: '2024-05-25T09:00:00.000Z',
    items: [
      {
        id: 'item-4',
        description: 'Office Supplies',
        quantity: 1,
        unitPrice: 800,
        amount: 800,
      },
      {
        id: 'item-5',
        description: 'Furniture',
        quantity: 1,
        unitPrice: 1200,
        amount: 1200,
      },
    ],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    amountPaid: 0,
    balance: 2200,
    currency: 'USD',
    status: 'overdue',
    createdAt: '2024-05-10T09:00:00.000Z',
    updatedAt: '2024-05-10T09:00:00.000Z',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2024-004',
    providerId: 'provider-2',
    providerName: 'Global Suppliers Co.',
    purchaserId: 'purchaser-2',
    purchaserName: 'Starlight Enterprises',
    issueDate: '2024-05-15T11:00:00.000Z',
    dueDate: '2024-06-15T11:00:00.000Z',
    items: [
      {
        id: 'item-6',
        description: 'Computer Hardware',
        quantity: 5,
        unitPrice: 1200,
        amount: 6000,
      },
      {
        id: 'item-7',
        description: 'Software Licenses',
        quantity: 10,
        unitPrice: 300,
        amount: 3000,
      },
    ],
    subtotal: 9000,
    tax: 900,
    total: 9900,
    amountPaid: 0,
    balance: 9900,
    currency: 'USD',
    status: 'pending',
    createdAt: '2024-05-15T11:00:00.000Z',
    updatedAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2024-005',
    providerId: 'provider-1',
    providerName: 'TechSolutions Ltd',
    purchaserId: 'purchaser-1',
    purchaserName: 'Acme Corporation',
    issueDate: '2024-05-20T13:00:00.000Z',
    dueDate: '2024-06-20T13:00:00.000Z',
    items: [
      {
        id: 'item-8',
        description: 'Cloud Hosting Services (1 year)',
        quantity: 1,
        unitPrice: 3000,
        amount: 3000,
      },
      {
        id: 'item-9',
        description: 'Technical Support (1 year)',
        quantity: 1,
        unitPrice: 1500,
        amount: 1500,
      },
    ],
    subtotal: 4500,
    tax: 450,
    total: 4950,
    amountPaid: 0,
    balance: 4950,
    currency: 'USD',
    status: 'pending',
    createdAt: '2024-05-20T13:00:00.000Z',
    updatedAt: '2024-05-20T13:00:00.000Z',
  },
  {
    id: 'inv-6',
    invoiceNumber: 'INV-2024-006',
    providerId: 'provider-1',
    providerName: 'TechSolutions Ltd',
    purchaserId: 'purchaser-2',
    purchaserName: 'Starlight Enterprises',
    issueDate: '2024-05-01T10:00:00.000Z',
    dueDate: '2024-05-15T10:00:00.000Z',
    items: [
      {
        id: 'item-10',
        description: 'IT Consulting Services',
        quantity: 20,
        unitPrice: 150,
        amount: 3000,
      },
    ],
    subtotal: 3000,
    tax: 300,
    total: 3300,
    amountPaid: 0,
    balance: 3300,
    currency: 'UGX',
    status: 'overdue',
    createdAt: '2024-05-01T10:00:00.000Z',
    updatedAt: '2024-05-01T10:00:00.000Z',
  },
  {
    id: 'inv-7',
    invoiceNumber: 'INV-2024-007',
    providerId: 'provider-2',
    providerName: 'Global Suppliers Co.',
    purchaserId: 'purchaser-1',
    purchaserName: 'Acme Corporation',
    issueDate: '2024-05-12T10:00:00.000Z',
    dueDate: '2024-06-12T10:00:00.000Z',
    items: [
      {
        id: 'item-11',
        description: 'Construction Materials',
        quantity: 1,
        unitPrice: 25000,
        amount: 25000,
      },
    ],
    subtotal: 25000,
    tax: 2500,
    total: 27500,
    amountPaid: 10000,
    balance: 17500,
    currency: 'LYD',
    status: 'partial',
    createdAt: '2024-05-12T10:00:00.000Z',
    updatedAt: '2024-05-20T15:45:00.000Z',
  },
];

// Dummy Payments
export const dummyPayments: Payment[] = [
  {
    id: 'payment-1',
    invoiceId: 'inv-1',
    amount: 4400,
    currency: 'USD',
    paymentDate: '2024-05-10T15:30:00.000Z',
    paymentMethod: 'bank_transfer',
    reference: 'REF-001',
    createdAt: '2024-05-10T15:30:00.000Z',
  },
  {
    id: 'payment-2',
    invoiceId: 'inv-2',
    amount: 2750,
    currency: 'USD',
    paymentDate: '2024-05-15T11:20:00.000Z',
    paymentMethod: 'credit_card',
    reference: 'REF-002',
    createdAt: '2024-05-15T11:20:00.000Z',
  },
  {
    id: 'payment-3',
    invoiceId: 'inv-7',
    amount: 10000,
    currency: 'LYD',
    paymentDate: '2024-05-20T15:45:00.000Z',
    paymentMethod: 'bank_transfer',
    reference: 'REF-003',
    createdAt: '2024-05-20T15:45:00.000Z',
  },
];

// Dummy Notifications
export const dummyNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'provider-1',
    title: 'Payment Received',
    message: 'You have received a payment of $4,400.00 for invoice INV-2024-001',
    isRead: false,
    createdAt: '2024-05-10T15:30:00.000Z',
  },
  {
    id: 'notif-2',
    userId: 'provider-1',
    title: 'Partial Payment Received',
    message: 'You have received a partial payment of $2,750.00 for invoice INV-2024-002',
    isRead: true,
    createdAt: '2024-05-15T11:20:00.000Z',
  },
  {
    id: 'notif-3',
    userId: 'purchaser-1',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2024-003 is now overdue. Please make a payment as soon as possible.',
    isRead: false,
    createdAt: '2024-05-26T09:00:00.000Z',
  },
  {
    id: 'notif-4',
    userId: 'purchaser-2',
    title: 'New Invoice Received',
    message: 'You have received a new invoice INV-2024-004 for $9,900.00',
    isRead: true,
    createdAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'notif-5',
    userId: 'provider-2',
    title: 'Partial Payment Received',
    message: 'You have received a partial payment of 10,000.00 LYD for invoice INV-2024-007',
    isRead: false,
    createdAt: '2024-05-20T15:45:00.000Z',
  },
];

// Function to generate dummy invoices with different statuses
export const generateDummyInvoices = (
  providerId: string,
  purchaserId: string,
  count: number
): Invoice[] => {
  const statuses: Invoice['status'][] = ['paid', 'pending', 'partial', 'overdue'];
  const currencies: Invoice['currency'][] = ['UGX', 'USD', 'LYD'];
  const invoices: Invoice[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const total = Math.floor(Math.random() * 10000) + 1000;
    let amountPaid = 0;

    switch (status) {
      case 'paid':
        amountPaid = total;
        break;
      case 'partial':
        amountPaid = Math.floor(total / 2);
        break;
      case 'pending':
      case 'overdue':
        amountPaid = 0;
        break;
    }

    invoices.push({
      id: `inv-${count + i + 10}`,
      invoiceNumber: `INV-2024-${(count + i + 10).toString().padStart(3, '0')}`,
      providerId,
      providerName: providerId === 'provider-1' ? 'TechSolutions Ltd' : 'Global Suppliers Co.',
      purchaserId,
      purchaserName: purchaserId === 'purchaser-1' ? 'Acme Corporation' : 'Starlight Enterprises',
      issueDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: `item-${i + 100}`,
          description: `Product or Service ${i + 1}`,
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: Math.floor(Math.random() * 1000) + 100,
          amount: Math.floor(Math.random() * 1000) + 100,
        },
      ],
      subtotal: total - Math.floor(total * 0.1),
      tax: Math.floor(total * 0.1),
      total,
      amountPaid,
      balance: total - amountPaid,
      currency,
      status,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return invoices;
};