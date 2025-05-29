import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  FileCheck, 
  FileClock, 
  FileWarning,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import StatsCard from '../../components/dashboard/StatsCard';
import InvoiceStatusChart from '../../components/dashboard/InvoiceStatusChart';
import RecentInvoices from '../../components/dashboard/RecentInvoices';
import { Button } from '../../components/ui/Button';

const ProviderDashboard: React.FC = () => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        
        <Link to="/invoices/create">
          <Button className="mt-4 sm:mt-0">
            <Plus size={16} className="mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalAmount, 'USD')}
          icon={<DollarSign className="w-full h-full" />}
          change={{ value: 12, positive: true }}
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
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
          
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
                <span className="text-gray-500">Amount Received</span>
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
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            {recentInvoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  invoice.status === 'paid' ? 'bg-success/10 text-success-600' :
                  invoice.status === 'partial' ? 'bg-primary/10 text-primary-600' :
                  invoice.status === 'pending' ? 'bg-secondary/10 text-secondary-600' :
                  'bg-error/10 text-error-600'
                }`}>
                  {invoice.status === 'paid' ? <FileCheck size={20} /> :
                   invoice.status === 'partial' ? <FileCheck size={20} /> :
                   invoice.status === 'pending' ? <FileClock size={20} /> :
                   <FileWarning size={20} />
                  }
                </div>
                
                <div>
                  <div className="font-medium">
                    {invoice.status === 'paid' ? 'Payment received for ' :
                     invoice.status === 'partial' ? 'Partial payment for ' :
                     invoice.status === 'pending' ? 'Invoice sent to ' :
                     'Invoice overdue for '
                    }
                    <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                      {invoice.invoiceNumber}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {formatDate(invoice.updatedAt)}
                  </div>
                </div>
                
                <div className="ml-auto text-right">
                  <div className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {invoice.purchaserName}
                  </div>
                </div>
              </div>
            ))}
            
            {recentInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;