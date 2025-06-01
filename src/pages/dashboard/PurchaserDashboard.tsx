import React, { useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  FileCheck, 
  FileClock, 
  FileWarning,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { formatCurrency, formatDate, getStatusColorClass } from '../../utils/helpers';
import StatsCard from '../../components/dashboard/StatsCard';
import InvoiceStatusChart from '../../components/dashboard/InvoiceStatusChart';
import RecentInvoices from '../../components/dashboard/RecentInvoices';

const PurchaserDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { invoices, fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    if (user) {
      fetchInvoices(user.id, user.role);
    }
    
  }, [user, fetchInvoices]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
    const partialInvoices = invoices.filter(invoice => invoice.status === 'partial');
    const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');
    
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidAmount = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);
    const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);
    
    return {
      totalInvoices: invoices.length,
      totalPaid: paidInvoices.length,
      totalPending: pendingInvoices.length,
      totalPartial: partialInvoices.length,
      totalOverdue: overdueInvoices.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
    };
  }, [invoices]);

  // Sort invoices by issue date (newest first)
  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);
  }, [invoices]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Purchaser Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Payable"
          value={formatCurrency(stats.totalAmount, 'USD')}
          icon={<DollarSign className="w-full h-full" />}
          bgClass="bg-primary/10"
          textClass="text-primary-700"
        />
        
        <StatsCard
          title="Paid Invoices"
          value={stats.totalPaid}
          icon={<FileCheck className="w-full h-full" />}
          bgClass="bg-success/10"
          textClass="text-success-700"
        />
        
        <StatsCard
          title="Pending Invoices"
          value={stats.totalPending + stats.totalPartial}
          icon={<FileClock className="w-full h-full" />}
          bgClass="bg-secondary/10"
          textClass="text-secondary-700"
        />
        
        <StatsCard
          title="Overdue Invoices"
          value={stats.totalOverdue}
          icon={<FileWarning className="w-full h-full" />}
          bgClass="bg-error/10"
          textClass="text-error-700"
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InvoiceStatusChart 
            data={{
              paid: stats.totalPaid,
              pending: stats.totalPending,
              partial: stats.totalPartial,
              overdue: stats.totalOverdue,
            }}
          />
        </div>
        
        <div className="lg:col-span-2">
          <RecentInvoices 
            invoices={recentInvoices}
            viewAllLink="/invoices"
          />
        </div>
      </div>
      
      {/* Upcoming Payments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Upcoming Payments</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter(invoice => invoice.status !== 'paid')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <a href={`/invoices/${invoice.id}`} className="font-medium text-primary hover:underline">
                        {invoice.invoiceNumber}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{invoice.providerName}</td>
                    <td className="py-3 px-4 text-gray-800">{formatDate(invoice.dueDate)}</td>
                    <td className="py-3 px-4 text-gray-800 text-right">{formatCurrency(invoice.balance, invoice.currency)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end">
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColorClass(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a 
                        href={`/invoices/${invoice.id}`} 
                        className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary-600"
                      >
                        <CreditCard size={14} className="mr-1" />
                        Pay
                      </a>
                    </td>
                  </tr>
              ))}
              
              {invoices.filter(invoice => invoice.status !== 'paid').length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No upcoming payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Payment Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-medium">{formatCurrency(stats.totalAmount, 'USD')}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-medium">{formatCurrency(stats.paidAmount, 'USD')}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${(stats.paidAmount / stats.totalAmount) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Pending Amount</span>
                <span className="font-medium">{formatCurrency(stats.pendingAmount, 'USD')}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${(stats.pendingAmount / stats.totalAmount) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Overdue Amount</span>
                <span className="font-medium">{formatCurrency(stats.overdueAmount, 'USD')}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full" style={{ width: `${(stats.overdueAmount / stats.totalAmount) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatCurrency(stats.paidAmount, 'USD')}
                </div>
                <div className="text-sm text-gray-500">Total Paid Amount</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {formatCurrency(stats.pendingAmount + stats.overdueAmount, 'USD')}
                  </div>
                  <div className="text-xs text-gray-500">Outstanding</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {Math.round((stats.paidAmount / stats.totalAmount) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Paid Percentage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaserDashboard;