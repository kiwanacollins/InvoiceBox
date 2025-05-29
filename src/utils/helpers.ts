import { format, parseISO } from 'date-fns';

// Format currency based on currency code
export const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    UGX: 'USh',
    USD: '$',
    LYD: 'LD',
  };

  const symbol = currencySymbols[currency] || currency;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: currency === 'UGX' ? 0 : 2,
    maximumFractionDigits: currency === 'UGX' ? 0 : 2,
  })
    .format(amount)
    .replace(currency, symbol);
};

// Format date to readable format
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd MMM yyyy');
};

// Get status color class based on invoice status
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-success/20 text-success-700';
    case 'partial':
      return 'bg-warning/20 text-warning-700';
    case 'pending':
      return 'bg-secondary/20 text-secondary-700';
    case 'overdue':
      return 'bg-error/20 text-error-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate random hex color
export const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// Get user initials from name
export const getUserInitials = (name: string): string => {
  if (!name) return '';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};